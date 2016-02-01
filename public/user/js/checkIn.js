var ruid;
var uid = localStorage.getItem('UID');

var getRUID = (function(){
  var URLSegmentArray = window.location.pathname.split( '/' );
  ruid = URLSegmentArray[URLSegmentArray.length - 1];
  console.log("RUID" , ruid);
  getRestDetailsObj(displayRestDetails);
})();

function getRestDetailsObj(callback){
  var restDetails= new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid);
  restDetails.on("value", function(snapshot){
    var restDetailsObj=snapshot.val();
    callback(restDetailsObj);
  });
}

function displayRestDetails(restDetailsObj){
  var html = "<div class='restDetailWrapper'><img class='restLogo' src=" + restDetailsObj.image +"><p class='restTimes'>"+restDetailsObj.openTime+ " - " +restDetailsObj.closeTime+ "</p><h3 class='restName'>"+restDetailsObj.restName+"</h3><p class='restDescription'>"+restDetailsObj.description+"</p><p class='restAddress'>"+restDetailsObj.address+"</p></div>";
  document.getElementById("restDetails").innerHTML=html;
  restChecker();
}

function restChecker (){
  var ruidQueue=localStorage.getItem('ruidQueue_'+uid);
  var tableNoQueue=localStorage.getItem('tableNoQueue_'+uid);
  if(ruidQueue===ruid){
    document.getElementById('page').style.display = "none";
    document.getElementById('queue').style.display="block";
    loadWaitlist(tableNoQueue, getPositionOnWaitlist);
  } else if(ruidQueue) {
    document.getElementById('page').style.display = "none";
    document.getElementById('anotherQueue').style.display="block";
    console.log("user is in another queue");
  } else {
    document.getElementById('queue').style.display="show";
    document.getElementById('page').style.display = "block";

  }
}

document.getElementById('checkInForm').addEventListener('submit', function(e){
  e.preventDefault();
  var users = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/");
  users.authWithCustomToken($.cookie("firebase_token"), function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
      window.location = "/user/userLogin.html";
    } else {
      console.log("Authentication Succeeded!");
      checkUserIsNotAlreadyOnWaitlist(authData.uid);
    }
  });
});


var checkUserIsNotAlreadyOnWaitlist = function(uid){
  var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
  console.log("https://blistering-torch-1660.firebaseio.com/users/"+uid);
  User.once("value", function(snapshot){
    var userDetailsObj=snapshot.val();
    userDetailsObj.alreadyOnWaitlist === true ? userIsAlreadyOnWaitlist() : createWaitlistObj(userDetailsObj, uid);
  }, errorHandler);
};

var userIsAlreadyOnWaitlist = function(){
  console.log("user already on a waitlist");
};

var createWaitlistObj = function(userDetailsObj, uid){
    console.log(userDetailsObj);
    var userBookingDetailsObj = {
      name:userDetailsObj.name,
      tel: userDetailsObj.tel,
      guests:checkInForm.guests.value,
      "uid":uid
    };
    console.log(userBookingDetailsObj);
    addUserToWaitlist(userBookingDetailsObj, uid);
};


var addUserToWaitlist = function(bookingObj, uid){
  var tableNo = bookingObj.guests > 4 ? "5" : bookingObj.guests > 2 ? "4" : "2";
  var restaurantWaitlist = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
  var UpdatedWaitlist =restaurantWaitlist.push(bookingObj, function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
      var tid = UpdatedWaitlist.key();
      localStorage.setItem('TID_'+uid, tid);
      localStorage.setItem('ruidQueue_'+uid, ruid);
      localStorage.setItem('tableNoQueue_'+uid, tableNo);
      updateUserWaitlistStatusinDb(uid);
      document.getElementById('page').style.display = "none";
      document.getElementById('queue').style.display="block";
      console.log("table", tableNo);
      loadWaitlist(tableNo,getPositionOnWaitlist);
    }
  });
};

var updateUserWaitlistStatusinDb = function(uid){
  var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
  User.update({
    alreadyOnWaitlist: true
  });
};

function loadWaitlist(tableNo,callback){
  var restaurantWaitlist = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
  console.log("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
    restaurantWaitlist.on('value', function(snapshot) {
      var waitlistObj = snapshot.val();
      var tid = localStorage.getItem('TID_'+uid);
      console.log("UID",uid);
      console.log("TID", tid);
      console.log(waitlistObj[tid]);
      var tidsArray = Object.keys(waitlistObj);
      callback(tidsArray,tid, tableNo);
  }, errorHandler);
}

function getPositionOnWaitlist(tidsArray,tid,tableNo){
  var positionOnWaitlist = tidsArray.indexOf(tid);
  console.log(positionOnWaitlist, tid, tableNo);
  if(positionOnWaitlist>0){
    document.getElementById("numPeopleWaitingTable").innerHTML= positionOnWaitlist;
  } else{
    document.getElementById("numPeopleWaitingTable").innerHTML= "<b>Table ready! Please head to the restaurant and enjoy your meal </b>";
    localStorage.removeItem('ruidQueue_'+uid);
    localStorage.removeItem('tableNoQueue_'+uid);
  }
  leaveQueue(uid, tid, tableNo);
}

function leaveQueue(uid, tid, tableNo){
  document.getElementById('leaveQueueBtn').addEventListener('click', function(){
      var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
      User.update({
        alreadyOnWaitlist: false
      });
      var userWaitlistDetails = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo+"/"+tid);
      console.log("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo+"/"+tid);
      userWaitlistDetails.remove(onComplete);
  });
}

var onComplete = function(error) {
  if (error) {
    console.log('Synchronization failed - user not removed from waitlist');
  } else {
    console.log('Successful - User removed from waitlist');
    document.getElementById('queue').style.display='none';
    document.getElementById('page').style.display='block';
    localStorage.removeItem('TID_'+uid);
    localStorage.removeItem('tableNoQueue_'+uid);
    localStorage.removeItem('ruidQueue_'+uid);
  }
};

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};
