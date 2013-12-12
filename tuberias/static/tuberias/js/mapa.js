
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

function point_tostr(tubo){
	var str = "";
	tubo.getPath().forEach(function(item){
		str += item;
	});
	return str;
}

function point_towkt(point){
	str = "POINT(" + point.lat() + " " + point.lng()+")";
	return str;
}

function guardar_tubo(id,tubo){
	p1 = point_towkt(tubo.getPath().getAt(0));
	p2 = point_towkt(tubo.getPath().getAt(1));
	var remote = $.ajax({
	    type: "GET",
	    url: "guardar_tubo/?"+"id="+id+"&p1="+p1+"&p2="+p2,
	    async: false
	}).responseText;
	var json = $.parseJSON(remote);
	console.log("guardado id: "+json.id);
	return json.id;
}

function select_tubo(id,polyline){
	console.log("selected id: "+id);
	if( id )
		$("#eliminar_tubo").removeAttr('disabled');
	if(selected){
		if( selected == polyline ){
			selected_id = id;
			return;
		}
		selected.set('strokeColor', unselected_color);
		selected.setEditable(false);		
	}
	selected = polyline;
	selected_id = id;
	selected.set('strokeColor', selected_color);
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
		var path = tubo.getPath();
		if( confirm("Dividir en 2 tubos?") ){
			hide_tubo(tubo);
			var tubo1 = crear_tubo();
			var tubo2 = crear_tubo();
			tubo1.getPath().push(path.getAt(0));
			tubo1.getPath().push(path.getAt(1));
			tubo2.getPath().push(path.getAt(1));
			tubo2.getPath().push(path.getAt(2));
			guardar_tubo(id,tubo1); 
			nid = guardar_tubo(0,tubo2);
			make_selectable(id,tubo1);
			make_editable(id,tubo1);
			make_selectable(nid,tubo2);
			make_editable(nid,tubo2);
			select_tubo(id, tubo1);
		}
		else{
			hide_tubo(tubo);
			var tubo1 = crear_tubo();
			tubo1.getPath().push(path.getAt(0));
			tubo1.getPath().push(path.getAt(2));
			guardar_tubo(id,tubo1); 
			make_selectable(id,tubo1);
			make_editable(id,tubo1);
			select_tubo(id, tubo1);
		}
	});
}

function draw_tubo(){
	$("#nuevo_tubo").attr('disabled', true);
	$("#eliminar_tubo").attr('disabled', true);
	var polyline = crear_tubo();

	var listener_click = google.maps.event.addListener(map, 'click', function(e){
		select_tubo(0,polyline);
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
			make_selectable(nid,polyline);
			make_editable(nid,polyline);
			select_tubo(nid,polyline);
			$("#nuevo_tubo").removeAttr('disabled');
		});

	});
}

function hide_tubo(tubo){
	tubo.setVisible(false);
}



function eliminar_tubo(){
	if(selected){
		if(selected.getVisible() ){
			if( confirm("Seguro que quiere eliminar el tubo seleccionado?") ){
				$.ajax({
				    type: "GET",
				    url: "eliminar_tubo/?"+"id="+selected_id,
				    async: false
				})
				hide_tubo(selected);
				console.log("eliminado id: "+selected_id);
				selected = null;
				selected_id = null;
				$("#eliminar_tubo").attr('disabled', true);
				
			}
		}
	}
}

function draw_pre_tubo(id, linestring){
	polyline = crear_tubo();
	$.each(linestring.coordinates, function(i, val){
		var pnt = new google.maps.LatLng(val[0], val[1], false);
		polyline.getPath().push(pnt);
	});
	make_selectable(id, polyline);
	make_editable(id, polyline);
}

function cargar_tubos(){
	$.getJSON("mapa/", "", function(json){
		$.each(json.tubos, function(i, val){
			draw_pre_tubo(val.id,val.tubo);
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
$("#eliminar_tubo").click(eliminar_tubo);
$("#eliminar_tubo").attr('disabled', true);

cargar_tubos();

});
