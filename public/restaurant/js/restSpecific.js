var ruid=localStorage.getItem("RUID");
var tableSize;

var getTableSize = (function(){
  var URLSegmentArray = window.location.pathname.split( '/' );
  tableSize = URLSegmentArray[URLSegmentArray.length - 1];
  loadPeopleWaiting(tableSize);
})();


function loadPeopleWaiting(tableSize){
  var restaurantWaitlist= new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+tableSize);
  restaurantWaitlist.on('value', function(snapshot) {
    var tableWaitlistObj=snapshot.val();
    tableWaitlistObj === null? emptyWaitlist() : generateWaitlistHtml(tableWaitlistObj);
  }, errorHandler);
}

var emptyWaitlist = function(){
  var html = "<h3>Waitlist is empty </h3>";
  document.getElementById('peopleDetails').innerHTML = html;
};

var generateWaitlistHtml = function(tableWaitlistObj){
  var waitlistHtml = Object.keys(tableWaitlistObj).reduce(function(html, tID){
    var tableReadyButton, seatedButton, noShowButton;
    if (tableWaitlistObj[tID].alreadySent === true) {
      tableReadyButton = "";
      seatedButton = "<button id = SE" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " style='display:inline' class='seatedButton btn btn-danger btn-lg'>Seated</button>";
      noShowButton = "<button id = NS" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " style='display:inline' class='noShowButton btn btn-danger btn-lg'>No show</button>";
    } else{
      tableReadyButton = "<button id = TR" + tID +  " value=" + tID + " data-value =" + tableWaitlistObj[tID].tel + " style='display:inline' class='tableReadyButton btn btn-danger btn-lg'>Table ready</button>";
      seatedButton = "<button id = SE" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " style='display:none' class='seatedButton btn btn-danger btn-lg'>Seated</button>";
      noShowButton = "<button id = NS" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " style='display:none' class='noShowButton btn btn-danger btn-lg'>No show</button>";
    }
    return html += "<li class='personDetails' id=guest-" + tID + "> <div class='personName'>" + tableWaitlistObj[tID].name + "</div><div class='personTel'>" + tableWaitlistObj[tID].tel + "</div><div class='personGuests'>Guests:" + tableWaitlistObj[tID].guests + "</div>" + tableReadyButton + seatedButton + noShowButton + "</li>";
  }, "");
  document.getElementById("peopleDetails").innerHTML = waitlistHtml;
  tableReadyClickListener(tableWaitlistObj);
  removeTableClickListener();
};


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
      var updateWaitlistUser = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+tableSize+"/"+event.target.value);
      console.log("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+tableSize+"/"+event.target.value);
      updateWaitlistUser.update({
        tableReadyNotificationSent: true
      });
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
  console.log("sms notification successful! :) ");
  document.getElementById("SE"+ event.target.value).style.display="inline";
  document.getElementById("NS"+ event.target.value).style.display="inline";
};

var smsFailure = function(){
  console.log("sms notification failed! :(");
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
    var uid = event.target.getAttribute("data-uid");
    console.log(uid);
    var Users = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/");
    Users.once('value', function(snapshot){
      (snapshot.child(uid).exists() === true) ? updateUserWaitlistStatusinDb(uid) : console.log("user was temporary");
    });
    console.log(event.target.className + " clicked");
  };

  var updateUserWaitlistStatusinDb = function(uid){
    var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
    User.update({
      alreadyOnWaitlist: false,
      queueRuid:"",
      queueTableNo:"",
      queueTid:""
    });
  };

  var onComplete = function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
    }
};
