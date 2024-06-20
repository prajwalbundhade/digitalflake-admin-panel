import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './Category.css';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryStatus, setCategoryStatus] = useState('Active');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setCategoryName('');
    setCategoryImage(null);
    setCategoryStatus('Active');
    setCurrentCategory(null);
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleStatusChange = (e) => {
    setCategoryStatus(e.target.value);
  };

  const handleSaveCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      formData.append('image', categoryImage);
      formData.append('status', 'Active');

      const response = await fetch('http://localhost:5000/categories', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryStatus(category.status);
    setShowEditModal(true);
  };

  const handleUpdateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      formData.append('image', categoryImage);
      formData.append('status', categoryStatus);

      const response = await fetch(`http://localhost:5000/categories/${currentCategory.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/categories/${currentCategory.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting category:', error);
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
                <td><img src={`http://localhost:5000${category.image}`} alt={category.name} className="category-image" /></td>
                <td className={category.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {category.status}
                </td>
                <td>
                  <Button variant="link" onClick={() => handleEditCategory(category)}>
                    <FontAwesomeIcon className='custom-icon' icon={faEdit} />
                  </Button>
                  <Button variant="link" onClick={() => handleDeleteCategory(category)}>
                    <FontAwesomeIcon className='custom-icon ' icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Adding Category */}
      <Modal show={showAddModal} onHide={handleCloseModal}>
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

      {/* Modal for Editing Category */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
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
            <Form.Group controlId="categoryStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={categoryStatus} onChange={handleStatusChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCategory} style={{ backgroundColor: '#5C218B' }}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Deleting Category */}
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this category?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Category;
