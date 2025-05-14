import React from "react";
import { useLocation, Link } from "react-router-dom";

const Recu = () => {
  const { state } = useLocation();
  const { flight, seats, totalPrice, passengers } = state || {};

  if (!flight || !passengers) {
    return (
      <div className="text-center mt-20 text-lg text-red-600">
        Aucune donnée de réservation trouvée.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6">
      <div className="bg-white p-10 shadow-2xl rounded-2xl border border-gray-300">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">
          🧾 Reçu de Réservation
        </h1>

        {/* Infos sur le vol */}
        <div className="text-gray-700 space-y-4 mb-12 text-lg">
          <div>
            <label className="font-semibold text-gray-900">Vol :</label> #{flight.id} — {flight.airline_name}
          </div>
          <div>
            <label className="font-semibold text-gray-900">Départ :</label> {flight.departure_city} à {new Date(flight.departure_time).toLocaleString()}
          </div>
          <div>
            <label className="font-semibold text-gray-900">Arrivée :</label> {flight.arrival_city} à {new Date(flight.arrival_time).toLocaleString()}
          </div>
          <div>
            <label className="font-semibold text-gray-900">Nombre de sièges :</label> {seats}
          </div>
          <div>
            <label className="font-semibold text-gray-900">Prix unitaire :</label> {flight.price} €
          </div>
          <div className="pt-4">
            <label className="text-xl font-bold text-green-700">💶 Total à payer :</label> 
            <span className="text-black font-semibold ml-2">{totalPrice} €</span>
          </div>
        </div>

        {/* Infos sur les passagers */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">👥 Informations des Passagers</h2>

          {passengers.map((passenger, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-xl border border-gray-300 shadow-sm">
              <p className="text-xl font-semibold text-gray-800 mb-4">Passager {index + 1}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div><label className="font-medium">Prénom :</label> {passenger.firstName}</div>
                <div><label className="font-medium">Nom :</label> {passenger.lastName}</div>
                <div><label className="font-medium">Date de naissance :</label> {passenger.dateOfBirth}</div>
                <div><label className="font-medium">Numéro de carte d'identité :</label> {passenger.cin}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton vers paiement */}
      <div className="flex justify-center mt-10">
        <Link
          to="/paiement"
          state={{ flight, seats, totalPrice, passengers }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Procéder au paiement 💳
        </Link>
      </div>
    </div>
  );
};

export default Recu;
