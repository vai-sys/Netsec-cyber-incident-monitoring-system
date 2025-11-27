import React, { useState } from 'react';
import { authService } from '../Services/AuthServices';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = isLogin 
        ? await authService.login(formData)
        : await authService.register(formData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-green-400 text-center mb-6">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <input 
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}
            
            <input 
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            
            <input 
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 text-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            
            <button 
              type="submit"
              className="w-full p-3 bg-green-600 text-black font-bold rounded-lg hover:bg-green-500 transition-colors duration-300 transform hover:scale-105"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-green-300 hover:text-green-200 cursor-pointer"
            >
              {isLogin 
                ? 'Need an account? Register' 
                : 'Already have an account? Login'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;


