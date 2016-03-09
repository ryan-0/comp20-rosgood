
	request = new XMLHttpRequest();
// Step 1: Make request
	request.open("GET", "data.json", true);
// Step 2: Handle the response	
	request.onreadystatechange = message;
// Step 3: Fire off the request
	

function message () {
	// Step 4: Data is ready --there is a response!
			elem = document.getElementById("messages");
			if (request.readyState == 4 && request.status == 200) {
				text_message = JSON.parse(request.responseText)
				
				for (i = 0; i < 3; i++) { 
    				elem.innerHTML = "<p>" + text_message[i]["content"]+"</p>"
				}

			}
			else if (request.readyState == 4 && request.status != 200) {
				// think 404 or 500
				elem.innerHTML = "<p>Whoops, something went terribly wrong!</p>";
			}
		};

request.send(null); // null means no data nec to send