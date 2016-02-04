var ref = new Firebase("https://blistering-torch-1660.firebaseio.com/users");

ref.authWithCustomToken($.cookie("firebase_token"), function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
    window.location = "/";
  } else {
    localStorage.setItem('UID',authData.uid);
    console.log("Login Succeeded!");
  }
});
