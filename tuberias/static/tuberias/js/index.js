$(document).ready(function(){
	$("#suma").click(function(){
		var data = {nro1:$("#nro1").val(), nro2:$("#nro2").val()};
		$.getJSON("mapa/", data, function(json){
		    $("#rpta").html(json['rpta']);
		  });
	});
});