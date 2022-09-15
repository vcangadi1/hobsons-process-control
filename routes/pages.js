const express = require('express');

const router = express.Router();

// Home Page
router.get('/', (req, res) => {
    res.render('index');
});

// Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;

