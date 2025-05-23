import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { basename } from 'path';
import SignUp from './signup';
import Login from './login';
import Dashboard from './dashboard';
import { UserProvider } from './userContext';
import CreateApplication from './createapplication';

import { Applications } from './applications';
import Watchlist from './watchlist';
import Footer from './footer';
import Header from './header';


function App() {
  return (
    <UserProvider>
      <Router basename="/">
      <Header/>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/createapplication' element={<CreateApplication />} />
          <Route path='/applications' element={<Applications />} />
          <Route path='/watchlist' element={<Watchlist />} />
        </Routes>
        <Footer/>
      </Router>
    </UserProvider>


  );
}

export default App;
