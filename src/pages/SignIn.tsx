import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';
import { signInWithEmail } from '../lib/auth';
import { isDevBypass } from '../lib/env';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };

    // Skip validation in dev bypass mode
    if (isDevBypass) {
      return true;
    }
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Dev bypass - skip all validation and Supabase calls
    if (isDevBypass) {
      signInWithEmail('dev@example.com', 'password').then(() => {
        navigate('/dashboard');
      }).finally(() => {
        setLoading(false);
      });
    } else if (validateForm()) {
      // Normal validation and sign-in flow
      signInWithEmail(formData.email, formData.password).then((result) => {
        if (result.error) {
          setErrors({
            email: '',
            password: 'Invalid login credentials'
          });
        } else {
          navigate('/dashboard');
        }
      }).catch(error => {
        console.error('Sign in failed:', error);
        setErrors({
          email: '',
          password: 'Invalid login credentials'
        });
      }).finally(() => {
        setLoading(false);
      });
    } else {
      // Validation failed
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-md w-full mx-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your OpsCentral account
            </p>
            {isDevBypass && (
              <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
                Development mode: Any credentials will work
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full inline-flex justify-center items-center px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-all duration-300 gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Get Started →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;