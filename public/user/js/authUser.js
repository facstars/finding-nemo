var ref = new Firebase("https://blistering-torch-1660.firebaseio.com/users");

ref.authWithCustomToken($.cookie("firebase_token"), function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
    window.location = "/user/userLogin.html";
  } else {
    console.log("Login Succeeded!", authData);
  }
});
