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
            res.redirect('/');
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

app.get('/students/search', async (req, res) => {
  const nameSearch = req.query.nameSearch || '';
  const courseSearch = req.query.courseSearch || '';
  const timeSearch = req.query.timeSearch || '';
  try{
    const query = `SELECT u.user_id, u.email, u.time_info, c.course_name
    FROM users u 
    JOIN users_to_courses utc ON u.user_id = utc.user_id 
    JOIN courses c ON utc.course_id = c.course_id 
    WHERE u.student = true AND utc.tutoring = false 
    AND u.email ILIKE $1 AND c.course_name ILIKE $2 AND u.time_info ILIKE $3;`;
    const students = await db.any(query, [`%${nameSearch}%`, `%${courseSearch}%`, `%${timeSearch}%`]);
    //console.log({nameSearch}, {courseSearch}, {timeSearch});
    //console.log(students);  && utc.tutoring = true
    res.render('pages/students',{session: req.session.user, students});

  } 
  catch (error){
    console.error('Error during serach:', error);
    res.status(500).render('pages/students', {session: req.session.user, error});
  }
});


app.get('/tutors/search', async (req, res) => {
  const nameSearch = req.query.nameSearch || '';
  const courseSearch = req.query.courseSearch || '';
  const timeSearch = req.query.timeSearch || '';
  try{
    const query = `SELECT u.user_id, u.email, u.time_info, c.course_name
    FROM users u 
    JOIN users_to_courses utc ON u.user_id = utc.user_id 
    JOIN courses c ON utc.course_id = c.course_id 
    WHERE u.tutor = true AND utc.tutoring = true
    AND u.email ILIKE $1 AND c.course_name ILIKE $2 AND u.time_info ILIKE $3;`;
    const tutors = await db.any(query, [`%${nameSearch}%`, `%${courseSearch}%`, `%${timeSearch}%`]);
    //console.log({nameSearch}, {courseSearch}, {timeSearch});
    //console.log(tutors);
    res.render('pages/tutors',{session: req.session.user, tutors});

  } 
  catch (error){
    console.error('Error during serach:', error);
    res.status(500).render('pages/students', {session: req.session.user, error});
  }
});

async function isStudentConnectedWithTutor(studentUserId, tutorUserId) {
  try {
    const result = await db.oneOrNone(
      'SELECT * FROM user_to_user WHERE tutor_user = $1 AND student_user = $2',
      [tutorUserId, studentUserId]
    );

    // If there is a result, the student is connected with the tutor
    return !!result;
  } catch (error) {
    console.error('Error checking connection', error);
    throw error;
  }
}

app.get('/tutors', async (req, res) => { 
  try{
    const query = `SELECT u.user_id, u.email, u.time_info, p.post_id, c.course_name 
    FROM users u 
    JOIN users_to_courses utc ON u.user_id = utc.user_id 
    JOIN courses c ON utc.course_id = c.course_id 
    JOIN posts p ON p.user_id = u.user_id
    WHERE u.tutor = true AND utc.tutoring = true;`;

    const tutors = await db.any(query);

    for (const tutor of tutors) {
      tutor.isConnected = await isStudentConnectedWithTutor(req.session.user_id, tutor.user_id);
    }

    res.render('pages/tutors', { session: req.session.user, tutors });

  } catch (error){

    console.error('Error fetching tutors:', error);
    res.ststus(500).render('pages/landing', {error});
  }
});

app.get('/students', async (req, res) => { 
  try{
    const query = `SELECT u.user_id, u.email, u.time_info, c.course_name 
    FROM users u 
    JOIN users_to_courses utc ON u.user_id = utc.user_id 
    JOIN courses c ON utc.course_id = c.course_id 
    WHERE u.student = true AND utc.tutoring = false;`;

    const students = await db.any(query);
    res.render('pages/students', { session: req.session.user, students });

  } catch (error){

    console.error('Error during serach:', error);
    res.ststus(500).render('pages/students', { session: req.session.user, error });
  }
});

app.post('/addPost/tutoring', async(req, res) => {
  res.render('pages/landing', {session: (req.session.user?true:false)})
});

app.post('/addPost/student', async(req, res) => {
  res.render('pages/landing', {session: (req.session.user?true:false)})
});

app.get('/profile', async (req, res) =>{
  //this should render the tutors profile page
  res.render('pages/landing', {session: (req.session.user?true:false)})
});

app.post('/connect/student', async(req, res) => {
  //we could get rid of this or have it link to a messaging platform 
  res.render('pages/landing', {session: (req.session.user?true:false)})
});

app.post('/connect/tutor', async(req, res) => {
  //this should be changed to connecting tutor and user through the user_to_user table
  res.render('pages/landing', {session: (req.session.user?true:false)})
});

app.post('/upvote/:id', async(req, res) => {
  const post_query = "SELECT upvote FROM posts, users WHERE posts.post_id=$1"
  try{
    const post_upvote = db.oneOrNone(post_query, [req.params.id])
    post_upvote++;
    res.redirect('/tutors');
    //res.render('pages/tutors', { session: req.session.upvote, post_upvote });
  }catch(error){
    console.error('Error during upvote', error)
    res.ststus(500).render('pages/tutors', { session: req.session.upvote, error });
  }
});



// START SERVER
// app.listen(3000);
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
