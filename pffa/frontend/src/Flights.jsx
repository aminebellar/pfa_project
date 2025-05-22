import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Flights.css";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState({});
  const [user, setUser] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [seatVisibility, setSeatVisibility] = useState({});
  const [search, setSearch] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const paramsUrl = new URLSearchParams(location.search);
  const airlineId = paramsUrl.get("airlineId");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      setUser(null);
    }

    const params = new URLSearchParams();
    if (airlineId) params.append("airline", airlineId);

    const url = `http://127.0.0.1:8000/api/flights/?${params.toString()}`;

    axios.get(url)
      .then((response) => {
        const updatedFlights = response.data.map((flight) => ({
          ...flight,
          seats: flight.total_seats,
          reservedSeats: Object.keys(flight.reserved_seat_ids || {}),
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
      const prevSeats = prev[flightId] || [];
      if (prevSeats.includes(seatId)) {
        return { ...prev, [flightId]: prevSeats.filter((s) => s !== seatId) };
      } else {
        return { ...prev, [flightId]: [...prevSeats, seatId] };
      }
    });
  };

  const toggleSeatVisibility = (flightId) => {
    setSeatVisibility((prev) => ({
      ...prev,
      [flightId]: !prev[flightId],
    }));
  };

  const handleReservation = async (flightId) => {
    if (!user || !user.access) {
      setShowModal(true);
      return;
    }
    setLoading((prev) => ({ ...prev, [flightId]: true }));

    let accessToken = user.access;

    // Rafraîchir le token si refresh existe
    if (user.refresh) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: user.refresh
        });
        accessToken = res.data.access;
        const updatedUser = { ...user, access: accessToken };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (err) {
        setUser(null);
        localStorage.removeItem('user');
        setShowModal(true);
        setLoading((prev) => ({ ...prev, [flightId]: false }));
        return;
      }
    }

    const seatsToReserve = selectedSeats[flightId] || [];
    if (seatsToReserve.length === 0) {
      setLoading((prev) => ({ ...prev, [flightId]: false }));
      return;
    }

    axios.post("http://127.0.0.1:8000/api/reservations/", {
      user: user.id,
      flight: flightId,
      seats: seatsToReserve
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(() => {
      setSelectedSeats((prev) => ({ ...prev, [flightId]: [] }));
      navigate(`/Reservation?flightId=${flightId}`, {
        state: { seats: seatsToReserve },
      });
    })
    .catch((error) => {
      setSelectedSeats((prev) => ({ ...prev, [flightId]: [] }));
      if (error.response && error.response.status === 401) {
        setShowModal(true);
      }
    })
    .finally(() => setLoading((prev) => ({ ...prev, [flightId]: false })));
  };

  const renderSeatsLayout = (flight) => {
    const totalSeats = Math.min(flight.seats, 18);
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
        const isSelected = (selectedSeats[flight.id] || []).includes(seatId);

        rowSeats.push(
          <button
            key={seatId}
            disabled={isReserved}
            onClick={() => handleSeatSelection(flight.id, seatId)}
            className={`w-10 h-10 m-1 rounded-lg font-bold text-sm border-2 flex items-center justify-center shadow-md transition-all duration-200
              ${isReserved ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed" :
                isSelected ? "bg-gradient-to-br from-indigo-500 to-blue-400 border-indigo-700 text-white scale-110 shadow-lg" :
                  "bg-white border-blue-300 text-indigo-700 hover:bg-blue-100 hover:border-blue-500"}`}
            style={{ boxShadow: isSelected ? "0 0 8px #6366f1" : undefined }}
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
              <div className="text-xs text-gray-400 mb-1">Window</div>
              {rowSeats.slice(0, 3)}
            </div>
            <div className="w-8 bg-gradient-to-b from-blue-200 to-blue-100 h-full rounded"></div>
            <div className="flex flex-col items-center w-1/3">
              <div className="text-xs text-gray-400 mb-1">Aisle</div>
              {rowSeats.slice(3, 6)}
            </div>
          </div>
        </div>
      );
    }

    layout.push(
      <div key="door" className="text-center mt-4 text-lg font-semibold text-indigo-400">
        ✈️ Porte / Issue de secours
      </div>
    );

    return layout;
  };

  const filteredFlights = flights.filter(flight => {
    const depCityMatch = departureCity === "" || flight.departure_city.toLowerCase().includes(departureCity.toLowerCase());
    const arrCityMatch = arrivalCity === "" || flight.arrival_city.toLowerCase().includes(arrivalCity.toLowerCase());
    const dateMatch =
      departureDate === "" ||
      new Date(flight.departure_time).toISOString().slice(0, 10) === departureDate;
    return depCityMatch && arrCityMatch && dateMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-blue-50 to-white animate-gradient">
      <header className="w-full bg-white/80 shadow-lg py-4 px-8 flex justify-between items-center fixed top-0 z-50 backdrop-blur">
        <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2 tracking-tight">
          <span className="inline-block animate-bounce">✈️</span> FlyHigh
        </h1>
        <nav>
          <ul className="flex space-x-8 text-indigo-700 font-semibold text-lg">
            <li><Link to="/" className="hover:text-indigo-500 transition">Accueil</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-500 transition">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-12 drop-shadow-lg tracking-tight">✈️ Vols Disponibles</h2>

          {/* Barre de recherche */}
        
          {/* Fin barre de recherche */}

          {/* Barre de recherche avancée stylée */}
          <div className="flex flex-col md:flex-row gap-6 mb-12 justify-center items-end">
            <div className="relative w-full md:w-1/4">
              <label className="absolute left-4 top-2 text-indigo-500 text-xs font-semibold pointer-events-none transition-all duration-200">
                <i className="fas fa-plane-departure mr-2"></i>Ville de départ
              </label>
              <input
                type="text"
                value={departureCity}
                onChange={e => setDepartureCity(e.target.value)}
                className="mt-6 w-full px-5 py-3 rounded-xl border border-indigo-200 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white placeholder-gray-400"
                placeholder="Casablanca, Paris..."
              />
            </div>
            <div className="relative w-full md:w-1/4">
              <label className="absolute left-4 top-2 text-indigo-500 text-xs font-semibold pointer-events-none transition-all duration-200">
                <i className="fas fa-plane-arrival mr-2"></i>Ville d'arrivée
              </label>
              <input
                type="text"
                value={arrivalCity}
                onChange={e => setArrivalCity(e.target.value)}
                className="mt-6 w-full px-5 py-3 rounded-xl border border-indigo-200 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white placeholder-gray-400"
                placeholder="Londres, Marrakech..."
              />
            </div>
            <div className="relative w-full md:w-1/4">
              <label className="absolute left-4 top-2 text-indigo-500 text-xs font-semibold pointer-events-none transition-all duration-200">
                <i className="fas fa-calendar-alt mr-2"></i>Date de départ
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                className="mt-6 w-full px-5 py-3 rounded-xl border border-indigo-200 shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg bg-white"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          {/* Fin barre de recherche avancée stylée */}

          {filteredFlights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {filteredFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white/90 rounded-3xl shadow-2xl overflow-hidden border border-indigo-100 hover:shadow-indigo-200 transition-shadow duration-300 flex flex-col"
                  style={{ minHeight: 420 }}
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-5 text-white flex justify-between items-center">
                    <h3 className="text-2xl font-bold">{flight.airline_name}</h3>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">{calculateTimeLeft(flight.departure_time)}</span>
                  </div>

                  <div className="p-7 flex flex-col flex-grow">
                    <div className="flex justify-between mb-4 text-lg font-medium">
                      <p>Départ : <span className="font-bold text-indigo-600">{flight.departure_city}</span></p>
                      <p>Arrivée : <span className="font-bold text-indigo-600">{flight.arrival_city}</span></p>
                    </div>
                    <p className="mb-4 text-blue-700 font-bold text-xl">Prix : <span className="text-2xl">{flight.price} €</span></p>

                    <p className="mb-3 text-sm text-gray-600">Sièges disponibles : <span className="font-semibold text-indigo-700">{flight.seats - flight.reservedSeats.length}</span></p>

                    <button
                      onClick={() => toggleSeatVisibility(flight.id)}
                      className={`mb-4 px-5 py-2 rounded-xl font-semibold shadow transition-all duration-200 ${
                        seatVisibility[flight.id]
                          ? "bg-gradient-to-r from-blue-400 to-indigo-400 text-white"
                          : "bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      }`}
                    >
                      {seatVisibility[flight.id] ? "Masquer les sièges" : "Choisir un siège"}
                    </button>

                    {seatVisibility[flight.id] && (
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-4 rounded-xl mb-4 border border-indigo-100 shadow-inner">
                        {renderSeatsLayout(flight)}
                      </div>
                    )}

                    <button
                      onClick={() => handleReservation(flight.id)}
                      disabled={(selectedSeats[flight.id] || []).length === 0 || loading[flight.id]}
                      className={`mt-auto w-full py-3 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 ${
                        (selectedSeats[flight.id] || []).length === 0 || loading[flight.id]
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-500 to-blue-400 text-white hover:from-indigo-600 hover:to-blue-500"
                      }`}
                    >
                      {loading[flight.id] ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Traitement...
                        </span>
                      ) : "Réserver maintenant"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 text-xl font-medium">
              <p>Aucun vol trouvé</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-3 text-indigo-700">Connexion requise</h2>
            <p className="mb-6 text-gray-600">Veuillez vous connecter pour réserver un vol.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 bg-gray-200 rounded-lg font-semibold">Annuler</button>
              <Link to="/login" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">Se connecter</Link>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white py-8 text-center mt-10 shadow-inner">
        <div className="text-lg font-semibold tracking-wide">© 2024 FlyHigh - Tous droits réservés</div>
        <div className="mt-2 text-sm opacity-80">Design by FlyHigh Team</div>
      </footer>
    </div>
  );
}

export default Flights;
