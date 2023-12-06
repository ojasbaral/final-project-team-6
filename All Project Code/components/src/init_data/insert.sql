-- INSERT INTO users (email, password, bio, time_info, contact_info, rate_info, tutor, student) VALUES
-- ('john.doe@example.com', 'securepass1', 'John Doe - Student', 'Available on weekdays after 5 PM', '555-1234', '$25/hour', false, true),
-- ('jane.smith@example.com', 'password123', 'Jane Smith - Tutor', 'Flexible hours on weekends', '555-5678', '$30/hour', true, false),
-- ('alex.jackson@example.com', 'passw0rd', 'Alex Jackson - Student', 'Evenings and weekends', '555-9876', '$20/hour', false, true),
-- ('emily.white@example.com', 'letmein', 'Emily White - Tutor', 'Weekdays before 3 PM', '555-4321', '$35/hour', true, false),
-- ('sam.jones@example.com', 'sam123', 'Sam Jones - Student and Tutor', 'Varies, contact for availability', '555-8765', '$28/hour', true, true),
-- ('olivia.wilson@example.com', 'olivia456', 'Olivia Wilson - Student', 'Flexible schedule', '555-3456', '$22/hour', false, true),
-- ('david.miller@example.com', 'millerpass', 'David Miller - Tutor', 'Mornings on weekdays', '555-7890', '$40/hour', true, false),
-- ('sophia.brown@example.com', 'sophia789', 'Sophia Brown - Student and Tutor', 'Weekends only', '555-2109', '$30/hour', true, true),
-- ('michael.taylor@example.com', 'taylorpass', 'Michael Taylor - Student', 'Afternoons on weekdays', '555-6543', '$23/hour', false, true),
-- ('oliver.jenkins@example.com', 'jenkinspass', 'Oliver Jenkins - Tutor', 'Evenings on weekdays', '555-1098', '$38/hour', true, false),
-- ('ava.morris@example.com', 'morrispass', 'Ava Morris - Student and Tutor', 'Anytime by appointment', '555-5678', '$32/hour', true, true),
-- ('mia.hall@example.com', 'hallpass', 'Mia Hall - Student', 'Weekdays after 6 PM', '555-8765', '$25/hour', false, true),
-- ('logan.green@example.com', 'greenpass', 'Logan Green - Tutor', 'Flexible schedule', '555-2345', '$45/hour', true, false),
-- ('lily.roberts@example.com', 'lilypass', 'Lily Roberts - Student', 'Weekends and evenings', '555-7890', '$24/hour', false, true),
-- ('owen.ward@example.com', 'wardpass', 'Owen Ward - Tutor', 'Weekdays after 4 PM', '555-3210', '$42/hour', true, false),
-- ('amelia.harris@example.com', 'harrispass', 'Amelia Harris - Student and Tutor', 'Available on request', '555-6789', '$31/hour', true, true),
-- ('ethan.turner@example.com', 'turnerpass', 'Ethan Turner - Student', 'Mornings on weekdays', '555-1234', '$21/hour', false, true),
-- ('mia.anderson@example.com', 'andersonpass', 'Mia Anderson - Tutor', 'Afternoons on weekdays', '555-5678', '$37/hour', true, false),
-- ('noah.carter@example.com', 'carterpass', 'Noah Carter - Student and Tutor', 'Weekends and evenings', '555-9876', '$29/hour', true, true),
-- ('emma.hughes@example.com', 'hughespass', 'Emma Hughes - Student', 'Evenings on weekdays', '555-4321', '$26/hour', false, true),
-- ('jackson.wells@example.com', 'wellspass', 'Jackson Wells - Tutor', 'Anytime by appointment', '555-8765', '$44/hour', true, false),
-- ('grace.tucker@example.com', 'tuckerpass', 'Grace Tucker - Student and Tutor', 'Flexible hours', '555-2109', '$33/hour', true, true),
-- ('carter.cooper@example.com', 'cooperpass', 'Carter Cooper - Student', 'Weekdays after 5 PM', '555-6543', '$27/hour', false, true),
-- ('aubrey.ross@example.com', 'rosspass', 'Aubrey Ross - Tutor', 'Mornings on weekdays', '555-1098', '$39/hour', true, false),
-- ('zoey.parker@example.com', 'parkerpass', 'Zoey Parker - Student and Tutor', 'Weekends only', '555-9876', '$34/hour', true, true),
-- ('leo.gray@example.com', 'leopass', 'Leo Gray - Student', 'Afternoons on weekdays', '555-5678', '$22/hour', false, true),
-- ('hannah.kelly@example.com', 'kellypass', 'Hannah Kelly - Tutor', 'Flexible schedule', '555-2109', '$43/hour', true, false),
-- ('isaac.wright@example.com', 'wrightpass', 'Isaac Wright - Student and Tutor', 'Varies, contact for availability', '555-3210', '$36/hour', true, true);

