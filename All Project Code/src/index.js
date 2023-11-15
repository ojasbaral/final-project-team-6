// IMPORT DEPENDENCIES

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
//const bcrypt = require('bcrypt'); //  To hash passwords //THIS IS CAUSING AN ERROR

// DATABASE CONFIGURATION

const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// DATABASE CONNECTION TEST

db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// APP SETTINGS

app.use( express.static( "resources" ) );
app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// API ROUTES

app.get('/welcome', (req, res) => { // sample test from Lab 11
    res.json({status: 'success', message: 'Welcome!'});
});

//Landing Page Route
app.get('/', (req, res) => {

  // Testing navbar component, session represents whether a user is logged in or not
  res.render('pages/landing', {session: true})
})

app.get('/login', (req, res) => {
    res.render('views/pages/login', {});
});

app.get('/register', (req, res) => {
    res.render('views/pages/register',{})
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('views/pages/login', {message: 'Logged out Successfully!', error: false})
});
  
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE email = $1`;

    try {
        const user = await db.oneOrNone(query, email);

        if (!user) { //user not found
        res.redirect('/register');
        } else { //check if password is correct
        const match = await bcrypt.compare(password, user.password);

        if (match) { //password match -> save user session and redirect
            req.session.user = user;
            req.session.save();
            res.redirect('/');
        } else {
            res.render('views/pages/login', {message: 'Incorrect username or password.', error: true});
        }
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.render('views/pages/login', {message: 'Incorrect username or password.', error: true});
    }
});

app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = {
        email: req.body.email,
        password: hash,
    };
    const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`;

    try {
        const insertResult = await db.oneOrNone(query, [user.email, user.password]);

        if (insertResult) { // valid registration, redirect
        res.redirect('/login');
        } else {
        res.render('views/pages/register', {message: 'Email belongs to another account', error: true});
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.render('views/pages/register', {message: 'Email belongs to another account', error: true});
    }
});

// START SERVER
// app.listen(3000);
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
