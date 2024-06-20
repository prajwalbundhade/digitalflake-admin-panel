const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const db = require('./config');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

// POST method for  category
app.post('/categories', upload.single('image'), (req, res) => {
  const { name, status } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = 'INSERT INTO categories (name, image, status) VALUES (?, ?, ?)';
  db.query(sql, [name, image, status], (err, result) => {
    if (err) {
      console.error('Error inserting category:', err);
      res.status(500).json({ error: 'Failed to add category' });
    } else {
      res.status(201).json({ message: 'Category added successfully' });
    }
  });
});

// Fetch method for categories
app.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM categories';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories' });
    } else {
      res.json(results);
    }
  });
});

// PUT method for category
app.put('/categories/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  let sql;
  let params;

  if (req.file) {
    const image = `/uploads/${req.file.filename}`;
    sql = 'UPDATE categories SET name = ?, image = ?, status = ? WHERE id = ?';
    params = [name, image, status, id];
  } else {
    sql = 'UPDATE categories SET name = ?, status = ? WHERE id = ?';
    params = [name, status, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ error: 'Failed to update category' });
    } else {
      res.json({ message: 'Category updated successfully' });
    }
  });
});

// DELETE method for category
app.delete('/categories/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM categories WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ error: 'Failed to delete category' });
    } else {
      res.json({ message: 'Category deleted successfully' });
    }
  });
});

// POST method for subcategory
app.post('/subcategories', upload.single('image'), (req, res) => {
  const { name, status, categoryId } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = 'INSERT INTO subcategories (name, image, status, categoryId) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, image, status, categoryId], (err, result) => {
    if (err) {
      console.error('Error inserting subcategory:', err);
      res.status(500).json({ error: 'Failed to add subcategory' });
    } else {
      res.status(201).json({ message: 'Subcategory added successfully' });
    }
  });
});

// Fetch method for subcategories
app.get('/subcategories', (req, res) => {
  const sql = `
    SELECT subcategories.*, categories.name AS categoryName
    FROM subcategories
    JOIN categories ON subcategories.categoryId = categories.id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching subcategories:', err);
      res.status(500).json({ error: 'Failed to fetch subcategories' });
    } else {
      res.json(results);
    }
  });
});

// PUT method for subcategory
app.put('/subcategories/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, status, categoryId } = req.body;
  let sql;
  let params;

  if (req.file) {
    const image = `/uploads/${req.file.filename}`;
    sql = 'UPDATE subcategories SET name = ?, image = ?, status = ?, categoryId = ? WHERE id = ?';
    params = [name, image, status, categoryId, id];
  } else {
    sql = 'UPDATE subcategories SET name = ?, status = ?, categoryId = ? WHERE id = ?';
    params = [name, status, categoryId, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error updating subcategory:', err);
      res.status(500).json({ error: 'Failed to update subcategory' });
    } else {
      res.json({ message: 'Subcategory updated successfully' });
    }
  });
});

// DELETEmethod for subcategory
app.delete('/subcategories/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM subcategories WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting subcategory:', err);
      res.status(500).json({ error: 'Failed to delete subcategory' });
    } else {
      res.json({ message: 'Subcategory deleted successfully' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
