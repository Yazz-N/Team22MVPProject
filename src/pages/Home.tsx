import React from 'react';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';

const Home = () => {
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