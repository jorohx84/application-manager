import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { basename } from 'path';
import SignUp from './signup';


function App() {
  return (
    <Router basename="/">
<Routes>
  <Route path="/" element={<SignUp/>} />
</Routes>
    </Router>
  );
}

export default App;
