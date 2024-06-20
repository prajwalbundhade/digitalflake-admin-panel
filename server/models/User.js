const db = require('../config');
const bcrypt = require('bcrypt');

const createUser = (email, password, callback) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) callback(err);
    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], callback);
  });
};

const findUserByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) callback(err);
    callback(null, results[0]);
  });
};

module.exports = {
  createUser,
  findUserByEmail
};
