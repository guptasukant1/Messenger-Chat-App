# Messenger App

Setup client via vite (react + js)
Install tailwind, axios

Create Register component
Add a form with inputs to username and password and use tailwind.
Create onSubmit function to deal with submission of form via axios that sends a post response to the '/register' handler which contains uname and pword.
Create onChange attribute of the inputs to set the values to the entered values via useState hook

In app.jsx, setup axios connection that deals with the base url to which the requests will be sent to.

Setup api folder to create backend.
install express, mongoose, dotenv, cors, jwt, nodemon
Import userSchema [Initiates a connection via mongoose to handle uname, pword entries along with timestamp of creation]
Create MongoDB connection, initialize jwt access.
app.get for test path

post for /register handler to access the uname and pword sent from frontend, create user from the userSchema imported.
Generate a jwt token for the said user by accesing mongodb entry id, send the token back to the client as a cookie and store the said user's data.


