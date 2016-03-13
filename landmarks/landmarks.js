
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
	// Create and place marker
	marker = new google.maps.Marker({
							position: my_location,
							title: "You Found me!",
							icon: my_icon, 
							map: map,
							content: "That's Me!"
							});
	//create an infowindow
	var infowindow = new google.maps.InfoWindow();
	marker.addListener('click', function(){
		infowindow.setContent(this.content)
		infowindow.open(map, this)
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
		var infowindow = new google.maps.InfoWindow();
		for (var i = 0; i < marker_data.people.length; i++) {
			console.log (" people latitude: " + marker_data.people[i].lat + " people longitude: " + marker_data.people[i].lng)
			if (marker_data.people[i].lat != MyLatitude && marker_data.people[i].lng != MyLongitude) {
				locations = new google.maps.LatLng(marker_data.people[i].lat,marker_data.people[i].lng);
				marker = new google.maps.Marker({
							position: locations,
							title: marker_data.people[i].login,
							icon: student_icon,
							map: map,
							content:marker_data.people[i].login + " <br>Miles away: " + Math.round(Haversine(MyLatitude, MyLongitude, marker_data.people[i].lat,marker_data.people[i].lng) * 100) / 100
							});
				marker.addListener('click', function() {
					infowindow.setContent(this.content);
    				infowindow.open(map, this);
  					});

			}	
		}
		for (var i = 0; i < marker_data.landmarks.length; i++) {
			locations = new google.maps.LatLng(marker_data.landmarks[i].geometry.coordinates[1],marker_data.landmarks[i].geometry.coordinates[0]);
			marker = new google.maps.Marker({
							position: locations,
							title: marker_data.landmarks[i].properties.Location_Name,
							icon: monument_icon,
							map: map,
							content: marker_data.landmarks[i].properties.Details
							});
			marker.addListener('click', function() {
					infowindow.setContent(this.content);	
    				infowindow.open(map, this);
  					});
		}
	}
	else if (request.readyState == 4 && request.status != 200) {
	}
};

//  the haversine function and helper function has been taking from stackoverflow at the following url:
//  http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}
function Haversine (lat1,lon1,lat2,lon2) {
	var lat2 = lat2; 
	var lon2 = lon2; 
	var lat1 = lat1; 
	var lon1 = lon1; 

	var R = 6371; // km 
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
	              	 Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
	                Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	d /= 1.60934 // I added this to convert to Miles as the formula works for kilometers.
	return d;
}





