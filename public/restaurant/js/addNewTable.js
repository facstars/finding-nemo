
document.getElementById('modalForm').addEventListener('submit', function(e){
  e.preventDefault();
  validation(modalForm, modalFormHandler);
});

function validation(modalForm,callback){
  var pattern = /^\d{11,16}$/;
  if(modalForm.name.value===""||modalForm.tel.value===""||modalForm.guests.value===""){
    document.getElementById('validation').innerHTML="You must fill in all * fields to proceed";
  } else if(!modalForm.tel.value.match(pattern)){
    document.getElementById('validation').innerHTML="Please enter a valid mobile number";
  } else {
    callback(modalForm);
  }
}

function modalFormHandler(modalForm){
  $('#modal').modal('hide');
  var tempUser = new Firebase ("https://blistering-torch-1660.firebaseio.com");
  var tempUserDetails = ["name", "tel", "guests"];
  var tempUserDetailsObj = tempUserDetails.reduce(function(obj, detail){
    obj[detail] = modalForm[detail].value;
    return obj;
  }, {});
  tempUser.authAnonymously(function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      tempUserDetailsObj["uid"] = authData.uid;
      console.log("Authenticated successfully with payload:", authData.uid);
      addTempUserToWaitlist(authData, tempUserDetailsObj);
    }
  });
}



var addTempUserToWaitlist = function(authData, tempUserDetailsObj){
  var tempUid = authData.uid;
  var tableNo = tempUserDetailsObj.guests > 4 ? "5" : tempUserDetailsObj.guests > 2 ? "4" : "2";
  var restaurantWaitlist = new Firebase("https://blistering-torch-1660.firebaseio.com/restaurants/"+ruid+"/waitlist/table"+tableNo);
  console.log(tempUserDetailsObj);
  restaurantWaitlist.push(tempUserDetailsObj, function(error) {
    if (error) {
      console.log('Synchronization failed');
    } else {
      console.log('Synchronization succeeded');
      $('#modalForm')[0].reset();
    }
  });
};
