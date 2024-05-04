// models/user.model.js

const { selectData, insertData, updateData, deleteData } = require('../config');

const md5 = require('md5');

class User {
    static getAll(callback) {
        selectData('users', null, (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }
    static findByEmail(email, callback) {
        const condition = { email: email };
        selectData('users', condition, (error, results) => {
            if (error) throw error;
            callback(results[0]);
        });
    }
    static findById(user_id, callback) {
        const condition = { user_id: user_id };
        selectData('users', condition, (error, results) => {
            if (error) throw error;
            callback(results[0]);
        });
    }
    static create(user, callback) {
        const condition = { email: user.email };
        selectData('users', condition, (error, results) => {
            if (error) {
                throw error;
            } else if (results.length > 0) {
                // Email already exists, provide an error
                const err = new Error('Email already exists');
                callback(err, null);
            } else {
                user.password = md5(user.password); // Assuming password is present in user object
                insertData('users', user, (error, results) => {
                    if (error) {
                        throw error;
                    }
                    callback(null, { ...user, id: results.insertId });
                });
            }
        });
    }
    static updatePassword(user, callback) {
        const updateValues = { password: user.password };
        const updateCondition = { user_id: user.user_id };
        updateData('users', updateValues, updateCondition, (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }
    static deleteUser(user, callback) {
        const deleteCondition = { user_id: user.user_id };
        deleteData('users', deleteCondition, (error, results) => {
            if (error) throw error;
            callback(results);
        });
    }

    static async loginCheck(user, callback) {
        const email = user.email;
        const password = user.password;

        try {
            // Find user by email
            const condition = { email: email };
            selectData('users', condition, (error, results) => {
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
            return callback(error);
        }
    }
}

module.exports = User;
