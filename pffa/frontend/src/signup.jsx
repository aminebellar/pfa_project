import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setUserExists(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/register/', form);
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Échec de l\'inscription';
      setError(errMsg);

      if (errMsg.includes('Le nom d\'utilisateur existe déjà')) {
        setUserExists(true);
      }
    }
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
              <Link to="/Flights" className="hover:text-indigo-500 transition">
                Vols
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
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white/90 shadow-2xl rounded-3xl border border-indigo-100 p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-indigo-700 mb-2 drop-shadow-lg tracking-tight">
                Créer un compte FlyHigh
              </h2>
              <p className="text-gray-500 text-lg">
                Rejoignez-nous pour une expérience de voyage exceptionnelle
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Entrez un nom unique"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="********"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {userExists && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-sm">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="text-indigo-500 hover:underline font-medium">
                    Connectez-vous ici
                  </Link>.
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg text-lg transition"
              >
                Créer un compte
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-indigo-500 hover:underline font-medium">
                Connexion
              </Link>
            </p>
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
}

export default SignUp;
