
	request = new XMLHttpRequest();
// Step 1: Make request
	request.open("GET", "data.json", true);
// Step 2: Handle the response	
	request.onreadystatechange = parse;
// Step 3: Fire off the request
	

function parse () {
	// Step 4: Data is ready --there is a response!
			elem = document.getElementById("messages");
			if (request.readyState == 4 && request.status == 200) {
				text_message = JSON.parse(request.responseText);
				elem.innerHTML = "<h3>" + text_message[0]["content"]+"</h3><p> -"+ text_message[0]["username"]+"</p>"+ "<h3>" + text_message[1]["content"]+"</h3><p> -"+ text_message[1]["username"]+"</p>";
			}
			else if (request.readyState == 4 && request.status != 200) {
				// think 404 or 500
				elem.innerHTML = "<p>Whoops, this means I'm going to fail this lab!</p>";
			}
		};

request.send(null); // null means no data nec to send