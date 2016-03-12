
var MyLatitude = 0;
var MyLongitude = 0;
var map;
var request = new XMLHttpRequest

function GetMyLocation(){
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			MyLatitude = position.coords.latitude;
			MyLongitude = position.coords.longitude;
			Setup();
			});
	}else{
		//do someting
	}
}
function Setup(){
	var my_info = "login=AMOS_HORN&lat="+MyLatitude+"&lng="+MyLongitude;
	request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(my_info); 
	request.onreadystatechange = StartMap;
}

function StartMap(){
	var my_location = new google.maps.LatLng(MyLatitude, MyLongitude);
	var marker;
	var infowindow = new google.maps.InfoWindow();
	var map_options = {
						zoom: 13, // The larger the zoom number, the bigger the zoom
						center: my_location,
						mapTypeId: google.maps.MapTypeId.ROADMAP

						};
	map = new google.maps.Map(document.getElementById("landmark_map"), map_options);
	DisplayMap();
}
function DisplayMap(){
	my_location = new google.maps.LatLng(MyLatitude,MyLongitude);
				
				// Update map and go there..
	map.panTo(my_location);

	var my_icon = {
    url: "me.png", // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
	};


	// Create a marker
	marker = new google.maps.Marker({
							position: my_location,
							title: "You Found me!",
							icon: my_icon
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
	var student_icon = {
    url: "student.png", // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
	};
	var monument_icon = {
    url: "monument.png", // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
	};


//console.log (" Landmark latitude: " + marker_data.landmarks[i].geometry.coordinates[1] + " landmark longitude: " + marker_data.landmarks[i].geometry.coordinates[0])

	if (request.readyState == 4 && request.status == 200) {
		marker_data = JSON.parse(request.responseText);
		console.log(marker_data)
		for (var i = 0; i < marker_data.people.length; i++) {
			console.log (" people latitude: " + marker_data.people[i].lat + " people longitude: " + marker_data.people[i].lng)
			locations = new google.maps.LatLng(marker_data.people[i].lat,marker_data.people[i].lng);
			marker = new google.maps.Marker({
							position: locations,
							title: marker_data.people[i].login,
							icon: student_icon,
							map: map
							});
		}

		for (var i = 0; i < marker_data.landmarks.length; i++) {
			locations = new google.maps.LatLng(marker_data.landmarks[i].geometry.coordinates[1],marker_data.landmarks[i].geometry.coordinates[0]);
			marker = new google.maps.Marker({
							position: locations,
							title: marker_data.landmarks[i].properties.Location_Name,
							icon: monument_icon,
							map: map

							});
		}

	}
	else if (request.readyState == 4 && request.status != 200) {
	}
};





