from django.urls import path
from . import views

urlpatterns = [
    path('', views.mapa, name="mapa"),
    path('getGeoJSON', views.getgeojson, name="getgeojson"),
    path('posto/<int:id>', views.posto, name="posto"),
    path('publicar', views.publicar, name="publicar"),
    path('coletar', views.coletar, name="coletar"),
    path('getTable/<int:id>', views.gettable, name="gettable")
]
