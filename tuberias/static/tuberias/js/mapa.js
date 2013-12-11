$(document).ready(function(){

var options = {
	zoom: 17
	, center: new google.maps.LatLng(-16.39880241990732, -71.53690756007563)
	, mapTypeId: google.maps.MapTypeId.ROADMAP
	, draggableCursor: 'default'
	, draggingCursor: 'default'
};

var map = new google.maps.Map(document.getElementById('mapa'), options);


$("#nuevo_tubo").click(function (){
	console.log("holaaaaaaaaaaaaaaaaaaaaa");

	var routes = new google.maps.MVCArray();

	var polyline = new google.maps.Polyline({
		path: routes
		, map: map
		, strokeColor: '#ff0000'
		, strokeWeight: 3
		, strokeOpacity: 0.4
		, clickable: false
	});

	var listener = google.maps.event.addListener(map, 'click', function(e){
		var path = polyline.getPath();
		path.push(e.latLng);
		if( path.getLength() == 2 ){
			str = "";
			path.forEach(function(item){
				str += item;
			});
			alert(str);
			google.maps.event.removeListener(listener);
		}
	});

});

});