import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import AssistantLauncher from './components/AssistantLauncher';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Book from './pages/Book';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || !savedTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const handleAssistantClick = () => {
    // TODO: Open assistant panel
    console.log('Assistant clicked - panel will be implemented');
  };

  // Show assistant launcher on all pages except auth pages
  const showAssistant = !location.pathname.includes('/signin') && !location.pathname.includes('/signup');

  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/book" element={<Book />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
      </Routes>
      <Footer />
      {showAssistant && <AssistantLauncher onClick={handleAssistantClick} />}
    </div>
  );
}

export default App;