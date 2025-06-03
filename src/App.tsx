import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './signup';
import Login from './login';
import Dashboard from './dashboard';
import { UserProvider } from './userContext';
import CreateApplication from './createapplication';
import { Applications } from './applications';
import Watchlist from './watchlist';
import Footer from './footer';
import Header from './header';
import { Imprint } from './imprint';
import { Legalnotice } from './legalnotice';
const basename = window.location.hostname === 'localhost' ? '' : '/applications';
function App() {
  return (
    <UserProvider>
      <Router basename={basename}>
        <Header />
        <div className='headerPlaceholder'></div>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/createapplication' element={<CreateApplication />} />
          <Route path='/applications' element={<Applications />} />
          <Route path='/watchlist' element={<Watchlist />} />
          <Route path='/imprint' element={<Imprint />} />
          <Route path='/legalnotice' element={<Legalnotice />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>


  );
}

export default App;
