import React from "react";
import { useLocation, Link } from "react-router-dom";

const Recu = () => {
  const { state } = useLocation();
  const { flight, seats, totalPrice, passengers } = state || {};

  if (!flight || !passengers || !seats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white animate-gradient">
        <div className="text-center text-lg text-red-600 font-medium">
          Aucune donnée de réservation trouvée.
        </div>
      </div>
    );
  }

  // Calcul du total à payer
  const calculateTotalPrice = () => {
    const pricePerSeat = flight.price || 0;
    return pricePerSeat * seats.length;
  };

  const calculatedTotalPrice = totalPrice || calculateTotalPrice();

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
          <div className="bg-white/90 p-10 shadow-2xl rounded-3xl border border-indigo-100">
            <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10 drop-shadow-lg tracking-tight">
              🧾 Reçu de Réservation
            </h1>

            {/* Infos sur le vol */}
            <div className="text-gray-700 space-y-4 mb-12 text-lg">
              <div>
                <label className="font-semibold text-gray-900">Vol :</label> #{flight.id} — {flight.airline_name}
              </div>
              <div>
                <label className="font-semibold text-gray-900">Départ :</label> {flight.departure_city} à{" "}
                <span className="text-blue-700 font-medium">
                  {new Date(flight.departure_time).toLocaleString()}
                </span>
              </div>
              <div>
                <label className="font-semibold text-gray-900">Arrivée :</label> {flight.arrival_city} à{" "}
                <span className="text-blue-700 font-medium">
                  {new Date(flight.arrival_time).toLocaleString()}
                </span>
              </div>
              <div>
                <label className="font-semibold text-gray-900">Nombre de sièges :</label>{" "}
                <span className="font-semibold text-indigo-700">{seats.length}</span> (
                <span className="text-blue-700">{seats.join(", ")}</span>)
              </div>
              <div>
                <label className="font-semibold text-gray-900">Prix unitaire :</label>{" "}
                <span className="text-blue-700 font-bold">{flight.price} €</span>
              </div>
              <div className="pt-4">
                <label className="text-xl font-bold text-green-700">💶 Total à payer :</label>
                <span className="text-black font-semibold ml-2">{calculatedTotalPrice} €</span>
              </div>
            </div>

            {/* Infos sur les passagers */}
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">
                👥 Informations des Passagers
              </h2>

              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-xl border border-indigo-100 shadow"
                >
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    Passager {index + 1} <span className="text-indigo-400 text-base">| Siège {passenger.seatNumber}</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                      <label className="font-medium">Prénom :</label> {passenger.firstName}
                    </div>
                    <div>
                      <label className="font-medium">Nom :</label> {passenger.lastName}
                    </div>
                    <div>
                      <label className="font-medium">Date de naissance :</label> {passenger.dateOfBirth}
                    </div>
                    <div>
                      <label className="font-medium">Numéro de carte d'identité :</label> {passenger.cin}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton vers paiement */}
          <div className="flex justify-center mt-10">
            <Link
              to="/paiement"
              state={{ flight, seats, totalPrice: calculatedTotalPrice, passengers }}
              className="bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 text-white font-bold py-4 px-10 rounded-xl shadow-lg text-lg transition"
            >
              Procéder au paiement 💳
            </Link>
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

export default Recu;
