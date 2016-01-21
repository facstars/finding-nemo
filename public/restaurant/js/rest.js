var ruid=localStorage.getItem("RUID");
var ref= new Firebase("https://blistering-torch-1660.firebaseio.com/"+ruid);

var restDetails =(function(){
  ref.on('value', function(snapshot) {
    var restDetailsObj=snapshot.val();
    document.getElementById("ruid").innerHTML=restDetailsObj.restName;
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  })
}) ();
