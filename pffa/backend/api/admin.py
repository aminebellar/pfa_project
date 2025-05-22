from django.contrib import admin
from .models import Airline, Flight , Reservation
from .models import PasswordResetRequest
from .models import ContactMessage

admin.site.register(Airline)
admin.site.register(Reservation)
admin.site.register(ContactMessage)

class PasswordResetRequestAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'message', 'requested_at')  # Assure-toi que 'requested_at' est un champ valide
    list_filter = ('requested_at',)  # Optionnel : tu peux filtrer par date
    search_fields = ('username', 'email')  # Optionnel : tu peux ajouter une recherche par 'username' ou 'email'

admin.site.register(PasswordResetRequest, PasswordResetRequestAdmin)

class FlightAdmin(admin.ModelAdmin):
    exclude = ('reserved_seat_ids',)  # <-- cache ce champ

admin.site.register(Flight, FlightAdmin)
