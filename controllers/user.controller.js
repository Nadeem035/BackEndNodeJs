// controllers/user.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.registerUser = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password
  };

  User.create(newUser, (err, user) => {
    
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (user) {
      return res.json({status: false, message: 'Email Already Exists' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({status: true, message: 'Registered successful', user, token });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body.formData; // Destructuring email and password from req.body
  const newUser = {
    email: email,
    password: password
  };

  User.loginCheck(newUser, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    } 
    if (!user) {
      return res.json({status: false, message: 'User not found' });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    return res.status(200).json({status: true, message: 'Login successful', user, token });
  });
};

exports.getAllUsers = (req, res) => {
  User.getAll(users => {
    res.json(users);
  });
};
const md5 = require('md5');
// Controller function to change password
exports.changePassword = (req, res) => {

  const { password, new_password } = req.body.formData;
  const { userId } = req.user;
  // Check if the old password matches the password stored in the database
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== md5(password)) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = md5(new_password);

    User.updatePassword(user, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update password' });
      }
      return res.status(200).json({status: true, message: 'Password updated successfully',});
    });
  });
};

