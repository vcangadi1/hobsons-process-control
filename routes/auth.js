const express = require('express');
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register, Login & Logout Page
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', validateToken, authController.logout);

// Search Data
router.post('/find', validateToken, authController.find);

// Add & Create Data
router.get('/add', validateToken, authController.add);
router.post('/create', validateToken, authController.create);

// Edit & Update Data
router.get('/edit/:gyle', validateToken, authController.edit);
router.post('/edit/:gyle', validateToken, authController.update);

// Delete
router.get('/delete/:gyle', validateToken, authController.delete);
router.get('/fdelete/:gyle/:id', validateToken, authController.fdelete);

// View
router.get('/view/:gyle', validateToken, authController.view);

module.exports = router;

function validateToken(req, res, next) {
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