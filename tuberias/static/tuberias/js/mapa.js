
// global
var unselected_color = '#ff0000';
var selected_color = '#4E65ED';

var selected;
var selected_id;

var id_count = 0;

var map;

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

	return polyline;
}

function guardar_tubo(id,tubo){
	str = "";
	tubo.getPath().forEach(function(item){
		str += item;
	});
	if(id == 0){
		console.log("creando "+str);		
		++id_count;
		console.log("Id: "+id_count);
		return id_count;
	}
	else{
		console.log("actualizando "+str);
		console.log("Id: "+id);
		return id;
	}

	
}

function select_tubo(id,polyline){
	if(selected){
		if( selected == polyline )
			return;
		selected.set('strokeColor', unselected_color);
		selected.setDraggable(false);
		selected.setEditable(false);		
	}
	selected = polyline;
	selected_id = id;
	selected.set('strokeColor', selected_color);
	selected.setDraggable(true);
	selected.setEditable(true); 
}

function make_selectable(id, tubo){
	var select_click = google.maps.event.addListener(tubo, 'click', function(c){
		select_tubo(id,tubo);
	});

	
}

function make_editable(id, tubo){
	var edit_listener = google.maps.event.addListener(tubo.getPath(), 'set_at', function(i, previo){
		guardar_tubo(id,tubo);
	});

	var add_node_listener = google.maps.event.addListener(tubo.getPath(), 'insert_at', function(i){
		if( confirm("Dividir en 2 tubos?") ){
			ntubo = crear_tubo();
			v3 = tubo.getPath().pop();
			v2 = tubo.getPath().pop();
			tubo.getPath().push(v2);
			ntubo.getPath().push(v2);
			ntubo.getPath().push(v3);
		}
	});
}

function draw_tubo(){
	var polyline = crear_tubo();
	make_selectable(0,polyline);
	select_tubo(0,polyline);

	var listener_click = google.maps.event.addListener(map, 'click', function(e){
		var path = polyline.getPath();
		path.push(e.latLng);
		path.push(e.latLng);	

		var listener_move = google.maps.event.addListener(map, 'mousemove', function(m){
			var path = polyline.getPath();
			path.pop();
			path.push(m.latLng);
		});

		var listener_click2 = google.maps.event.addListener(polyline, 'click', function(c){
			google.maps.event.removeListener(listener_click2);
			google.maps.event.removeListener(listener_move);
			google.maps.event.removeListener(listener_click);
			var nid = guardar_tubo(0,polyline);
			make_editable(nid,polyline);
		});

	});
}

function eliminar_tubo(){
	if(selected){
		if(selected.getVisible() ){
			if( confirm("Seguro que quiere eliminar el tubo seleccionado?") ){
				console.log("eliminando tubo id: "+selected_id);
				selected.setVisible(false);
			}
		}
	}
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
$("#eliminar_tubo").click(eliminar_tubo);

});
