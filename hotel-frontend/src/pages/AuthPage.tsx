import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guest',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint =
      tab === 'login'
        ? '/api/auth/login'
        : tab === 'register'
        ? '/api/auth/register'
        : '/api/auth/forgot-password';

    try {
      const { data } = await axios.post(`http://localhost:5001${endpoint}`, formData);

    if (tab === 'login') {
  localStorage.setItem('user', JSON.stringify(data));
  navigate(data.role === 'admin' ? '/admin-dashboard' : '/guest-dashboard');
      } else {
        alert(data.message || `${tab.charAt(0).toUpperCase() + tab.slice(1)} success`);
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen bg-hotel bg-cover bg-center flex items-center justify-center">
      <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-md font-inter animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Account' : 'Reset Password'}
        </h2>

        <div className="flex justify-center mb-6 gap-2">
          {['login', 'register', 'forgot'].map((t) => (
            <button
              key={t}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                tab === t ? 'bg-white text-black' : 'text-white'
              }`}
              onClick={() => setTab(t as typeof tab)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {tab === 'register' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 rounded-lg bg-white/80 placeholder-gray-700 text-black"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded-lg bg-white/80 placeholder-gray-700 text-black"
          />

          {tab !== 'forgot' && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="p-3 rounded-lg bg-white/80 placeholder-gray-700 text-black"
            />
          )}

          {tab === 'register' && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-3 rounded-lg bg-white/80 text-black"
            >
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            type="submit"
            className="bg-white text-black rounded-lg py-2 font-semibold hover:bg-gray-100 transition"
          >
            {tab === 'login'
              ? 'Login'
              : tab === 'register'
              ? 'Register'
              : 'Send Reset Email'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
