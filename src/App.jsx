import React, { useState } from 'react';

import { Login } from './compoment/login';
import { Register } from './compoment/register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AdminDashboard from './compoment/admin';
import Test from './compoment/test';
import ChatsPage from './compoment/chat'
import HomePage from './compoment/HomePage';
import ChooseChat from './compoment/ChooseChat';

function App() {
  const [currentForm, setCurrentForm] = useState('login');
  const [user, setUser] = useState(localStorage.getItem('access_token') || '');
  const [username, setUserName] = useState(localStorage.getItem('username') || '');
  const [id, setId] = useState(localStorage.getItem('user') || '');
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" exact element={<HomePage />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          {user && (
            <>    
              <Route path="/ChooseChat" exact element={<ChooseChat />} /> 
              <Route path="/chat" exact element={<ChatsPage user={id} username={username}/>} />
              <Route path="/chat2" exact element={<Test />} /> 
              
            </>
          )}
           {username == "houdalaaamrabet123@gmail.com" && (
            <>              
              <Route path="/admin" element={<AdminDashboard />} />
            </>
          )}
        </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
