import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { basename } from 'path';
import SignUp from './signup';
import Header from './header';
import Login from './login';
import Dashboard from './dashboard';
import { UserProvider } from './userContext';
import CreateApplication from './createapplication';
import Sidebar from './sidebar';
import { Applications } from './applications';



function App() {
  return (
    <UserProvider>
    
      <Router basename="/"> 
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/createapplication' element={<CreateApplication />} />
          <Route path='/applications' element={<Applications />} />
        </Routes>
      </Router>

    </UserProvider>


  );
}

export default App;
