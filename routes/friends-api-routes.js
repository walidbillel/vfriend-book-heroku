var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the friends
  app.get("/api/friends", function (req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Friends.findAll().then(function(dbFriends) {
        res.json(dbFriends);
      });
    });

  // Get route for retrieving a single Friends
  app.get("/api/friends/:id", function (req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Friends.findOne({
      where: {
        currentuser: req.params.id
      },
    }).then(function (dbFriends) {
      res.json(dbFriends);
    });
  });

  // Friends route for saving a new Friends
  app.post("/api/friends", function (req, res) {
    db.Friends.create(req.body).then(function (dbFriends) {
      res.json(dbFriends);
    });
  });

  // DELETE route for deleting friends
  app.delete("/api/friends/:id", function (req, res) {
    console.log("---------------------------------------")
    db.Friends.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbFriends) {
      res.json(dbFriends);
    });
  });

  // PUT route for updating friends
  app.put("/api/friends", function (req, res) {
    db.Friends.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbFriends) {
        res.json(dbFriends);
      });
  });
};
