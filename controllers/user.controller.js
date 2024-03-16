// controllers/user.controller.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateSecretKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

const User = require('../models/user.model');

exports.getAllUsers = (req, res) => {
  User.getAll(users => {
    res.json(users);
  });
};

exports.registerUser = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password
  };

  User.create(newUser, userId => {
    res.json({ message: 'User registered successfully', userId });
  });
};

exports.loginUser = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password
  };

  User.loginCheck(newUser, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      return res.json({status: false, message: 'User not found' });
    }

    const secretKey = generateSecretKey();
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

    return res.status(200).json({status: true, message: 'Login successful', user, token });
  });
};
