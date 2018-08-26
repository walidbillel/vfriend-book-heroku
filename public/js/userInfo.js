
var currentUserID = localStorage.getItem("user");
var usersContainer = $(".users-container");
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

});



var searchInput;
function getSearchUser() {
    var searchInput = $("#searchBarInput").val().trim();
    $.get("/api/authors/checkID/" + searchInput, function (data) {
        if (!data) {
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
            usersContainer.html(friendDiv);
        }

    });
}

$("#searchBarSubmit").on("click", function(){
    window.location ="/all-users";
    getSearchUser();
    
});


