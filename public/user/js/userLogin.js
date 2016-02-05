(function checkUid(){
  if(localStorage.getItem('UID')){
    window.location.replace('/user/restList');
  }
})();

function checkRuid(){
  if(localStorage.getItem('RUID')){
    window.location.replace('../restaurant/restOverview');
  }
  else{
    window.location.replace("../../restaurant/restLogin");
  }
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

var loginError = getUrlVars().error;

if (loginError === "password") {
  $("#incorrect-p")[0].innerHTML = "Incorrect phone number or password!";
}

if (loginError === "confirmPassword") {
  $("#create #password")[0].style.borderColor = "#E34234";
  $("#confirm-password")[0].style.borderColor = "#E34234";
  $("#incorrect-confirm")[0].innerHTML = "Passwords do not match!";
  $("#create, #login").toggleClass("fade");
  $("#create, #login").toggleClass("active");
  $(".nav-tabs>li").toggleClass("active");
}

if (loginError === "userExists") {
  $("#incorrect-confirm")[0].innerHTML = "This phone number is already registered!";
  $("#signup-tel")[0].style.borderColor = "#E34234";
  $("#create, #login").toggleClass("fade");
  $("#create, #login").toggleClass("active");
  $(".nav-tabs>li").toggleClass("active");
}
