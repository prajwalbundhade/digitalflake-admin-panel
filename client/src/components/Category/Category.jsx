import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Category.css';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);

  // Fetch categories from backend when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      // if (!response.ok) {
      //   // throw new Error('Failed to fetch categories');
      // }
      console.log(response)
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddNew = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCategoryName('');
    setCategoryImage(null);
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleSaveCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      formData.append('image', categoryImage);
      formData.append('status', 'Active'); // Assuming you set default status
      

      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      // After successful save, fetch updated categories
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <Container className="category-container">
      <div>
        <div className="header">
          <h2>Category</h2>
          <Button variant="primary" className="add-button" onClick={handleAddNew}>
            <FontAwesomeIcon icon={faPlus} /> Add New
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Category name</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td><img src={category.image} alt={category.name} className="category-image" /></td>
                <td className={category.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {category.status}
                </td>
                <td>
                  <Button variant="link">
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button variant="link">
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Adding Category */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control type="text" value={categoryName} onChange={handleCategoryNameChange} />
            </Form.Group>
            <Form.Group controlId="categoryImage">
              <Form.Label>Upload Image</Form.Label>
              <div className="image-upload-container">
                <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
                <span>Upload maximum allowed file size is 10MB</span>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveCategory} style={{ backgroundColor: '#5C218B' }}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Category;
