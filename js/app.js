//On DOM ready query API for most recent 2014 movies

(function() {
	var source = document.getElementById("index").innerHTML;
	var template = Handlebars.compile(source);
	var html = template();

	document.getElementById("container").innerHTML = html;

	var xmlhttp;

	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var httpresponse = JSON.parse(xmlhttp.responseText);

			if (httpresponse.Response == "False") {
				console.log(httpresponse.Error);
			} else {
				console.log(httpresponse);
			}
		}
	}

	xmlhttp.open(
		"GET",
		"http://www.omdbapi.com/?y=2012&s=iron",
		true
	);

	xmlhttp.send();
})();

//Application routing

window.addEventListener("hashchange", function() {
	console.log(location.hash);
});