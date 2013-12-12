
// global
var unselected_color = '#ff0000';
var selected_color = '#4E65ED';

var selected;

// functions 

function crear_tubo(){
	
	var routes = new google.maps.MVCArray();

	var polyline = new google.maps.Polyline({
		path: routes
		, map: map
		, strokeColor: '#ff0000'
		, strokeWeight: 3
		, strokeOpacity: 0.4
		, clickable: true
	});

	var select_click = google.maps.event.addListener(polyline, 'click', function(c){
		select_tubo(polyline);
	});

	return polyline;
}

function select_tubo(polyline){
	if(selected){
		selected.set('strokeColor', unselected_color);
		selected.setDraggable(false);
		selected.setEditable(false);
		google.maps.event.removeListener(edit_listener);
	}
	selected = polyline;
	selected.set('strokeColor', selected_color);
	selected.setDraggable(true);
	selected.setEditable(true);
	var edit_listener = google.maps.event.addListener(selected, 'mouseover', function(){
		var path = selected.getPath();
		if( path.getLength() == 3 )
			if( confirm("Desea dividir el tubo en 2?") ){
				ultimo = selected.getPath().pop();
				medio = selected.getPath().pop();
				n = crear_tubo();
				selected.getPath().push(medio);
				n.getPath().push(medio);
				n.getPath().push(ultimo);
			}
			else{
				ultimo = selected.getPath().pop();
				medio = selected.getPath().pop();
				selected.getPath().push(ultimo);
			}
			
	});
}



function draw_tubo(){
	var polyline = crear_tubo();

	var listener_click = google.maps.event.addListener(map, 'click', function(e){
		select_tubo(polyline);
		var path = polyline.getPath();
		path.push(e.latLng);
		path.push(e.latLng);	

		var listener_move = google.maps.event.addListener(map, 'mousemove', function(m){
			var path = polyline.getPath();
			path.pop();
			path.push(m.latLng);
		});

		var listener_click2 = google.maps.event.addListener(polyline, 'click', function(c){
			str = "";
			path.forEach(function(item){
				str += item;
			});
			alert(str);
			google.maps.event.removeListener(listener_click2);
			google.maps.event.removeListener(listener_move);
			google.maps.event.removeListener(listener_click);
		});

	});
}



// document ready

$(document).ready(function(){

var options = {
	zoom: 17
	, center: new google.maps.LatLng(-16.39880241990732, -71.53690756007563)
	, mapTypeId: google.maps.MapTypeId.ROADMAP
	, draggableCursor: 'default'
	, draggingCursor: 'default'
};


map = new google.maps.Map(document.getElementById('mapa'), options);

$("#nuevo_tubo").click(draw_tubo);



});
