import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import Navbar from './Header';
const useStyles = makeStyles({
  cuteTable: {
    maxWidth: '800px',
    margin: 'auto',
    marginTop: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
  },
  button: {
    marginRight: '8px',
  },
});

const AdminDashboard = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the list of users from the backend
    fetch('http://127.0.0.1:5000/api/getUsers')
      .then(response => response.json())
      .then(data => setUsers(data.users))
      .catch(error => console.error('Error fetching users:', error));
  }, []);
  const handleAccept = (user) => {
    console.log(user)
    // Envoyer une requête au backend pour mettre à jour la colonne "checkC" à 1
    fetch('http://127.0.0.1:5000/api/updateUserCheckC', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: user.email, nom: user.nom, prenom: user.prenom,id: user.id, checkC: 1 }),
    })
      .then(response => response.json())
      .then(data => {
        // Mettre à jour l'état local après la mise à jour réussie
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.email == email ? { ...user, checkC: 1 } : user
          )
        );
        window.location.reload();

      })
      .catch(error => console.error('Error updating user:', error));
  };


  const handleDelete = (email) => {
    // Envoyer une requête au backend pour supprimer l'utilisateur
    fetch('http://127.0.0.1:5000/api/deleteUser', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    })
      .then(response => response.json())
      .then(data => {
        // Mettre à jour l'état local après la suppression réussie
        setUsers(prevUsers =>
          prevUsers.filter(user => user.email !== email)
        );
      })
      .catch(error => console.error('Error deleting user:', error));
  };
  

  return (
   <>
   <Navbar/>
    <TableContainer component={Paper} className={classes.cuteTable} style={{borderRadius:'5px'}}>
      <Table>
        <TableHead style={{backgroundColor:'#800080',color:'#fff'}}>
          <TableRow style={{color:'#fff'}}>
            <TableCell className={classes.tableHeaderCell}  style={{color:'#fff',fontWeight:'bold',textTransform:'capitalize'}}>Username</TableCell>
            <TableCell className={classes.tableHeaderCell}  style={{color:'#fff',fontWeight:'bold',textTransform:'capitalize'}}>Nom</TableCell>
            <TableCell className={classes.tableHeaderCell}  style={{color:'#fff',fontWeight:'bold',textTransform:'capitalize'}}>Prenom</TableCell>
            <TableCell className={classes.tableHeaderCell}  style={{color:'#fff',fontWeight:'bold',textTransform:'capitalize'}}>Email</TableCell>
            <TableCell className={classes.tableHeaderCell}  style={{color:'#fff',fontWeight:'bold',textTransform:'capitalize'}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.username}>
              <TableCell style={{textTransform:'capitalize'}}>{user.username}</TableCell>
              <TableCell style={{textTransform:'capitalize'}}>{user.nom}</TableCell>
              <TableCell style={{textTransform:'capitalize'}}>{user.prenom}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={() => handleAccept(user)}
                  style={{marginRight:'20px'}}
                >
                  <VerifiedUserIcon/> Accepter
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(user.email)}
                >
                 <DeleteForeverIcon/> Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
   </>
  );
};

export default AdminDashboard;