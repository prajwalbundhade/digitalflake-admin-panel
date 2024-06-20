import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const CustomNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.reload(); 
  };

  return (
    <>
    <div className="navbar">
      <Navbar  expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/src/assets/logo-1.png"
              height="30"
              className="d-inline-block align-top"
              alt="Company Logo"
            />
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="#" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faUser} />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Are you sure you want to logout?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button> &nbsp;&nbsp;
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Body>
      </Modal>
      </div>
    </>
  );
};

export default CustomNavbar;
