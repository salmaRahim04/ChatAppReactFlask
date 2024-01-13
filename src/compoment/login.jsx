import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import Navbar from "./Header";

export const Login = () => {
  const navigate = useNavigate();
  // Utilisation des hooks useState pour gérer les états locaux
  const [email, setemail] = useState(''); // État du champ email
  const [pass, setPass] = useState('');  // État du champ password

  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = (e) => {
      e.preventDefault();  // Évite le rechargement de la page lors de la soumission du formulaire
      console.log(email);  // Affiche l'email dans la console
  }
  const handleLogin = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/UserLoginIn', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: pass,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Display success message
          // Stocker le token dans le localStorage
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', data.user_id);
          localStorage.setItem('username', email);
          console.log(pass,email)
          if (email=="houdalaaamrabet123@gmail.com" && pass== "1234") {
            navigate('/admin');
            window.location.reload();
          } else {
            navigate('/ChooseChat');
            window.location.reload();
 
          }
        } else {
          const data = await response.json();
          console.error(data.message); // Display error message
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const onSubmit = async () => {
      try {
          const response = await axios.post(
              'http://localhost:8000/authenticate',
              { username: email }
          );
           console.log(email)
          const userData = response.data;
          console.log('Authenticated user data:', userData);
      } catch (error) {
          console.error('Authentication failed:', error.message);
      }
  };
  return (
    <>
    <Navbar/>
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "50vh",padding: "50px",backgroundColor:"rgb(240, 240, 240)"}}
    >
      <Grid item xs={12} sm={6} md={4} >
        <Paper elevation={3} className="auth-form-container" style={{minHeight: "50vh",minWidth: "50vh",padding: "50px",borderTop:'3px solid #800080',borderRadius:'14px', boxShadow: '5px 5px  rgba(128, 0, 128, 0.4), 10px 10px rgba(221, 160, 221, 0.3), 15px 15px rgba(221, 160, 221, 0.2), 20px 20px rgba(221, 160, 221, 0.1), 25px 25px rgba(221, 160, 221, 0.05)'}}>
          <Typography variant="h4" align="center" gutterBottom style={{ paddingTop:'50px', }}>
            <LoginIcon   style={{color:'#800080',fontSize:'30px'}}/> Login
          </Typography>
          <form className="login-form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              style={{  Height: "0.4375em",minWidth: "50vh"}}
              onChange={(e) => setemail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              style={{  minHeight: "10vh",minWidth: "50vh"}}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              
              style={{  minHeight: "7vh",minWidth: "50vh",marginTop:'20px',backgroundColor:'#800080'}}
              fullWidth
              onClick={() => { handleLogin(); onSubmit(); }}
            >
              Log In
            </Button>
          </form>

          <Link to={"/Register"} style={{ textDecoration: "none"}}>
            <Button variant="text" fullWidth style={{marginTop:'20px',padding:'10px',color:'#800080',textTransform:'lowercase' }}>
              <span  style={{textTransform:'uppercase' }}>D</span> on't have an account? Register here.
            </Button>
          </Link>
        </Paper>
      </Grid>
    </Grid>
    </>
  );
};

export default Login;