INSERT INTO users (email, password, bio, time_info, contact_info, rate_info, tutor, student) VALUES
('john.doe@example.com', 'securepass1', 'John Doe - Student', 'Monday: 5:00pm, Wednesday: 6:00pm, Friday: 7:00pm,', '555-1234', '$25/hour', false, true),
('jane.smith@example.com', 'password123', 'Jane Smith - Tutor', 'Saturday: 1:00pm, Sunday: 2:00pm,', '555-5678', '$30/hour', true, false),
('alex.jackson@example.com', 'passw0rd', 'Alex Jackson - Student', 'Saturday: 7:00pm, Sunday: 8:00pm,', '555-9876', '$20/hour', false, true),
('emily.white@example.com', 'letmein', 'Emily White - Tutor', 'Monday: 2:00pm, Wednesday: 3:00pm, Friday: 4:00pm,', '555-4321', '$35/hour', true, false),
('sam.jones@example.com', 'sam123', 'Sam Jones - Student and Tutor', 'Wednesday: 11:00am, Thursday: 12:00pm, Saturday: 1:00pm,', '555-8765', '$28/hour', true, true),
('olivia.wilson@example.com', 'olivia456', 'Olivia Wilson - Student', 'Monday: 4:00pm, Tuesday: 5:00pm, Thursday: 6:00pm,', '555-3456', '$22/hour', false, true),
('david.miller@example.com', 'millerpass', 'David Miller - Tutor', 'Monday: 9:00am, Wednesday: 10:00am, Friday: 11:00am,', '555-7890', '$40/hour', true, false),
('sophia.brown@example.com', 'sophia789', 'Sophia Brown - Student and Tutor', 'Sunday: 9:00am, Saturday: 10:00am,', '555-2109', '$30/hour', true, true),
('michael.taylor@example.com', 'taylorpass', 'Michael Taylor - Student', 'Monday: 5:00pm, Wednesday: 6:00pm, Friday: 7:00pm,', '555-6543', '$23/hour', false, true),
('oliver.jenkins@example.com', 'jenkinspass', 'Oliver Jenkins - Tutor', 'Wednesday: 8:00pm, Thursday: 9:00pm, Saturday: 10:00pm,', '555-1098', '$38/hour', true, false),
('ava.morris@example.com', 'morrispass', 'Ava Morris - Student and Tutor', 'Monday: 1:00pm, Tuesday: 2:00pm, Thursday: 3:00pm,', '555-5678', '$32/hour', true, true),
('mia.hall@example.com', 'hallpass', 'Mia Hall - Student', 'Monday: 6:00pm, Wednesday: 7:00pm, Friday: 8:00pm,', '555-8765', '$25/hour', false, true),
('logan.green@example.com', 'greenpass', 'Logan Green - Tutor', 'Flexible schedule', '555-2345', '$45/hour', true, false),
('lily.roberts@example.com', 'lilypass', 'Lily Roberts - Student', 'Saturday: 5:00pm, Sunday: 6:00pm,', '555-7890', '$24/hour', false, true),
('owen.ward@example.com', 'wardpass', 'Owen Ward - Tutor', 'Monday: 4:00pm, Wednesday: 5:00pm, Friday: 6:00pm,', '555-3210', '$42/hour', true, false),
('amelia.harris@example.com', 'harrispass', 'Amelia Harris - Student and Tutor', 'Available on request', '555-6789', '$31/hour', true, true),
('ethan.turner@example.com', 'turnerpass', 'Ethan Turner - Student', 'Monday: 9:00am, Wednesday: 10:00am, Friday: 11:00am,', '555-1234', '$21/hour', false, true),
('mia.anderson@example.com', 'andersonpass', 'Mia Anderson - Tutor', 'Monday: 1:00pm, Wednesday: 2:00pm, Friday: 3:00pm,', '555-5678', '$37/hour', true, false),
('noah.carter@example.com', 'carterpass', 'Noah Carter - Student and Tutor', 'Saturday: 4:00pm, Sunday: 5:00pm,', '555-9876', '$29/hour', true, true),
('emma.hughes@example.com', 'hughespass', 'Emma Hughes - Student', 'Monday: 7:00pm, Wednesday: 8:00pm, Friday: 9:00pm,', '555-4321', '$26/hour', false, true),
('jackson.wells@example.com', 'wellspass', 'Jackson Wells - Tutor', 'Monday: 2:00pm, Tuesday: 3:00pm, Thursday: 4:00pm,', '555-8765', '$44/hour', true, false),
('grace.tucker@example.com', 'tuckerpass', 'Grace Tucker - Student and Tutor', 'Saturday: 7:00pm, Sunday: 8:00pm,', '555-2109', '$33/hour', true, true),
('carter.cooper@example.com', 'cooperpass', 'Carter Cooper - Student', 'Monday: 5:00pm, Wednesday: 6:00pm, Friday: 7:00pm,', '555-6543', '$27/hour', false, true),
('aubrey.ross@example.com', 'rosspass', 'Aubrey Ross - Tutor', 'Monday: 9:00am, Wednesday: 10:00am, Friday: 11:00am,', '555-1098', '$39/hour', true, false),
('zoey.parker@example.com', 'parkerpass', 'Zoey Parker - Student and Tutor', 'Saturday: 1:00pm, Sunday: 2:00pm,', '555-9876', '$34/hour', true, true),
('leo.gray@example.com', 'leopass', 'Leo Gray - Student', 'Monday: 3:00pm, Wednesday: 4:00pm, Friday: 5:00pm,', '555-5678', '$22/hour', false, true),
('hannah.kelly@example.com', 'kellypass', 'Hannah Kelly - Tutor', 'Flexible schedule', '555-2109', '$43/hour', true, false),
('isaac.wright@example.com', 'wrightpass', 'Isaac Wright - Student and Tutor', 'Varies, contact for availability', '555-3210', '$36/hour', true, true);

