
var currentUserID = localStorage.getItem("user");
var usersContainer = $(".users-container");
localStorage.removeItem("searched-user")
var friendsApiArr = [];
var friendsDataArr = [];
usersContainer.hide();
if (!currentUserID) {
    //window.location.href = "/"
}
console.log(currentUserID)
$(document).ready(function () {
    $.get("/api/authors/" + currentUserID, function (data) {
        // attach stuff here to the divs
        // like $(".current-log").html(userName);
        console.log(data.Posts.length);
        $(".info-name").html(data.realName);
        $(".info-birthday").html(data.birthday);
        $(".info-gender").html(data.sex);
        $(".info-username").html(data.name);
        $(".info-email").html(data.email);
        $(".info-posts").html(data.Posts.length);
        $(".profile-image").attr("src", data.profileImage);
        $(".profile-image").css("width", "100px");
        $(".profile-image").css("height", "100px");
        $(".profile-image").css("border-radius", "20px");
        $(".main-profile-image").attr("src", data.profileImage);
        $(".main-profile-image").css("width", "200px");
        $(".main-profile-image").css("height", "200px");
        $(".main-profile-image").css("border-radius", "20px");
        $(".mini-profile-image").attr("src", data.profileImage);
    });


    $.get("/api/friends/", function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            if (data[i].currentUser == currentUserID && friendsApiArr.includes(data[i].followedUser) == false) {
                console.log(data[i].followedUser)
                friendsApiArr.push(data[i].followedUser)
            }
        }
        console.log(friendsApiArr)
        getAllAuthors()
    });

function getAllAuthors(){
    $.get("/api/authors/", function (data) {
        console.log(data + "author data");
        //array.includes didnt work for comparing data types so i used two for loops
        for (var i = 0; i < data.length; i++){
            console.log(data[i].id)
            console.log(friendsApiArr)
            for (var x = 0; x < friendsApiArr.length; x++){
                if (friendsApiArr[x] == data[i].id){
                    friendsDataArr.push(data[i])
                }

                
            }   
        }
        console.log(friendsDataArr)
        displayFriends()  
    });

    

}
function displayFriends(){
    for (var i = 0; i < friendsDataArr.length; i++) {
  
          usersContainer.show();
          console.log(friendsDataArr[i]);
          var friendDiv = $("<li>");
          friendDiv.css("background", "#e6f3f7");
          friendDiv.addClass("list-group-item");
          console.log("1")
          var userName = "&nbsp" + friendsDataArr[i].name;
          var userImg = $("<img>");
          userImg.css("height", "80px");
          userImg.css("width", "80px");
          userImg.attr("src", friendsDataArr[i].profileImage);
          userImg.attr("profileID", friendsDataArr[i].id)
          var btnFollow = $("<button>");
          btnFollow.addClass("follow-button btn-primary btn-lg");
          btnFollow.css("cursor", "pointer");
          btnFollow.text("Follow");
          btnFollow.attr("profileID", friendsDataArr[i].id)
          var btnProfile = $("<button>");
          // console.log("2.5")
          btnProfile.addClass("profile-button btn-primary btn-lg");
          btnProfile.css("cursor", "pointer");
          btnProfile.text("Profile");
          console.log("2")
          btnProfile.attr("profileID", friendsDataArr[i].id)
          friendDiv.append(userImg);
          friendDiv.append(userName + "<br>" + "<br>");
          friendDiv.append(btnFollow);
          friendDiv.append(btnProfile);
          usersContainer.append(friendDiv);
          usersContainer.append("<br>")
          // console.log("3")
        
      }

}
$("#searchBarSubmit").on("click", function () {
    var searchInput = $("#searchBarInput").val().trim();
    localStorage.setItem("searched-user", searchInput)
    window.location = "/all-users";
});
});





