import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get("flightId");
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passengerName, setPassengerName] = useState("");

  // Get location data
  const location = useLocation();
  
  // Handle seats data - ensure it's an array and has values
  let selectedSeats = [];
  if (location.state && location.state.seats) {
    selectedSeats = Array.isArray(location.state.seats) ? 
      location.state.seats : [location.state.seats];
  }

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setPassengerName(user.username);
    }

    if (flightId) {
      axios
        .get(`http://127.0.0.1:8000/api/flights/${flightId}/`)
        .then((res) => setFlight(res.data))
        .catch((err) => console.error("Erreur récupération vol:", err))
        .finally(() => setLoading(false));
    }
  }, [flightId]);

  const handleReservation = () => {
    navigate("/fiche-passagers", {
      state: {
        flight,
        seats: selectedSeats,
      },
    });
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg text-gray-500 animate-pulse">
        Chargement de votre réservation...
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="text-center mt-20 text-lg text-red-600 font-medium">
        Aucun vol trouvé pour cette réservation.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">
        ✈️ Confirmation de Réservation
      </h1>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Bonjour, <span className="text-blue-600">{passengerName}</span> !
        </h2>
        <p className="text-lg text-gray-500">Merci de réserver chez nous.</p>
      </div>

      <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-8 space-y-4">
        <ul className="space-y-1 text-gray-700">
          <li><strong>Vol :</strong> #{flight.id}</li>
          <li><strong>Départ :</strong> {flight.departure_city} — {new Date(flight.departure_time).toLocaleString()}</li>
          <li><strong>Arrivée :</strong> {flight.arrival_city} — {new Date(flight.arrival_time).toLocaleString()}</li>
          <li><strong>Prix :</strong> {flight.price} €</li>
        </ul>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block mb-2 text-gray-600 font-medium">
              Nombre total de sièges
            </label>
            <div className="w-full border border-gray-300 rounded-md px-4 py-2 text-center font-medium text-blue-600 bg-gray-100">
              {selectedSeats.length} sièges
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-gray-600 font-medium">
              Numéros des sièges choisis
            </label>
            <div className="w-full border border-gray-300 rounded-md px-4 py-2 text-center font-semibold text-indigo-700 bg-gray-100">
              {selectedSeats.length > 0 
                ? selectedSeats.join(", ") 
                : "Aucun siège sélectionné"}
            </div>
          </div>
        </div>

        {error && <div className="text-red-600 font-medium">{error}</div>}

        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={handleReservation}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Continuer
          </button>

          <Link
            to="/Home"
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
