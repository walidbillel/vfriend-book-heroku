var otherUser = localStorage.getItem("other-user");
console.log(otherUser);

var currentUserName = localStorage.getItem("username");
var currentUserID = localStorage.getItem("user");
var otherUserName;
var friendsApiArr = [];
var friendsDataArr = [];
$(document).ready(function () {
  var postsContainer = $("#timeline2");
  var newPostDiv = $("#newPost");
  var usersContainer = $(".users-container");
  $.get("/api/authors/" + currentUserID, function (data) {

    $(".mini-profile-image").attr("src", data.profileImage);
    var userN = data.name;
    var userName = userN.toUpperCase();
    userName = "Hello " + userName + " !";
    $(".current-log").text(userName);
  });


  $.get("/api/authors/" + otherUser, function (data) {
    // attach stuff here to the divs
    // like $(".current-log").html(userName);
    console.log(data.Posts.length);
    $(".info-name").html(data.realName);
    otherUserN = data.name;
    otherUserName = otherUserN.toUpperCase();
    otherUserName = otherUserName + "'s Profile";
    $("#other-user-profile").append(otherUserName);
    
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
   


  }).then(function () {
    getPosts(otherUser)
  })


  $(document).on("click", "#submitPost", function () {
    event.preventDefault();
    var newPostText = {
      postedBy: currentUserName,
      body: newPostDiv.val().trim(),
      AuthorId: otherUser
    };
    console.log("you clicked it")
    console.log(newPostText)
    submitPost(newPostText);
  })

  function submitPost(post) {
    console.log("Test1")
    $.post("/api/posts", post, function () {
      getPosts(otherUser)
      console.log("test2")
    });
  }

  function getPosts(author) {
    console.log("test3")
    authorId = author || "";
    if (authorId) {
      authorId = "/?author_id=" + authorId;
    }
    $.get("/api/posts" + authorId, function (data) {
      console.log("Posts", data);
      posts = data.reverse();
      if (!posts || !posts.length) {

        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }



  function initializeRows() {
    postsContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]));
      
    }
    postsContainer.append(postsToAdd);
    
  }


  // This function constructs a post's HTML
  function createNewRow(post) {
    var formattedDate = new Date(post.updatedAt);
    var updateCreate;
    if (post.createdAt == post.updatedAt) { updateCreate = "Created at " } else { updateCreate = "Updated at " }
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    newPostCard.attr("id", post.id);
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
     var deleteBtn = $("<button>");
    deleteBtn.attr("clicker", post.id);
    deleteBtn.text("Delete");
     deleteBtn.addClass("delete-post btn btn-danger");
     var editBtn = $("<button>");
     editBtn.text("EDIT");
      editBtn.attr("clicker", post.id);
     editBtn.addClass("edit-post btn btn-info");
    var newPostBody = $("<h4>");
    var newPostAuthor = $("<h5>");
    var newPostDate = $("<small>");
    newPostBody.text(post.body + " ");
    newPostDate.text(updateCreate + formattedDate);
    newPostAuthor.text("Posted By: " + post.postedBy)
    newPostCardHeading.append(newPostBody);
    newPostCardHeading.append(newPostAuthor);
    newPostCardHeading.append(newPostDate);
    newPostCardHeading.append("<br>")
    if (post.postedBy == currentUserName){
     newPostCardHeading.append(editBtn);
     newPostCardHeading.append(deleteBtn);
    }
    newPostCard.append(newPostCardHeading);
    var brkline = $("<br>");
    newPostCard.append(brkline);
 
    newPostCard.data("post", post);
    return newPostCard;
  }

  function displayEmpty() {
    postsContainer.empty();
    postsContainer.append("<h3>Post on Your Friend's Book!!</h3>")
  }


$(document).on("click", ".delete-post", function () {
  event.preventDefault();
  console.log("delete-test")
  var deleteID = $(this).attr("clicker");
  console.log(deleteID)
  $.ajax({
    method: "DELETE",
    url: "/api/posts/" + deleteID
  })
    .then(function () {
      getPosts(otherUser);
    });

});


$(document).on("click", ".edit-post", function () {
  console.log("edit-test")
  event.preventDefault();
  var editID = $(this).attr("clicker");
  var postToEdit = $("#" + editID);
  postToEdit.empty();
  var newPostCardHeading = $("<div>");
  newPostCardHeading.addClass("card-header");
  var updateBtn = $("<button>");
  updateBtn.attr("clicker", editID);
  updateBtn.text("Update");
  updateBtn.addClass("update-post btn btn-info");
  var exitBtn = $("<button>");
  exitBtn.text("Cancel");
  exitBtn.attr("clicker", editID);
  exitBtn.addClass("cancel-update btn btn-danger");
  var newPostUpdate = $("<textarea>");
  newPostUpdate.addClass("update-textarea " + editID)
  newPostUpdate.addClass("update-textarea")
  newPostCardHeading.append(newPostUpdate);
  newPostCardHeading.append(updateBtn);
  newPostCardHeading.append(exitBtn);
  postToEdit.append(newPostCardHeading);

})

$(document).on("click", ".update-post", function () {
  console.log("update-test")
  var updatePostID = $(this).attr("clicker");
  var updatedPostText = $("." + updatePostID)
  var newPostText = {
    id: updatePostID,
    postedBy: currentUserName,
    body: updatedPostText.val().trim(),
    AuthorId: otherUser
  };
  console.log(newPostText)
  updatePost(newPostText)
});

$(document).on("click", ".cancel-update", function () {
  console.log("cancel-test")
  getPosts(otherUser)
});

function updatePost(post) {
  $.ajax({
    method: "PUT",
    url: "/api/posts",
    data: post
  })
    .then(function () {
      //location.reload();
      getPosts(otherUser);
    });
}


$.get("/api/friends/", function (data) {
  console.log(data);
  for (var i = 0; i < data.length; i++) {
      if (data[i].currentUser == otherUser && friendsApiArr.includes(data[i].followedUser) == false) {
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

$("#searchBarSubmit").on("click", function(){
  var searchInput = $("#searchBarInput").val().trim();
  localStorage.setItem("searched-user", searchInput)
  window.location ="/all-users";
});
});

