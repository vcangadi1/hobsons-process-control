const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crud = require('./crud');

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
                crud.read(req, res);
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

exports.find = (req, res) => {
    crud.read(req, res);
}

exports.add = (req, res) => {
    res.render('../views/create');
}

// Edit & Update
exports.edit = (req, res) => {
    crud.edit(req, res);
}

exports.update = (req, res) => {
    crud.update(req, res);
}

// Delete Data
exports.delete = (req, res) => {
    crud.delete(req, res);
}

exports.view = (req, res) => {
    crud.view(req, res);
}

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
}

exports.create = (req, res) => {
    const data = req.body;

    if (req.body.brewer === '') {
        return res.render('../views/login', {
            message: 'Please login again',
            data,
            color: 'warning'
        });
    }

    if (req.body.beer === '') {
        return res.render('../views/create', {
            message: 'Please input a valid beer type',
            data,
            color: 'danger'
        });
    }

    if (req.body.gyle === '' || req.body.gyle == 0) {
        return res.render('../views/create', {
            message: 'Please input a valid gyle number',
            data,
            color: 'danger'
        });
    }

    if (req.body.fv === '' || req.body.fv === 0) {
        return res.render('../views/create', {
            message: 'Please input a valid Fv',
            data,
            color: 'danger'
        });
    }

    crud.create(req, res);
}
