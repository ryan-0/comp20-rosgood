var x = document.getElementById("demo");

lat,lon = 0;

function getUserLocation() {

	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(){
			lat = position.coords.latitude;
			lon = position.coords.longitude;
		});
	} else{
		// post an error message saying the geolocation is not supported. 
	}

}

var request = new XMLHttpRequest();
var my_info = "login=AMOS_HORN&lat="+lat+"&lng="+lon;
request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);
//Send the proper header information along with the request
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
request.send(my_info);
request.onreadystatechange = PinsToMap;

function PinsToMap () {	
	elem = document.getElementById("messages");
	if (request.readyState == 4 && request.status == 200) {
		text_message = JSON.parse(request.responseText);
		elem.innerHTML = "<h3>" + text_message[0]["content"]+"</h3><p> -"+ text_message[0]["username"]+"</p>"+ "<h3>" + text_message[1]["content"]+"</h3><p> -"+ text_message[1]["username"]+"</p>";
	}
	else if (request.readyState == 4 && request.status != 200) {

		elem.innerHTML = "<p>Whoops, this means I'm going to fail this lab!</p>";
	}
};

request.send(null); 
