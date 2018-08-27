
var currentUserID = localStorage.getItem("user");
var usersContainer = $(".users-container");
localStorage.removeItem("searched-user")
var friendsApiArr = [];
var friendsDataArr = [];
usersContainer.hide();
var userFriends = $(".user-friends");
if (!currentUserID) {
    //window.location.href = "/"
}
console.log(currentUserID)
$(document).ready(function () {
    $.get("/api/authors/" + currentUserID, function (data) {
        // attach stuff here to the divs
        // like $(".current-log").html(userName);
        console.log(data.Posts.length);
        $(".info-name").html(data.realName.toUpperCase());
        $(".info-birthday").html(data.birthday);
        $(".info-gender").html(data.sex.toUpperCase());
        $(".info-username").html(data.name.toUpperCase());
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
        getFriends()
    });

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
            console.log(friendsApiArr);
            $("#num-of-friends").html(friendsApiArr.length);

            getAllAuthors()
        });
    }
    function getAllAuthors() {
        $.get("/api/authors/", function (data) {
            console.log(data + "author data");
            //array.includes didnt work for comparing data types so i used two for loops
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].id)
                console.log(friendsApiArr)
                    if (friendsApiArr.includes(parseInt(data[i].id))) {
                        friendsDataArr.push(data[i])
                    }


                
            }
            console.log(friendsDataArr)
            displayFriends()
        });



    }
    function displayFriends() {
        usersContainer.empty();
        for (var i = 0; i < friendsDataArr.length; i++) {

            usersContainer.show();
            console.log(friendsDataArr[i]);
            var friendDiv = $("<li>");
            friendDiv.css("background", "#e6f3f7");
            friendDiv.addClass("list-group-item");
            console.log("1")
            var friendN = friendsDataArr[i].name;
            var friendNCap = friendN.toUpperCase();
            var userName =  "<b>" + "&nbsp" + friendNCap + "</b>";
            var userImg = $("<img>");
            userImg.css("height", "40px");
            userImg.css("width", "40px");
            userImg.css("border-radius", "15px");
            userImg.attr("src", friendsDataArr[i].profileImage);
            userImg.attr("profileID", friendsDataArr[i].id)
            var btnUnfollow = $("<button>");
            btnUnfollow.addClass("unfollow-button btn-primary btn-xs");
            btnUnfollow.css("cursor", "pointer");
            btnUnfollow.text("Unfollow");
            btnUnfollow.css("width", "100%");
            btnUnfollow.css("border-radius", "15px");
            btnUnfollow.attr("profileID", friendsDataArr[i].id)
            var btnProfile = $("<button>");
            // console.log("2.5")
            btnProfile.addClass("profile-button btn-primary btn-xs");
            btnProfile.css("cursor", "pointer");
            btnProfile.text("Profile");
            btnProfile.css("width", "100%");
            btnProfile.css("border-radius", "15px");
            console.log("2")
            btnProfile.attr("profileID", friendsDataArr[i].id)
            friendDiv.append(userImg);
            friendDiv.append(userName + "<br>" + "<br>");
            friendDiv.append(btnUnfollow);
            friendDiv.append(btnProfile);
            userFriends.append(friendDiv);
            userFriends.append("<br>")
            // console.log("3")

        }

    }
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

    $(document).on("click", ".profile-button", function () {
        localStorage.removeItem("other-user")
        event.preventDefault();
        var profileID = $(this).attr("profileID");
        localStorage.setItem("other-user", profileID)
        // console.log("you clicked it!!!")
        window.location = "/other-user/" + profileID;
    });

    $("#searchBarSubmit").on("click", function () {
        var searchInput = $("#searchBarInput").val().trim();
        localStorage.setItem("searched-user", searchInput)
        window.location = "/all-users";
    });
});





