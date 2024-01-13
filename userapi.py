
# condition password username cryptage interface canal communication
from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token,JWTManager,jwt_required, get_jwt_identity
from datetime import datetime
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import requests
from flask import request
import pyodbc

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app,  origins='*')
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")
PRIVATE_KEY = "709749ab-1de2-4bf8-bd0c-1eb1052fd6be"

app.config['JWT_SECRET_KEY'] = 'salma'  # Change this to a secure secret key
jwt = JWTManager(app)

            #  Connection avec la base de donnée 
server = 'DESKTOP-T14'
database = 'SIR'
class SQLServerConnection:
    def __init__(self, server, database, driver='{ODBC Driver 17 for SQL Server}', Trusted_connection='yes'):
        self.server = server
        self.database = database
        self.driver = driver
        self.Trusted_connection = Trusted_connection
        self.conn_str = f'DRIVER={self.driver};SERVER={self.server};DATABASE={self.database};Trusted_connection={self.Trusted_connection}'
        self.conn = None
        self.cursor = None

    def __enter__(self):
        try:
            self.conn = pyodbc.connect(self.conn_str)
            self.cursor = self.conn.cursor()
            return self
        except pyodbc.Error as e:
            print(f"Error connecting to the database: {str(e)}")
    
    def __exit__(self, exc_type, exc_value, traceback):
        if self.conn:
            self.conn.close()


def execute_query(query, params=None, fetch_results=False,fetch_identity=False):
    with SQLServerConnection(server, database) as connection:
        try:
            with connection.cursor as cursor:
                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)

                if fetch_results:
                    return cursor.fetchall()
                elif fetch_identity:
                    # Fetch the last identity value (e.g., for auto-incremented columns)
                    cursor.execute("SELECT SCOPE_IDENTITY()")
                    return cursor.fetchone()[0]
        except Exception as e:
            print(f"Error executing query: {str(e)}")
            return None
        

@app.route('/')
def home():
    return 'Home Page'

        
