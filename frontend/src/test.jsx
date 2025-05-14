import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Flights.css";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // State to hold user info
  const [selectedSeats, setSelectedSeats] = useState([]); // New state for selected seats
  const [showModal, setShowModal] = useState(false); // Modal for login/signup alert
  const navigate = useNavigate();
  const location = useLocation();

  const paramsUrl = new URLSearchParams(location.search);
  const airlineId = paramsUrl.get("airlineId");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null); // Check if the user is logged in

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (date) params.append("departure_time", date); // Date en format ISO
    if (sortOrder) params.append("ordering", sortOrder === "asc" ? "price" : "-price");
    if (airlineId) params.append("airline", airlineId);

    const url = `http://127.0.0.1:8000/api/flights/?${params.toString()}`;
    console.log(url);  // Vérification de la requête envoyée

    axios
      .get(url)
      .then((response) => {
        const updatedFlights = response.data.map((flight) => ({
          ...flight,
          seats: flight.seats !== undefined ? flight.seats : 100, // Nombre total de sièges
          reservedSeats: flight.reservedSeats || [], // Liste des sièges réservés (nouveau champ)
        }));

        // Filtrage des vols déjà passés
        const availableFlights = updatedFlights.filter((flight) => {
          const departureTime = new Date(flight.departure_time).getTime();
          const currentTime = Date.now();
          return departureTime > currentTime; // On garde uniquement les vols dont l'heure de départ est dans le futur
        });

        setFlights(availableFlights);
      })
      .catch((error) => console.error("Erreur lors de la récupération des vols", error));
  }, [search, date, sortOrder, airlineId]);

  const calculateTimeLeft = (departureTime) => {
    const departureDate = new Date(departureTime);
    const currentTime = Date.now();
    const timeDiff = departureDate - currentTime;
    if (timeDiff <= 0) return "Vol passé";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m restant`;
  };

  const handleSeatSelection = (flightId, seatId) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        // Si le siège est déjà sélectionné, on le retire
        return prev.filter((seat) => seat !== seatId);
      } else {
        // Sinon, on l'ajoute à la sélection
        return [...prev, seatId];
      }
    });
  };

  const handleReservation = (flightId) => {
    if (!user) {
      setShowModal(true); // Affiche le modal si l'utilisateur n'est pas connecté
      return;
    }

    setLoading(true);

    // Réduire le nombre de sièges disponibles et ajouter les sièges réservés
    const updatedFlights = flights.map((flight) => {
      if (flight.id === flightId) {
        const updatedReservedSeats = [
          ...flight.reservedSeats,
          ...selectedSeats,
        ];

        return {
          ...flight,
          reservedSeats: updatedReservedSeats,
          seats: flight.seats - selectedSeats.length, // Réduire le nombre de sièges disponibles
        };
      }
      return flight;
    });

    setFlights(updatedFlights);

    // Mettre à jour la réservation des sièges côté back-end
    axios
      .patch(`http://127.0.0.1:8000/api/flights/${flightId}/`, {
        reservedSeats: [...flights.find((flight) => flight.id === flightId).reservedSeats, ...selectedSeats],
        seats: flights.find((flight) => flight.id === flightId).seats - selectedSeats.length,
      })
      .then(() => {
        console.log("Réservation effectuée avec succès");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour des sièges", error);
      })
      .finally(() => setLoading(false));

    // Réinitialiser les sièges sélectionnés après la réservation
    setSelectedSeats([]);

    // Naviguer vers la page Reservation et passer le nombre de sièges sélectionnés
    navigate(`/Reservation?flightId=${flightId}`, {
      state: { seats: selectedSeats.length }, // Passer le nombre de sièges sélectionnés
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-gray-200 text-gray-900 font-sans">
      {/* Header */}
      <header className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center fixed top-0 z-50">
        <h1 className="text-3xl font-bold text-indigo-600">FlyHigh ✈️</h1>
        <nav>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li><Link to="/Home" className="hover:text-indigo-600 transition">Accueil</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-600 transition">Contact</Link></li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow pt-24">
        <section className="w-full px-6 py-14">
          {/* Résultats */}
          <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">✈️ les vols disponibles</h2>

          {flights.length > 0 ? (
            <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {flights.map((flight) => {
                const timeLeft = calculateTimeLeft(flight.departure_time);
                const isAvailable = timeLeft !== "Vol passé";

                return (
                  <li key={flight.id} className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    {/* Titre & Prix */}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-indigo-700">✈️ {flight.airline_name}</h4>
                      <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">{flight.price} €</span>
                    </div>

                    {/* Infos vol */}
                    <div className="flex flex-col space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600 font-medium">{flight.departure_city}</div>
                        <div className="text-xs text-gray-400">{new Date(flight.departure_time).toLocaleString()}</div>
                      </div>

                      <div className="relative w-full h-4 bg-gray-200 rounded-full my-4 overflow-visible">
                        <div className="absolute w-3 h-3 bg-indigo-600 rounded-full left-0 top-1/2 -translate-y-1/2 z-10"></div>
                        <div className="absolute top-[-10px] left-0 text-xl z-20 animate-fly">✈️</div>
                        <div className="absolute w-3 h-3 bg-indigo-600 rounded-full right-0 top-1/2 -translate-y-1/2 z-10"></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">{new Date(flight.arrival_time).toLocaleString()}</div>
                        <div className="text-sm text-gray-600 font-medium">{flight.arrival_city}</div>
                      </div>
                    </div>

                    {/* Nombre de sièges disponibles */}
                    <div className="text-sm text-gray-600 font-medium mt-2">
                      Sièges disponibles: {flight.seats}
                    </div>

                    {/* Liste des sièges */}
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700">Sélectionner des sièges</h5>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {Array.from({ length: flight.seats }).map((_, index) => {
                          const seatId = `seat-${index + 1}`;
                          const isReserved = flight.reservedSeats.includes(seatId);
                          const isSelected = selectedSeats.includes(seatId);
                          return (
                            <button
                              key={seatId}
                              className={`w-8 h-8 rounded-md border ${isReserved ? 'bg-gray-400 cursor-not-allowed' : isSelected ? 'bg-indigo-600 text-white' : 'bg-white'}`}
                              disabled={isReserved}
                              onClick={() => handleSeatSelection(flight.id, seatId)}
                            >
                              {index + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bouton Réservation */}
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      {isAvailable ? (
                        <button
                          onClick={() => handleReservation(flight.id)}
                          disabled={loading || selectedSeats.length === 0}
                          className={`w-full py-3 px-4 rounded-lg ${loading || selectedSeats.length === 0 ? 'bg-gray-400 text-gray-700' : 'bg-indigo-600 text-white'}`}
                        >
                          {loading ? "Chargement..." : `Réserver ${selectedSeats.length} siège(s)`}
                        </button>
                      ) : (
                        <span className="text-red-600">Vol passé</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center text-lg font-semibold text-gray-500">Aucun vol disponible</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Flights;
