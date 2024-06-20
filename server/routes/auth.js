const express = require('express');
const router = express.Router();
const { createUser, findUserByEmail } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
  const { email, password } = req.body;
  createUser(email, password, (err, result) => {
    if (err) {
      console.error(err); 
      return res.status(500).json({ error: 'Failed to create user' });
    }
    res.status(201).json({ message: 'User created' });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  findUserByEmail(email, (err, user) => {
    if (err) {
      console.error(err); 
      return res.status(500).json({ error: 'Failed to find user' });
    }
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err); 
        return res.status(500).json({ error: 'Failed to compare passwords' });
      }
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;
