//Compile input template
var inputSource = document.getElementById("index").innerHTML;
var inputTemplate = Handlebars.compile(inputSource);

//Compile card template
var cardSource = document.getElementById("movie-cards").innerHTML;
var cardTemplate = Handlebars.compile(cardSource);

//On DOM ready show the search form

(function() {
	loadSearch();
})();

function loadSearch() {
	var html = inputTemplate();
	document.getElementById("container").innerHTML = html;
}

//Send search via AJAX and hide input box

document.addEventListener("click", function(event) {
	if (event.target.id == "movie-search-button") {
		//Show loading button
		document.getElementById("movie-search-button").style.display = "none";
		document.getElementById("movie-search-button-disabled").style.display = "inline-block";

		var title = document.getElementById("movie-title").value;
		var year = document.getElementById("movie-year").value;
		
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
					alert("Sorry! Your movie wasn't found!");

					//Hide loading button
					document.getElementById("movie-search-button").style.display = "inline-block";
					document.getElementById("movie-search-button-disabled").style.display = "none";
				} else {
					document.getElementById("search-input-box").className = "hide-left";

					//Request information for all returned movies with a 1 second delay to allow for CSS effect to finish

					setTimeout(function() {
						document.getElementById("container").innerHTML = "";

						for (var i = 0; i < httpresponse.Search.length; i++) {
							var thisCardId = httpresponse.Search[i].imdbID;
							
							addCard(thisCardId, i, httpresponse.Search[0].imdbID);
						}
					}, 1000);
				}
			}
		}

		//Build the ajax query to account for the fact that year cannot be null

		var yearQuery;

		if (year == "Movie Year") {
			yearQuery = "";
		} else {
			yearQuery = "&y=" + year;
		}

		xmlhttp.open(
			"GET",
			"http://www.omdbapi.com/?s=" + encodeURIComponent(title) + yearQuery,
			true
		);

		xmlhttp.send();
	}
});

//Add card to container function

function addCard(imdbID, count, lastId) {
	var xmlhttp;

	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var httpresponse = JSON.parse(xmlhttp.responseText);

			var html = cardTemplate({
				response:httpresponse,
				count:count + 1
			});

			$("#container").append(html);

			//Show each movie card as it's ready

			var currentDiv = document.getElementById(httpresponse.imdbID);
			currentDiv.className = currentDiv.className + " show-top";

			//Hide each movie card as it's dismissed by the user

			document.getElementById("button"+httpresponse.imdbID).addEventListener("click", function() {
				var thisDiv = document.getElementById(httpresponse.imdbID);
				thisDiv.className = thisDiv.className + " hide-top";

				//If button is the last button take us back to the search with a 1 second delay to let the animation complete

				if (httpresponse.imdbID == lastId) {
					setTimeout(function() {
						loadSearch();
					}, 1000);
				}
			});
		}
	}

	xmlhttp.open(
		"GET",
		"http://www.omdbapi.com/?i=" + imdbID,
		false
	);

	xmlhttp.send();
}