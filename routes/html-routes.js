// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads login.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/login.html"));
  });

  // Route that loads the user profile
  app.get("/profile", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/user.html"));
  });

  // // Route that loads the newsfeed
  app.get("/newsfeed", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/newsfeed.html"));
  });
  
  // Route that loads the user registration form
  app.get("/survey", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/register.html"));
  });

  // Route that loads the password page
  app.get("/password", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/password.html"));
  });

  // Route that loads all the users
  app.get("/all-users", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/all-users.html"));
  });
  
  // Route that loads the other viewed user
  app.get("/other-user/:id", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/other-user.html"));
  });

// isolated route for login
  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/login.html"));
  });


};
