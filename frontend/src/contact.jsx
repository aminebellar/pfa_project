import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-sky-800">Contact Service Client FlyHigh</h1>
          <p className="text-gray-600 mt-2">Une question ? Un problème ? Envoyez-nous un message.</p>
        </div>

        {success && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center font-medium">
            ✅ Votre message a bien été envoyé à notre équipe !
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Adresse Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre.email@exemple.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
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
              className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-sky-500 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold transition duration-300"
            >
              ✈️ Envoyer le message
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 border border-sky-600 text-sky-700 py-3 rounded-lg font-semibold hover:bg-sky-100 transition duration-300"
            >
              ⬅️ Retour à l'accueil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
