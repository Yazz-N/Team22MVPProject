import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-secondary-900 dark:via-primary-900 dark:to-accent-900">
      {/* Abstract Background - Hero Section Only */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Flowing Gradient Shapes */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-primary-400/30 to-secondary-400/30 dark:from-primary-600/20 dark:to-secondary-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-secondary-400/30 to-accent-400/30 dark:from-secondary-600/20 dark:to-accent-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-300/20 to-secondary-300/20 dark:from-primary-500/15 dark:to-secondary-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Creative Abstract Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path d="M0,100 Q150,50 300,100 T600,100" stroke="url(#line-gradient)" strokeWidth="2" fill="none" />
          <path d="M100,200 Q250,150 400,200 T700,200" stroke="url(#line-gradient)" strokeWidth="1.5" fill="none" />
          <path d="M-50,300 Q100,250 250,300 T500,300" stroke="url(#line-gradient)" strokeWidth="1" fill="none" />
          <circle cx="200" cy="150" r="3" fill="#14b8a6" opacity="0.6" />
          <circle cx="400" cy="250" r="2" fill="#22c55e" opacity="0.6" />
          <circle cx="600" cy="180" r="2.5" fill="#10b981" opacity="0.6" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700 dark:from-accent-400 dark:via-accent-500 dark:to-accent-600 bg-clip-text text-transparent">
          Workflow Mach 3
        </h1>
        
        <p className="text-xl md:text-2xl text-secondary-800 dark:text-secondary-300 mb-4 max-w-4xl mx-auto leading-relaxed">
          A centralised hub that transforms how product managers handle internal workflows, 
          SOP management, and real-time updates
        </p>
        
        <p className="text-lg text-secondary-700 dark:text-secondary-400 mb-12 max-w-3xl mx-auto">
          One location - all the information in one place, with access to it at your fingertips.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2FER4aPpkS9vYzTZ8NjZoNzQ-workflow-mach-3-demo"
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-300 items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Demo Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
