import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import CustomNavbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Category from './components/Category/Category'; 
import SubCategory from './components/SubCategory/SubCategory'; 
import Product from './components/Product/Product';

import './App.css';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  return (
    <Router>
      {isAuthenticated && <CustomNavbar />}
      <div className={`main-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
        {isAuthenticated && <Sidebar />}
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/category" element={isAuthenticated ? <Category /> : <Navigate to="/login" />} />
            <Route path="/subcategory" element={isAuthenticated ? <SubCategory /> : <Navigate to="/login" />} />
            <Route path="/product" element={isAuthenticated ? <Product /> : <Navigate to="/login" />} />
           
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
