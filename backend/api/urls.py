from django.urls import path , include
from rest_framework.routers import DefaultRouter
from .views import AirlineList, FlightList ,  FlightDetail
from .views import RegisterView, login_view
from . import views
from .views import simple_reset_password
from .views import create_reservation
from .views import FlightViewSet
from django.conf import settings
from django.conf.urls.static import static
from .views import ContactMessageView
from .views import FlightSeatView
from .views import reserve_seats

router = DefaultRouter()
router.register(r'flights', FlightViewSet ,basename='flight')
urlpatterns = [
    # API Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('api/airlines/', AirlineList.as_view(), name='airline-list'),
    path('api/flights/', FlightList.as_view(), name='flight-list'),
    path('api/flights/<int:pk>/', FlightDetail.as_view(), name='flight-detail'), 
    path('api/flights/<int:flight_id>/seats/', FlightSeatView.as_view()),
    path('api/flights/<int:flight_id>/reserve/', reserve_seats),
    path('api/reservation/', views.create_reservation),
    path('api/create_reservation/', create_reservation, name='create_reservation'),
    path('api/reset-password/', simple_reset_password, name='simple-reset-password'),
    path('api/simple-reset-password/', views.simple_reset_password, name='simple_reset_password'),
    path('api/airlines/<int:id>/', views.AirlineDetailView.as_view(), name='airline-detail'),
    path('api/payment/', views.process_payment, name='process_payment'),
    path('', views.home, name='home'),  # Home page route
    path('api/contact/', ContactMessageView.as_view(), name='contact'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)