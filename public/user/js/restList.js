loadRestDetails();

function loadRestDetails(){
  var restDetails= new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/");

  restDetails.on("value", function(snapshot){
    var restDetailsObj=snapshot.val();
    console.log(restDetailsObj['0df2ff31-0801-4cc8-9374-5ca3209be1a1']);

    var ruidsArray = Object.keys(restDetailsObj);
    console.log(ruidsArray);

    var restDetailsHtml = ruidsArray.reduce(function(html,ruid){
      return html+=
        "<div class='restDetailWrapper'><img class='restLogo' src=" + restDetailsObj[ruid].image +
        "><h3 class='restName'>"+restDetailsObj[ruid].restName+"</h3><p class='restDescription'>"+restDetailsObj[ruid].description+"</p><p class='restAddress'>"+restDetailsObj[ruid].address+"</p></div>";


      // <li id=rest-" + ruid + ">"+restDetailsObj[ruid].description+"</li>";
    }, "");
    document.getElementById("restsWrapper").innerHTML=restDetailsHtml;

  }, errorHandler);
}

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};
