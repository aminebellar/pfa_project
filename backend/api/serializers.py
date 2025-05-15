from rest_framework import serializers, viewsets
from .models import Airline, Flight
from .models import Reservation
from django.contrib.auth.models import User
from .models import ContactMessage
from .models import Seat

class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = ['id', 'name', 'logo', 'description', 'country']  # Ajout du champ 'country'


class FlightSerializer(serializers.ModelSerializer):
    airline_name = serializers.CharField(source='airline.name', read_only=True)

    class Meta:
        model = Flight
        fields = ['id', 'airline', 'departure_city', 'arrival_city', 'departure_time', 
                  'arrival_time', 'price', 'created_at', 'updated_at', 'airline_name']

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['id', 'seat_number', 'is_reserved']
        
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def create(self, request, *args, **kwargs):
        # Traitement personnalisé si nécessaire
        return super().create(request, *args, **kwargs)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'