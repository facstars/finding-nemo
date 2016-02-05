var uid = localStorage.getItem('UID');
console.log(uid);

loadAllRestDetails();

function loadAllRestDetails(){
  var restTemplate = _.template($("#rest-template").html());
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
      var rendered = restTemplate({
        ruid: ruid,
        restDetailsObj: restDetailsObj,
        avWaitingTime: avWaitingTime
      });

      return html += rendered;

    }, "");
    document.getElementById("restsWrapper").innerHTML=restDetailsHtml;
  }, errorHandler);
}

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};
