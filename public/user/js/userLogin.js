(function checkUid(){
  if(localStorage.getItem('UID')){
    window.location.replace('/user/restList');
  }
})();


function checkRuid(){
  if(localStorage.getItem('RUID')){
    window.location.replace('../restaurant/restOverview');
  } else {
    window.location.replace('../restaurant/restLogin');
  }
}

function clearInvalidLoginMsg(){
  $("#incorrect-p")[0].innerHTML = "";
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
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

document.getElementById('tabSignup').addEventListener('submit', function(e){
  e.preventDefault();
  validation(tabSignup, formHandler);
});

function validation(form, callback){
  var pattern = /^\d{11,16}$/;
  if(form.name.value===""||form.tel.value===""||form.password.value===""||form.confirmPassword.value===""){
    document.getElementById('validation').innerHTML="You must fill in all * fields to proceed";
  } else if(!form.tel.value.match(pattern)){
    document.getElementById('validation').innerHTML="Please enter a valid mobile number";
  } else {
    callback(form);
  }
}

function formHandler(form){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      window.location = request.responseText;
    }
  };
  var formObj = {
    name: form.name.value,
    tel: form.tel.value,
    password: form.password.value,
    confirmPassword: form.confirmPassword.value
  };
  request.open("POST", "/signup");
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(formObj));

}
