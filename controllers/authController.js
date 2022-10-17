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

                db.query(`SELECT id, date, brewer, gyle, beer, fv FROM brew order by datetimeFermentation desc, date desc limit 10;`, (err, data) => {
                    if (err) {
                        throw err;
                    }

                    res.render('../views/tableData', {
                        message: 'Data retrieved successfully',
                        data,
                        color: 'success'
                    });
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

exports.tableData = (req, res) => {
    db.query(`SELECT id, date, brewer, gyle, beer, fv FROM brew order by datetimeFermentation desc, date desc limit 10;`, (err, data) => {
        if (err) {
            throw err;
        }

        res.render('../views/tableData', {
            message: 'Data retrieved successfully',
            data,
            color: 'success'
        });
    });
}

exports.find = (req, res) => {
    const { search } = req.body;

    db.query(`SELECT * FROM brew WHERE id LIKE '%${search}%' OR date LIKE '%${search}%' OR brewer LIKE '%${search}%' OR gyle LIKE '%${search}%' OR beer LIKE '%${search}%' OR fv LIKE '%${search}%' order by datetimeFermentation desc, date desc LIMIT 10`, (err, data) => {
        if (err) {
            throw err;
        }

        if (data.length > 0) {
            res.render('../views/tableData', {
                message: 'Data retrieved successfully',
                data,
                color: 'success'
            });
        } else {
            res.render('../views/tableData', {
                message: 'Data not found',
                color: 'danger'
            });
        }
    });
}

exports.add = (req, res) => {
    res.render('../views/profile', {});
}

exports.profile = (req, res) => {
    const data = req.body;
    console.log(req.body);

    if (req.body.brewer === '') {
        return res.render('../views/login', {
            message: 'Please login again',
            data,
            color: 'warning'
        });
    }

    if (req.body.beer === '') {
        return res.render('../views/profile', {
            message: 'Please input a valid beer type',
            data,
            color: 'danger'
        });
    }

    if (req.body.gyle === '' || req.body.gyle == 0) {
        return res.render('../views/profile', {
            message: 'Please input a valid gyle number',
            data,
            color: 'danger'
        });
    }

    if (req.body.fv === '' || req.body.fv === 0) {
        return res.render('../views/profile', {
            message: 'Please input a valid Fv',
            data,
            color: 'danger'
        });
    }

    insert(req, res);
}
