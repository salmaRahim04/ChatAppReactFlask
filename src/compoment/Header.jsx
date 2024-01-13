import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#fff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#800080',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px 30px',
    '&:hover': {
      backgroundColor: '#fff',
      color: '#800080',
    },
  },
  logoutButton: {
    backgroundColor: '#800080',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px 30px',
    '&:hover': {
      backgroundColor: '#fff',
      color: '#800080',
    },
  },
  title: {
    color: '#800080',
    fontWeight: 'bold',
  },
}));

const Navbar = () => {
  const classes = useStyles();

  const handleLogout = () => {
    // Récupérez toutes les clés du local storage
    const keysToRemove = Object.keys(localStorage);
  
    // Supprimez chaque clé du local storage
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  
    
    window.location.href = '/login'; 
  };
  return (
    <AppBar position="static" className={classes.appBar} style={{ backgroundColor: '#fff' }}>
      <Toolbar className={classes.toolbar}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" className={classes.title}>SIR Project</Typography>
        </Link>
       <div style={{ display: 'flex' }}>
       <Link to="/login" style={{ textDecoration: 'none',marginRight: '20px' }}>
          <Button className={classes.button} style={{ backgroundColor: '#800080', color: '#fff' }}>Sign In</Button>
        </Link>
        <Button className={classes.logoutButton} onClick={handleLogout} style={{ backgroundColor: '#800080', color: '#fff' }}>Logout</Button>
       </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
