import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./fichepassager.css"; // Assurez-vous d'importer le fichier CSS

const FichePassagers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, seats } = location.state;

  // Initialisation des passagers avec les champs nécessaires
  const [passengers, setPassengers] = useState(
    seats.map((seat) => ({
      seatNumber: seat,
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      cin: "",
    }))
  );

  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification que tous les champs sont remplis avant la soumission
    const isValid = passengers.every(
      (passenger) =>
        passenger.firstName &&
        passenger.lastName &&
        passenger.dateOfBirth &&
        passenger.cin
    );

    if (!isValid) {
      setError("Tous les champs doivent être remplis.");
      return;
    }

    setError("");

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    passengers.forEach(async (passenger) => {
      await axios.post("http://127.0.0.1:8000/api/create_reservation/", {
        flight: flight.id,
        user: user ? user.id : 1,
        seats: 1,
        seat_number: passenger.seatNumber,
        passenger_info: {
          first_name: passenger.firstName,
          last_name: passenger.lastName,
          date_of_birth: passenger.dateOfBirth,
          cin: passenger.cin,
        },
      });
    });

    navigate("/recu", {
      state: {
        flight,
        seats,
        totalPrice: seats.length * flight.price,
        passengers,
      },
    });
  };

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
        <div className="w-full max-w-3xl mx-auto px-4">
          <div className="bg-white/90 shadow-2xl rounded-3xl border border-indigo-100 p-10">
            <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10 drop-shadow-lg tracking-tight">
              📝 Informations des Passagers
            </h1>

            <form onSubmit={handleSubmit} className="space-y-12">
              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-blue-100 p-8 rounded-xl shadow-lg border border-indigo-100 mb-4"
                >
                  <h2 className="text-2xl font-semibold text-blue-800 mb-6">
                    Passager {index + 1}{" "}
                    <span className="text-indigo-400 text-base">
                      | Siège {passenger.seatNumber}
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Prénom :
                      </label>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) =>
                          handleChange(index, "firstName", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Nom :
                      </label>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) =>
                          handleChange(index, "lastName", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Date de naissance :
                      </label>
                      <input
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) =>
                          handleChange(index, "dateOfBirth", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Numéro de carte d'identité :
                      </label>
                      <input
                        type="text"
                        value={passenger.cin}
                        onChange={(e) =>
                          handleChange(index, "cin", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {error && (
                <div className="text-red-600 text-center mt-4 p-4 bg-red-100 rounded-md">
                  <strong>Erreur :</strong> {error}
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-blue-400 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition duration-300 transform hover:scale-105 hover:from-green-600 hover:to-blue-500 text-lg"
                >
                  Valider la réservation
                </button>
                <Link
                  to="/"
                  className="bg-gray-200 text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg shadow hover:bg-gray-300 transition text-center"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </form>
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

export default FichePassagers;
