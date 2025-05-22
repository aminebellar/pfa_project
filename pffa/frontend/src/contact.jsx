import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Contact() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/contact/', formData);
      setSuccess(true);
      setFormData({ email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Erreur lors de l’envoi du message:', err);
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
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-white/90 shadow-2xl rounded-3xl border border-indigo-100 p-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 drop-shadow-lg tracking-tight">
                📬 Contactez le Service Client FlyHigh
              </h1>
              <p className="text-gray-600 text-lg">
                Une question ? Un problème ? Envoyez-nous un message, notre équipe vous répondra rapidement.
              </p>
            </div>

            {success && (
              <div className="bg-green-100 text-green-800 p-4 rounded mb-6 text-center font-medium">
                ✅ Votre message a bien été envoyé à notre équipe !
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Adresse Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre.email@exemple.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Sujet</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Problème de réservation"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700 font-semibold">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Décrivez votre demande ici..."
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-400 hover:from-indigo-600 hover:to-blue-500 text-white py-3 rounded-lg font-bold text-lg shadow-lg transition duration-300"
                >
                  ✈️ Envoyer le message
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 border border-indigo-500 text-indigo-700 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition duration-300"
                >
                  ⬅️ Retour à l'accueil
                </button>
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
}

export default Contact;
