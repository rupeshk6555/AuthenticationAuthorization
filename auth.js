// auth.js
const jwt = require('jsonwebtoken');

// Secret key used to sign the JWT
const secretKey = 'your_secret_key';

// Mock user data
const users = [
  {
    email: 'rupeshk@gmail.com',
    password: '123'
  },
  {
    email: 'rupeshkdev@gmail.com',
    password: '1234'
  }
];

// Authenticate user based on email and password
function authenticateUser(email, password) {
  const user = users.find((user) => user.email === email && user.password === password);
  return user;
}

// Generate a JWT token
function generateToken(email) {
  const token = jwt.sign({ email }, secretKey);
  return token;
}

module.exports = { authenticateUser, generateToken };
