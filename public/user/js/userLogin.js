var ref = new Firebase("https://blistering-torch-1660.firebaseio.com/users");

document.getElementById('user-login').addEventListener('submit', function(e){
  e.preventDefault();
  var tel=userLogin.elements.tel.value;
  var pw=userLogin.elements.password.value;
  validateRestLoginDetails(tel,pw);
});

var validateRestLoginDetails = function(phone_number,pw){
  ref.authWithPassword({
    tel      : tel,
    password : pw
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      localStorage.setItem('RUID',authData.auth.uid);
      window.location.replace('../availableRestaurants');
    }
  });
};
