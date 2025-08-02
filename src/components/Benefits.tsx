import React from 'react';
import { Clock, Target, Users, Shield } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Saving Time',
      description: 'Streamline your processes and eliminate redundant tasks with automated workflows.',
      color: 'text-primary-600 dark:text-primary-400',
      phrase: 'Elevate your team\'s productivity instantly'
    },
    {
      icon: Target,
      title: 'Enhanced Accuracy',
      description: 'Reduce errors with standardised procedures and real-time validation checks.',
      color: 'text-accent-600 dark:text-accent-400',
      phrase: 'Transform your product management in real time'
    },
    {
      icon: Users,
      title: 'Better Collaboration',
      description: 'Foster seamless teamwork with centralised communication and shared resources.',
      color: 'text-primary-600 dark:text-primary-400',
      phrase: 'Centralise your workflow with ease'
    },
    {
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Protect your workflows with enterprise-grade security and compliance standards.',
      color: 'text-secondary-700 dark:text-secondary-500',
      phrase: 'Secure your operations with confidence'
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-secondary-50/50 dark:bg-primary-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-700 dark:text-white mb-4">
            Why Choose Workflow Mach 3?
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-400 max-w-2xl mx-auto">
            Discover how our platform revolutionises your team's productivity and operational excellence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="group p-8 bg-white dark:bg-secondary-800 rounded-xl border border-primary-200 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-secondary-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 ${benefit.color}`} />
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-primary-500 dark:text-primary-400 uppercase tracking-wide">
                    {benefit.phrase}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-primary-700 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-primary-600 dark:text-primary-400 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;