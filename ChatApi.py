from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

users = []

def add_user(user_id, sid):
    if not any(user['user_id'] == user_id for user in users):
        users.append({'user_id': user_id, 'sid': sid})

def remove_user(sid):
    global users
    users = [user for user in users if user['sid'] != sid]
def get_user(user_id):
    return next((user for user in users if user['user_id'] == user_id), None)

@socketio.on('connect')
def handle_connect():
    print('a user is connected.')

@socketio.on('addUser')
def handle_add_user(user_id):
    add_user(user_id, request.sid)
    emit('getUsers', users, broadcast=True)

@socketio.on('sendMessage')
def handle_send_message(data):
    print(data)
    sender_id = data['user']['id']  
    receiver_id = data['receiver']
    text = data['content']
    receiver = get_user(receiver_id)
    if receiver:
        socketio.emit('getMessage', {'sender_id': sender_id, 'text': text}, room=receiver['sid'])
        print(receiver)
@socketio.on('message')
def handle_message(message):
    # Broadcast the message to all connected clients
    socketio.emit('message', message)
@socketio.on('message_from_client')
def handle_message(message):
    print('Received message:', message)
    socketio.emit('message_from_server', message)
@socketio.on('disconnect')
def handle_disconnect():
    print('a user disconnected!')
    remove_user(request.sid)
    emit('getUsers', users, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, port=5001)