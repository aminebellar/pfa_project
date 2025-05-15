import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
    e.preventDefault(); // Empêche l'envoi du formulaire si le formulaire n'est pas valide

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

    setError(""); // Réinitialiser le message d'erreur si le formulaire est valide

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
        totalPrice: seats * flight.price,
        passengers,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-16 px-6">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">
        📝 Informations des Passagers
      </h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        {passengers.map((passenger, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-300"
          >
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Passager {index + 1}
            </h2>

            <div className="space-y-6">
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
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {/* Affichage du message d'erreur si des champs sont manquants */}
        {error && (
          <div className="text-red-600 text-center mt-4 p-4 bg-red-100 rounded-md">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-green-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Valider la réservation 
          </button>
        </div>
      </form>
    </div>
  );
};

export default FichePassagers;
