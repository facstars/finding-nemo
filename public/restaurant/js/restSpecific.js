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
        seatedButton = "<button id = SE" + uid +  " value=" + uid + " style='display:inline' class='seatedButton btn btn-danger btn-sm'>Seated</button>";
        noShowButton = "<button id = NS" + uid +  " value=" + uid + " style='display:inline' class='noShowButton btn btn-danger btn-sm'>No show</button>";
      } else{
        tableReadyButton = "<button id = TR" + uid +  " value=" + uid + " data-value =" + tableWaitlistObj[uid].tel + " style='display:inline' class='tableReadyButton btn btn-danger btn-sm'>Table ready</button>";
        seatedButton = "<button id = SE" + uid +  " value=" + uid + " style='display:none' class='seatedButton btn btn-danger btn-sm'>Seated</button>";
        noShowButton = "<button id = NS" + uid +  " value=" + uid + " style='display:none' class='noShowButton btn btn-danger btn-sm'>No show</button>";
      }
      return html += "<li id=guest-" + uid + ">"+ tableWaitlistObj[uid].name + " --- " +tableWaitlistObj[uid].tel + " --- Guests:" + tableWaitlistObj[uid].guests + tableReadyButton + seatedButton + noShowButton + "</li>";
    }, "");
    document.getElementById("PeopleDetails").innerHTML = waitlistHtml;
    tableReadyClickListener(tableWaitlistObj);
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
  var target = event.currentTarget.style.display = "none";
  var tel = {
    tel: event.target.getAttribute("data-value")
  };
  console.log(tel);
  console.log("table ready button clicked");
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var reply = request.responseText;
      reply  === "SMS sent" ? smsSuccess(event) : smsFailure();
    }
  };
  request.open("POST", "/sms");
  request.send(JSON.stringify(tel));
};

var smsSuccess = function(event){
  var updateWaitlistUser = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+tableSize+"/"+event.target.value);
  updateWaitlistUser.update({
    alreadySent: true
  });
  document.getElementById("SE"+ event.target.value).style.display="inline";
  document.getElementById("NS"+ event.target.value).style.display="inline";
};

var smsFailure = function(){
  console.log("sms failed notification! :(");
};

var removeTableClickListener = function (){
  var seatedButtonArray = document.getElementsByClassName("seatedButton");
  var noShowButtonArray = document.getElementsByClassName("noShowButton");
  [].map.call(seatedButtonArray, function(button){
    button.addEventListener("click", removeUserHandler);
  });
  [].map.call(noShowButtonArray, function(button){
    button.addEventListener("click", removeUserHandler);
  });
};

  var removeUserHandler = function(event) {
    var updateWaitlistUser = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+tableSize+"/"+event.target.value);
    updateWaitlistUser.remove(onComplete);
    console.log(event.target.className + " clicked");
  };

  var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed');
  } else {
    console.log('Synchronization succeeded');
  }
};
