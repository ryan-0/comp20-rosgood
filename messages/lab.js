
request = new XMLHttpRequest();
request.open("GET", "data.json", true);
request.onreadystatechange = parse;
	

function parse () {
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