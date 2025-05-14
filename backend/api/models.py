from django.db import models
from django.contrib.auth.models import User

class Airline(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='airlines/')
    description = models.TextField(null=True, blank=True)  # Description détaillée de la compagnie
    country = models.CharField(max_length=100, null=True, blank=True)  # Pays de la compagnie

    def __str__(self):
        return self.name


class Flight(models.Model):
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE)
    departure_city = models.CharField(max_length=100)
    arrival_city = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_seats = models.IntegerField(default=100)

    # Propriété dynamique pour obtenir le nombre de sièges disponibles
    @property
    def available_seats(self):
        return self.seats.filter(is_reserved=False).count()

    def __str__(self):
        return f"{self.departure_city} to {self.arrival_city}"

    # Méthode pour générer les sièges pour un vol
    def create_seats(self):
        rows = ['A', 'B', 'C', 'D']
        seats_per_row = self.total_seats // len(rows)
        for row in rows:
            for number in range(1, seats_per_row + 1):
                Seat.objects.create(flight=self, seat_number=f"{row}{number}")


class Seat(models.Model):
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name="seats")
    seat_number = models.CharField(max_length=10)  # Ex: A1, A2, B1...
    is_reserved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.seat_number} - {'Réservé' if self.is_reserved else 'Libre'}"


class Reservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reservations")
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name="reservations")
    reserved_at = models.DateTimeField(auto_now_add=True)
    seats = models.ManyToManyField(Seat)

    def __str__(self):
        return f"{self.user.username} - {self.flight} - {self.seats.count()} sièges"


class PasswordResetRequest(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField()
    message = models.TextField()
    requested_at = models.DateTimeField(auto_now_add=True)  # Ce champ enregistre la date de la demande

    def __str__(self):
        return f"Demande de réinitialisation pour {self.username}"


class ContactMessage(models.Model):
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    date_sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.subject}"

