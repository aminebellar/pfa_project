from rest_framework import generics, filters, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from django.conf import settings
from django.db import transaction
from django.shortcuts import render
import logging

from .models import Airline, Flight, Reservation, PasswordResetRequest, ContactMessage
from .serializers import AirlineSerializer, FlightSerializer, ReservationSerializer, UserSerializer, ContactMessageSerializer

logger = logging.getLogger(__name__)

# Home view
def home(request):
    return render(request, 'home.html')

# List all airlines
class AirlineList(generics.ListAPIView):
    queryset = Airline.objects.all()
    serializer_class = AirlineSerializer

# Airline detail view
class AirlineDetailView(APIView):
    def get(self, request, id):
        try:
            airline = Airline.objects.get(id=id)
            serializer = AirlineSerializer(airline)
            return Response(serializer.data)
        except Airline.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

# List and filter flights
class FlightList(generics.ListAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['airline', 'departure_time']
    search_fields = ['departure_city', 'arrival_city']
    ordering_fields = ['price']

# Flight detail
class FlightDetail(generics.RetrieveAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer

# Flight seats view
class FlightSeatView(APIView):
    def get(self, request, flight_id):
        try:
            flight = Flight.objects.get(id=flight_id)
            reserved = flight.reserved_seat_ids.keys()
            available = flight.total_seats - len(reserved)
            return Response({"available_seats": available, "reserved_seats": list(reserved)})
        except Flight.DoesNotExist:
            return Response({"error": "Flight not found"}, status=404)

    def patch(self, request, flight_id):
        try:
            flight = Flight.objects.get(id=flight_id)
            requested = request.data.get("reserved_seats", [])
            for seat in requested:
                if seat in flight.reserved_seat_ids:
                    return Response({"error": f"Seat {seat} already reserved"}, status=400)
            if len(requested) > (flight.total_seats - len(flight.reserved_seat_ids)):
                return Response({"error": "Not enough seats"}, status=400)
            flight.reserved_seat_ids.update({seat: True for seat in requested})
            flight.save()
            return Response({"message": "Seats reserved", "reserved_seats": list(flight.reserved_seat_ids.keys())})
        except Flight.DoesNotExist:
            return Response({"error": "Flight not found"}, status=404)

# Reserve seats dynamically
@api_view(['POST'])
@permission_classes([AllowAny])
def reserve_seats(request, flight_id):
    seats_to_reserve = request.data.get('seats', 1)
    if not isinstance(seats_to_reserve, int) or seats_to_reserve <= 0:
        return Response({"error": "Invalid seat count"}, status=400)
    with transaction.atomic():
        try:
            flight = Flight.objects.select_for_update().get(id=flight_id)
        except Flight.DoesNotExist:
            return Response({"error": "Flight not found"}, status=404)
        available = flight.total_seats - len(flight.reserved_seat_ids)
        if seats_to_reserve > available:
            return Response({"error": "Not enough seats"}, status=400)
        new_seats = [f"Seat{len(flight.reserved_seat_ids) + i + 1}" for i in range(seats_to_reserve)]
        flight.reserved_seat_ids.update({seat: True for seat in new_seats})
        flight.save()
    return Response({"message": "Reservation successful", "reserved_seats": new_seats})

# Create reservation
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    user = request.user
    flight_id = request.data.get('flight')
    seats = request.data.get('seats', [])
    if not flight_id or not seats:
        return Response({'error': 'Flight and seats required'}, status=400)
    try:
        with transaction.atomic():
            flight = Flight.objects.select_for_update().get(id=flight_id)
            # Vérifie que les sièges ne sont pas déjà réservés
            reserved = set(flight.reserved_seat_ids.keys())
            requested = set(seats)
            if reserved & requested:
                return Response({'error': 'Some seats already reserved'}, status=400)
            # Réserve les sièges
            flight.reserved_seat_ids.update({seat: True for seat in seats})
            flight.save()
            # Crée la réservation
            reservation = Reservation.objects.create(user=user, flight=flight, seats=seats)
            serializer = ReservationSerializer(reservation)
            return Response(serializer.data, status=201)
    except Flight.DoesNotExist:
        return Response({'error': 'Flight not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# User registration
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({'error': e.messages}, status=400)
        user = User.objects.create_user(username=username, password=password, email=email)
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        return Response({'user': user_data, 'refresh': str(refresh), 'access': str(refresh.access_token)}, status=201)

# Login with JWT
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                # Ajoute d'autres champs si besoin
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })
    return Response({'error': 'Invalid credentials'}, status=401)

# Password reset via email
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get('email')
    if email:
        try:
            send_mail("Password Reset", "Password reset request.", settings.DEFAULT_FROM_EMAIL, [email])
            return Response({"message": f"Password reset email sent to {email}"})
        except Exception as e:
            logger.error(f"Email error: {str(e)}")
            return Response({"error": str(e)}, status=500)
    return Response({"error": "Email required"}, status=400)

# Store reset request
@api_view(['POST'])
@permission_classes([AllowAny])
def simple_reset_password(request):
    email = request.data.get('email')
    username = request.data.get('username', '')
    message = request.data.get('message', '')
    if not email:
        return Response({'error': 'Email required'}, status=400)
    try:
        PasswordResetRequest.objects.create(email=email, username=username, message=message)
        send_mail(f"Reset request from {username}", message, settings.DEFAULT_FROM_EMAIL, [settings.DEFAULT_FROM_EMAIL])
        return Response({'success': 'Request recorded. Admin will contact you.'})
    except Exception as e:
        logger.error(f"Reset request error: {str(e)}")
        return Response({'error': str(e)}, status=500)

# Contact message
class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": "Message sent"}, status=201)
        return Response(serializer.errors, status=400)

# ViewSet for Flight
class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    http_method_names = ['get', 'post', 'put', 'patch']

    @action(methods=['patch'], detail=True)
    def update_seats(self, request, pk=None):
        flight = self.get_object()
        seats = request.data.get('seats')
        if seats is not None:
            flight.seats = seats
            flight.save()
            return Response({'status': 'Seats updated'})
        return Response({'error': 'Missing seats data'}, status=400)

# Dummy payment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_payment(request):
    return Response({"message": "Payment successful!"})

# Get current user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    return Response(UserSerializer(request.user).data)
