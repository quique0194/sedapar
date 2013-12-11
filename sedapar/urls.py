from django.conf.urls import patterns, include, url
from django.contrib.gis import admin
from django.views.generic import TemplateView

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'sedapar.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
    url(r'^tuberias/', include('tuberias.urls', namespace="tuberias")),
    url(r'^admin/', include(admin.site.urls)),
)