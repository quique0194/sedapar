from django.conf.urls import patterns, url

from tuberias import views

urlpatterns = patterns('',
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^mapa/$', views.mapa, name='mapa'),
)