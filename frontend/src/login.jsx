import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/login/', form);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      if (message.toLowerCase().includes('invalid')) {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
      } else {
        setError(message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-600 mb-2">Connexion à FlyHigh</h2>
          <p className="text-gray-500">Bienvenue ! Veuillez vous connecter pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
            <div className="relative">
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Entrez votre nom"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              <p>{error}</p>
              <p className="mt-2">
                Mot de passe oublié ?{' '}
                <Link to="/resetpassword" className="text-indigo-500 hover:underline font-medium">
                  Cliquez ici pour le récupérer
                </Link>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ backgroundColor: '#4f46e5', color: 'white' }}
          >
            Se connecter
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{' '}
          <Link to="/register" className="text-indigo-500 hover:underline font-medium">
            Inscrivez-vous ici
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
