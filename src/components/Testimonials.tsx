import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      review: "Workflow Mach 3 has saved us countless hours by streamlining our processes. What used to take days now happens in hours.",
      name: "Sarah Mitchell",
      title: "Senior Product Manager",
      company: "TechFlow Solutions",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      review: "Our team collaboration has greatly improved thanks to the real-time updates. Everyone stays in sync effortlessly.",
      name: "James Rodriguez",
      title: "Head of Product Operations",
      company: "InnovateCorp",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      review: "The platform's customisation options have allowed us to perfectly tailor our workflows to our specific needs. It's like having a bespoke solution.",
      name: "Emily Chen",
      title: "Director of Product Management",
      company: "Streamline Dynamics",
      image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      review: "Using this system has significantly boosted our productivity and efficiency. Our team delivers results faster than ever before.",
      name: "Michael Thompson",
      title: "VP of Product Strategy",
      company: "Efficiency Partners",
      image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50/30 dark:from-secondary-800 dark:to-primary-900/30">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 dark:text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-secondary-700 dark:text-secondary-400">
            Discover how teams worldwide are transforming their operations with Workflow Mach 3.
          </p>
        </div>

        <div className="relative">
          <div className="bg-white dark:bg-secondary-700 rounded-2xl p-8 md:p-12 shadow-lg border border-secondary-100 dark:border-secondary-600 min-h-[300px] flex items-center">
            <div className="w-full text-center">
              {/* Star Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary-400 text-secondary-400" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-xl md:text-2xl text-secondary-800 dark:text-secondary-300 italic mb-8 leading-relaxed">
                "{testimonials[currentIndex].review}"
              </blockquote>

              {/* Reviewer Info */}
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-secondary-200 dark:border-secondary-600"
                />
                <div className="text-left">
                  <div className="font-semibold text-secondary-800 dark:text-white text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-secondary-700 dark:text-secondary-400">
                    {testimonials[currentIndex].title}
                  </div>
                  <div className="text-secondary-600 dark:text-secondary-500 text-sm">
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white dark:bg-secondary-700 hover:bg-primary-50 dark:hover:bg-secondary-600 rounded-full shadow-lg border border-primary-200 dark:border-secondary-600 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-primary-600 dark:text-secondary-400" />
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white dark:bg-secondary-700 hover:bg-primary-50 dark:hover:bg-secondary-600 rounded-full shadow-lg border border-primary-200 dark:border-secondary-600 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-primary-600 dark:text-secondary-400" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-primary-600 dark:bg-primary-400 scale-110' 
                    : 'bg-primary-300 dark:bg-secondary-600 hover:bg-primary-400 dark:hover:bg-secondary-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;