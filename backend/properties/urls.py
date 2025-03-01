from django.urls import path
from .views import PropertyDetailsView

urlpatterns = [
    path('', PropertyDetailsView.as_view(), name='property_view'),
]