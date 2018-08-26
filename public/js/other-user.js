var otherUser = localStorage.getItem("other-user");
console.log(otherUser);
var currentUserName = localStorage.getItem("username");
var currentUserID = localStorage.getItem("user");
var otherUserName;
$(document).ready(function () {
  var postsContainer = $("#timeline2");
  var newPostDiv = $("#newPost");

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
    // var deleteBtn = $("<button>");
    //deleteBtn.attr("clicker", post.id);
    //deleteBtn.text("Delete");
    // deleteBtn.addClass("delete-post btn btn-danger");
    // var editBtn = $("<button>");
    // editBtn.text("EDIT");
    //  editBtn.attr("clicker", post.id);
    // editBtn.addClass("edit-post btn btn-info");
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
    // newPostCardHeading.append(editBtn);
    // newPostCardHeading.append(deleteBtn);
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

});



$("#searchBarSubmit").on("click", function(){
  var searchInput = $("#searchBarInput").val().trim();
  localStorage.setItem("searched-user", searchInput)
  window.location ="/all-users";
});