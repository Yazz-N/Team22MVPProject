import React from 'react';
import { Settings, Palette, Zap, Download } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Settings,
      title: "Outline your team's workflow needs and goals",
      description: "Define clear objectives and map out your team's unique requirements with our intuitive planning tools.",
      phrase: "Elevate your team's productivity instantly"
    },
    {
      icon: Palette,
      title: "Tailor features to perfectly match your teams' needs and preferences",
      description: "Customise every aspect of the platform to align with your team's working style and operational requirements.",
      phrase: "Transform your product management in real time"
    },
    {
      icon: Zap,
      title: "Automatically produced, tailored workflows and updates in real time",
      description: "Experience intelligent automation that creates and adjusts workflows dynamically based on your team's patterns.",
      phrase: "Centralise your workflow with ease"
    },
    {
      icon: Download,
      title: "Easily export your workflows for offline access",
      description: "Take your workflows anywhere with seamless export functionality for complete operational flexibility.",
      phrase: "Transform your workflow today"
    }
  ];

  return (
    <section id="features" className="py-20 bg-secondary-50 dark:bg-secondary-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700 dark:from-accent-400 dark:via-accent-500 dark:to-accent-600 bg-clip-text text-transparent mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Discover the comprehensive tools that make Workflow Mach 3 the ultimate platform for streamlined operations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group p-8 bg-white dark:bg-secondary-700 rounded-xl border border-secondary-100 dark:border-secondary-600 hover:border-secondary-200 dark:hover:border-secondary-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-accent-600 dark:text-accent-400 uppercase tracking-wide">
                    {feature.phrase}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;