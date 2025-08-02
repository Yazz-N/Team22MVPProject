import React from 'react';
import { Settings, Palette, Zap, Download } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Settings,
      title: "Outline your team's workflow needs and goals",
      description: "Define clear objectives and map out your team's unique requirements with our intuitive planning tools.",
      phrase: "Plan your workflow strategy"
    },
    {
      icon: Palette,
      title: "Tailor features to perfectly match your teams' needs and preferences",
      description: "Customise every aspect of the platform to align with your team's working style and operational requirements.",
      phrase: "Customise your experience"
    },
    {
      icon: Zap,
      title: "Automatically produced, tailored workflows and updates in real time",
      description: "Experience intelligent automation that creates and adjusts workflows dynamically based on your team's patterns.",
      phrase: "Automate your processes"
    },
    {
      icon: Download,
      title: "Easily export your workflows for offline access",
      description: "Take your workflows anywhere with seamless export functionality for complete operational flexibility.",
      phrase: "Access anywhere, anytime"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-primary-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-600 via-accent-500 to-accent-400 dark:from-accent-400 dark:via-accent-300 dark:to-accent-200 bg-clip-text text-transparent mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-300 max-w-2xl mx-auto">
            Discover the comprehensive tools that make Workflow Mach 3 the ultimate platform for streamlined operations.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group p-8 bg-primary-50 dark:bg-primary-800 rounded-xl border border-primary-200 dark:border-primary-600 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary-200 to-primary-300 dark:from-primary-700 dark:to-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-primary-700 dark:text-primary-200" />
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-accent-600 dark:text-accent-400 uppercase tracking-wide">
                    {feature.phrase}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-200 mb-3">{feature.title}</h3>
                <p className="text-primary-600 dark:text-primary-200 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;