$("#new-user").on("click", function () {

  event.preventDefault();
  var nameInput = $("#user-name").val().trim();
  var actualName = $("#name").val().trim();
  var emailInput = $("#email").val().trim();
  var imagLink = $("#img-link").val().trim();
  var birthdayInput = $("#birthday").val().trim();
  var gender = $("#sex").val().trim();
  var userPass = $("#password").val().trim();
  var cfpass = $("#pass-conf").val().trim();

  //if the user hasnt entered a value into the text field than we alert them of an error
  if (!nameInput || !actualName || !emailInput || !imagLink || !birthdayInput || !gender || !userPass || !cfpass) {
    // alert("Please fill all fields!")
    $(".alert-message").html("Please Fill All Fields!");
    $("#alert-modal").modal("toggle");
  }

  //if the user hasnt entered the same password we alert them of an error
  else if (!(userPass === cfpass)) {
    // alert("Passwords Don't Match!!");
    $(".alert-message").html("Passwords Don't Match!");
    $("#alert-modal").modal("toggle");
  }
  //otherwise we create a new user object
  else {

    var userNameObject = {
      realName: actualName,
      name: nameInput,
      email: emailInput,
      profileImage: imagLink,
      birthday: birthdayInput,
      sex: gender,
      password: userPass,
      passCon: cfpass

    };

    console.log(userNameObject);

    upsertNewUser(userNameObject);
  }
});


//we then post the nw user data to the server.. the username and email must be unique or it throws an error
function upsertNewUser(newUserData) {
  $.post("/api/authors", newUserData)
    .then(function (res, err) {
      console.log(err)
      console.log(res)
      if (res.name == "SequelizeUniqueConstraintError") {
        // alert("That username or email is already in user");
        $(".alert-message").html("The username or email is already in taken!");
        $("#alert-modal").modal("toggle");
      }
      else {
        window.location.href = "/login"
      }
    });
}


