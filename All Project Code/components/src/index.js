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

async function updateUser(userId, updatedFields) {
  try {
    const updateFields = Object.keys(updatedFields).map((field, index) => `${field} = $${index + 1}`).join(', ');
    const updateValues = Object.values(updatedFields);

    const query = `UPDATE users SET ${updateFields} WHERE user_id = $${updateValues.length + 1}`;
    await db.none(query, updateValues.concat(userId));
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};



const profileData = {
  bio: null,
  classes: [],
  monday_time_info: [],
  tuesday_time_info: [],
  wednesday_time_info: [],
  thursday_time_info: [],
  friday_time_info: [],
  rate_info: null,
  contact_info: null,
  tutor: null,
  student: null,
};

let editMode = false;


// API ROUTES

app.get('/welcome', (req, res) => { // sample test from Lab 11
    res.json({status: 'success', message: 'Welcome!'});
});

//Landing Page Route
app.get('/', (req, res) => {

  // Testing navbar component, session represents whether a user is logged in or not
  res.render('pages/landing', {session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false)})
})

app.get('/login', (req, res) => {
    res.render('pages/login', {session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false)});
});

app.get('/register', (req, res) => {
    res.render('pages/register',{session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false)})
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/login', {session: false, message: 'Logged out Successfully!', error: false, user: false})
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const query = `SELECT * FROM users WHERE email = $1`;

    try {
        const user = await db.oneOrNone(query, email);

        if (!user) { //user not found
            res.status(400).render('pages/login', {session: (req.session.user?true:false), message: 'User not found', error: true, user: (req.session.user?req.session.user.user_id:false)});
        } else { //check if password is correct
            const match = await bcrypt.compare(password, user.password);

        if (match) { //password match -> save user session and redirect
            req.session.user = user;
            req.session.save();
            res.redirect('/profile/'+req.session.user.userId);
        } else {
            res.status(400).render('pages/login', {session: (req.session.user?true:false), message: 'Incorrect password', error: true, user: (req.session.user?req.session.user.user_id:false)});
        }
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).render('pages/login', {session: (req.session.user?true:false), message: 'Error during login!', error: true, user: (req.session.user?req.session.user.user_id:false)});
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
         res.status(400).render('pages/register', {session: (req.session.user?true:false), message: 'Email belongs to another account', error: true, user: (req.session.user?req.session.user.user_id:false)});
      }else{

        const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`;

        try {
          const insertResult = await db.oneOrNone(query, [user.email, user.password]);

          if (insertResult) { // valid registration, redirect
          res.redirect('/login');
          } else {
          res.status(400).render('pages/register', {session: (req.session.user?true:false), message: 'Email belongs to another account', error: true, user: (req.session.user?req.session.user.user_id:false)});
          }
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(400).render('pages/register', {session: (req.session.user?true:false), message: 'Email belongs to another account', error: true, user: (req.session.user?req.session.user.user_id:false)});
        }

      }
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(400).render('pages/register', {session: (req.session.user?true:false), message: 'Email belongs to another account', error: true, user: (req.session.user?req.session.user.user_id:false)});
    }
});


const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};
// Authentication Required
app.use(auth);

app.get('/update-profile', async(req, res) => {

  try{
    const userId = req.session.user.user_id;

    // Fetch user email from the database
    const userEmailQuery = `SELECT email FROM users WHERE user_id = $1`;
    const userEmailResult = await db.oneOrNone(userEmailQuery, userId);
    const userEmail = userEmailResult ? userEmailResult.email : '';
    const allTimes = ['8:00am', '9:00am','10:00am','11:00am','12:00pm','1:00pm','2:00pm','3:00pm','4:00pm','5:00pm','6:00pm','7:00pm','8:00pm'];
    const courses = [
      { course_id: 1000, course_name: 'Computer Science as a Field of Work and Study', credit_hours: 1 },
      { course_id: 1300, course_name: 'Introduction to Programming', credit_hours: 4},
      { course_id: 1200, course_name: 'Introduction to computational thinking', credit_hours: 3},
      { course_id: 2270, course_name: 'Data Structures', credit_hours:  4},
      { course_id: 2400, course_name: 'Computer Systems', credit_hours:  4},
      { course_id: 3308, course_name: 'Software Development Methods and Tools', credit_hours:  3},
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
    
    //fetch classes
    const class_query = 'SELECT course_id FROM users_to_courses WHERE user_id=$1'
    
    try {
      const class_res = await db.manyOrNone(class_query, [req.session.user.user_id])
      profileData.classes = []
      console.log(class_res)
      if (class_res){
        class_res.forEach((class_id) => {
          console.log(class_id)
          profileData.classes.push((class_id.course_id) + '')
        })
      }
    } catch (e) {
      console.error('Error fetching user data:', e);
      res.status(500).send('Internal Server Error');
    }
    
    console.log('profileData:', profileData); // Log the profileData object
    res.render('pages/update-profile', {
      bio: req.session.user.bio,
      courses: courses,
      classes: Array.isArray(profileData.classes) ? new Set(profileData.classes) : [],
      monday_time_info: Array.isArray(profileData.monday_time_info) ? profileData.monday_time_info : [],
      tuesday_time_info: Array.isArray(profileData.tuesday_time_info) ? profileData.tuesday_time_info : [],
      wednesday_time_info: Array.isArray(profileData.wednesday_time_info) ? profileData.wednesday_time_info : [],
      thursday_time_info: Array.isArray(profileData.thursday_time_info) ? profileData.thursday_time_info : [],
      friday_time_info: Array.isArray(profileData.friday_time_info) ? profileData.friday_time_info : [],
      rate_info: req.session.user.rate_info,
      contact_info: req.session.user.contact_info,
      tutor: req.session.user.tutor,
      student: req.session.user.student,
      session: (req.session.user ? true : false),
      allTimes: allTimes,
      editMode: true,
      userEmail: userEmail,
      user: (req.session.user?req.session.user.user_id:false),

    });
  }catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
  editMode = true;
});


app.post('/update-profile', async (req, res) => {
  const prior_classes = new Set(profileData.classes)
  profileData.bio = req.body.bio;
  profileData.classes = req.body.classes;
  profileData.monday_time_info = req.body.monday_time_info;
  profileData.tuesday_time_info = req.body.tuesday_time_info;
  profileData.wednesday_time_info = req.body.wednesday_time_info;
  profileData.thursday_time_info = req.body.thursday_time_info;
  profileData.friday_time_info = req.body.friday_time_info;
  profileData.allTimes = req.body.allTimes;
  profileData.rate_info = req.body.rate_info;
  profileData.contact_info = req.body.contact_info;
  profileData.tutor = req.body.tutor;
  profileData.student = req.body.student;

  req.session.user.bio = profileData.bio;
  req.session.user.rate_info = profileData.rate_info;
  req.session.user.contact_info = profileData.contact_info;
  req.session.user.tutor = profileData.tutor;
  req.session.user.student = profileData.student;

  if(profileData.classes !== undefined){
  profileData.classes.forEach( async (class_num) => {
    if(!prior_classes.has(class_num)){
      try {
        const query = 'INSERT INTO users_to_courses (user_id, course_id) VALUES ($1, $2)'
        const insert_result = await db.oneOrNone(query, [req.session.user.user_id, parseInt(class_num)])
      }
      catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send('Internal Server Error');
      }
    }else{
      prior_classes.delete(class_num)
    }
  })

  for (let class_num of prior_classes){
    try {
      const query = 'DELETE FROM users_to_courses WHERE user_id=$1 AND course_id=$2'
      const delete_result = await db.oneOrNone(query, [req.session.user.user_id, parseInt(class_num)])
    }
    catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send('Internal Server Error');
      }
  }
}
  
const timeInfoString = `
  ${profileData.monday_time_info ? 'Monday: ' + profileData.monday_time_info + ',' : ''}
  ${profileData.tuesday_time_info ? 'Tuesday: ' + profileData.tuesday_time_info + ',' : ''}
  ${profileData.wednesday_time_info ? 'Wednesday: ' + profileData.wednesday_time_info + ',' : ''}
  ${profileData.thursday_time_info ? 'Thursday: ' + profileData.thursday_time_info + ',' : ''}
  ${profileData.friday_time_info ? 'Friday: ' + profileData.friday_time_info + '' : ''}
`.trim();
req.session.user.time_info = timeInfoString;

  const updatedFields = {
    bio: profileData.bio.trim(),
    time_info: timeInfoString,
    rate_info: profileData.rate_info.trim(),
    contact_info: profileData.contact_info.trim(),
    tutor: profileData.tutor==='on'?true:false,
    student: profileData.student==='on'?true:false
  };

  console.log(timeInfoString)

  const userId = req.session.user.user_id;
  updateUser(userId, updatedFields);
  
  res.redirect(`/profile/${userId}`);
  editMode = false;
});


app.get('/profile/:id', async (req, res) => {

  const user_query = "SELECT email, bio, time_info, contact_info, rate_info, tutor, student FROM users WHERE user_id=$1"
  const class_query = "SELECT course_id, tutoring FROM users_to_courses WHERE user_id=$1"
  //const posts_query = "SELECT post_id, upvote, post, email, bio, time_info, contact_info, rate_info FROM posts, users WHERE users.user_id = posts.user_id AND users.user_id=$1"
  const tutor_query = "SELECT COUNT(*) as count FROM user_to_user WHERE tutor_user=$1"
  const student_query = "SELECT COUNT(*) as count FROM user_to_user WHERE student_user=$1"
  const check_relationship = "SELECT * FROM user_to_user WHERE (student_user=$1 AND tutor_user=$2) OR (student_user=$2 AND tutor_user=$1)"
  let user_data = {}
  let class_data = []

  try {
    //get the user from database
    const user = await db.oneOrNone(user_query, [req.params.id])
    if (!user){
      res.redirect('/profile/' + req.session.user.user_id)
    }
    //const posts = await db.manyOrNone(posts_query, [req.params.id])
    const classes = await db.manyOrNone(class_query, [req.params.id])
    const tutors = await db.oneOrNone(tutor_query, [req.params.id])
    const students = await db.oneOrNone(student_query, [req.params.id])
    const relationship = await db.oneOrNone(check_relationship, [req.params.id, req.session.user.user_id])
    
    class_data = classes
    
    user_data = user
    user_data['tutors'] = tutors.count
    user_data['students'] = students.count
    if (relationship) { user_data['relationship'] = true }
  } catch (e) {
    console.error('Error during rendering of profile page', e)
    res.status(400).render('pages/profile', {user_id: req.params.id, classes:class_data, session: (req.session.user?true:false), message: 'There was an error, please try again', error: true, user: (req.session.user?req.session.user.user_id:false)});
  }
 
  res.render('pages/profile', {user_id: req.params.id, classes: class_data, session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false), user_data: user_data, edit_perms: (req.session.user.user_id==req.params.id?true:false)})
})

app.get('/create-connection/:id', async (req, res) => {
  const query = "SELECT email FROM users WHERE user_id=$1"
  let email = ''

  try{
    email = await db.oneOrNone(query, [req.params.id])
  } catch (e) {
    console.error('Error during rendering of profile page', e)
    res.status(400).render('pages/profile', {session: (req.session.user?true:false), message: 'There was an error, please try again', error: true, user: (req.session.user?req.session.user.user_id:false)});
  }

  res.render('pages/connection', {session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false), user_email: email.email, user_id: req.params.id})
})

app.post('/create-connection/:id', async (req, res) => {
  console.log(req.body)
  user_email_query = "SELECT email FROM users WHERE user_id=$1"
  if (req.body.type === '2'){

    const check_tutor_query = "SELECT tutor FROM users WHERE user_id=$1"
    const check_student_query = "SELECT student FROM users WHERE user_id=$1"

    const query = "INSERT INTO user_to_user (tutor_user, student_user) VALUES ($1, $2)"

    try{
      const valid_tutor = await db.oneOrNone(check_tutor_query, [req.params.id])
      const valid_student = await db.oneOrNone(check_student_query, [req.session.user.user_id])
      const email = await db.oneOrNone(user_email_query, req.params.id)
      console.log(valid_tutor, valid_student)
      if (valid_tutor.tutor === true && valid_student.student === true){
        const relationship = await db.oneOrNone(query, [req.params.id, req.session.user.user_id])
        res.redirect('/profile/' + req.params.id)
      } else {
        res.render('pages/connection', {message: 'Invalid Relationship, You are not a student or this user is not a tutor', error:true, session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false), user_email: email.email, user_id: req.params.id})
      }
    } catch (e){
      console.error('Error during rendering of profile page', e)
      res.status(400).render('pages/profile', {session: (req.session.user?true:false), message: 'There was an error, please try again', error: true, user: (req.session.user?req.session.user.user_id:false)});
    }
  }else if (req.body.type === '1'){

    const check_tutor_query = "SELECT tutor FROM users WHERE user_id=$1"
    const check_student_query = "SELECT student FROM users WHERE user_id=$1"

    const query = "INSERT INTO user_to_user (tutor_user, student_user) VALUES ($1, $2)"

    try{
      const valid_tutor = await db.oneOrNone(check_tutor_query, [req.session.user.user_id])
      const valid_student = await db.oneOrNone(check_student_query, [req.params.id])
      const email = await db.oneOrNone(user_email_query, req.params.id)
      if (valid_tutor.tutor === true && valid_student.student === true){
      const relationship = await db.oneOrNone(query, [req.session.user.user_id, req.params.id])
      res.redirect('/profile/' + req.params.id)
      } else {
        res.render('pages/connection', {message: 'Invalid Relationship, You are not a tutor or this user is not a student', error:true, session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false), user_email: email.email, user_id: req.params.id})
      }
    } catch (e){
      console.error('Error during rendering of profile page', e)
      res.status(400).render('pages/profile', {session: (req.session.user?true:false), message: 'There was an error, please try again', error: true, user: (req.session.user?req.session.user.user_id:false)});
    }
  }else{
    res.redirect('/profile/' + req.params.id)
  }

  
})

app.post('/delete-connection/:id', async (req, res) => {
  const query = "DELETE FROM user_to_user WHERE (student_user=$1 AND tutor_user=$2) OR (student_user=$2 AND tutor_user=$1)"
  console.log("hello")
  try {
    const del = await db.oneOrNone(query, [req.params.id, req.session.user.user_id])
  } catch (e){
    console.error('Error during rendering of profile page', e)
    res.status(400).render('pages/profile', {session: (req.session.user?true:false), message: 'There was an error, please try again', error: true, user: (req.session.user?req.session.user.user_id:false)});
  }

  res.redirect('/profile/' + req.params.id)
});



app.get('/students/search', async (req, res) => {
  const nameSearch = req.query.nameSearch || '';
  const classes = req.query.classes || [];
  const courses = [
    { course_id: 1000, course_name: 'Computer Science as a Field of Work and Study', credit_hours: 1 },
    { course_id: 1300, course_name: 'Introduction to Programming', credit_hours: 4},
    { course_id: 1200, course_name: 'Introduction to computational thinking', credit_hours: 3},
    { course_id: 2270, course_name: 'Data Structures', credit_hours:  4},
    { course_id: 2400, course_name: 'Computer Systems', credit_hours:  4},
    { course_id: 3308, course_name: 'Software Development Methods and Tools', credit_hours:  3},
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
  const allTimes = ['8:00am', '9:00am','10:00am','11:00am','12:00pm','1:00pm','2:00pm','3:00pm','4:00pm','5:00pm','6:00pm','7:00pm','8:00pm'];
  const time_info = req.query.time_info || [];
  try{
    if(classes == ""){
      const query = `SELECT u.user_id, u.email, u.time_info, c.course_name
      FROM users u 
      JOIN users_to_courses utc ON u.user_id = utc.user_id 
      JOIN courses c ON utc.course_id = c.course_id 
      WHERE u.student = true AND utc.tutoring = false 
      AND u.email ILIKE $1 AND c.course_name ILIKE $2 AND u.time_info ILIKE $3;`;
      const students = await db.any(query, [`%${nameSearch}%`, `%${classes}%`, `%${time_info}%`]);

      res.render('pages/students',{session: (req.session.user?true:false), students, user: (req.session.user?req.session.user.user_id:false),courses: courses, classes:Array.isArray(profileData.classes) ? new Set(profileData.classes) : [], allTimes: allTimes, time_info: Array.isArray(time_info) ? time_info : []});

    }else{
      const query = `SELECT u.user_id, u.email, u.time_info, c.course_name
      FROM users u 
      JOIN users_to_courses utc ON u.user_id = utc.user_id 
      JOIN courses c ON utc.course_id = c.course_id 
      WHERE u.student = true AND utc.tutoring = false 
      AND u.email ILIKE $1 AND c.course_id = $2 AND u.time_info ILIKE $3;`;
      const students = await db.any(query, [`%${nameSearch}%`, `${classes}`, `%${time_info}%`]);

      res.render('pages/students',{session: (req.session.user?true:false), students, user: (req.session.user?req.session.user.user_id:false),courses: courses, classes:Array.isArray(profileData.classes) ? new Set(profileData.classes) : [], allTimes: allTimes, time_info: Array.isArray(time_info) ? time_info : []});

    }
    
  } 
  catch (error){
    console.error('Error during serach:', error);
    res.status(500).render('pages/landing', {session: (req.session.user?true:false), error, user: (req.session.user?req.session.user.user_id:false),courses: courses, classes:Array.isArray(profileData.classes) ? new Set(profileData.classes) : [], allTimes: allTimes, time_info: Array.isArray(time_info) ? time_info : []});
  }
});


app.get('/tutors/search', async (req, res) => {
  const nameSearch = req.query.nameSearch || '';
  const classes = req.query.classes || [];
  const courses = [
    { course_id: 1000, course_name: 'Computer Science as a Field of Work and Study', credit_hours: 1 },
    { course_id: 1300, course_name: 'Introduction to Programming', credit_hours: 4},
    { course_id: 1200, course_name: 'Introduction to computational thinking', credit_hours: 3},
    { course_id: 2270, course_name: 'Data Structures', credit_hours:  4},
    { course_id: 2400, course_name: 'Computer Systems', credit_hours:  4},
    { course_id: 3308, course_name: 'Software Development Methods and Tools', credit_hours:  3},
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
  const allTimes = ['8:00am', '9:00am','10:00am','11:00am','12:00pm','1:00pm','2:00pm','3:00pm','4:00pm','5:00pm','6:00pm','7:00pm','8:00pm'];
  const time_info = req.query.time_info || [];
  //const timeSearch = req.query.timeSearch || '';


  try{
    
    if(classes == ""){
      const query = `SELECT u.user_id, u.email, u.time_info, c.course_name
      FROM users u 
      JOIN users_to_courses utc ON u.user_id = utc.user_id 
      JOIN courses c ON utc.course_id = c.course_id 
      WHERE u.tutor = true AND utc.tutoring = true
      AND u.email ILIKE $1 AND c.course_name ILIKE $2 AND ($3 = '' OR u.time_info ILIKE '%' || $3 || '%');`;
      const tutors = await db.any(query, [`%${nameSearch}%`, `%${classes}%`, `%${time_info}%`]);
      res.render('pages/tutors',{session: (req.session.user?true:false), tutors, user: (req.session.user?req.session.user.user_id:false), courses: courses, classes:Array.isArray(profileData.classes) ? new Set(profileData.classes) : [], allTimes: allTimes, time_info: Array.isArray(time_info) ? time_info : []});

    }else{
      const query = `SELECT u.user_id, u.email, u.time_info, c.course_name
      FROM users u 
      JOIN users_to_courses utc ON u.user_id = utc.user_id 
      JOIN courses c ON utc.course_id = c.course_id 
      WHERE u.tutor = true AND utc.tutoring = true
      AND u.email ILIKE $1 AND c.course_id = $2 AND ($3 = '' OR u.time_info ILIKE '%' || $3 || '%');`;
      const tutors = await db.any(query, [`%${nameSearch}%`, `${classes}`, `%${time_info}%`]);
      res.render('pages/tutors',{session: (req.session.user?true:false), tutors, user: (req.session.user?req.session.user.user_id:false), courses: courses, classes:Array.isArray(profileData.classes) ? new Set(profileData.classes) : [], allTimes: allTimes, time_info: Array.isArray(time_info) ? time_info : []});

    }
    //console.log({nameSearch}, {courseSearch}, {timeSearch});
    //console.log(tutors);
    //res.render('pages/tutors',{session: (req.session.user?true:false), tutors, user: (req.session.user?req.session.user.user_id:false), courses: courses, classes:Array.isArray(profileData.classes) ? new Set(profileData.classes) : [], allTimes: allTimes, time_info: Array.isArray(time_info) ? time_info : []});

  } 
  catch (error){
    console.error('Error during serach:', error);
    res.status(500).render('pages/landing', {session: (req.session.user?true:false), error, user: (req.session.user?req.session.user.user_id:false)});
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
    const courses = [
      { course_id: 1000, course_name: 'Computer Science as a Field of Work and Study', credit_hours: 1 },
      { course_id: 1300, course_name: 'Introduction to Programming', credit_hours: 4},
      { course_id: 1200, course_name: 'Introduction to computational thinking', credit_hours: 3},
      { course_id: 2270, course_name: 'Data Structures', credit_hours:  4},
      { course_id: 2400, course_name: 'Computer Systems', credit_hours:  4},
      { course_id: 3308, course_name: 'Software Development Methods and Tools', credit_hours:  3},
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
    const allTimes = ['8:00am', '9:00am','10:00am','11:00am','12:00pm','1:00pm','2:00pm','3:00 pm','4:00pm','5:00pm','6:00pm','7:00pm','8:00pm'];
    const classes = [];
    const time_info = [];
    const query = `SELECT u.user_id, u.email, u.time_info, c.course_name 
    FROM users u 
    JOIN users_to_courses utc ON u.user_id = utc.user_id 
    JOIN courses c ON utc.course_id = c.course_id 
    WHERE u.tutor = true AND utc.tutoring = true;`;

    const tutors = await db.any(query);

    for (const tutor of tutors) {
      tutor.isConnected = await isStudentConnectedWithTutor(req.session.user_id, tutor.user_id);
    }

    res.render('pages/tutors', { session: (req.session.user?true:false), tutors, user: (req.session.user?req.session.user.user_id:false), courses: courses, classes:Array.isArray(profileData.classes) ? new Set(profileData.classes) : [], allTimes: allTimes, time_info: Array.isArray(time_info) ? time_info : []});

  } catch (error){

    console.error('Error fetching tutors:', error);
    res.status(500).render('pages/landing', {error});
  }
});

app.get('/students', async (req, res) => { 
  try{
    const courses = [
      { course_id: 1000, course_name: 'Computer Science as a Field of Work and Study', credit_hours: 1 },
      { course_id: 1300, course_name: 'Introduction to Programming', credit_hours: 4},
      { course_id: 1200, course_name: 'Introduction to computational thinking', credit_hours: 3},
      { course_id: 2270, course_name: 'Data Structures', credit_hours:  4},
      { course_id: 2400, course_name: 'Computer Systems', credit_hours:  4},
      { course_id: 3308, course_name: 'Software Development Methods and Tools', credit_hours:  3},
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
    const allTimes = ['8:00am', '9:00am','10:00am','11:00am','12:00pm','1:00pm','2:00pm','3:00 pm','4:00pm','5:00pm','6:00pm','7:00pm','8:00pm'];
    const classes = [];
    const time_info = [];
    const query = `SELECT u.user_id, u.email, u.time_info, c.course_name 
    FROM users u 
    JOIN users_to_courses utc ON u.user_id = utc.user_id 
    JOIN courses c ON utc.course_id = c.course_id 
    WHERE u.student = true AND utc.tutoring = false;`;

    const students = await db.any(query);
    res.render('pages/students', { session:(req.session.user?true:false), students, user: (req.session.user?req.session.user.user_id:false), courses: courses, classes:Array.isArray(profileData.classes) ? new Set(profileData.classes) : [], allTimes: allTimes, time_info: Array.isArray(time_info) ? time_info : []});

  } catch (error){

    console.error('Error during serach:', error);
    res.status(500).render('pages/students', { session: (req.session.user?true:false), error, user: (req.session.user?req.session.user.user_id:false) });
  }
});

// app.post('/addPost/tutoring', async(req, res) => {
//   res.render('pages/landing', {session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false)})
// });

// app.post('/addPost/student', async(req, res) => {
//   res.render('pages/landing', {session: (req.session.user?true:false), user: (req.session.user?req.session.user.user_id:false)})
// });


// app.post('/upvote/:id', async(req, res) => {
//   const post_query = "SELECT upvote FROM posts, users WHERE posts.post_id=$1"
//   try{
//     const post_upvote = db.oneOrNone(post_query, [req.params.id])
//     post_upvote++;
//     res.redirect('/tutors');
//     //res.render('pages/tutors', { session: req.session.upvote, post_upvote });
//   }catch(error){
//     console.error('Error during upvote', error)
//     res.status(500).render('pages/tutors', { session: req.session.upvote, error, user: (req.session.user?req.session.user.user_id:false) });
//   }
// });

app.post('/change-class-status', async (req, res) => {
  const course_id = req.body.class_id
  const user_id = req.session.user.user_id
  const query = "UPDATE users_to_courses SET tutoring = NOT tutoring WHERE user_id=$1 AND course_id=$2"

  try {

    const query_result = await db.oneOrNone(query, [user_id, course_id])

    res.redirect('/profile/' + req.session.user.user_id)

  } catch (e) {
    console.error('Error during rendering of profile page', e)
    res.status(400).render('pages/profile', {session: (req.session.user?true:false), message: 'There was an error, please try again', error: true, user: (req.session.user?req.session.user.user_id:false)});
  }
})

// START SERVER
// app.listen(3000);
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
