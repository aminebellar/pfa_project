import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import backgroundImage from './assets/Home.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Home() {
  const [user, setUser] = useState(null);
  const [airlines, setAirlines] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    axios.get("http://127.0.0.1:8000/api/airlines/")
      .then(response => setAirlines(response.data))
      .catch(error => console.error("Erreur lors du chargement des compagnies :", error));

    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-indigo-100 via-blue-50 to-white animate-gradient relative overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative w-full h-[650px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Nuages animés */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-10 top-20 w-40 h-20 bg-white/40 rounded-full blur-2xl animate-cloud1"></div>
          <div className="absolute right-20 top-32 w-56 h-24 bg-white/30 rounded-full blur-2xl animate-cloud2"></div>
          <div className="absolute left-1/2 bottom-10 w-48 h-16 bg-white/30 rounded-full blur-2xl animate-cloud3"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-blue-900/40 to-black/60"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-5xl sm:text-7xl font-extrabold mb-8 drop-shadow-xl tracking-tight animate-fadein">
            <span className="block animate-gradient-text bg-gradient-to-r from-indigo-300 via-blue-200 to-white bg-clip-text text-transparent">
              Prenez votre envol
            </span>
            <span className="block text-indigo-200 mt-2 animate-bounce">avec FlyHigh</span>
          </h2>
          <p className="text-2xl sm:text-3xl mb-10 max-w-2xl mx-auto font-medium drop-shadow animate-fadein-slow">
            Réservez vos vols en toute simplicité, où que vous soyez.<br />
            <span className="text-indigo-100 font-bold">Voyagez autrement, vivez l’expérience FlyHigh !</span>
          </p>
          <Link
            to="/Flights"
            className="inline-block bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 text-white font-bold px-12 py-5 rounded-3xl shadow-2xl text-2xl transition transform hover:scale-110 animate-pulse"
            style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.3)" }}
          >
            Explorer les vols <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
        {/* Navigation flottante */}
        <header className="absolute top-0 left-0 w-full bg-white/80 shadow-lg py-4 px-8 flex justify-between items-center z-50 backdrop-blur">
          <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2 tracking-tight">
            <span className="inline-block animate-bounce">✈️</span> FlyHigh
          </h1>
          <nav className="flex items-center space-x-6 text-indigo-700 font-semibold text-lg">
            <Link to="/" className="hover:text-indigo-500 transition">Accueil</Link>
            <Link to="/Flights" className="hover:text-indigo-500 transition">Vols</Link>
            <Link to="/contact" className="hover:text-indigo-500 transition">Contact</Link>
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
                <Link to="/login" className="hover:text-indigo-500 transition">Login</Link>
                <Link to="/register" className="hover:text-indigo-500 transition">Sign up</Link>
              </>
            )}
          </nav>
        </header>
      </section>

      {/* Airlines Section */}
      <section className="w-full bg-white py-20 flex flex-col items-center">
        <h3 className="text-4xl font-extrabold text-indigo-600 mb-12 tracking-tight animate-fadein">
          Nos compagnies partenaires
        </h3>
        <div className="flex flex-wrap justify-center gap-14 px-6">
          {airlines.map((airline) => (
            <Link
              key={airline.id}
              to={`/airlines/${airline.id}`}
              className="group hover:scale-110 transition-transform duration-300"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-indigo-100 group-hover:shadow-indigo-300 hover:-translate-y-2 transition-all duration-300">
                <img
                  src={airline.logo}
                  alt={airline.name}
                  className="w-32 h-32 object-contain mb-4 drop-shadow-lg group-hover:scale-110 transition"
                  style={{ filter: "drop-shadow(0 0 10px #6366f1aa)" }}
                />
                <span className="text-indigo-700 font-bold text-xl tracking-wide">{airline.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="w-full bg-white py-24 flex flex-col items-center px-6">
        <h3 className="text-5xl font-extrabold text-indigo-700 mb-16 text-center tracking-tight animate-fadein">
          🌍 Pourquoi <span className="text-indigo-500">FlyHigh</span> ?
        </h3>
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-16">
          <div>
            <h4 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              🚀 Notre mission
            </h4>
            <p className="text-gray-600 leading-relaxed text-lg">
              FlyHigh révolutionne la réservation de vols : simplicité, rapidité, et expérience utilisateur inégalée.<br />
              <span className="font-bold text-indigo-600">Voyagez, rêvez, recommencez.</span>
            </p>
            <ul className="mt-8 space-y-3 text-indigo-600 font-medium">
              <li><i className="fas fa-check-circle mr-2"></i>Réservation instantanée</li>
              <li><i className="fas fa-check-circle mr-2"></i>Support client 24/7</li>
              <li><i className="fas fa-check-circle mr-2"></i>Comparaison intelligente</li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              🧭 Ce que vous trouverez
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600 text-lg">
              <li>🏠 <strong>Accueil :</strong> Aperçu rapide des vols</li>
              <li>🔎 <strong>Recherche intelligente :</strong> Par destination, date et prix</li>
              <li>🛫 <strong>Tri dynamique :</strong> Classement flexible</li>
              <li>📱 <strong>Responsive :</strong> Compatible mobile, tablette et desktop</li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl w-full mt-20">
          <h4 className="text-2xl font-semibold mb-8 text-center text-gray-700">💡 Nos atouts</h4>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 p-10 rounded-2xl shadow-xl text-center flex flex-col items-center hover:scale-105 transition">
              <i className="fas fa-bolt text-5xl text-indigo-600 mb-4 animate-spin-slow"></i>
              <h5 className="text-xl font-bold text-indigo-600 mb-2">Rapide & intuitif</h5>
              <p className="text-gray-600">Interface claire pour trouver votre vol rapidement.</p>
            </div>
            <div className="bg-indigo-50 p-10 rounded-2xl shadow-xl text-center flex flex-col items-center hover:scale-105 transition">
              <i className="fas fa-cogs text-5xl text-indigo-600 mb-4 animate-pulse"></i>
              <h5 className="text-xl font-bold text-indigo-600 mb-2">Moteur intelligent</h5>
              <p className="text-gray-600">Filtres efficaces pour trier par prix et date.</p>
            </div>
            <div className="bg-indigo-50 p-10 rounded-2xl shadow-xl text-center flex flex-col items-center hover:scale-105 transition">
              <i className="fas fa-mobile-alt text-5xl text-indigo-600 mb-4 animate-bounce"></i>
              <h5 className="text-xl font-bold text-indigo-600 mb-2">Design moderne</h5>
              <p className="text-gray-600">Expérience agréable sur tous vos appareils.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-[#1c1f4a] to-[#0d0f2b] text-white pt-20 pb-10 mt-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 blur-lg opacity-60"></div>
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
              <i className="fab fa-facebook-square text-2xl hover:text-indigo-400 transition animate-pulse"></i>
              <i className="fab fa-twitter text-2xl hover:text-indigo-400 transition animate-bounce"></i>
              <i className="fab fa-instagram text-2xl hover:text-indigo-400 transition animate-spin-slow"></i>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-indigo-600 p-4 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-110 animate-bounce z-50"
        >
          <i className="fas fa-plane-up text-2xl rotate-45"></i>
        </button>
      )}
    </div>
  );
}

export default Home;
