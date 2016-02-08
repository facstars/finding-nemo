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
    printTitle(tableWaitlistObj);
    tableWaitlistObj === null? emptyWaitlist() : generateWaitlistHtml(tableWaitlistObj);
  }, errorHandler);
}

function printTitle(tableWaitlistObj){
  if(tableWaitlistObj){
    var queueLength =Object.keys(tableWaitlistObj).length;
    var tableSizeNum = tableSize[5];
    document.getElementById('specificTableTitle').innerHTML=  queueLength +" tables of " + tableSizeNum;
  }
}

var emptyWaitlist = function(){
  var html = "<h3>Waitlist is empty </h3>";
  document.getElementById('peopleDetails').innerHTML = html;
};

var generateWaitlistHtml = function(tableWaitlistObj){
  var waitlistHtml = Object.keys(tableWaitlistObj).reduce(function(html, tID){
    var tableReadyButton, seatedButton, noShowButton;
    if (tableWaitlistObj[tID].tableReadyNotificationSent === true) {
      tableReadyButton = "";
      cannotSeatButton="";
      seatedButton = "<button id = SE" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " style='display:inline' class='seatedButton btn btn-danger btn-lg'>Seated</button>";
      noShowButton = "<button id = NS" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " style='display:inline' class='noShowButton btn btn-danger btn-lg'>No show</button>";
    } else{
      tableReadyButton = "<button id = TR" + tID +  " value=" + tID + " data-value =" + tableWaitlistObj[tID].tel + " style='display:inline' class='tableReadyButton btn btn-danger btn-lg'>Table ready</button>";
      cannotSeatButton = "<button id = CS" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " data-value =" + tableWaitlistObj[tID].tel + " style='display:inline' class='cannotSeatButton btn btn-danger btn-lg'>Cannot seat</button>";
      seatedButton = "<button id = SE" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " style='display:none' class='seatedButton btn btn-danger btn-lg'>Seated</button>";
      noShowButton = "<button id = NS" + tID +  " value=" + tID + " data-uid =" + tableWaitlistObj[tID].uid + " style='display:none' class='noShowButton btn btn-danger btn-lg'>No show</button>";
    }
    return html += "<li class='personDetails' id=guest-" + tID + "> <div class='personName'>" + tableWaitlistObj[tID].name + "</div><div class='personTel'>" + tableWaitlistObj[tID].tel + "</div><div class='personGuests'>Guests:" + tableWaitlistObj[tID].guests + "</div>" +"<br class='gap'>"+ tableReadyButton + cannotSeatButton+ seatedButton + noShowButton + "</li>";
  }, "");
  document.getElementById("peopleDetails").innerHTML = waitlistHtml;
  tableReadyClickListener();
  cannotSeatClickListener();
  removeTableClickListener();
};


var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};


var tableReadyClickListener = function (){
  var tableReadyButtonArray = document.getElementsByClassName("tableReadyButton");
    [].map.call(tableReadyButtonArray, function(button){
    button.addEventListener("click", smsClickHander);
    });
};

var smsClickHander = function(event) {
  document.getElementById("TR"+ event.target.value).style.display="none";
  document.getElementById("CS"+ event.target.value).style.display="none";
  var tel = {
    tel: event.target.getAttribute("data-value"),
    type: event.target.innerHTML
  };
  console.log(event.target.innerHTML + " button clicked");
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var updateWaitlistUser = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+tableSize+"/"+event.target.value);
      updateWaitlistUser.update({
        tableReadyNotificationSent: true
      });
      var reply = request.responseText;
      reply.indexOf("SMS sent") > -1 ? smsSuccess(event, reply) : smsFailure();
    }
  };
  request.open("POST", "/sms");
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(tel));
};


var cannotSeatClickListener = function (){
  var cannotSeatButtonArray = document.getElementsByClassName("cannotSeatButton");
    [].map.call(cannotSeatButtonArray, function(button){
    button.addEventListener("click", smsClickHander);
    });
};

var smsSuccess = function(event, reply){
  reply.indexOf("Cannot seat") > -1 ? removeUserHandler(event, reply) : updateUser(event, reply);
};

 function updateUser(event, reply){
   document.getElementById("SE"+ event.target.value).style.display="inline";
   document.getElementById("NS"+ event.target.value).style.display="inline";
   var updateWaitlistUser = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/"+tableSize+"/"+event.target.value);
   updateWaitlistUser.update({
     tableReadyNotificationSent: true
   });
   console.log(reply + "! :) ");

 }

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
    var Users = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/");
    Users.once('value', function(snapshot){
      (snapshot.child(uid).exists() === true) ? updateUserWaitlistStatusinDb(uid) : console.log("user was temporary");
    });
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


function restSpecificLogout(){
  localStorage.removeItem('RUID');
  window.location.replace('../restaurant/restLogin');
}
