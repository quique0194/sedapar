from django.contrib.gis.db import models


class Tubo(models.Model):

	radio = models.FloatField();
	tubo = models.LineStringField();
	
	# GeoManager
	objects = models.GeoManager()