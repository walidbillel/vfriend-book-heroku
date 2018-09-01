
var currentUserName;
var password;

//localStorage.removeItem("user");
//on login click we take in the current username and password values
$("#login-button").on("click", function () {
    event.preventDefault();
    localStorage.clear();
    currentUserName = $("#username-val").val().trim();
    password = $("#password-val").val().trim();

    console.log(currentUserName);


//get request to check if the username and password match a current entry into the database.
    $.get("/api/authors/" + currentUserName + "/" + password, function (data) {
        if (!data) {
            $(".alert-message").html("User Not Found!");
            $("#alert-modal").modal("toggle");
        }

        localStorage.setItem("user", data.id)
        console.log(localStorage);
        window.location.href = "../newsfeed";

    });

});
