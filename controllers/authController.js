const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { insert } = require('./SQL_Insert');

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password:  process.env.PASSWORD,
    database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query(`SELECT email FROM users WHERE email = '${email}'`, async (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            return res.render('../views/register', {
                message: 'Email already exists',
                color: 'warning'
            });
        } else if (password !== passwordConfirm) {
            return res.render('../views/register', {
                message: 'Passwords do not match',
                color: 'danger'
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            db.query(`INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`, (err, results) => {
                if (err) {
                    throw err;
                }
                return res.render('../views/register', {
                    message: 'Registration successful',
                    color: 'success'
                });
            });
        }
    });
}

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, results) => {
        if (err) {
            throw err;
        }

        if (results.length > 0) {
            const user = results[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET);
                res.cookie('jwt', token, { maxAge: 60 * 60 * 24 * 7 * 1000 });
                res.render('../views/profile', {
                    message: 'Login successful',
                    user,
                    color: 'success'
                });
            } else {
                res.render('../views/login', {
                    message: 'Invalid password',
                    color: 'danger'
                });
            }
        } else {
            res.render('../views/login', {
                message: 'Invalid email',
                color: 'danger'
            });
        }
    });
}

exports.addFermentationData = (req, res) => {
    res.send('Add Fermentation Data');
}

exports.save = (req, res) => {
    res.send('Save');
}

exports.profile = (req, res) => {
    console.log(req.body);
    insert(req, res);
}
