import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function AirlineDetails() {
  const { id } = useParams();
  const [airline, setAirline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [flights, setFlights] = useState([]);
  const [showFlights, setShowFlights] = useState(false);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/airlines/${id}/`)
      .then(response => {
        setAirline(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError("Erreur lors de la récupération des données.");
        setLoading(false);
      });
  }, [id]);

  const fetchFlights = () => {
    axios.get(`http://127.0.0.1:8000/api/flights/?is_available=true`)
      .then(response => {
        const allFlights = response.data;
        const filteredFlights = allFlights.filter(flight => flight.airline === parseInt(id));
        setFlights(filteredFlights);
        setShowFlights(true);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des vols", error);
      });
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (!airline) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-600">La compagnie n'a pas été trouvée.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-8 flex flex-col items-center">
      <Link to="/" className="self-start mb-6 text-indigo-600 hover:underline">
        &larr; Retour à l'accueil
      </Link>

      <div className="bg-white shadow-xl rounded-lg p-8 max-w-2xl w-full text-center">
        <img
          src={`http://127.0.0.1:8000${airline.logo}`}
          alt={airline.name}
          className="h-40 mx-auto object-contain mb-6"
        />
       

        <p className="text-gray-700 text-base mb-4">
          {airline.description ? airline.description : "Aucune description disponible."}
        </p>

        <p className="text-gray-700 text-base mb-6">
          <strong>Pays :</strong> {airline.country ? airline.country : "Pays non renseigné"}
        </p>

        {/* Bouton pour afficher les vols disponibles */}
        <Link to={`/Flights?airlineId=${airline.id}`}>
  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full">
    Voir les vols de cette compagnie
  </button>
</Link>

       
      </div>
    </div>
  );
}

export default AirlineDetails;
