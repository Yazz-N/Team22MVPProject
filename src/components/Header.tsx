import React from 'react';
import { Menu, X, Workflow } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-primary-900/90 backdrop-blur-md border-b border-primary-200/50 dark:border-primary-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-700 dark:text-primary-200">Workflow Mach 3</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 font-medium transition-colors">Features</a>
            <a href="#benefits" className="text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 font-medium transition-colors">Benefits</a>
            <a href="#testimonials" className="text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 font-medium transition-colors">Testimonials</a>
            <a href="#faq" className="text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 font-medium transition-colors">FAQ</a>
          </nav>
          
          {/* Desktop CTA and Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <button className="text-primary-700 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-100 font-medium transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
              Get Started
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6 text-primary-700 dark:text-primary-200" /> : <Menu className="w-6 h-6 text-primary-700 dark:text-primary-200" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-200 dark:border-primary-700">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 font-medium">Features</a>
              <a href="#benefits" className="text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 font-medium">Benefits</a>
              <a href="#testimonials" className="text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 font-medium">Testimonials</a>
              <a href="#faq" className="text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-200 font-medium">FAQ</a>
              <div className="flex items-center justify-between pt-4 border-t border-primary-200 dark:border-primary-700">
                <ThemeToggle />
                <div className="flex gap-2">
                  <button className="text-primary-700 dark:text-primary-200 hover:text-primary-600 dark:hover:text-primary-100 font-medium">Sign In</button>
                  <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg">
                    Get Started
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;