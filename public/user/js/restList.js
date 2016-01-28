var uid = localStorage.getItem('UID');
console.log(uid);

loadRestDetails();

function loadRestDetails(){
  var restDetails= new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/");

  restDetails.on("value", function(snapshot){
    var restDetailsObj=snapshot.val();

    var ruidsArray = Object.keys(restDetailsObj);

    var restDetailsHtml = ruidsArray.reduce(function(html,ruid){
      return html+=
        "<div class='restDetailWrapper'><a href='../checkIn/"+ruid+"'><img class='restLogo' src=" + restDetailsObj[ruid].image +
        "></a><p class='restTimes'>"+restDetailsObj[ruid].openTime+ " - " +restDetailsObj[ruid].closeTime+ "</p><h3 class='restName'>"+restDetailsObj[ruid].restName+"</h3><p class='restDescription'>"+restDetailsObj[ruid].description+"</p><p class='restAddress'>"+restDetailsObj[ruid].address+"</p></div>";
    }, "");
    document.getElementById("restsWrapper").innerHTML=restDetailsHtml;
  }, errorHandler);
}

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};
