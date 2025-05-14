import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Flights.css";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [seatVisibility, setSeatVisibility] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const paramsUrl = new URLSearchParams(location.search);
  const airlineId = paramsUrl.get("airlineId");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const params = new URLSearchParams();
    if (airlineId) params.append("airline", airlineId);

    const url = `http://127.0.0.1:8000/api/flights/?${params.toString()}`;

    axios.get(url)
      .then((response) => {
        const updatedFlights = response.data.map((flight) => ({
          ...flight,
          seats: flight.seats !== undefined ? flight.seats : 100,
          reservedSeats: flight.reservedSeats || [],
        }));

        const availableFlights = updatedFlights.filter((flight) => {
          const departureTime = new Date(flight.departure_time).getTime();
          return departureTime > Date.now();
        });

        setFlights(availableFlights);

        const visibility = {};
        availableFlights.forEach(f => { visibility[f.id] = false; });
        setSeatVisibility(visibility);
      })
      .catch((error) => console.error("Erreur lors de la récupération des vols", error));
  }, [airlineId]);

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
        return prev.filter((seat) => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const toggleSeatVisibility = (flightId) => {
    setSeatVisibility((prev) => ({
      ...prev,
      [flightId]: !prev[flightId],
    }));
  };

  const handleReservation = (flightId) => {
    if (!user) {
      setShowModal(true);
      return;
    }

    setLoading(true);

    const updatedFlights = flights.map((flight) => {
      if (flight.id === flightId) {
        const updatedReservedSeats = [...flight.reservedSeats, ...selectedSeats];
        return {
          ...flight,
          reservedSeats: updatedReservedSeats,
          seats: flight.seats - selectedSeats.length,
        };
      }
      return flight;
    });

    setFlights(updatedFlights);

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

    setSelectedSeats([]);
    navigate(`/Reservation?flightId=${flightId}`, {
      state: { seats: selectedSeats.length },
    });
  };

  const renderSeatsLayout = (flight) => {
    const totalSeats = Math.min(flight.seats, 48);
    const seatsPerRow = 6;
    const rows = Math.ceil(totalSeats / seatsPerRow);

    let seatCounter = 1;
    const layout = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];

      for (let col = 0; col < seatsPerRow; col++) {
        if (seatCounter > totalSeats) break;
        const seatId = `seat-${seatCounter}`;
        const isReserved = flight.reservedSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);

        rowSeats.push(
          <button
            key={seatId}
            disabled={isReserved}
            onClick={() => handleSeatSelection(flight.id, seatId)}
            className={`w-8 h-8 m-1 rounded-md font-bold text-sm border-2 flex items-center justify-center transition-colors duration-200
              ${isReserved ? "bg-gray-400 border-gray-500 text-gray-700 cursor-not-allowed" :
                isSelected ? "bg-blue-600 border-blue-800 text-white" :
                  "bg-blue-400 border-blue-600 text-black hover:bg-blue-500"}`}
          >
            {seatCounter}
          </button>
        );
        seatCounter++;
      }

      layout.push(
        <div key={row} className="flex justify-center mb-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-center w-1/3">
              <div className="text-xs text-gray-500">Window</div>
              {rowSeats.slice(0, 3)}
            </div>
            <div className="w-6 bg-gray-300 h-full"></div>
            <div className="flex flex-col items-center w-1/3">
              <div className="text-xs text-gray-500">Aisle</div>
              {rowSeats.slice(3, 6)}
            </div>
          </div>
        </div>
      );
    }

    layout.push(
      <div key="door" className="text-center mt-4 text-lg font-semibold text-gray-600">
        ✈️ Door / Emergency Exit Area
      </div>
    );

    return layout;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 to-gray-200 text-gray-900 font-sans">
      <header className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center fixed top-0 z-50">
        <h1 className="text-3xl font-bold text-indigo-600">FlyHigh ✈️</h1>
        <nav>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <li><Link to="/" className="hover:text-indigo-600 transition">Accueil</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-600 transition">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">✈️ Vols Disponibles</h2>

          {flights.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {flights.map((flight) => (
                <div key={flight.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-indigo-600 p-4 text-white flex justify-between">
                    <h3 className="text-xl font-bold">{flight.airline_name}</h3>
                    <span>{calculateTimeLeft(flight.departure_time)}</span>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <p>Départ : {flight.departure_city}</p>
                      <p>Arrivée : {flight.arrival_city}</p>
                    </div>
                    <p className="mb-4 text-indigo-600 font-bold">Prix: ${flight.price}</p>

                    <p className="mb-2 text-sm text-gray-700">Sièges disponibles: {flight.seats}</p>

                    <button
                      onClick={() => toggleSeatVisibility(flight.id)}
                      className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      {seatVisibility[flight.id] ? "Masquer les sièges" : "Choisir un siège"}
                    </button>

                    {seatVisibility[flight.id] && (
                      <div className="bg-gray-100 p-4 rounded mb-4">{renderSeatsLayout(flight)}</div>
                    )}

                    <button
                      onClick={() => handleReservation(flight.id)}
                      disabled={selectedSeats.length === 0 || loading}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        selectedSeats.length === 0
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {loading ? "Traitement..." : "Réserver maintenant"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p>Aucun vol disponible</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Connexion requise</h2>
            <p className="mb-4">Veuillez vous connecter pour réserver un vol.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
              <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Se connecter</Link>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-indigo-800 text-white py-6 text-center">
        © 2024 FlyHigh - Tous droits réservés
      </footer>
    </div>
  );
}

export default Flights;
