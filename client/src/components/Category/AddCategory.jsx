// AddCategory.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Form } from 'react-bootstrap';
import './AddCategory.css';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('Inactive');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/categories', { name, image, status });
      navigate('/category');
    } catch (error) {
      console.error('There was an error saving the category!', error);
    }
  };

  return (
    <Container className="add-category-container">
      <h2>Add Category</h2>
      <Form>
        <Form.Group controlId="categoryName">
          <Form.Label>Category Name</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="categoryImage">
          <Form.Label>Upload Image</Form.Label>
          <div className="image-upload-container">
            {image && <img src={image} alt="Preview" className="image-preview" />}
            <Form.File onChange={handleImageChange} accept="image/*" />
            <span>Upload maximum allowed file size is 10MB</span>
          </div>
        </Form.Group>
        <Button variant="secondary" onClick={() => navigate('/category')}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} style={{ backgroundColor: '#5C218B' }}>
          Save
        </Button>
      </Form>
    </Container>
  );
};

export default AddCategory;
