import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToSection = () => {
      if (location.hash) {
        const elementId = location.hash.substring(1); // Remove the '#'
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Scroll on initial load and when hash changes
    const timeoutId = setTimeout(scrollToSection, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timeoutId);
  }, [location.hash]);

  return (
    <>
      <Hero />
      <Benefits />
      <Features />
      <Testimonials />
      <FAQ />
    </>
  );
};

export default Home;