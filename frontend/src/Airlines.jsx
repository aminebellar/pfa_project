import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Airlines.css";
import { Link } from 'react-router-dom';  // Importer Link pour la navigation

function Airlines() {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);  // Pour gérer l'état de chargement
  const [error, setError] = useState(null);  // Pour gérer les erreurs

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/airlines/")
      .then(response => {
        setAirlines(response.data);
        setLoading(false);  // Une fois les données récupérées, on arrête le chargement
      })
      .catch(error => {
        setError("Erreur lors de la récupération des compagnies");
        setLoading(false);  // Arrêter le chargement même en cas d'erreur
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r  to-white-500 ">
      {/* Header avec un bouton pour revenir à la page d'accueil */}
      <header className="w-full bg-white shadow-md py-4  flex justify-between items-center fixed top-0 ">
              <h1 className="text-3xl font-bold text-indigo-600">FlyHigh ✈️</h1>
              <nav>
                <ul className="flex space-x-6 text-gray-700 font-medium">
                  <li><Link to="/" className="hover:text-indigo-600 transition">Accueil</Link></li>
                  <li><Link to="/Flights" className="hover:text-indigo-600 transition">Vols</Link></li>
                  <li><Link to="/contact" className="hover:text-indigo-600 transition">Contact</Link></li>
                </ul>
              </nav>
            </header>

      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-white mb-6 text-center"></h1>

        <div className="bg-white p-4 rounded-lg shadow-xl max-w-3xl mx-auto">
          {loading && (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-6 h-6 border-4 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
              <p className="text-gray-600">Chargement des données...</p>
            </div>
          )}

          {error && <p className="text-red-600 text-center mt-4">{error}</p>}

          <ul className="mt-1 space-y-4">
            <h2 className="text-3xl font-bold p-5 text-indigo-700 text-center">Compagnies Aériennes Disponibles :</h2>
            {airlines.length > 0 ? (
              airlines.map(airline => (
                <li
                  key={airline.id}
                  className="bg-indigo-100 p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-indigo-700">{airline.name}</div>
                    <div className="text-sm text-indigo-600 semi-bold">{airline.country}</div>
                  </div>
                  <div className="mt-2 text-gray-600">
                    Découvrez nos offres avec {airline.name}, une compagnie aérienne de qualité!
                  </div>
                  {/* Bouton pour consulter les vols disponibles */}
                  <div className="mt-4">
                    <Link
                      to={`/airlines/${airline.id}/flights`}  // Redirige vers une page des vols pour cette compagnie
                      className="bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-i-700 transition duration-300"
                    >
                      Consulter les vols disponibles
                    </Link>
                  </div>
                </li>
              ))
            ) : (
              !loading && <p className="text-gray-600 text-center mt-4">Aucune compagnie aérienne disponible.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Airlines;
