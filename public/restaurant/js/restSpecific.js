var ruid=localStorage.getItem("RUID");

var getTableSize = function(){
  var URLSegmentArray = window.location.pathname.split( '/' );
  var lastURLSegment = URLSegmentArray[URLSegmentArray.length - 1]
  console.log(lastURLSegment);
  loadPeopleWaiting(lastURLSegment) ;
}();


function loadPeopleWaiting(table){
  var restaurantWaitlist=new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+table);

    restaurantWaitlist.on('value', function(snapshot) {
      var TableObj=snapshot.val();
      var waitlistNames =   Object.keys(TableObj).map(key => TableObj[key]);

      for (var key in waitlistNames) {
        console.log(waitlistNames[key]);
      document.getElementById("PeopleDetails").innerHTML+= "<li>"+waitlistNames[key].name + " --- " +waitlistNames[key].tel + " --- Guests:" + waitlistNames[key].guests+"</li>";
    }
  }, errorHandler);
};

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};

var getValuesFromObject = function(obj){
  Object.keys(obj).map(key => obj[key]);
};
