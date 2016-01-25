var ruid=localStorage.getItem("RUID");
var waitlistUIDs;
var tableSize;

var getTableSize = function(){
  var URLSegmentArray = window.location.pathname.split( '/' );
  tableSize = URLSegmentArray[URLSegmentArray.length - 1]
  console.log(tableSize);
  loadPeopleWaiting(tableSize) ;
}();


function loadPeopleWaiting(table){
  document.getElementById("PeopleDetails").innerHTML="";
  var restaurantWaitlist=new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+table);
  var tableReadyButton = "<button class='tableReadyButton'>Table ready</button>";
  var seatedButton = "<button class='seatedButton'>Seated</button>";
  var noShowButton = "<button class='noShowButton'>No show</button>";

  restaurantWaitlist.on('value', function(snapshot) {
    var tableWaitlistObj=snapshot.val();

    waitlistUIDs = Object.keys(tableWaitlistObj);

    var guestCount=-1;
    for (var key in tableWaitlistObj) {
      guestCount++;
      console.log(tableWaitlistObj[key]);
      document.getElementById("PeopleDetails").innerHTML+= "<li id=guest-" + waitlistUIDs[guestCount] + ">"+tableWaitlistObj[key].name + " --- " +tableWaitlistObj[key].tel + " --- Guests:" + tableWaitlistObj[key].guests + tableReadyButton+seatedButton + noShowButton + "</li>";
    }
    tableReadyClickListener();
    removeTableClickListener();
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

var tableReadyClickHandler = function(i) {
  return function() {
    console.log("table ready button clicked");
      document.getElementsByClassName("tableReadyButton")[i].style.display = "none";
      document.getElementsByClassName("seatedButton")[i].style.display="inline";
      document.getElementsByClassName("noShowButton")[i].style.display="inline";
    }
  };

  var removeTableClickListener = function (){
    var seatedButtonArray = document.getElementsByClassName("seatedButton"),
      i;

    var noShowButtonArray = document.getElementsByClassName("noShowButton"),
      i;

    for (i = 0; i < seatedButtonArray.length; i++) {
      seatedButtonArray[i].addEventListener("click", removeTableClickHandler(i));

      for (i = 0; i < noShowButtonArray.length; i++) {
        noShowButtonArray[i].addEventListener("click", removeTableClickHandler(i));
      }
    }
  };

var removeTableClickHandler = function(i) {
    return function() {
      console.log("seated or no show clicked");
      var guestDetails =new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+"table2/" + waitlistUIDs[i]);
      console.log("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+"table2/" + waitlistUIDs[i]);
      guestDetails.remove(onComplete);
    }
  }


  var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
  } else {
    console.log('Synchronization succeeded');
    loadPeopleWaiting(tableSize);
  }
};