-- INSERT INTO posts (user_id, upvote, post) VALUES
-- (1, 10, 'This is a post by John Doe.'),
-- (2, 25, 'Check out my tutoring services! - Jane Smith'),
-- (3, 15, 'Just joined as a student, excited to learn! - Alex Jackson'),
-- (4, 30, 'Available for tutoring sessions in the mornings! - Emily White'),
-- (5, 50, 'Hello everyone! I am both a student and a tutor.'),
-- (6, 12, 'Flexible schedule for study sessions! - Olivia Wilson'),
-- (7, 18, 'Tutoring available in the evenings - David Miller'),
-- (8, 22, 'I love both learning and teaching! - Sophia Brown'),
-- (9, 8, 'Afternoon study sessions available! - Michael Taylor'),
-- (10, 35, 'Evening tutoring sessions available - Oliver Jenkins'),
-- (11, 42, 'Contact me for tutoring or study sessions! - Ava Morris'),
-- (12, 20, 'Evening study sessions - Mia Hall'),
-- (13, 28, 'Morning tutoring available - Logan Green'),
-- (14, 5, 'Late-night study sessions! - Lily Roberts'),
-- (15, 40, 'Available for tutoring in the afternoons - Owen Ward'),
-- (16, 55, 'Both a student and a tutor - Amelia Harris'),
-- (17, 14, 'Morning study sessions - Ethan Turner'),
-- (18, 32, 'Afternoon tutoring available - Mia Anderson'),
-- (19, 48, 'Weekend study sessions! - Noah Carter'),
-- (20, 17, 'Evening study time! - Emma Hughes'),
-- (21, 23, 'Flexible tutoring hours - Jackson Wells'),
-- (22, 60, 'Contact me for study sessions! - Grace Tucker'),
-- (23, 9, 'After 5 PM study sessions - Carter Cooper'),
-- (24, 26, 'Morning tutoring sessions - Aubrey Ross'),
-- (25, 38, 'Weekend study group! - Zoey Parker'),
-- (26, 13, 'Afternoon study time - Leo Gray'),
-- (27, 19, 'Flexible tutoring schedule - Hannah Kelly'),
-- (28, 45, 'Varied availability for study sessions - Isaac Wright');

  INSERT INTO user_to_user (tutor_user, student_user) VALUES
