from django.urls import path
from . import views


urlpatterns = [
    path('api/projections/', views.SavingsProjectionView.as_view(), name='savings_projections'),
]
