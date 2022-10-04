const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const { beer, gyle, date, fv } = req.body;
    const { mashIn, copperUp, mashTemp, gravity_after_boil, setTaps, dip_after_boil, first_runnings, dip_in_liquor, last_runnings, wort_pH, collection_dip } = req.body;
    const { issue_no, action_mashing_liquor, action_glass_audit, action_racking_tank, action_fermenter, action_auger_grain_chute, action_trailer, action_premasher, action_mash_tun_plates, action_copper, action_pipes_paraflow } = req.body;
    const { datetimeFermentation, hoursFermentation, tempFermentation, gravityFermentation, tasteFermentation } = req.body;

    db.query(`INSERT INTO brew (beer, gyle, date, fv) VALUES ('${beer}', '${gyle}', '${date}', '${fv}')`, (err, results) => {
        if (err) {
            throw err;
        }
        return res.render('../views/register', {
            message: 'Registration successful',
            color: 'success'
        });
    });

    //res.render('../views/login');
}

