from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse
import json
from django.contrib.gis.geos import GEOSGeometry, LineString, Polygon
from tuberias.models import Tubo
from django.contrib.gis.gdal import Envelope

class IndexView(TemplateView):
	template_name = "tuberias/index.html"

def mapa(request):
	if request.method == 'GET':
		GET = request.GET
		min_x = float(GET['min_lat'])
		max_x = float(GET['max_lat'])
		min_y = float(GET['min_lng'])
		max_y = float(GET['max_lng'])
		env = Envelope(min_x, min_y, max_x, max_y)
		p = GEOSGeometry(env.wkt)
		tubos = Tubo.objects.filter(tubo__intersects=p)
		json ="""{ "tubos":["""
		for tubo in tubos:
			json += '{ "id":"'+str(tubo.id)+'" ,"tubo":'+tubo.tubo.json+ '},'
		json = json[:-1]
		json += "]}"
		return HttpResponse(json)


def guardar_tubo(request):
	print "guardar tubo"
	if request.method == 'GET':
		GET = request.GET
		if GET.has_key('id') and GET.has_key('p1') and GET.has_key('p2'):
			id = int(GET['id'])
			p1 = GEOSGeometry(GET['p1'])
			p2 = GEOSGeometry(GET['p2'])
			print "llegue aqui"
			if id == 0:
				tubo = Tubo(radio=1)
				tubo.tubo = LineString(p1, p2)
				tubo.save()
			else:
				tubo = Tubo.objects.get(pk=id)
				tubo.tubo = LineString(p1, p2)
				tubo.save()
			rpta = {'id':tubo.id}
			j = json.dumps(rpta)
			return HttpResponse(j)

def eliminar_tubo(request):
	if request.method == 'GET':
		GET = request.GET
		if GET.has_key('id'):
			id = int(GET['id'])
			tubo = Tubo.objects.get(pk=id)
			tubo.delete()
		return HttpResponse()