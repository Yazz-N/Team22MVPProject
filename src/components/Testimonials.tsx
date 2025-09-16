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
    <section id="testimonials" className="py-20 bg-purple-700 dark:bg-purple-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-600 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-300">
          </p>
          <p className="text-lg text-white">
            Discover how teams worldwide are transforming their operations with Workflow Mach 3.
          </p>
        </div>

        <div className="relative">
          <div className="bg-purple-600 rounded-2xl p-8 md:p-12 shadow-lg border border-purple-500 min-h-[300px] flex items-center">
            <div className="w-full text-center">
              {/* Star Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-600 text-accent-600" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-xl md:text-2xl text-white italic mb-8 leading-relaxed">
                "{testimonials[currentIndex].review}"
              </blockquote>

              {/* Reviewer Info */}
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-400"
                />
                <div className="text-left">
                  <div className="font-semibold text-white text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-purple-200">
                    {testimonials[currentIndex].title}
                  </div>
                  <div className="text-purple-300 text-sm">
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-purple-500 hover:bg-purple-400 rounded-full shadow-lg border border-purple-400 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-purple-500 hover:bg-purple-400 rounded-full shadow-lg border border-purple-400 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-accent-600 scale-110' 
                    : 'bg-purple-400 hover:bg-purple-300'
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