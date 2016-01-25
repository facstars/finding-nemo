var ruid=localStorage.getItem("RUID");

var getTableSize = function(){
  var URLSegmentArray = window.location.pathname.split( '/' );
  var lastURLSegment = URLSegmentArray[URLSegmentArray.length - 1]
  console.log(lastURLSegment);
  loadPeopleWaiting(lastURLSegment) ;
}();


function loadPeopleWaiting(table){
  var restaurantWaitlist=new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+table);
  var tableReadyButton = "<button class='tableReadyButton'>Table ready</button>";
  var seatedButton = "<button class='seatedButton'>Seated</button>";
  var noShowButton = "<button class='noShowButton'>No show</button>";

  restaurantWaitlist.on('value', function(snapshot) {
    var TableObj=snapshot.val();
    var waitlistNames =   Object.keys(TableObj).map(key => TableObj[key]);

    for (var key in waitlistNames) {
      console.log(waitlistNames[key]);
      document.getElementById("PeopleDetails").innerHTML+= "<li>"+waitlistNames[key].name + " --- " +waitlistNames[key].tel + " --- Guests:" + waitlistNames[key].guests + tableReadyButton+seatedButton + noShowButton + "</li>";
    }
    tableReadyClickListener();
  }, errorHandler);
};

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};

var getValuesFromObject = function(obj){
  Object.keys(obj).map(key => obj[key]);
};

var tableReadyClickListener = function (){
  var tableReadyButtonArray = document.getElementsByClassName("tableReadyButton"),
    i;
  for (i = 0; i < tableReadyButtonArray.length; i++) {
    tableReadyButtonArray[i].addEventListener("click", tableReadyClickHandler(i));
  }
}

function tableReadyClickHandler(i) {
  return function() {
    console.log("table ready button clicked");
      document.getElementsByClassName("tableReadyButton")[i].style.display = "none";
      document.getElementsByClassName("seatedButton")[i].style.display="inline";
      document.getElementsByClassName("noShowButton")[i].style.display="inline";
    }
  };
