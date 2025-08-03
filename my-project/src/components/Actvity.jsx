import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaUmbrellaBeach, FaHiking, FaSwimmer, FaParachuteBox, FaShip, FaFish } from 'react-icons/fa';
import { GiSailboat, GiIsland, GiWaveSurfer } from 'react-icons/gi';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ActivitiesSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const titleRef = useRef(null);

  // Store hover animation functions so we can remove them later
  const hoverHandlers = useRef([]);

  // Add to cards ref array
  const addToCardsRef = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Set initial styles before animation
    gsap.set(titleRef.current, { opacity: 0, y: 20 });
    gsap.set(cardsRef.current, { opacity: 0, y: 30 });

    // Animate title
    gsap.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none none",
        once: true
      }
    });

    // Animate cards with stable positioning
    cardsRef.current.forEach((card, index) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true
        }
      });

      // Create hover animation functions
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -5,
          scale: 1.03,
          duration: 0.3,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        });
      };

      // Add event listeners
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      // Store handlers for cleanup
      hoverHandlers.current.push({
        card,
        handleMouseEnter,
        handleMouseLeave
      });
    });

    return () => {
      // Clean up ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Clean up event listeners
      hoverHandlers.current.forEach(({ card, handleMouseEnter, handleMouseLeave }) => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
      hoverHandlers.current = [];
    };
  }, []);

  const activities = [
    {
      icon: <FaUmbrellaBeach className="w-12 h-12 text-indigo-600" />,
      title: "Beach Relaxation",
      description: "Unwind on pristine beaches with crystal clear waters."
    },
    {
      icon: <FaHiking className="w-12 h-12 text-indigo-600" />,
      title: "Island Hiking",
      description: "Explore lush tropical trails with breathtaking views."
    },
    {
      icon: <FaSwimmer className="w-12 h-12 text-indigo-600" />,
      title: "Snorkeling",
      description: "Discover vibrant coral reefs and marine life."
    },
    {
      icon: <FaParachuteBox className="w-12 h-12 text-indigo-600" />,
      title: "Parasailing",
      description: "Soar above the ocean for unforgettable views."
    },
    {
      icon: <GiSailboat className="w-12 h-12 text-indigo-600" />,
      title: "Sailing Tours",
      description: "Glide across turquoise waters in luxury."
    },
    {
      icon: <FaFish className="w-12 h-12 text-indigo-600" />,
      title: "Scuba Diving",
      description: "Dive into underwater worlds with experts."
    }
  ];

  return (
    <div 
      ref={sectionRef}
      className="min-h-screenbg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16" ref={titleRef}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-indigo-600">Adventure Activities</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience unforgettable moments with our carefully curated selection of activities.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div
              key={index}
              ref={addToCardsRef}
              className="bg-white rounded-xl p-6 shadow-md transform transition-all duration-300 hover:shadow-lg border border-gray-200"
            >
              <div className="flex justify-center mb-5">
                <div className="bg-indigo-50 p-4 rounded-full">
                  {activity.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-3">{activity.title}</h3>
              <p className="text-gray-600 text-center">{activity.description}</p>
              <div className="mt-6 text-center">
                <button className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready for your next adventure?</h3>
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
            Book Your Activities Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesSection;