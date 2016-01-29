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

var pwerror = getUrlVars().error;

if (pwerror === "password") {
  $("#incorrect-p")[0].innerHTML = "Incorrect phone number or password!";
}

if (pwerror === "confirmPassword") {
  $("#create #password")[0].style.borderColor = "#E34234";
  $("#confirm-password")[0].style.borderColor = "#E34234";
  $("#incorrect-confirm")[0].innerHTML = "Passwords do not match!";
  $("#create, #login").toggleClass("fade");
  $("#create, #login").toggleClass("active");
  $(".nav-tabs>li").toggleClass("active");


}
