from django.urls import path
from . import views

urlpatterns = [
    path('', views.gerenciamento, name="gerenciamento"),
    path('adicionar', views.adicionar, name="adicionar"),
    path('editar', views.editar, name="editar"),
    path('excluir/<int:id>/', views.excluir, name="excluir"),
    path('atualizar/<int:id>/', views.atualizar, name="atualizar"),
    path('download', views.download, name="download")
]
