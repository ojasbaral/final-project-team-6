DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(100) NOT NULL,
	password VARCHAR(250) NOT NULL,
	bio VARCHAR(100),
	time_info VARCHAR(500),
	contact_info VARCHAR(100),
	rate_info VARCHAR(100),
	tutor BOOLEAN DEFAULT false,
	student BOOLEAN DEFAULT false,
	isConnected BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS user_to_user CASCADE;
CREATE TABLE user_to_user(
	tutor_user INT,
	student_user INT,
	PRIMARY KEY (tutor_user, student_user),
	FOREIGN KEY (tutor_user) REFERENCES users(user_id),
	FOREIGN KEY (student_user) REFERENCES users(user_id)
);

DROP TABLE IF EXISTS courses CASCADE;
CREATE TABLE courses(
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credit_hours NUMERIC NOT NULL
);

DROP TABLE IF EXISTS users_to_courses CASCADE;
CREATE TABLE users_to_courses(
	user_id INT,
	course_id INT,
	tutoring BOOLEAN DEFAULT false,
    PRIMARY KEY (user_id, course_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id),
	FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
