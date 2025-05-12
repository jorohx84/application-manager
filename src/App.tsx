import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { basename } from 'path';
import SignUp from './signup';
import Header from './header';
import Login from './login';
import Dashboard from './dashboard';
import { UserProvider } from './userContext';


function App() {
  return (
    <UserProvider>
      <Router basename="/">
        <Header />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>

    </UserProvider>


  );
}

export default App;
