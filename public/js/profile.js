var currentUserID = localStorage.getItem("user");
var currentUsername;
if (!currentUserID) {
  //window.location.href = "/"
}
localStorage.removeItem("searched-user")
$(document).ready(function () {

  //global variables
  /

  var nameInput = $("#author-name");
  var authorContainer = $(".author-container");
  var newPostDiv = $("#newPost")
  var authorId;
  var posts;
  var postsContainer = $("#timeline")
  var friendsApiArr = [];
  var friendsDataArr = [];

  //get the users info for the current logged in user and display it for the nav bar
  $.get("/api/authors/" + currentUserID, function (data) {
    // console.log(data + "dataaaa")
    console.log(data.name)

    var userN = data.name;
    localStorage.setItem("username", data.name);
    currentUsername = localStorage.getItem("username")
    console.log(currentUsername)
    var userName = userN.toUpperCase();
    $(".current-log").html(userName);
    $(".current-log2").html("Hello " + userName + "!");
    var imgDiv = $("#user-image");
    var userImg = $("<img>");
    userImg.css("height", "100px");
    userImg.css("width", "200px");
    userImg.attr("src", data.profileImage);
    imgDiv.append(userImg);
    $(".mini-profile-image").attr("src", data.profileImage);
    getFriends();
  });

  //then we get all friends and  put them into an array
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
      // $("#num-of-friends").html(friendsApiArr.length);

      getAllAuthors()
    });
  }

  //afterwards we get all users so and check if they are in out friends list so we can load all of the current users friends posts
  function getAllAuthors() {
    var allPosts = []
    $.get("/api/authors/", function (data) {
      console.log(data + "author data");
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].Posts)

        console.log(friendsApiArr)
        if (friendsApiArr.includes(parseInt(data[i].id)) || data[i].id == currentUserID) {
          for (var x = 0; x < data[i].Posts.length; x++) {
            allPosts.push(data[i].Posts[x]);
          }
        }



      }
      console.log(friendsDataArr)
      console.log(allPosts)
      var reversedPosts = allPosts.reverse()
      initializeRows(reversedPosts)
    });



  }

  //submit post button which creates a new post object with the user who posted it and the authorID of the current user with the text value of the post
  $(document).on("click", "#submitPost", function () {
    event.preventDefault();
    var newPostText = {
      postedBy: currentUsername,
      body: newPostDiv.val().trim(),
      AuthorId: currentUserID
    };
    console.log("you clicked it")
    console.log(newPostText)
    submitPost(newPostText);
    newPostDiv.val("")
  });


  //it then runs submit post to post it to the posts table
  function submitPost(post) {
    console.log("Test1")
    $.post("/api/posts", post, function () {
      getFriends()
      console.log("test2")
    });
  }




  //creates a posts array and appends them to the posts container
  function initializeRows(posts) {
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
    editBtn.addClass("edit-post btn btn-secondary");
    var newPostBody = $("<h4>");
    var newPostAuthor = $("<h5>");
    var newPostDate = $("<small>");
    newPostBody.text(post.body + " ");
    newPostDate.text(updateCreate + formattedDate);
    newPostAuthor.text("Posted By: " + post.postedBy)
    //newPostBody.append(newPostDate);
    newPostCardHeading.append(newPostBody);
    newPostCardHeading.append(newPostAuthor);
    newPostCardHeading.append(newPostDate);
    newPostCardHeading.append("<br>")
    if (post.postedBy == currentUsername) { newPostCardHeading.append(editBtn); newPostCardHeading.append(deleteBtn); };

    newPostCard.append(newPostCardHeading);
    var brkline = $("<br>");
    newPostCard.append(brkline);

    newPostCard.data("post", post);
    return newPostCard;
  }

  //displays a text indicating the the user has no posts if the user has no posts
  function displayEmpty() {
    postsContainer.empty();
    postsContainer.append("<h3>You have no posts yet, make your first post above!</h3>")
  }

  //delete post click function which captures the post ID from the delete buton attribute and then runs a .delete request to delete it from the sql database
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
        getFriends();
      });

  });

  //edit post button which takes the id of the post and creates a text box out of the current post field
  $(document).on("click", ".edit-post", function () {

    event.preventDefault();
    var editID = $(this).attr("clicker");
    var postToEdit = $("#" + editID);
    postToEdit.empty();
    console.log(editID)
    var editText;
    for (var i = 0; i < posts.length; i++) {
      console.log(posts[i])
      if (posts[i].id == editID) {
        editText = posts[i].body
      }
    }

    console.log(editText)
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
    newPostUpdate.val(editText)
    newPostUpdate.addClass("update-textarea " + editID)
    newPostUpdate.addClass("update-textarea")
    newPostCardHeading.append(newPostUpdate);
    newPostCardHeading.append(updateBtn);
    newPostCardHeading.append(exitBtn);
    postToEdit.append(newPostCardHeading);

  });

  //this confirms the post update with the new post data and then runs updatePost which puts the data into the correct post ID updating the mysql database
  $(document).on("click", ".update-post", function () {
    console.log("update-test")
    var updatePostID = $(this).attr("clicker");
    var updatedPostText = $("." + updatePostID)
    var newPostText = {
      id: updatePostID,
      postedBy: currentUsername,
      body: updatedPostText.val().trim(),
      AuthorId: currentUserID
    };
    console.log(newPostText)
    updatePost(newPostText)
  });

  //this cancels the update field and refreses the js back to getfriends
  $(document).on("click", ".cancel-update", function () {
    console.log("cancel-test")
    getFriends()
  });

  //update post put method and then runs getfrinds to refresh the js
  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    })
      .then(function () {
        getFriends();
      });
  }

  //getAuthors();
  console.log(currentUserID);
  // A function to handle what happens when the form is submitted to create a new Author




  // A function for creating an author. Calls getAuthors upon completion
  function upsertAuthor(authorData) {
    $.post("/api/authors", authorData)
      .then(getAuthors);
  }

  //search bar function which redirects the user to the members page and captures the search input in local storage
  $("#searchBarSubmit").on("click", function () {
    event.preventDefault();
    var searchInput = $("#searchBarInput").val().trim();
    localStorage.setItem("searched-user", searchInput)
    window.location = "/all-users";
    $("#searchBarInput").val("");
  });

});