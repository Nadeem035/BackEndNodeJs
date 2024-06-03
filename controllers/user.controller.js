// controllers/user.controller.js
const fs = require('fs');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
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
    // Remove Password from User Object 
    delete user.password;


    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({status: true, message: 'Login successful', user, token });
  });
};

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

// Controller function to change password
exports.profile = (req, res) => {
  const {
    name,
    jobTitle,
    age,
    education,
    experience,
    language,
    about,
    email,
    phone,
    tempAddress,
    address,
    address2,
    country,
    stateCity,
    zipCode,
    latitude,
    longitude,
    facebook,
    twitter,
    instagram,
    linkedin,
    googlePlus
  } = req.body;

  const profileImage = req.file ? req.file.path : null;

  console.log(req.body.formData.name);

  // Here you can save the data to your database
  // For demonstration purposes, we will save it to a JSON file

  const userProfile = {
    name,
    jobTitle,
    age,
    education,
    experience,
    language,
    about,
    email,
    phone,
    tempAddress,
    address,
    address2,
    country,
    stateCity,
    zipCode,
    latitude,
    longitude,
    facebook,
    twitter,
    instagram,
    linkedin,
    googlePlus,
    profileImage
  };

  fs.writeFile('userProfile.json', JSON.stringify(userProfile, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to save profile data', error: err });
    }
    res.status(200).json({ message: 'Profile updated successfully', data: userProfile });
  });
};

