const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const db = require('./config'); 
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/auth', authRoutes);

app.get('/', (req, res) => {

  res.send('Hello World!');
});

// GET all categories
app.get('/categories', (req, res) => {
  console.log("ganesh");
  try {
    const sql = 'SELECT * FROM categories';
  db.query(sql, (err, result) => {
    console.log('Error yet ahe :',result);
      if (err) {
          console.error('Error fetching categories:', err);
          res.status(500).json({ error: 'Failed to fetch categories' }); // Improved error response
      } else {
          res.status(200).json(result); // Send the result as JSON
      }
  });
    
  } catch (error) {
    console.error('Error yet ahe :', error);
  }
});

// POST to add a new category
app.post('/categories', (req, res) => {
  console.log("ganesh");
  const { name, image, status } = req.body;
  const sql = 'INSERT INTO categories (name, image, status) VALUES (?, ?, ?)';
  db.query(sql, [name, image, status], (err, result) => {
      if (err) {
          console.error('Error inserting category:', err);
          res.status(500).json({ error: 'Failed to add category' }); // Improved error response
      } else {
          res.status(201).json({ message: 'Category added successfully' }); // Send a success message
      }
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
