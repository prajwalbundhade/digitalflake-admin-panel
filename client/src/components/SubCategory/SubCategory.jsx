import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './SubCategory.css';

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [subCategoryStatus, setSubCategoryStatus] = useState('Active');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/subcategories');
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

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
    setSubCategoryName('');
    setSubCategoryImage(null);
    setSubCategoryStatus('Active');
    setSelectedCategory('');
    setCurrentSubCategory(null);
  };

  const handleSubCategoryNameChange = (e) => {
    setSubCategoryName(e.target.value);
  };

  const handleImageChange = (e) => {
    setSubCategoryImage(e.target.files[0]);
  };

  const handleStatusChange = (e) => {
    setSubCategoryStatus(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSaveSubCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('name', subCategoryName);
      formData.append('image', subCategoryImage);
      formData.append('status', subCategoryStatus);
      formData.append('categoryId', selectedCategory);

      const response = await fetch('http://localhost:5000/subcategories', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add subcategory');
      }

      fetchSubCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving subcategory:', error);
    }
  };

  const handleEditSubCategory = (subCategory) => {
    setCurrentSubCategory(subCategory);
    setSubCategoryName(subCategory.name);
    setSubCategoryStatus(subCategory.status);
    setSelectedCategory(subCategory.categoryId);
    setShowEditModal(true);
  };

  const handleUpdateSubCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('name', subCategoryName);
      formData.append('image', subCategoryImage);
      formData.append('status', subCategoryStatus);
      formData.append('categoryId', selectedCategory);

      const response = await fetch(`http://localhost:5000/subcategories/${currentSubCategory.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update subcategory');
      }

      fetchSubCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  };

  const handleDeleteSubCategory = (subCategory) => {
    setCurrentSubCategory(subCategory);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/subcategories/${currentSubCategory.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subcategory');
      }

      fetchSubCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  return (
    <Container className="subcategory-container">
      <div>
        <div className="header">
          <h2>SubCategory</h2>
          <Button variant="primary" className="add-button" onClick={handleAddNew}>
            <FontAwesomeIcon icon={faPlus} /> Add New
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>SubCategory name</th>
              <th>Image</th>
              <th>Status</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((subCategory) => (
              <tr key={subCategory.id}>
                <td>{subCategory.id}</td>
                <td>{subCategory.name}</td>
                <td><img src={`http://localhost:5000${subCategory.image}`} alt={subCategory.name} className="subcategory-image" /></td>
                <td className={subCategory.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {subCategory.status}
                </td>
                <td>{subCategory.categoryName}</td>
                <td>
                  <Button variant="link" onClick={() => handleEditSubCategory(subCategory)}>
                    <FontAwesomeIcon className='custom-icon' icon={faEdit} />
                  </Button>
                  <Button variant="link" onClick={() => handleDeleteSubCategory(subCategory)}>
                    <FontAwesomeIcon className='custom-icon' icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Adding SubCategory */}
      <Modal show={showAddModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add SubCategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="subCategoryName">
              <Form.Label>SubCategory Name</Form.Label>
              <Form.Control type="text" value={subCategoryName} onChange={handleSubCategoryNameChange} />
            </Form.Group>
            <Form.Group controlId="subCategoryImage">
              <Form.Label>Upload Image</Form.Label>
              <div className="image-upload-container">
                <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
                <span>Upload maximum allowed file size is 10MB</span>
              </div>
            </Form.Group>
            <Form.Group controlId="categorySelect">
              <Form.Label>Select Category</Form.Label>
              <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveSubCategory} style={{ backgroundColor: '#5C218B' }}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Editing SubCategory */}
      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit SubCategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="subCategoryName">
              <Form.Label>SubCategory Name</Form.Label>
              <Form.Control type="text" value={subCategoryName} onChange={handleSubCategoryNameChange} />
            </Form.Group>
            <Form.Group controlId="subCategoryImage">
              <Form.Label>Upload Image</Form.Label>
              <div className="image-upload-container">
                <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
                <span>Upload maximum allowed file size is 10MB</span>
              </div>
            </Form.Group>
            <Form.Group controlId="categorySelect">
              <Form.Label>Select Category</Form.Label>
              <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="subCategoryStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" value={subCategoryStatus} onChange={handleStatusChange}>
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
          <Button variant="primary" onClick={handleUpdateSubCategory} style={{ backgroundColor: '#5C218B' }}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Deleting SubCategory */}
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete SubCategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this subcategory?
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

export default SubCategory;
