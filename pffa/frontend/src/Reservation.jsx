import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import "./reservation.css"; // Assurez-vous d'importer le fichier CSS
const Reservation = () => {
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get("flightId");
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passengerName, setPassengerName] = useState("");

  const location = useLocation();

  let selectedSeats = [];
  if (location.state?.seats?.length) {
    selectedSeats = location.state.seats;
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
        .catch((err) => setError("Erreur récupération vol"))
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white animate-gradient">
        <div className="text-center text-lg text-gray-500 animate-pulse">
          Chargement de votre réservation...
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white animate-gradient">
        <div className="text-center text-lg text-red-600 font-medium">
          Aucun vol trouvé pour cette réservation.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-blue-50 to-white animate-gradient">
      <header className="w-full bg-white/80 shadow-lg py-4 px-8 flex justify-between items-center fixed top-0 z-50 backdrop-blur">
        <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2 tracking-tight">
          <span className="inline-block animate-bounce">✈️</span> FlyHigh
        </h1>
        <nav>
          <ul className="flex space-x-8 text-indigo-700 font-semibold text-lg">
            <li>
              <Link to="/" className="hover:text-indigo-500 transition">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-500 transition">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center pt-32 pb-16">
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-white/90 shadow-2xl rounded-3xl border border-indigo-100 p-10">
            <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8 drop-shadow-lg tracking-tight">
              ✈️ Confirmation de Réservation
            </h1>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">
                Bonjour, <span className="text-blue-600">{passengerName}</span> !
              </h2>
              <p className="text-lg text-gray-500">Merci de réserver chez nous.</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl border border-indigo-100 p-6 mb-8">
              <ul className="space-y-2 text-gray-700 text-lg">
                <li>
                  <span className="font-semibold text-indigo-700">Vol :</span> #{flight.id}
                </li>
                <li>
                  <span className="font-semibold text-indigo-700">Départ :</span>{" "}
                  {flight.departure_city} —{" "}
                  <span className="text-blue-700 font-medium">
                    {new Date(flight.departure_time).toLocaleString()}
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-indigo-700">Arrivée :</span>{" "}
                  {flight.arrival_city} —{" "}
                  <span className="text-blue-700 font-medium">
                    {new Date(flight.arrival_time).toLocaleString()}
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-indigo-700">Prix :</span>{" "}
                  <span className="text-blue-700 font-bold">{flight.price} €</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block mb-2 text-gray-600 font-medium">
                  Nombre total de sièges
                </label>
                <div className="w-full border border-gray-300 rounded-md px-4 py-2 text-center font-medium text-blue-600 bg-gray-100">
                  {selectedSeats.length} siège{selectedSeats.length > 1 ? "s" : ""}
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

            {error && (
              <div className="text-red-600 font-medium text-center mb-4">{error}</div>
            )}

            <div className="mt-4 flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={handleReservation}
                className="bg-gradient-to-r from-indigo-500 to-blue-400 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-blue-500 transition"
              >
                Continuer
              </button>

              <Link
                to="/"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-semibold text-lg shadow hover:bg-gray-300 transition text-center"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white py-8 text-center mt-10 shadow-inner">
        <div className="text-lg font-semibold tracking-wide">
          © 2024 FlyHigh - Tous droits réservés
        </div>
        <div className="mt-2 text-sm opacity-80">Design by FlyHigh Team</div>
      </footer>
    </div>
  );
};

export default Reservation;
