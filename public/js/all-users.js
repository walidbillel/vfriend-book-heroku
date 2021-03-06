//establish global variables
var usersContainer = $(".users-container");
usersContainer.hide();
var currentUserID = localStorage.getItem("user");
var friendsApiArr = [];
var friendsDataArr = [];
var searchedUser = localStorage.getItem("searched-user")


if (searchedUser) {
getSearchUser(searchedUser)

}
else {
  getFriends()
}

//this function gets all friends from the current user ID and adds them to the friendsApiArr
  function getFriends() {
    friendsApiArr = [];
    friendsDataArr = [];
    $.get("/api/friends/", function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (data[i].currentUser == currentUserID && friendsApiArr.includes(parseInt(data[i].followedUser)) == false) {
                console.log(data[i].followedUser)
                friendsApiArr.push(parseInt(data[i].followedUser))
            }
        }
        console.log(friendsApiArr)
        getAuthors()
    });
}

//we then get all users to display them. If the users was on the currently logged in users frineds list, we append an unfollow button, otherwise we append a follow button
function getAuthors() {
  $.get("/api/authors", function (data) {
    usersContainer.empty();

    for (var i = 0; i < data.length; i++) {
      if (data[i].id != currentUserID) {
        usersContainer.show();
        console.log(data[i]);
        var friendDiv = $("<li>");
        friendDiv.css("background", "#e6f3f7");
        friendDiv.addClass("list-group-item");
        // console.log("1")
        var friendN = data[i].name;
        var friendNCap = friendN.toUpperCase();
        var userName = "<b>" + "&nbsp" + friendNCap + "</b>";
        var userImg = $("<img>");
        userImg.css("height", "80px");
        userImg.css("width", "80px");
        userImg.css("border-radius", "15px");
        userImg.attr("src", data[i].profileImage);
        userImg.attr("profileID", data[i].id)
        var btnFollow = $("<button>");
        btnFollow.addClass("follow-button btn-primary btn-lg");
        btnFollow.css("cursor", "pointer");
        btnFollow.text("Follow");
        btnFollow.attr("profileID", data[i].id)
        var btnUnfollow = $("<button>");
        btnUnfollow.addClass("unfollow-button btn-primary btn-lg");
        btnUnfollow.css("cursor", "pointer");
        btnUnfollow.text("Unfollow");
        btnUnfollow.attr("profileID", data[i].id)
        var btnProfile = $("<button>");
        // console.log("2.5")
        btnProfile.addClass("profile-button btn-primary btn-lg");
        btnProfile.css("cursor", "pointer");
        btnProfile.text("Profile");
        console.log("2")
        btnProfile.attr("profileID", data[i].id)
        friendDiv.append(userImg);
        friendDiv.append(userName + "<br>" + "<br>");
        if (friendsApiArr.includes(parseInt(data[i].id))){
          friendDiv.append(btnUnfollow);
        }
        else{
          friendDiv.append(btnFollow);
        }
        
        friendDiv.append(btnProfile);
        usersContainer.append(friendDiv);
        usersContainer.append("<br>")
        // console.log("3")
      }
    }

  });
}


//this function searches for a user if the user exists and displays their information like all users.
function getSearchUser(search) {
  localStorage.removeItem("searched-user")
  $.get("/api/authors/checkID/" + search, function (data) {
    usersContainer.show();
    if (!data ) {
      $("#searchBarModal").html("This user Doesn't exist!");
      $("#search-modal").modal("toggle");
    } else {
      // usersContainer.hide();
      console.log(data);
      // authorContainer.append(createAuthorRow(data[i]));
      // authorContainer.append("<br>");
      var friendDiv = $("<li>");
      friendDiv.addClass("list-group-item");
      friendDiv.css("background", "#e6f3f7");
      var friendN = data.name;
      var friendNCap = friendN.toUpperCase();
      var userName = "<b>" +"&nbsp" + friendNCap + "</b>";
      var userImg = $("<img>");
      userImg.css("height", "80px");
      userImg.css("width", "80px");
      userImg.attr("src", data.profileImage);
      var btnFollow = $("<button>");
      btnFollow.addClass("btn-primary follow-button btn-lg");
      btnFollow.css("cursor", "pointer");
      btnFollow.text("Follow");
      btnFollow.attr("profileID", data.id)
      var btnProfile = $("<button>");
      btnProfile.addClass("btn-primary profile-button btn-lg");
      btnProfile.css("cursor", "pointer");
      btnProfile.attr("profileID", data.id)
      btnProfile.text("Profile");
      var btnUnfollow = $("<button>");
      btnUnfollow.addClass("unfollow-button btn-primary btn-lg");
      btnUnfollow.css("cursor", "pointer");
      btnUnfollow.text("Unfollow");
      btnUnfollow.attr("profileID", data.id)
      // btnProfile.css("margin-left", "5px");
      // friendDiv.append("Name: "+realName + "<br>");
      friendDiv.append(userImg);
      friendDiv.append(userName + "<br>" + "<br>");
      if (friendsApiArr.includes(parseInt(data.id))){
        friendDiv.append(btnUnfollow);
      }
      else{
        friendDiv.append(btnFollow);
      }
      friendDiv.append(btnProfile);
      usersContainer.html(friendDiv);
      
    }

  });
}

//simple get function for the current user to get nav bar info
$.get("/api/authors/" + currentUserID, function(data){
  var userN = data.name;
  var userName = userN.toUpperCase();
  $(".current-log2").html("Hello " + userName + "!");
  $(".mini-profile-image").attr("src", data.profileImage);
});

//search bar submit button function which runs the get search user function with the value
$("#searchBarSubmit").on("click", function () {
  event.preventDefault();
  var searchInput = $("#searchBarInput").val().trim();
  localStorage.setItem("searched-user", searchInput)
  getSearchUser(searchInput);
  $("#searchBarInput").val("");
})

//follow button takes in the users and the followed users ID to create a new entry into the friends table
$(document).on("click", ".follow-button", function () {
  event.preventDefault();
  var followID = $(this).attr("profileID");
  var newFollow = {
    currentUser: currentUserID,
    followedUser: followID,
  };
  // console.log("you clicked it")
  console.log(newFollow)
  followUser(newFollow);
});

//unfollow button which deletes the friends table entry with both the userID and the unfollowed users ID
$(document).on("click", ".unfollow-button", function () {
  event.preventDefault();
  console.log("delete-test")
  var deleteID = $(this).attr("profileID");
  console.log(deleteID)
  $.ajax({
      method: "DELETE",
      url: "/api/friends/" + currentUserID + "/" + deleteID
  })
      .then(function () {
          getFriends()
      });

});

//follow user button which posts follow to the friends table
function followUser(follow) {
  $.post("/api/friends", follow)
    .then(function (res) {
      getFriends()
      console.log("test2")
    });
}

//profile on each users card which when clicked links the user to the other users profile page
$(document).on("click", ".profile-button", function () {
  localStorage.removeItem("other-user")
  event.preventDefault();
  var followID = $(this).attr("profileID");
  localStorage.setItem("other-user", followID)
  // console.log("you clicked it!!!")

  window.location = "/other-user/" + followID;
}); 

