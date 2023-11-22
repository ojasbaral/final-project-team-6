// IMPORT DEPENDENCIES

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords //THIS IS CAUSING AN ERROR

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

const profileData = {
  bio: null,
  classes: [],
  time_info: [],
  contact_info: null,
  tutor: null,
  student: null,
};

let editMode = null;


// API ROUTES

app.get('/welcome', (req, res) => { // sample test from Lab 11
    res.json({status: 'success', message: 'Welcome!'});
});

//Landing Page Route
app.get('/', (req, res) => {

  // Testing navbar component, session represents whether a user is logged in or not
  res.render('pages/landing', {session: (req.session.user?true:false)})
})

app.get('/login', (req, res) => {
    res.render('pages/login', {session: (req.session.user?true:false)});
});

app.get('/register', (req, res) => {
    res.render('pages/register',{session: (req.session.user?true:false)})
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/login', {session: false, message: 'Logged out Successfully!', error: false})
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
            res.redirect('/profile');
        } else {
            res.status(400).render('pages/login', {session: (req.session.user?true:false), message: 'Incorrect username or password.', error: true});
        }
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).render('pages/login', {session: (req.session.user?true:false), message: 'Incorrect username or password.', error: true});
    }   
});

app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = {
        email: req.body.email,
        password: hash,
    };

    //checking if email exists
    const valid_email = 'SELECT * FROM users WHERE email=$1'
    try {
      const checkResult = await db.oneOrNone(valid_email, user.email)

      if(checkResult){
         res.status(400).render('pages/register', {session: (req.session.user?true:false), message: 'Email belongs to another account', error: true});
      }else{

        const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`;

        try {
          const insertResult = await db.oneOrNone(query, [user.email, user.password]);

          if (insertResult) { // valid registration, redirect
          res.redirect('/login');
          } else {
          res.status(400).render('pages/register', {session: (req.session.user?true:false), message: 'Email belongs to another account', error: true});
          }
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(400).render('pages/register', {session: (req.session.user?true:false), message: 'Email belongs to another account', error: true});
        }

      }
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(400).render('pages/register', {session: (req.session.user?true:false), message: 'Email belongs to another account', error: true});
    }


    
});

app.get('/profile', (req, res) => {

  console.log('profileData:', profileData); // Log the profileData object
  const allTimes = ['8:00am', '9:00am','10:00am','11:00am','12:00pm','1:00pm','2:00pm','3:00pm','4:00pm','5:00pm','6:00pm','7:00pm','8:00pm'];
  const courses = [
    { course_id:'CSCI 1000', course_name: 'Computer Science as a Field of Work and Study', credit_hours: 1 },
    { course_id: 'CSCI 1300', course_name: 'Introduction to Programming', credit_hours: 4},
    { course_id: 'CSCI 1200', course_name: 'Introduction to computational thinking', credit_hours: 3},
    { course_id: 'CSCI 2270', course_name: 'Data Structures', credit_hours:  4},
    { course_id: 'CSCI 2400', course_name: 'Computer Systems', credit_hours:  4},
    { course_id: 'CSCI 3308', course_name: 'Software Development Methods and Tools', credit_hours:  3},
    { course_id: 2824, course_name: 'Discrete Structures', credit_hours:  3},
    { course_id: 3104, course_name: 'Algorithms', credit_hours:  4},
    { course_id: 3155, course_name: 'Principles of Programming Languages', credit_hours:  4},
    { course_id: 3287, course_name: 'Design and Analysis of Database systems', credit_hours:  3},
    { course_id: 3753, course_name: 'Design and Analysis of Operating systems', credit_hours:  4},
    { course_id: 2820, course_name: 'Linear Algebra with Computer Science Applications', credit_hours:  3},
    { course_id: 3202, course_name: 'Introduction to Artificial Intelligence', credit_hours:  3},
    { course_id: 3022, course_name: 'Introduction to Data Science', credit_hours:  3},
    { course_id: 3002, course_name: 'Fundamentals of Human Computer Interaction', credit_hours:  4},
    { course_id: 3010, course_name: 'Intensive Programming Workshop', credit_hours:  3},
    { course_id: 4253, course_name: 'Data Center Scale Computing', credit_hours:  3},
    { course_id: 4273, course_name: 'Network Systems', credit_hours:  3},
    { course_id: 4308, course_name: 'Software Engineering Project 1', credit_hours:  4},
    { course_id: 4448, course_name: 'Object-Oriented Analysis and Design', credit_hours:  3},
    { course_id: 4502, course_name: 'Data Mining', credit_hours:  3},
  ];

  res.render('pages/profile', {
    bio: profileData.bio,
    courses: courses,
    classes: Array.isArray(profileData.classes) ? profileData.classes : [],
    time_info: Array.isArray(profileData.time_info) ? profileData.time_info : [],
    contact_info: profileData.contact_info,
    tutor: profileData.tutor,
    student: profileData.student,
    session: (req.session.user ? true : false),
    allTimes: allTimes,
    editMode: editMode,
    
  });
  editMode = true;
});


app.post('/update-profile', (req, res) => {
  profileData.bio = req.body.bio;
  profileData.classes = req.body.classes;
  profileData.time_info = req.body.time_info;
  profileData.allTimes = req.body.allTimes;
  profileData.contact_info = req.body.contact_info;
  profileData.tutor = req.body.tutor;
  profileData.student = req.body.student;
  editMode = false;
  res.redirect('/profile');
});



// START SERVER
// app.listen(3000);
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
