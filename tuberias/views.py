from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse
from django.utils import simplejson
from django.contrib.gis.geos import GEOSGeometry, LineString
from tuberias.models import Tubo

class IndexView(TemplateView):
	template_name = "tuberias/index.html"

def mapa(request):
	if request.method == 'GET':
		GET = request.GET
		tubos = Tubo.objects.all()
		json ="""{ "tubos":["""
		for tubo in tubos:
			json += '{ "id":"'+str(tubo.id)+'" ,"tubo":'+tubo.tubo.json+ '},'
		json = json[:-1]
		json += "]}"
		print "JSON: "+json
		return HttpResponse(json)


def guardar_tubo(request):
	if request.method == 'GET':
		GET = request.GET
		if GET.has_key('id') and GET.has_key('p1') and GET.has_key('p2'):
			id = int(GET['id'])
			p1 = GEOSGeometry(GET['p1'])
			p2 = GEOSGeometry(GET['p2'])
			if id == 0:
				tubo = Tubo(radio=1)
				tubo.tubo = LineString(p1, p2)
				tubo.save()
			else:
				tubo = Tubo.objects.get(pk=id)
				tubo.tubo = LineString(p1, p2)
				tubo.save()
			rpta = {'id':tubo.id}
			json = simplejson.dumps(rpta)
			return HttpResponse(json)

def eliminar_tubo(request):
	return HttpResponse()