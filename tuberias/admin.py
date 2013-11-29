from django.contrib.gis import admin
from models import Tubo

admin.site.register(Tubo, admin.OSMGeoAdmin)
admin.OSMGeoAdmin.default_lon = -7963445
admin.OSMGeoAdmin.default_lat = -1850954
admin.OSMGeoAdmin.default_zoom = 17
