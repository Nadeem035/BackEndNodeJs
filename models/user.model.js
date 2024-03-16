// models/user.model.js

const connection = require('../config');
const md5 = require('md5');

class User {
    static getAll(callback) {
        connection.query('SELECT * FROM users', (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }
    static findByEmail(email, callback) {
        connection.query('SELECT * FROM users WHERE email = ?', email, (error, results) => {
            if (error) throw error;
            callback(results[0]);
        });
    }
    static create(user, callback) {
        connection.query('INSERT INTO users SET ?', user, (error, results) => {
            if (error) throw error;
            callback(results.insertId);
        });
    }
    static async loginCheck(user, callback) {
        const email = user.email;
        const password = user.password;

        try {
            // Find user by email
            connection.query('SELECT * FROM users WHERE email = ?', email, (error, results) => {
                if (error) throw error;

                if (results.length === 0) {
                    // User not found
                    return callback(null, false);
                }

                const user = results[0];

                // Compare hashed passwords
                if (user.password === md5(password)) {
                    // Passwords match
                    return callback(null, user);
                } else {
                    // Passwords don't match
                    return callback(null, false);
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return callback(error);
        }
    }
}

module.exports = User;
