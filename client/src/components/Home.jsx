import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import './Home.css';
import logo from '../assets/logo.png';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // Force a reload to update state
  };

  return (
    <Container className="home-container">
      <img src={logo} alt="Digitalflake" className="home-logo" />
      <h2>Welcome to the Dashboard</h2>
      <Button variant="primary" onClick={handleLogout} style={{ backgroundColor: '#5C218B' }}>
        Logout
      </Button>
    </Container>
  );
};

export default Home;
