import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTh, faTags, faBox } from '@fortawesome/free-solid-svg-icons';import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/logo.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'sidebar-link active-link' : 'sidebar-link')}
      >
        <FontAwesomeIcon className='custom-icon' icon={faHome} />
        Home
      </NavLink>
      <NavLink
        to="/category"
        className={({ isActive }) => (isActive ? 'sidebar-link active-link' : 'sidebar-link')}
      >
        <FontAwesomeIcon className='custom-icon' icon={faTh} />
        Category
      </NavLink>
      <NavLink
        to="/subcategory"
        className={({ isActive }) => (isActive ? 'sidebar-link active-link' : 'sidebar-link')}
      >
        <FontAwesomeIcon className='custom-icon' icon={faTags} />
        Subcategory
      </NavLink>
      <NavLink
        to="/product"
        className={({ isActive }) => (isActive ? 'sidebar-link active-link' : 'sidebar-link')}
      >
        <FontAwesomeIcon className='custom-icon' icon={faBox} />
        Products
      </NavLink>
    </div>
  );
};

export default Sidebar;
