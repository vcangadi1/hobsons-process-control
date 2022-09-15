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

