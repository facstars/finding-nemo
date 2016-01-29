var uid = localStorage.getItem('UID');
var ruid;


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
    // return restDetailsObj;
  });
}

function displayRestDetails(restDetailsObj){
  var html = "<div class='restDetailWrapper'><img class='restLogo' src=" + restDetailsObj.image +"><p class='restTimes'>"+restDetailsObj.openTime+ " - " +restDetailsObj.closeTime+ "</p><h3 class='restName'>"+restDetailsObj.restName+"</h3><p class='restDescription'>"+restDetailsObj.description+"</p><p class='restAddress'>"+restDetailsObj.address+"</p></div>";
  document.getElementById("restDetails").innerHTML=html;

}


document.getElementById('checkInForm').addEventListener('submit', function(e){
  e.preventDefault();
  var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
  console.log("https://blistering-torch-1660.firebaseio.com/users/"+uid);

  User.on("value", function(snapshot){
    var userDetailsObj=snapshot.val();
    console.log(userDetailsObj);
    var userBookingDetailsObj = {name:userDetailsObj.name, tel: userDetailsObj.tel, guests:checkInForm.guests.value};
    console.log(userBookingDetailsObj);
    addUserToWaitlist(userBookingDetailsObj);
  });
});

var addUserToWaitlist = function(bookingObj){
  var tableNo = bookingObj.guests > 4 ? "5" : bookingObj.guests > 2 ? "4" : "2";
  var restaurantWaitlist = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
  restaurantWaitlist.push(bookingObj, function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
      // $('#checkInForm')[0].reset();
      document.getElementById('page').style.display = "none";
      document.getElementById('queue').style.display="block";
      console.log(tableNo);
      loadWaitlist(tableNo);
    }
  });
};

function loadWaitlist(tableNo){
  var restaurantWaitlist = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
    restaurantWaitlist.on('value', function(snapshot) {
      var waitlistObj = snapshot.val();
      var usersArray = Object.keys(waitlistObj);
      console.log(usersArray.indexOf(uid));

      // THIS IS CURRENTLY 0 BECAUSE WE NEED TO STORE THE UID IN THE USER 
      // FIND WHERE THE USER IS IN THE OBJECT
      // document.getElementById("numPeopleWaitingTable"+tableNo).innerHTML= numOnWaitlist;
  }, errorHandler);
}

var errorHandler = function(errorObject) {
  console.log("The read failed: " + errorObject.code);
};
