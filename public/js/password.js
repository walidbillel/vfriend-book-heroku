var passName;
var passEmail;

var currentUserID = localStorage.getItem("user");

console.log(currentUserID);
//get password button takes in the user info for the username and email
$("#get-pass").on("click", function (event) {

    event.preventDefault();
    passName = $("#pass-name").val().trim();
    passEmail = $("#pass-email").val().trim();

    //    console.log(passEmail + " " + passName)

    //it then checks the information in the mysql database gives the user their password through a modal box
    $.get("/api/authors/password/" + passName + "/" + passEmail, function (data) {
       
        if (!data) {
            $("#password-text").html("Wrong Information Provided! Try Again!");
            $("#pass-modal").modal("toggle");
        } else {
            $("#password-text").html("Your Password is: " + data.password);
            $("#pass-modal").modal("toggle");
        }

        // console.log(data);

    });
});