import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ResetPassword() {
  const [form, setForm] = useState({ username: '', email: '', message: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reset-password/', form);
      if (response.status === 200 || response.status === 201) {
        setSuccess("Votre demande a été envoyée à l'administrateur.");
        setForm({ username: '', email: '', message: '' });
        setError(''); // Réinitialiser l'erreur après une soumission réussie
      }
    } catch (err) {
      // Vérifier si l'erreur provient d'un code de statut d'erreur (4xx ou 5xx)
      if (err.response && (err.response.status === 400 || err.response.status >= 500)) {
        setError(err.response?.data?.error || "Une erreur est survenue. Veuillez réessayer.");
      } else {
        // Si la requête échoue à cause d'un problème réseau ou autre
        setError("Une erreur de connexion est survenue. Veuillez réessayer.");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-600 mb-2">Réinitialiser le mot de passe</h2>
          <p className="text-gray-500 text-sm">Complétez ce formulaire et nous vous aiderons à récupérer votre compte</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                id="username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="ex: johndoe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="ex: johndoe@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message pour l'admin</label>
            <div className="relative">
              <textarea
                name="message"
                id="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="Expliquez votre problème ou demande de réinitialisation"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            ← Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
