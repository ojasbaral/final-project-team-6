# README:

# Brief description
Contributors - In this case, it will be the team Members
Technology Stack used for the project
Prerequisites to run the application - Any software that needs to be installed to run the application
Instructions on how to run the application locally.
How to run the tests
Link to the deployed application

# Buffs++ Application 
Users login or register if they do not have an account. After a user has successfully logged in they will be redirected to their profile page with an updated Navbar with links to a students and tutors page. Users will have a full UI to interact with the application, including a profile page to update different features of their account. The tutors and students pages will display all current students or tutors (depending on what page the user is on), with the class and time they’re looking to connect with people for. If the user finds someone they want to connect with they can view their profile and create a relationship with them. Users can log in and out of the application and the session will be maintained. There will be a database that stores student-tutor pairs, usernames/user emails and passwords and other user identifiers.



# Contributors: 
Amelia Lunn - amlu6553
Cade Mather - cademather
Sophia Soka - SophiaSoka
Nick Cisne - nickcisne 
Ojas Baral -  ojasbaral
Vesaun Shrestha - vesaun


# Our Technology Stack: 
  Front End: 
  HTML/CSS (EJS)
  BootStrap

  Back End:
  Node.js
  Express.js

  Database:
  PostgreSQL


Development Methodology: Agile	 
Version Control Software: Github	  			 
IDE: VSCode					
UI Tools: Figma, dbdiagram.io		
Deployment Environment: LocalHost   
Containerization: Docker		  	
Testing Tools: Mocha and Chai


# How to run:
Make sure you have a .env file in the same folder as your docker-compose.yaml. If you don’t have one, create one and copy these contents into the file. 
.env-

# database credentials
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="pwd"
POSTGRES_DB="users_db"

# Node vars
SESSION_SECRET="super duper secret!"
API_KEY="<API key you just created>"



Now that we've configured the .env files, starting docker compose is quite simple. Call this in your terminal.
$      docker compose up -d 


To shut down the containers after exploring the site by calling this in your terminal 
$    docker compose down -v 

Once docker is up and running, open your favorite web browser and search 
 
localhost:3000/

This will bring you to our landing page, follow the prompts to log in or register and continue exploring from there. 


