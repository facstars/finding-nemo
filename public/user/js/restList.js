var uid = localStorage.getItem('UID');
console.log(uid);

loadAllRestDetails();

function loadAllRestDetails(){
  var restDetails= new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/");
  // "https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo

  restDetails.on("value", function(snapshot){
    var restDetailsObj=snapshot.val();

    var ruidsArray = Object.keys(restDetailsObj);


    var restDetailsHtml = ruidsArray.reduce(function(html,ruid){
      var waitlist = restDetailsObj[ruid].waitlist;
      var avWaitingTime;

      if(waitlist!==undefined){
        var minsPerTable = 10;
        var tableQueueLength=
          waitlist.table2? Object.keys(waitlist.table2).length:0 +
          waitlist.table4? Object.keys(waitlist.table4).length:0 +
          waitlist.table5? Object.keys(waitlist.table5).length:0;
        console.log(tableQueueLength);
      avWaitingTime= tableQueueLength*minsPerTable;
    } else{
      avWaitingTime= 0;
    }

      // console.log(restDetailsObj[ruid]['waitlist']['table2']);
      return html+=
        "<div class='restDetailWrapper'><a href='../checkIn/"+ruid+"'><img class='restLogo' src=" + restDetailsObj[ruid].image +
        "></a><p class='restTimes'>"+restDetailsObj[ruid].openTime+ " - " +restDetailsObj[ruid].closeTime+ "</p>"+
        "<p class></p><h3 class='restName'>"+restDetailsObj[ruid].restName+"</h3><p class='restDescription'>"+restDetailsObj[ruid].description+"</p><p class='restAddress'>"+restDetailsObj[ruid].address+"</p><p class=avWaitingTime>"+avWaitingTime+" minutes average waiting time"+"</p></div>";
    }, "");
    document.getElementById("restsWrapper").innerHTML=restDetailsHtml;
  }, errorHandler);
}

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};
