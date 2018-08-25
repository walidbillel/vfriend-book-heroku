
var usersContainer = $(".users-container");
var searchedUser = $(".searchedUser");
usersContainer.hide();
var currentUserID = localStorage.getItem("user");
getAuthors()


function getAuthors() {
  $.get("/api/authors", function (data) {


    for (var i = 0; i < data.length; i++) {
      usersContainer.show();
      console.log(data[i]);
      // authorContainer.append(createAuthorRow(data[i]));
      // authorContainer.append("<br>");
      var friendDiv = $("<li>");
      friendDiv.addClass("list-group-item");
      var userName = "&nbsp" + data[i].name;
      var userImg = $("<img>");
      userImg.css("height", "80px");
      userImg.css("width", "80px");
      userImg.attr("src", data[i].profileImage);
      var btnFollow = $("<button>");
      btnFollow.addClass("btn-primary btn-lg");
      btnFollow.css("cursor", "pointer");
      btnFollow.text("Follow");
      var btnProfile = $("<button>");
      btnProfile.addClass("btn-primary btn-lg");
      btnProfile.css("cursor", "pointer");
      btnProfile.text("Profile");
      // btnProfile.css("margin-left", "5px");
      // friendDiv.append("Name: "+realName + "<br>");
      friendDiv.append(userImg);
      friendDiv.append(userName + "<br>" + "<br>");
      friendDiv.append(btnFollow);
      friendDiv.append(btnProfile);
      usersContainer.append(friendDiv);
    }

  });
}

// function searchBar() {
//   var searchInput = $("#serachBarInput").val().trim();
//   $("#searchBarSubmit").on("click", function(event){
//     event.preventDefault();
//     console.log(searchInput);
//   })

// }

// searchBar();
var searchInput;
function getSearchUser() {
  var searchInput = $("#searchBarInput").val().trim();
  $.get("/api/authors/checkID/" + searchInput, function (data) {
    if (!data) {
      $("#searchBarModal").html("This user Doesn't exist!");
      $("#search-modal").modal("toggle");
    } else {
      usersContainer.hide();
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
      btnFollow.addClass("btn-primary btn-lg");
      btnFollow.css("cursor", "pointer");
      btnFollow.text("Follow");
      var btnProfile = $("<button>");
      btnProfile.addClass("btn-primary btn-lg");
      btnProfile.css("cursor", "pointer");
      btnProfile.text("Profile");
      // btnProfile.css("margin-left", "5px");
      // friendDiv.append("Name: "+realName + "<br>");
      friendDiv.append(userImg);
      friendDiv.append(userName + "<br>" + "<br>");
      friendDiv.append(btnFollow);
      friendDiv.append(btnProfile);
      searchedUser.html(friendDiv);
    }

  });
}

$(".searchBarSubmit").on("click", getSearchUser);


