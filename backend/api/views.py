from rest_framework import generics, filters
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from .models import Airline, Flight, Reservation, PasswordResetRequest, ContactMessage, Seat
from .serializers import AirlineSerializer, FlightSerializer, ReservationSerializer, UserSerializer, ContactMessageSerializer
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.decorators import action

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

# List flights with filters, search, and ordering
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

# View available and reserved seats
class FlightSeatView(APIView):
    def get(self, request, flight_id):
        try:
            flight = Flight.objects.get(id=flight_id)
            reserved_seats = flight.reserved_seat_ids.keys()
            available_seats = flight.total_seats - len(reserved_seats)
            return Response({
                "available_seats": available_seats,
                "reserved_seats": list(reserved_seats),
            })
        except Flight.DoesNotExist:
            return Response({"error": "Flight not found"}, status=404)

    def patch(self, request, flight_id):
        try:
            flight = Flight.objects.get(id=flight_id)
            requested_seats = request.data.get("reserved_seats", [])

            # Check seat availability
            for seat in requested_seats:
                if seat in flight.reserved_seat_ids:
                    return Response({"error": f"Seat {seat} is already reserved"}, status=400)

            if len(requested_seats) > (flight.total_seats - len(flight.reserved_seat_ids)):
                return Response({"error": "Not enough seats available"}, status=400)

            # Reserve seats
            flight.reserved_seat_ids.update({seat: True for seat in requested_seats})
            flight.save()

            return Response({
                "message": "Seats reserved successfully",
                "reserved_seats": list(flight.reserved_seat_ids.keys())
            })
        except Flight.DoesNotExist:
            return Response({"error": "Flight not found"}, status=404)

# Reserve seats dynamically
@api_view(['POST'])
def reserve_seats(request, flight_id):
    try:
        flight = Flight.objects.select_for_update().get(id=flight_id)
    except Flight.DoesNotExist:
        return Response({"error": "Flight not found"}, status=404)

    seats_to_reserve = request.data.get('seats', 1)
    if not isinstance(seats_to_reserve, int) or seats_to_reserve <= 0:
        return Response({"error": "Invalid seat count"}, status=400)

    with transaction.atomic():
        available = flight.total_seats - len(flight.reserved_seat_ids)
        if seats_to_reserve > available:
            return Response({"error": "Not enough seats available"}, status=400)

        new_seats = [f"Seat{len(flight.reserved_seat_ids) + i + 1}" for i in range(seats_to_reserve)]
        flight.reserved_seat_ids.update({seat: True for seat in new_seats})
        flight.save()

    return Response({"message": "Reservation successful", "reserved_seats": new_seats}, status=200)

# Get flight by ID
@api_view(['GET'])
def get_flight(request, id):
    try:
        flight = Flight.objects.get(id=id)
        serializer = FlightSerializer(flight)
        return Response(serializer.data)
    except Flight.DoesNotExist:
        return Response({"error": "Flight not found"}, status=404)

# Create reservation
@api_view(['POST'])
def create_reservation(request):
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# User registration with validation
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

        return Response({
            'user': user_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=201)

# Login view with JWT
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data
        return Response({
            'user': user_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response({'error': 'Invalid credentials'}, status=401)

# Password reset request (simple email)
@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    if email:
        try:
            send_mail(
                subject="Password Reset Request",
                message="A password reset request has been made for your account.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
            return Response({"message": f"Password reset email sent to {email}"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    return Response({"error": "Email is required"}, status=400)

# Password reset request stored in DB
@api_view(['POST'])
def simple_reset_password(request):
    email = request.data.get('email')
    username = request.data.get('username', '')
    message = request.data.get('message', '')

    if not email:
        return Response({'error': 'Email required'}, status=400)

    try:
        PasswordResetRequest.objects.create(email=email, username=username, message=message)

        subject = f"Password reset request for {username}"
        admin_email = settings.DEFAULT_FROM_EMAIL
        body = f"Password reset request received for user {username}.\n\nMessage: {message}"

        send_mail(subject, body, admin_email, [admin_email])

        return Response({'success': 'Your request has been recorded. Admin will contact you soon.'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Contact form handling
class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": "Message sent"}, status=201)
        return Response(serializer.errors, status=400)

# ViewSet for Flight with seat update
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

# Dummy payment processor
@api_view(['POST'])
def process_payment(request):
    # Example: integrate Stripe, PayPal, etc.
    return Response({"message": "Payment successful!"}, status=200)
