const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');

dotenv.config({
    path: path.join(__dirname, '/.env')
});
const port = process.env.PORT;
const ip = process.env.IP;

const app = express();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const publicPath = path.join(__dirname, '/public');
app.use(express.static(publicPath));

// Parse URL encoded request bodies (as sent by HTML forms)
app.use(express.urlencoded({
    extended: false
}));
// Parse JSON request bodies (as sent by API clients)
app.use(express.json());
// Parse cookies
app.use(cookieParser());

//this required before view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

// Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(port, ip, () => {
    console.log(`Server is running at http://localhost:${port}`);
});