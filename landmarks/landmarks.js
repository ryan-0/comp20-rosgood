var MyLatitude = 0;
var MyLongitude = 0;
if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			MyLatitude = coords.latitude;
			MyLongitude = coords.longitude;
			});
		console.log("after if")
	}else{
		//do someting
	}
console.log("after loc")
console.log(MyLatitude)
var request = new XMLHttpRequest
var my_info = "login=AMOS_HORN&lat="+MyLatitude+"&lng="+MyLongitude;
request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);

//Send the proper header information along with the request
request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

request.send(my_info); 

var map;
var my_location = new google.maps.LatLng(MyLatitude, MyLongitude);
var marker;
var infowindow = new google.maps.InfoWindow();
var map_options = {
						zoom: 13, // The larger the zoom number, the bigger the zoom
						center: my_location,
						mapTypeId: google.maps.MapTypeId.ROADMAP

					};
StartMap();

function StartMap(){
		console.log("in the function")
		map = new google.maps.Map(document.getElementById("landmark_map"), map_options);
		DisplayMap();
}
function RetrieveMyLocation() {
	
}
function DisplayMap(){
	my_location = new google.maps.LatLng(MyLatitude,MyLongitude);
				
				// Update map and go there..
	map.panTo(my_location);

	// Create a marker
	marker = new google.maps.Marker({
							position: my_location,
							title: "You Found me!"
							});
	marker.setMap(map);

				// Open info window on click of marke
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});
	OtherMarkers();
}

function OtherMarkers () {	
		
	if (request.readyState == 4 && request.status == 200) {
		marker_data = JSON.parse(request.responseText);
		console.log(marker_data)
		for (var i = 0; i < marker_data.people.length; i++) {
			locations = new google.maps.LatLng(marker_data.people[i].lat,marker_data.people[i].lng);
			marker = new google.maps.Marker({
							position: locations,
							title: marker_data.people[i].login
							});
			marker.setMap(map);
			//TODO: set the image
		}	
	}
	else if (request.readyState == 4 && request.status != 200) {
	}
};





