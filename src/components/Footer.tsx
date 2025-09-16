import React from 'react';
import { Workflow, Mail, Phone, MapPin, Twitter, Linkedin, Github, Instagram, Facebook, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-purple-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* CTA Section */}
        <div className="text-center mb-16 pb-16 border-b border-purple-600">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-600 mb-6">
            Transform Your Workflow Today
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Are you ready to revolutionise how your team handles workflows and SOPs?
          </p>
          <a 
            href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2FER4aPpkS9vYzTZ8NjZoNzQ-workflow-mach-3-demo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-all duration-300 items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Demo Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-accent-600 to-accent-700 rounded-lg">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-accent-600">Workflow Mach 3</span>
            </div>
            <p className="text-white mb-6 max-w-md">
              The centralised hub that transforms how product managers handle internal workflows, 
              SOP management, and real-time updates.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-purple-600 hover:bg-purple-500 rounded-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-accent-600">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="text-white hover:text-accent-400 transition-colors">Features</a></li>
              <li><a href="#benefits" className="text-white hover:text-accent-400 transition-colors">Benefits</a></li>
              <li><a href="#testimonials" className="text-white hover:text-accent-400 transition-colors">Testimonials</a></li>
              <li><a href="#faq" className="text-white hover:text-accent-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-white hover:text-accent-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-white hover:text-accent-400 transition-colors">Support</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-accent-600">Contact</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white" />
                <a href="mailto:hello@workflowmach3.com" className="text-white hover:text-accent-400 transition-colors break-all">
                  hello@workflowmach3.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white" />
                <span className="text-white">+44 20 7123 4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white mt-0.5" />
                <span className="text-white">London, United Kingdom</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-purple-600 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white text-sm">
              © 2025 Workflow Mach 3. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white hover:text-accent-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-white hover:text-accent-400 transition-colors">Terms & Conditions</a>
              <a href="#" className="text-white hover:text-accent-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;