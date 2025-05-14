import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import backgroundImage from './assets/Home.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Home() {
  const [user, setUser] = useState(null);
  const [airlines, setAirlines] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    axios.get("http://127.0.0.1:8000/api/airlines/")
      .then(response => {
        setAirlines(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des compagnies :", error);
      });

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-slate-100 to-gray-200 text-gray-900">

      {/* Navigation */}
      <header className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center fixed top-0 z-50">
        <h1 className="text-3xl font-bold text-indigo-600">FlyHigh ✈️</h1>
        <nav className="flex items-center space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-indigo-600 transition">Accueil</Link>
          <Link to="/Flights" className="hover:text-indigo-600 transition">Vols</Link>
          <Link to="/contact" className="hover:text-indigo-600 transition">Contact</Link>

          {user ? (
            <>
              <span className="ml-4 text-indigo-700 font-semibold">👋 {user.username}</span>
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600 transition">Login</Link>
              <Link to="/signup" className="hover:text-indigo-600 transition">Sign up</Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-[600px] bg-cover bg-center flex items-center justify-center mt-16" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">
            Prenez votre envol avec FlyHigh
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Réservez vos vols en toute simplicité, où que vous soyez ✈️
          </p>
        </div>
      </div>

      {/* Airlines Section */}
      <div className="w-full bg-white py-12 flex flex-col items-center">
        <h3 className="text-2xl font-bold text-indigo-600 mb-10">Nos compagnies partenaires</h3>
        <div className="flex flex-wrap justify-center gap-10 px-6">
          {airlines.map((airline) => (
            <Link 
              key={airline.id} 
              to={`/airlines/${airline.id}`}
              className="hover:scale-110 transition-transform duration-300"
            >
              <img
                src={airline.logo}
                alt={airline.name}
                className="w-32 h-32 object-contain"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="w-full bg-white py-16 flex flex-col items-center px-6">
        <h3 className="text-3xl font-bold text-indigo-600 mb-12 text-center">
          🌍 En savoir plus sur <span className="text-indigo-700">FlyHigh</span>
        </h3>

        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              🚀 Qui sommes-nous ?
            </h4>
            <p className="text-gray-600 leading-relaxed">
              FlyHigh est une plateforme de recherche de vols conçue pour simplifier vos voyages.
              Que vous partiez en vacances ou en déplacement professionnel, nous vous aidons à trouver
              les meilleures options disponibles en quelques clics.
            </p>
          </div>

          <div>
            <h4 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              🧭 Ce que vous trouverez
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>🏠 <strong>Accueil :</strong> Aperçu rapide des vols</li>
              <li>🔎 <strong>Recherche intelligente :</strong> Par destination, date et prix</li>
              <li>🛫 <strong>Tri dynamique :</strong> Classement flexible</li>
              <li>📱 <strong>Responsive :</strong> Compatible mobile, tablette et desktop</li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl w-full mt-16">
          <h4 className="text-2xl font-semibold mb-8 text-center text-gray-700">💡 Pourquoi FlyHigh ?</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-6 rounded-xl shadow-md text-center flex flex-col items-center">
              <i className="fas fa-bolt text-3xl text-indigo-600 mb-4"></i>
              <h5 className="text-xl font-bold text-indigo-600 mb-2">Rapide & intuitif</h5>
              <p className="text-gray-600">Interface claire pour trouver votre vol rapidement.</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl shadow-md text-center flex flex-col items-center">
              <i className="fas fa-cogs text-3xl text-indigo-600 mb-4"></i>
              <h5 className="text-xl font-bold text-indigo-600 mb-2">Moteur intelligent</h5>
              <p className="text-gray-600">Filtres efficaces pour trier par prix et date.</p>
            </div>
            <div className="bg-indigo-50 p-6 rounded-xl shadow-md text-center flex flex-col items-center">
              <i className="fas fa-mobile-alt text-3xl text-indigo-600 mb-4"></i>
              <h5 className="text-xl font-bold text-indigo-600 mb-2">Design moderne</h5>
              <p className="text-gray-600">Expérience agréable sur tous vos appareils.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-[#1c1f4a] to-[#0d0f2b] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 z-10 relative">
          <div>
            <h2 className="text-3xl font-extrabold text-indigo-400">FlyHigh ✈️</h2>
            <p className="mt-3 text-sm text-gray-300">
              Prenez votre envol en toute confiance. Réservez rapidement et simplement vos vols préférés.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-300">Navigation</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition">Accueil</Link></li>
              <li><Link to="/Flights" className="hover:text-indigo-400 transition">Vols</Link></li>
              <li><Link to="/About" className="hover:text-indigo-400 transition">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-300">Contact</h4>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>📍 Casablanca, Maroc</li>
              <li>📧 contact@flyhigh.com</li>
              <li>📞 +212 6 12 34 56 78</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-indigo-300">Suivez-nous</h4>
            <div className="flex space-x-6 text-gray-300">
              <i className="fab fa-facebook-square text-2xl hover:text-indigo-400 transition"></i>
              <i className="fab fa-twitter text-2xl hover:text-indigo-400 transition"></i>
              <i className="fab fa-instagram text-2xl hover:text-indigo-400 transition"></i>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-indigo-600 p-4 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-110 animate-bounce z-50" >
        <i className="fas fa-plane-up text-2xl rotate-45"></i>
      </button>
      )}
    </div>
  );
}

export default Home;
