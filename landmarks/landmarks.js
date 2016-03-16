
var MyLatitude = 0;
var MyLongitude = 0;
var map;
var request = new XMLHttpRequest


//This function gets my current location and stores in the two MyLatitude and MyLongitude Variables
function GetMyLocation(){
	if (navigator.geolocation) { //this checks that geolocation is supported on the browser.
		navigator.geolocation.getCurrentPosition(function(position) {
			MyLatitude = position.coords.latitude;
			MyLongitude = position.coords.longitude;
			Setup();
			});
	}else{
		alert("Geolocation is not supported on this browser! Sorry!");
	}
}

//This function sends my data to Ming's API and when the JSON is received back, it calls the StartMap function.
function Setup(){
	var my_info = "login=AMOS_HORN&lat="+MyLatitude+"&lng="+MyLongitude;
	request.open("POST", "https://defense-in-derpth.herokuapp.com/sendLocation", true);

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(my_info); 
	request.onreadystatechange = StartMap;
}


//This function configures and create the map and displays it, it then calls the PopulateMap function to show markers
function StartMap(){
	var my_location = new google.maps.LatLng(MyLatitude, MyLongitude);
	
	var map_options = {
						zoom: 15,
						center: my_location,
						mapTypeId: google.maps.MapTypeId.ROADMAP
						};
	map = new google.maps.Map(document.getElementById("landmark_map"), map_options);
	PopulateMap();
}

//the following function puts all the necessary markers on the map at the correct locations and draws the polyline.
function PopulateMap(){
	
	//the following code is used to create the icons for the 3 types of markers (mine, people, landmarks)

	var my_icon = {
    url: "me.png", // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
	};

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

	
	//this creates an object that contains information on the closest landmark.
	var ClosestLandmark = {
			distance: 1, //distance is set to 1 instead of 0 as the furthest distance is going to be max. 1
			lat: 0,
			lon: 0,
			title: ""
		}
				
	if (request.readyState == 4 && request.status == 200) {
		marker_data = JSON.parse(request.responseText);
		
		var infowindow = new google.maps.InfoWindow();

		//this for loop is used to position all the people markers on the map.
		for (var i = 0; i < marker_data.people.length; i++) {
			//this if statement makes sure my location does not have two markers
			if (marker_data.people[i].lat != MyLatitude && marker_data.people[i].lng != MyLongitude) {
				locations = new google.maps.LatLng(marker_data.people[i].lat,marker_data.people[i].lng);
				//create a marker
				marker = new google.maps.Marker({
							position: locations,
							title: marker_data.people[i].login,
							icon: student_icon,
							map: map,
							//I decided to round the distance to 2 decimal places. 
							content:marker_data.people[i].login + " <br>Miles away: " + Math.round(Haversine(MyLatitude, MyLongitude, marker_data.people[i].lat,marker_data.people[i].lng) * 100) / 100
							});
				marker.addListener('click', function() {
					infowindow.setContent(this.content);
    				infowindow.open(map, this);
  					});

			}	
		}
		//this for loop displays all the landmarks in the area and keeps track of the closest one.
		for (var i = 0; i < marker_data.landmarks.length; i++) {
			locations = new google.maps.LatLng(marker_data.landmarks[i].geometry.coordinates[1],marker_data.landmarks[i].geometry.coordinates[0]);
			
			//the following code finds the closest landmark from my location and updates ClosestLandmark
			var TempDistance;
			TempDistance = Haversine(MyLatitude, MyLongitude, marker_data.landmarks[i].geometry.coordinates[1],marker_data.landmarks[i].geometry.coordinates[0]);
			if (TempDistance < ClosestLandmark.distance) {
				ClosestLandmark.distance = TempDistance;
				ClosestLandmark.lat = marker_data.landmarks[i].geometry.coordinates[1]
				ClosestLandmark.lon = marker_data.landmarks[i].geometry.coordinates[0]
				ClosestLandmark.title = marker_data.landmarks[i].properties.Location_Name
			}
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

		// This code creates my marker and displays the relevant information on the infowindow.
		my_location = new google.maps.LatLng(MyLatitude,MyLongitude);
		marker = new google.maps.Marker({
							position: my_location,
							title: "You Found me!",
							icon: my_icon, 
							map: map,
							content: "That's Me!<br>" + "The closest landmark is <b> " + ClosestLandmark.title +"</b><br> and it's <b>"+ Math.round(ClosestLandmark.distance*100)/ 100 + " miles</b> away."
							});
			//create an infowindow
		var infowindow = new google.maps.InfoWindow();
		marker.addListener('click', function(){
			infowindow.setContent(this.content)
			infowindow.open(map, this)
			//this code is used to display the polyline between my location and the closest landmark.
			var ClosestLandmarkPolyline = new google.maps.Polyline({
   		 	path: ClosestLandmarkPath,
    		geodesic: true,
    		strokeColor: '#FF0000',
    		strokeOpacity: 1.0,
   			strokeWeight: 2,
   			map: map
  		});
			});
		//this sets the latitude and longitude of the closest landmark for the polyline.
		var ClosestLandmarkPath = [
    		{lat: MyLatitude, lng: MyLongitude},
    		{lat: ClosestLandmark.lat, lng: ClosestLandmark.lon},
  		];
  		
	}
	else if (request.readyState == 4 && request.status != 200) {
		console.log("I'm Going to Fail this Assignment! Sorry Ming :(")
	}
}

//the following Haversine function and helper are used to calculate distances using geolocation(lat,lon)
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
	d /= 1.60934 // I added this to convert to miles as the formula works for kilometers.
	return d;
}