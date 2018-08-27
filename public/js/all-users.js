
var usersContainer = $(".users-container");
usersContainer.hide();
var currentUserID = localStorage.getItem("user");

var searchedUser = localStorage.getItem("searched-user")

if (searchedUser) {
getSearchUser(searchedUser)

}
else {
  getAuthors()
}

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
        var userName = "&nbsp" + data[i].name;
        var userImg = $("<img>");
        userImg.css("height", "80px");
        userImg.css("width", "80px");
        userImg.attr("src", data[i].profileImage);
        userImg.attr("profileID", data[i].id)
        var btnFollow = $("<button>");
        btnFollow.addClass("follow-button btn-primary btn-lg");
        btnFollow.css("cursor", "pointer");
        btnFollow.text("Follow");
        btnFollow.attr("profileID", data[i].id)
        var btnProfile = $("<button>");
        // console.log("2.5")
        btnProfile.addClass("profile-button btn-primary btn-lg");
        btnProfile.css("cursor", "pointer");
        btnProfile.text("Profile");
        console.log("2")
        btnProfile.attr("profileID", data[i].id)
        friendDiv.append(userImg);
        friendDiv.append(userName + "<br>" + "<br>");
        friendDiv.append(btnFollow);
        friendDiv.append(btnProfile);
        usersContainer.append(friendDiv);
        usersContainer.append("<br>")
        // console.log("3")
      }
    }

  });
}



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
      var userName = "&nbsp" + data.name;
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
      // btnProfile.css("margin-left", "5px");
      // friendDiv.append("Name: "+realName + "<br>");
      friendDiv.append(userImg);
      friendDiv.append(userName + "<br>");
      friendDiv.append(btnFollow);
      friendDiv.append(btnProfile);
      usersContainer.html(friendDiv);
      
    }

  });
}

$("#searchBarSubmit").on("click", function () {
  event.preventDefault();
  var searchInput = $("#searchBarInput").val().trim();
  localStorage.setItem("searched-user", searchInput)
  getSearchUser(searchInput);
})

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


function followUser(follow) {
  $.post("/api/friends", follow)
    .then(function (res) {
      getAuthors()
      console.log("test2")
    });


}

$(document).on("click", ".profile-button", function () {
  localStorage.removeItem("other-user")
  event.preventDefault();
  var followID = $(this).attr("profileID");
  localStorage.setItem("other-user", followID)
  // console.log("you clicked it!!!")

  window.location = "/other-user/" + followID;
}); 

