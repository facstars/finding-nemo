var uid = localStorage.getItem('UID');

console.log(uid);
var ruid;

var getRUID = (function(){
  var URLSegmentArray = window.location.pathname.split( '/' );
  ruid = URLSegmentArray[URLSegmentArray.length - 1];
  console.log("RUID" , ruid);
})();

document.getElementById('checkInForm').addEventListener('submit', function(e){
  e.preventDefault();
  var User = new Firebase ("https://blistering-torch-1660.firebaseio.com/users/"+uid);
  console.log("https://blistering-torch-1660.firebaseio.com/users/"+uid);

  User.on("value", function(snapshot){
    var userDetailsObj=snapshot.val();
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
      $('#checkInForm')[0].reset();
    }
  });
};
