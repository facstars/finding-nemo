var ref = new Firebase("https://blistering-torch-1660.firebaseio.com");

document.getElementById('restLogin').addEventListener('submit', function(e){
  e.preventDefault();
  var email=restLogin.elements.email.value;
  var pw=restLogin.elements.password.value;
  validateRestLoginDetails(email,pw);
})

var validateRestLoginDetails = function(email,pw){
  ref.authWithPassword({
    email    : email,
    password : pw
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      localStorage.setItem('RUID',authData.auth.uid);
      window.location.replace('../restaurantOverview')
    }
  });
};
