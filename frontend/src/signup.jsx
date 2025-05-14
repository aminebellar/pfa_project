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
      console.log('Registered successfully:', res.data);
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Registration failed';
      setError(errMsg);

      if (errMsg.includes('Username already exists')) {
        setUserExists(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-600 mb-2">Créer un compte FlyHigh</h2>
          <p className="text-gray-500">Rejoignez-nous pour une expérience de voyage exceptionnelle</p>
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
                placeholder="Entrez un nom unique"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <div className="relative">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="exemple@email.com"
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

          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">{error}</div>}

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
            className="btn btn-primary w-full"
            style={{ backgroundColor: '#4f46e5', color: 'white' }}>
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
  );
}

export default SignUp;
