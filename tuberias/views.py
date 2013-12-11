from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse
from django.utils import simplejson


class IndexView(TemplateView):
	template_name = "tuberias/index.html"

def mapa(request):
	if request.method == 'GET':
		GET = request.GET
		if GET.has_key('nro1') and GET.has_key('nro2'):
			nro1 = int(GET['nro1'])
			nro2 = int(GET['nro2'])
			suma = nro1 + nro2
			rpta = {'rpta':suma}
			json = simplejson.dumps(rpta)
			return HttpResponse(json)