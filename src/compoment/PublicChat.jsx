import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  makeStyles,
  Paper,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: '#fff',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(4),
    marginTop:"20px"
  },
  form: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  messageInput: {
    marginBottom: theme.spacing(1),
  },
  chatList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  chatMessage: {
    backgroundColor: '#f0f0f0',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const PublicChat = () => {
  const classes = useStyles();
  const [publicChatMessages, setPublicChatMessages] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the Flask API endpoint
      await axios.post('http://localhost:5000/api/public-chat', {
        sender: user,
        message: message,
      });
      setPublicChatMessages((prevMessages) => [...prevMessages, { message, sender: user }]);


      // Optionally, you can reset the form or update the UI
      setMessage('');
      socket.emit('message_from_client', { sender: user, message });

    } catch (error) {
      console.error('Error sending public chat message:', error);
    }
  };

  useEffect(() => {
    const fetchPublicChatMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/public-chat');
        setPublicChatMessages(response.data.public_chat);
        socket.on('message_from_server', (newMessage) => {
          setPublicChatMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      } catch (error) {
        console.error('Error fetching public chat messages:', error);
      }
    };

    fetchPublicChatMessages();
  }, []);

  return (
    <Container className={classes.container}>
      <Typography variant="h6" gutterBottom>
        Public Chat
      </Typography>
      <form onSubmit={handleSubmit} className={classes.form}>
        <TextField
          className={classes.messageInput}
          label="Message"
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send Message
        </Button>
      </form>
      <List className={classes.chatList}>
        {publicChatMessages.map((message) => (
          <ListItem key={message.id} className={classes.chatMessage}>
            <ListItemText
              primary={`${message.sender}: ${message.message}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PublicChat;
