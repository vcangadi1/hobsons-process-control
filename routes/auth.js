const express = require('express');
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Login Page
router.post('/login', authController.login);

// Profile Page
router.post('/profile', validateToken, authController.profile);

// Register Page
router.post('/register', authController.register);

// Data
router.get('/tableData', validateToken, authController.tableData);

// Find
router.post('/find', validateToken, authController.find);

// Add
router.get('/add', validateToken, authController.add);

// Edit
router.get('/edit/:id', validateToken, authController.edit);

// Update
router.post('/edit/:id', validateToken, authController.update);

// Delete
router.get('/delete/:id', validateToken, authController.delete);

// View
router.get('/view/:id', validateToken, authController.view);

module.exports = router;

function validateToken (req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.render('../views/login', {
                    message: 'Invalid token',
                    color: 'danger'
                });
            } else {
                return next();
            }
        });
    } else {
        return res.render('../views/login', {
            message: 'User not authenticated',
            color: 'danger'
        });
    }
}

