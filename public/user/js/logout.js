document.getElementById('logOutBtn').addEventListener('click', function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        var reply = request.responseText;
        console.log("I'm the request");
        // localStorage.removeItem('ruidQueue');
        // localStorage.removeItem('tableNoQueue');
        window.location.replace('../user/userLogin');
      }
    };
    request.open("GET", "/logout");
    request.send();
});
