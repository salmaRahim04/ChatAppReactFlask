import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';

import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import PublicChat from './PublicChat';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(3),
  },
  sidebar: {
    height: 'calc(90vh - 10px)',
    overflowY: 'auto',
    backgroundColor: '#f0f0f0',
    padding: theme.spacing(2),
  },
  chatArea: {
    height: 'calc(80vh - 16px)',
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
  inputArea: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Horizontally align content with space in between
  },
  onlineUser: {
    color: '#000',
  },
  messageList: {
    maxHeight: '60vh', // Set a maximum height for the message list
    overflowY: 'auto', // Enable vertical scrolling if messages exceed the height
  },
senderMessage: {
  textAlign: 'right', 
  // Align sender messages to the right
  padding:'4px',
  borderRadius:"5px",
  color: '#fff', // Example color for sender messages
  backgroundColor: 'rgb(128, 0, 128)', // Example background color for sender messages
},

receiverMessage: {
  textAlign: 'left', // Align receiver messages to the left
  color: '#000', // Example color for receiver messages
  backgroundColor: '#e0e0e0', // Example background color for receiver messages
},
}));

const ChatInterface = ({ socket }) => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("")
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [receiver, setReceiver] = useState("");
  const [userConversations, setUserConversations] = useState([]);
  const [twoUserConversation, setTwoUserConversation] = useState([]);
  

  const handleText = (e) => {
    const inputMessage = e.target.value;
    setMessage(inputMessage);
  };

  const handleSubmit = async() => {
   
    try {
      if (!message) {
        return;
      }
      socket.emit("message", message);
      await axios.post('http://127.0.0.1:5000/api/messages', { content: message, user:  JSON.parse(user),receiver });
      fetchMessages();
      console.log(message, JSON.parse(user));
      setMessage("");
      socket.emit("sendMessage", { content: message, user: JSON.parse(user), receiver });
    setMessages((prevMessages) => [...prevMessages, { content: message, sender_id: JSON.parse(user).id }]);
    setMessage("");
    socket.on('getMessage', (data) => {
      // Update your state with the received message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: data.text,
          sender_id: data.sender_id,
        },
      ]);
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
    
  };

  useEffect(() => {
    socket.on("data", (data) => {
      setMessages([...messages, data.data]);
      
      
    });
  }, [socket, messages]);
  const fetchUserConversations = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/get_conversations/${user}`);
      const data = await response.json();
      setUserConversations(data.conversations);
      const filteredConversations = userConversations.filter(
        (conversation) => conversation.user1_id === receiver || conversation.user2_id === receiver
      );
      setUserConversations(filteredConversations)
    } catch (error) {
      console.error('Error fetching user conversations:', error);
    }
  };
  useEffect(() => {
    

    // Fetch conversation for two users
   
    // Call the functions to fetch data
    fetchUserConversations()
    fetchConversations()
    fetchMessages();
    fetchOnlineUsers();
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  
    // Clean up the socket connection on component unmount
    return () => {
      socket.off("message");
    };
  }, [socket]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/messages');
      setMessages(response.data.messages)

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const fetchConversations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000//api/conversations');
      setConversations(response.data.conversations)

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const fetchOnlineUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/GetAllUsers');
      const usersArray = response.data.users;
  
      if (Array.isArray(usersArray)) {
         // Filter out the current user
         const filteredUsers = usersArray.filter((u) => u.id.toString() !== user);
         console.log(filteredUsers);
     
         // Set the OnlineUsers state with the filtered array
         setOnlineUsers(filteredUsers);
      } else {
        console.error('Invalid response for online users:', response.data);
      }
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  };
  

  const sendMessage = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/messages', {
        content: message,
        user: JSON.parse(user),
        receiver,
      });
  
      // Rest of your code
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const haha = async(receiverId) =>{
    setReceiver(receiverId)
    const fetchTwoUserConversation = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/get_conversation/${user}/${receiverId}`);
 // Replace with your Flask API URL and user IDs
        const data = await response.json();
        console.log(data.conversations[0].id);
        setTwoUserConversation(data.conversations[0]);
      } catch (error) {
        console.error('Error fetching two-user conversation:', error);
      }
    };

    fetchTwoUserConversation();

    

  }
  
console.log(user);

  return (
    <Container className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper className={classes.sidebar}>
  <Typography variant="h6" gutterBottom>
    Online Users
  </Typography>
  <List>
  <List>
    {onlineUsers.map((user) => (
      <ListItem
        key={user.id}
        button
        onClick={() => haha(user.id)}
        selected={user.id === receiver}
      >
        <Avatar style={{ marginRight: "15px" }}>{user.username.charAt(0)}</Avatar>
        <ListItemText primary={user.username} className={classes.onlineUser} />

      </ListItem>
    ))}
  </List>

</List>


</Paper>
        </Grid>
        {
          receiver && (
            <Grid item xs={9}>
            <Paper className={classes.chatArea}>
              <Typography variant="h6" gutterBottom>
                Chat Room
              </Typography>
              <List className={classes.messageList}>
              {messages.map((message) => {
  const isReceiver = message.sender_id === twoUserConversation?.user2_id;
              
              if (message.conversation_id === twoUserConversation?.id) {
               return (
                <ListItem key={message.id}>
                <Box
                  component="div"
                  className={classes.senderMessage}
                >
                  <ListItemText primary={`${message.sender_id.toString() === user ? 'YOU' : 'RECEIVER'}: ${message.content}`} />
                </Box>
              </ListItem>
    );
  }
  return null; // You can also skip rendering if the condition is not met
})}
              </List>
            </Paper>
            <Paper className={classes.inputArea}>
              <TextField
                label="Type your message"
                variant="outlined"
                fullWidth
                value={message}
                onChange={handleText}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
                disabled={!message.trim()}>
                Send
              </Button>
            </Paper>
          </Grid>
          )
        }
      </Grid>
      <PublicChat/>
    </Container>
    
  );
};
export default ChatInterface;