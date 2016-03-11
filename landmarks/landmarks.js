var MyLat = 0;
			var MyLon = 0;
			var request = new XMLHttpRequest();
			var my_location = new google.maps.LatLng(MyLat, MyLon);
			var myOptions = {
						zoom: 13, // The larger the zoom number, the bigger the zoom
						center: my_location,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
			
			var map;
			var marker;
			var infowindow = new google.maps.InfoWindow();
			
			function StartMap()
			{
				map = new google.maps.Map(document.getElementById("landmark_map"), myOptions);
				RetrieveMyLocation();
			}
			
			function RetrieveMyLocation() {
				if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
					navigator.geolocation.getCurrentPosition(function(position) {
						MyLat = position.coords.latitude;
						MyLon = position.coords.longitude;
						DisplayMap();
					});
				}
				else {
					//write message about no geolocation possible
				}
			}
			function DisplayMap()
			{
				my_location = new google.maps.LatLng(MyLat, MyLon);
				
				// Update map and go there...
				map.panTo(my_location);
	
				// Create a marker
				marker = new google.maps.Marker({
					position: my_location,
					title: "You Found me!"
				});
				marker.setMap(map);
					
				// Open info window on click of marker
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(marker.title);
					infowindow.open(map, marker);
				});
			}