(2, 1),   -- Jane Smith (Tutor) - John Doe (Student)
(4, 3),   -- Emily White (Tutor) - Alex Jackson (Student)
(7, 6),   -- David Miller (Tutor) - Olivia Wilson (Student)
(10, 9),  -- Oliver Jenkins (Tutor) - Michael Taylor (Student)
(13, 12), -- Logan Green (Tutor) - Mia Hall (Student)
(16, 15), -- Amelia Harris (Tutor) - Owen Ward (Student)
(19, 18), -- Mia Anderson (Tutor) - Ethan Turner (Student)
(22, 21), -- Jackson Wells (Tutor) - Grace Tucker (Student)
(25, 24), -- Noah Carter (Tutor) - Aubrey Ross (Student)
(28, 27); -- Isaac Wright (Tutor) - Hannah Kelly (Student)

INSERT INTO courses (course_id, course_name, credit_hours) VALUES
(1000,'Computer Science as a Field of Work and Study', 1),
(1300,'Introduction to Programming', 4),
(1200,'Introduction to computational thinking', 3),
(2270,'Data Structures', 4),
(2400,'Computer Systems', 4),
(3308,'Software Development Methods and Tools', 3),
(2824,'Discrete Structures', 3),
(3104,'Algorithms', 4),
(3155,'Principles of Programming Languages', 4),
(3287,'Design and Analysis of Database systems', 3),
(3753,'Design and Analysis of Operating systems', 4),
(2820,'Linear Algebra with Computer Science Applications', 3),
(3202,'Introduction to Artificial Intelligence', 3),
(3022,'Introduction to Data Science', 3),
(3002,'Fundamentals of Human Computer Interaction', 4),
(3010,'Intensive Programming Workshop', 3),
(4253,'Data Center Scale Computing', 3),
(4273,'Network Systems', 3),
(4308,'Software Engineering Project 1', 4),
(4448,'Object-Oriented Analysis and Design', 3),
(4502,'Data Mining', 3);

INSERT INTO users_to_courses (user_id, course_id, tutoring) VALUES
(1, 1000, false), -- John Doe (Student) - Computer Science as a Field of Work and Study
(1, 1300, true),  -- John Doe (Tutor) - Introduction to Programming
(2, 1300, false), -- Jane Smith (Student) - Introduction to Programming
(2, 2270, true),  -- Jane Smith (Tutor) - Data Structures
(3, 1200, false), -- Alex Jackson (Student) - Introduction to Computational Thinking
(3, 2400, true),  -- Alex Jackson (Tutor) - Computer Systems
(4, 3308, false), -- Emily White (Student) - Software Development Methods and Tools
(4, 2824, true),  -- Emily White (Tutor) - Discrete Structures
(5, 3104, false), -- Sam Jones (Student) - Algorithms
(5, 3155, true),  -- Sam Jones (Tutor) - Principles of Programming Languages
(6, 3287, false), -- Olivia Wilson (Student) - Design and Analysis of Database Systems
(6, 3753, true),  -- Olivia Wilson (Tutor) - Design and Analysis of Operating Systems
(7, 2820, false), -- David Miller (Student) - Linear Algebra with Computer Science Applications
(7, 3202, true),  -- David Miller (Tutor) - Introduction to Artificial Intelligence
(8, 3022, false), -- Sophia Brown (Student) - Introduction to Data Science
(8, 3002, true),  -- Sophia Brown (Tutor) - Fundamentals of Human Computer Interaction
(9, 3010, false), -- Michael Taylor (Student) - Intensive Programming Workshop
(9, 4253, true),  -- Michael Taylor (Tutor) - Data Center Scale Computing
(10, 4273, false), -- Oliver Jenkins (Student) - Network Systems
(10, 4308, true), -- Oliver Jenkins (Tutor) - Software Engineering Project 1
(11, 4448, false), -- Ava Morris (Student) - Object-Oriented Analysis and Design
(11, 4502, true);  -- Ava Morris (Tutor) - Data Mining