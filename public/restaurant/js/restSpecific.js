var ruid=localStorage.getItem("RUID");
var tableSize;

var getTableSize = (function(){
  var URLSegmentArray = window.location.pathname.split( '/' );
  tableSize = URLSegmentArray[URLSegmentArray.length - 1];
  // console.log(tableSize);
  loadPeopleWaiting(tableSize) ;
})();


function loadPeopleWaiting(table){
  var restaurantWaitlist= new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+table);
  restaurantWaitlist.on('value', function(snapshot) {
    var tableWaitlistObj=snapshot.val();

    var waitlistHtml = Object.keys(tableWaitlistObj).reduce(function(html, uid){
      var tableReadyButton, seatedButton, noShowButton;

      if (tableWaitlistObj[uid].alreadySent === true) {
        tableReadyButton = "";
        seatedButton = "<button id = SE" + uid +  " value=" + uid + " style='display:inline' class='seatedButton'>Seated</button>";
        noShowButton = "<button id = NS" + uid +  " value=" + uid + " style='display:inline' class='noShowButton'>No show</button>";
      } else{
        tableReadyButton = "<button id = TR" + uid +  " value=" + uid + " style='display:inline' class='tableReadyButton'>Table ready</button>";
        seatedButton = "<button id = SE" + uid +  " value=" + uid + " style='display:none' class='seatedButton'>Seated</button>";
        noShowButton = "<button id = NS" + uid +  " value=" + uid + " style='display:none' class='noShowButton'>No show</button>";
      }
      return html += "<li id=guest-" + uid + ">"+ tableWaitlistObj[uid].name + " --- " +tableWaitlistObj[uid].tel + " --- Guests:" + tableWaitlistObj[uid].guests + tableReadyButton + seatedButton + noShowButton + "</li>";
    }, "");
    document.getElementById("PeopleDetails").innerHTML = waitlistHtml;
    tableReadyClickListener();
    removeTableClickListener();
  }, errorHandler);
}


var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};


var tableReadyClickListener = function (){
  var tableReadyButtonArray = document.getElementsByClassName("tableReadyButton");
    [].map.call(tableReadyButtonArray, function(button){
    button.addEventListener("click", tableReadyClickHandler);
    });
};

var tableReadyClickHandler = function(event) {
  var updateWaitlistUser = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+tableSize+"/"+event.target.value);
  var target = event.currentTarget.style.display = "none";
  updateWaitlistUser.update({
    alreadySent: true
  });
  console.log("table ready button clicked");
  document.getElementById("SE"+ event.target.value).style.display="inline";
  document.getElementById("NS"+ event.target.value).style.display="inline";

  };

  var removeTableClickListener = function (){
    var seatedButtonArray = document.getElementsByClassName("seatedButton");
    var noShowButtonArray = document.getElementsByClassName("noShowButton");

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
    };
  };


  var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
  } else {
    console.log('Synchronization succeeded');
    // loadPeopleWaiting(tableSize);
  }
};
