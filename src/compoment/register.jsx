import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Paper, TextField, Button, Typography } from "@mui/material";
import styled, { keyframes } from "styled-components";
import { useNavigate } from 'react-router-dom';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Navbar from "./Header";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.02);
  }
`;

const StyledGrid = styled(Grid)`
  min-height: 50vh;
  padding: 20px;
`;

const StyledCard = styled(Paper)`
  display: flex;
  justify-content:center;
  height: 90vh;
  width:130vh;
  border-radius:5px;
  margin-left:200px;
  background: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
  transition: box-shadow 0.3s ease-out, transform 0.3s ease-out;
  border-top:3px solid  #800080;
  border-bottom:3px solid  #800080;

  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    transform: translateY(-5px);
  }

  &:active {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;

const StyledProfileContainer = styled.div`
  flex: 1;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
`;

const StyledProfileSvg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledFormContainer = styled.div`
  flex: 1;
  padding: 40px;
`;

const StyledTypography = styled(Typography)`
  color:  #800080;;
  margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 30px;
    border-radius: 10px;
    margin-left:10px
  }
`;

const StyledButton = styled(Button)`
  min-height: 7vh;
  min-width: 50vh;
  margin-top: 20px;
  background-color:  #3745b5;
  color: #fff;
  border-radius: 15px;
  animation: ${pulse} 1s infinite alternate;

  &:hover {
    background-color: #5364d8;
    animation: none;
  }
`;

const StyledLinkButton = styled(Button)`
  margin-top: 40px;
  padding: 10px;
  color: #DDA0DD;
  transition: color 0.3s ease-out;

  &:hover {
    text-decoration: underline;
    color:  #DDA0DD;
  }
`;

export const Register = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [username, setUserName] = useState('');
  const [nom, setnom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, prenom, nom, email, password: pass }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/login');
        console.log(data.message);
      } else {
        const data = await response.json();
        setErrorMessage(data.message); // Mettez à jour le message d'erreur
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <Navbar/>
    <StyledGrid
      container
      spacing={0}>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard elevation={5} style={{boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px'}}>
          <StyledProfileContainer>
            <StyledProfileSvg src={'https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/reading_0re1.svg'} alt="Profile" />
          </StyledProfileContainer>
          <StyledFormContainer>
            <StyledTypography variant="h4" align="center" gutterBottom style={{marginBottom:'20px'}}>
              <PersonAddAltIcon style={{fontSize:'30px'}}/> Sign Up
            </StyledTypography>
            {errorMessage && (
              <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{display:"flex"}}>  
                <StyledTextField
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  value={nom}
                  onChange={(e) => setnom(e.target.value)}
                />
                <StyledTextField
                  label="Prenom"
                  variant="outlined"
                  fullWidth
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </div>
              <StyledTextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              <StyledTextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <StyledTextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <StyledButton
                type="submit"
                variant="contained"
                fullWidth
                onClick={handleRegister}
                style={{backgroundColor:'#800080'}}
              >
                Register
              </StyledButton>
            </form>
            <Link to="/Login" style={{ textDecoration: "none" }}>
              <StyledLinkButton variant="text" fullWidth style={{color:'#800080'}}>
                Already have an account? Login here.
              </StyledLinkButton>
            </Link>
          </StyledFormContainer>
        </StyledCard>
      </Grid>
    </StyledGrid>
    </>
  );
};

export default Register;
