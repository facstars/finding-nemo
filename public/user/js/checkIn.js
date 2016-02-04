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
  var restTemplate = _.template($("#rest-template").html());
  var rendered = restTemplate({
    image: restDetailsObj.image,
    openTime: restDetailsObj.openTime,
    closeTime: restDetailsObj.closeTime,
    restName: restDetailsObj.restName,
    description: restDetailsObj.description,
    address: restDetailsObj.address,

  });
  var html = rendered;
  document.getElementById("restDetails").innerHTML=html;
  checkUserIsNotAlreadyOnWaitlist();
}

  var checkUserIsNotAlreadyOnWaitlist = function(){
    var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
    console.log("https://blistering-torch-1660.firebaseio.com/users/"+uid);
    User.once("value", function(snapshot){
      var userDetailsObj=snapshot.val();
      var queueTableNo = userDetailsObj.queueTableNo;
      var queueTid=userDetailsObj.queueTid;
      userDetailsObj.queueRuid === ruid ? userIsOnThisWaitlist(queueTableNo, queueTid) : userDetailsObj.alreadyOnWaitlist ===true? userIsInAnotherQueue() : userIsNotInAQueue();
    }, errorHandler);
  };

function userIsOnThisWaitlist(tableNo,tid){
  document.getElementById('page').style.display = "none";
  document.getElementById('anotherQueue').style.display = "none";
  document.getElementById('queue').style.display="block";
  loadWaitlist(tableNo,tid,displayPositionOnWaitlistStatus);
}

function userIsInAnotherQueue(){
    document.getElementById('page').style.display = "none";
    document.getElementById('queue').style.display = "none";
    document.getElementById('anotherQueue').style.display="block";
    console.log("user is in another queue");
  }

function userIsNotInAQueue(){
    document.getElementById('queue').style.display="none";
    document.getElementById('page').style.display = "block";
  }


document.getElementById('checkInForm').addEventListener('submit', function(e){
  e.preventDefault();
      var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
      console.log("https://blistering-torch-1660.firebaseio.com/users/"+uid);
      User.once("value", function(snapshot){
        var userDetailsObj=snapshot.val();
        createWaitlistObj(userDetailsObj, uid);
        }, errorHandler);
});


var userIsAlreadyOnWaitlist = function(){
  console.log("user already on a waitlist");
};


var createWaitlistObj = function(userDetailsObj, uid){
    console.log(userDetailsObj);
    var userBookingDetailsObj = {
      name:userDetailsObj.name,
      tel: userDetailsObj.tel,
      guests:checkInForm.guests.value,
      "uid":uid,
      "tableReadyNotificationSent":false
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
      updateUserWaitlistStatusinDb(uid, tableNo, tid);
      document.getElementById('page').style.display = "none";
      document.getElementById('queue').style.display="block";
      loadWaitlist(tableNo,tid,displayPositionOnWaitlistStatus);
    }
  });
};

var updateUserWaitlistStatusinDb = function(uid, tableNo, tid){
  var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
  User.update({
    alreadyOnWaitlist: true,
    queueRuid: ruid ,
    queueTableNo: tableNo,
    queueTid: tid
  });
};

function loadWaitlist(tableNo,tid,callback){
  var restaurantWaitlist = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
  console.log("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
    restaurantWaitlist.on('value', function(snapshot) {
      var waitlistObj = snapshot.val();
      if (waitlistObj){
        var tidsArray = Object.keys(waitlistObj);
        callback(tidsArray,tid,tableNo);
      } else{
        getRestDetailsObj(displayRestDetails);
      }
    }, errorHandler);
}

function displayPositionOnWaitlistStatus(tidsArray,tid,tableNo){
  var positionOnWaitlist = tidsArray.indexOf(tid);
console.log(positionOnWaitlist);
  if(positionOnWaitlist>=0){
    document.getElementById("numPeopleWaitingTable").innerHTML= "<span class='queue-pos' id='queue-pos-num'>" + (positionOnWaitlist+1)  + "</span>";
  } else if(positionOnWaitlist==-1){
    document.getElementById('queue').style.display="none";
    document.getElementById('page').style.display="block";
  }
  checkIfWaitlistObjExists(tid,tableNo);
  activateLeaveQueueBtnListener(uid, tid, tableNo);
}

function checkIfWaitlistObjExists(tid,tableNo){
  var userWaitlistDetails = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo+"/"+tid);
  userWaitlistDetails.on("value", function(snapshot){
    var waitlistObj=snapshot.val();
    if(waitlistObj){
      notifyUser(waitlistObj);
    }
  });
}

function notifyUser(obj){
  if(obj.tableReadyNotificationSent){
      document.getElementById("numPeopleWaitingTable").innerHTML= "<span class='queue-pos' id='table-ready'><b>Table ready! <br>Please head to the restaurant!</b></span>";
  }
}


function activateLeaveQueueBtnListener(uid, tid, tableNo){
  document.getElementById('leaveQueueBtn').addEventListener('click', function(){
      var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
      User.update({
        alreadyOnWaitlist: false,
        queueRuid:"",
        queueTableNo:"",
        queueTid:""
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
  }
};

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};