@app.route('/api/UserLoginIn', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    input_password = data.get('password')
    print(f"Received login request for email: {email}")

    # Retrieve user from the database
    query = "SELECT * FROM USERS WHERE email = ?"
    result = execute_query(query, (email,), fetch_results=True)

    if result:
        stored_password = result[0][5]  # Assuming the password column is at index 5
        checkC = result[0][6]

        print(f"Stored Password: {stored_password}")
        print(f"Input Password: {input_password}")

        if bcrypt.check_password_hash(stored_password, input_password) and checkC == 1:
        # Password is correct, generate and return a JWT
            access_token = create_access_token(identity=email)
             # Send the token and any additional data you want to the client
            response_data = {'access_token': access_token, 'user_id': result[0][0]}
            print(f"Access Token: {access_token}")
            return jsonify(response_data)
    # User does not exist or invalid credentials, return error message
    return jsonify({'message': 'Invalid credentials. Login failed.'}), 401
    
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    nom = data.get('nom')
    prenom = data.get('prenom')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    with SQLServerConnection(server, database) as connection:
        cursor = connection.cursor

        # Vérifier si l'e-mail existe déjà dans la base de données
        cursor.execute("SELECT email FROM USERS WHERE email=?", (email,))
        existing_email = cursor.fetchone()

        if existing_email:
            return jsonify({'message': 'Registration failed. Email already exists.'}), 400
        else:
            # Insérer un nouvel utilisateur dans la base de données
            query = "INSERT INTO USERS (username, password, email, nom, prenom) VALUES (?, ?, ?, ?, ?)"
            execute_query(query, (username, hashed_password, email, nom, prenom))
            return jsonify({'message': 'Registration successful. You can now log in'}), 201



users = []
def add_user(user_id, socket_id):
    if not any(user["user_id"] == user_id for user in users):
        users.append({"user_id": user_id, "socket_id": socket_id})

def remove_user(socket_id):
    global users
    users = [user for user in users if user["socket_id"] != socket_id]

def get_user(user_id):
    return next((user for user in users if user["user_id"] == user_id), None)



@app.route('/api/GetAllUsers', methods=['GET'])
def get_all_users():
    try:
        query = "SELECT * FROM USERS WHERE checkC = 1"
        result = execute_query(query, fetch_results=True)
        
        if result:
            users = [
                {
                    'id': user[0],
                    'username': user[1],
                    'email': user[4],
                }
                for user in result
            ]
            return jsonify({'users': users}), 200
        else:
            return jsonify({'users': []}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


    
@app.route('/api/messages', methods=['GET'])
def get_all_messages():
    try:
        # Fetch all messages from the MESSAGES table
        query = "SELECT * FROM message"
        messages = execute_query(query, fetch_results=True)
        if messages:
            # Convert the messages to a list of dictionaries for JSON serialization
            messages_data = [{'id': msg[0], 'content': msg[3], 'sender_id': msg[1], 'conversation_id': msg[5], 'receiver_id': msg[2]} for msg in messages]
            return jsonify({'messages': messages_data}), 200
        else:
            return jsonify({'messages': []}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

        
def get_or_create_conversation(user1, user2):
    # Print the values before sorting
    user1, user2 = sorted([user1, user2])
    # Check if a conversation already exists for the given pair of users
    query = "SELECT id FROM CONVERSATIONS WHERE user1_id = ? AND user2_id = ?"
    result = execute_query(query, (user1, user2),fetch_results=True)

    if result:
        # Conversation already exists, return the conversation ID
        print("Existing conversation:", result[0][0])
        return result[0][0]
    else:
        # Create a new conversation and return the generated conversation ID
        query = "INSERT INTO CONVERSATIONS (user1_id, user2_id) VALUES (?, ?)"
        new_conversation_id = execute_query(query, (user1, user2),fetch_identity=True)
        # Print the result of the insert query
        print("New conversation ID:", new_conversation_id[0][0])
        return new_conversation_id[0][0]


  
@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        data = request.get_json()
        print(data)  # Add this line to inspect the received data
        content = data.get('content')
        user = data.get('user')
        receiver = data.get('receiver')
        if not content:
            return jsonify({'error': 'Content cannot be empty'}), 400
        # Generate or retrieve conversation ID for the pair of users
        conversation_id = get_or_create_conversation(receiver, user)
        print('conversation_id', conversation_id)
        # Insert the message
        if conversation_id:
            query = "INSERT INTO message (content, sender_id, conversation_id, time_colonne, receiver_id) VALUES (?, ?, ?, GETDATE(), ?)"
        execute_query(query, (content, user, conversation_id, receiver))
        return jsonify({'message': 'the message was successfully created'}), 200
    except Exception as error:
        print(f'Error: {str(error)}')
        return jsonify({'error': f'Server Error: {str(error)}'}), 500


@app.route('/api/conversations', methods=['GET'])
def get_all_conversations():
    try:
        # Fetch all messages from the MESSAGES table
        query = "SELECT * FROM CONVERSATIONS "
        conversation = execute_query(query, fetch_results=True)
        if conversation:
            # Convert the messages to a list of dictionaries for JSON serialization
            conversation_data = [{'id': conv[0], 'receiver': conv[2], 'sender': conv[1]} for conv in conversation]
            return jsonify({'conversations': conversation_data}), 200
        else:
            return jsonify({'conversations': []}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/public-chat', methods=['GET'])
def get_public_chat_messages():
    try:
        # Fetch public chat messages from the database
        query = "SELECT * FROM PUBLIC_CHAT_MESSAGES"
        chat_messages = execute_query(query, fetch_results=True)

        if chat_messages:
            # Convert the chat messages to a list of dictionaries for JSON serialization
            chat_data = [{'id': message[0], 'sender': message[1], 'message': message[2]} for message in chat_messages]
            return jsonify({'public_chat': chat_data}), 200
        else:
            return jsonify({'public_chat': []}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route('/api/public-chat', methods=['POST'])
def post_public_chat_message():
    try:
        # Get data from the POST request
        data = request.get_json()
        sender = data.get('sender')
        message_content = data.get('message')

        # Validate the data (add your validation logic here)

        # Insert the new message into the database
        query = "INSERT INTO PUBLIC_CHAT_MESSAGES (sender, message)  VALUES (?, ?)"
        execute_query(query, params=(sender, message_content), fetch_results=False)

        return jsonify({'message': 'Message sent successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500@app.route('/api/public-chat', methods=['POST'])

    
# Route to get conversations for a single user
@app.route('/api/get_conversations/<int:user_id>', methods=['GET'])
def get_conversations(user_id):
    try:
        query = "SELECT * FROM CONVERSATIONS WHERE user1_id= ? OR user2_id= ?"
        params = (user_id, user_id)
        conversations = execute_query(query, params=params, fetch_results=True)
        if conversations:
            conversation_data = [{'id': conv[0], 'user1_id': conv[1], 'user2_id': conv[2]} for conv in conversations]
            return jsonify({'conversations': conversation_data}), 200
        else:
            return jsonify({'conversations': []}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Route to get conversation for two users
@app.route('/api/get_conversation/<int:first_user_id>/<int:second_user_id>', methods=['GET'])
def get_conversation(first_user_id, second_user_id):
    try:
        query = "SELECT * FROM CONVERSATIONS WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)"
        params = (first_user_id, second_user_id, second_user_id, first_user_id)

        # Fetch the conversations without committing the transaction
        conversations = execute_query(query, params=params, fetch_results=True)

        if conversations:
            # Convert the list of tuples to a list of dictionaries
            conversation_data = [{'id': conv[0], 'user1_id': conv[1], 'user2_id': conv[2]} for conv in conversations]
            return jsonify({'conversations': conversation_data}), 200
        else:
            return jsonify({'Two conversations': []}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/api/getUsers', methods=['GET'])
def get_users():
    query = "SELECT * FROM USERS WHERE checkC IS NULL"
    result = execute_query(query, fetch_results=True)

    if result:
        users = [{ 'username': user[1], 'nom': user[2], 'prenom': user[3], 'email': user[4],'id': user[0]} for user in result]
        return jsonify({'users': users})
    else:
        return jsonify({'users':[]})
                                                
                                                
@app.route('/api/updateUserCheckC', methods=['PUT'])
def update_user_checkC():
    data = request.get_json()

    # Assurez-vous que "username" et "checkC" sont présents dans les données JSON
    if 'email' not in data or 'checkC' not in data:
        return jsonify({'message': 'Invalid request data'}), 400
    email = data['email']
    new_checkC_value = data['checkC']
    print(data)
    # Mettez à jour la base de données avec la nouvelle valeur de checkC
    query = "UPDATE USERS SET checkC = ? WHERE email = ?"
    execute_query(query, (new_checkC_value, email))
    requests.post('https://api.chatengine.io/users/',
        data={
            "username": data['email'],
            "secret": data['id'],
            "email": data['email'],
            "first_name":  data['prenom'],
            "last_name": data['nom'],
        },
        headers={ "Private-Key":  PRIVATE_KEY}
    )
    return jsonify({'message': 'User checkC updated successfully'}), 200

@app.route('/api/deleteUser', methods=['DELETE'])
def delete_user():
    data = request.get_json()
    # Assurez-vous que "email" est présent dans les données JSON
    if 'email' not in data:
        return jsonify({'message': 'Invalid request data'}), 400

    email = data['email']

    # Supprimez l'utilisateur de la base de données
    query = "DELETE FROM USERS WHERE email = ?"
    execute_query(query, (email,))
    return jsonify({'message': 'User deleted successfully'}), 200
    
@socketio.on("connect")
def handle_connect():
    print("A user connected.")

@socketio.on("addUser")
def handle_add_user(user_id):
    add_user(user_id, request.sid)
    emit("getUsers", users, broadcast=True)
@socketio.on("sendMessage")
def handle_send_message(data):
    sender_id = data["senderId"]
    receiver_id = data["receiverId"]
    text = data["text"]

    receiver = get_user(receiver_id)
    if receiver:
        emit("getMessage", {"senderId": sender_id, "text": text}, room=receiver["socket_id"])
        print(receiver)
@socketio.on("disconnect")
def handle_disconnect():
    print("A user disconnected!")
    remove_user(request.sid)
    emit("getUsers", users, broadcast=True)
if __name__ == '__main__':
    socketio.run(app, debug=True)
