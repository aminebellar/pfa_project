from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    AirlineList, FlightList, FlightDetail, FlightViewSet,
    RegisterView, login_view, simple_reset_password,
    create_reservation, ContactMessageView, FlightSeatView, reserve_seats,
    AirlineDetailView, process_payment, home
)
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'flights', FlightViewSet, basename='flight')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),

    path('api/airlines/', AirlineList.as_view(), name='airline-list'),
    path('api/airlines/<int:id>/', AirlineDetailView.as_view(), name='airline-detail'),

    path('api/flights/', FlightList.as_view(), name='flight-list'),
    path('api/flights/<int:pk>/', FlightDetail.as_view(), name='flight-detail'),
    path('api/flights/<int:flight_id>/seats/', FlightSeatView.as_view()),
    path('api/flights/<int:flight_id>/reserve/', reserve_seats),

    path('api/reservations/', create_reservation, name="create_reservation"),
    path('api/reset-password/', simple_reset_password, name='simple-reset-password'),
    path('api/contact/', ContactMessageView.as_view(), name='contact'),
    path('api/payment/', process_payment, name='process_payment'),

    path('', home, name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
