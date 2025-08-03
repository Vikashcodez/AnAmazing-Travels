import React, { useEffect, useRef } from 'react';
import { MapPin, Users, Award, Globe, Heart, Star, Compass, Camera, Ship, Leaf, ArrowDown } from 'lucide-react';

const AboutPage = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    // Import GSAP with ScrollTrigger
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    
    const scrollTriggerScript = document.createElement('script');
    scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
    
    gsapScript.onload = () => {
      scrollTriggerScript.onload = () => {
        const { gsap } = window;
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero animations
        gsap.fromTo('.hero-title', 
          { opacity: 0, y: 80, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
        );
        
        gsap.fromTo('.hero-subtitle', 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
        );
        
        gsap.fromTo('.hero-description', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power3.out' }
        );

        gsap.fromTo('.hero-badges', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, delay: 0.9, ease: 'power3.out' }
        );

        // Floating animation for hero elements
        gsap.to('.floating-1', {
          y: -15,
          duration: 4,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        });

        gsap.to('.floating-2', {
          y: -10,
          x: 10,
          duration: 3,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.5
        });

        // Scroll-triggered animations for story section
        gsap.fromTo('.story-content', 
          { opacity: 0, x: -80 },
          { 
            opacity: 1, 
            x: 0, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: storyRef.current,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        gsap.fromTo('.story-image', 
          { opacity: 0, x: 80, rotateY: 15 },
          { 
            opacity: 1, 
            x: 0, 
            rotateY: 0,
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: storyRef.current,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Values cards staggered animation
        gsap.fromTo('.value-card', 
          { opacity: 0, y: 60, scale: 0.8 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.8, 
            stagger: 0.15,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: valuesRef.current,
              start: 'top 70%',
              end: 'bottom 30%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Team cards wave animation
        gsap.fromTo('.team-card', 
          { opacity: 0, y: 50, rotateX: 15 },
          { 
            opacity: 1, 
            y: 0,
            rotateX: 0,
            duration: 0.8, 
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: teamRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Parallax scrolling effects
        gsap.to('.parallax-slow', {
          y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true
          }
        });

        // Section reveal animations
        gsap.utils.toArray('.section-reveal').forEach(section => {
          gsap.fromTo(section, 
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'bottom 15%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });

        // Continuous scroll indicator animation
        gsap.to('.scroll-indicator', {
          y: 10,
          duration: 1.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        });
      };
      
      document.head.appendChild(scrollTriggerScript);
    };
    
    document.head.appendChild(gsapScript);

    // Cleanup
    return () => {
      if (document.head.contains(gsapScript)) {
        document.head.removeChild(gsapScript);
      }
      if (document.head.contains(scrollTriggerScript)) {
        document.head.removeChild(scrollTriggerScript);
      }
    };
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Passionate Service',
      description: 'We pour our hearts into creating unforgettable experiences that exceed your expectations and create lasting memories.'
    },
    {
      icon: Leaf,
      title: 'Sustainable Tourism',
      description: 'Committed to preserving the pristine beauty of Andaman while supporting local communities and ecosystems.'
    },
    {
      icon: Globe,
      title: 'Expert Knowledge',
      description: 'Deep local expertise combined with international standards to deliver world-class adventures and authentic experiences.'
    },
    {
      icon: Compass,
      title: 'Authentic Adventures',
      description: 'Discover hidden gems and authentic experiences beyond typical tourist destinations with our local insights.'
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      specialty: 'Marine Biology & Island Ecology',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      specialty: 'Hospitality & Customer Experience',
      color: 'from-teal-500 to-green-500'
    },
    {
      name: 'Captain Arjun',
      role: 'Marine Operations',
      specialty: 'Deep Sea Diving & Water Sports',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Maya Singh',
      role: 'Cultural Guide',
      specialty: 'Local History & Tribal Culture',
      color: 'from-green-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="parallax-slow absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-30" data-speed="0.3"></div>
        <div className="parallax-slow absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-teal-100 to-green-100 rounded-full blur-2xl opacity-40" data-speed="0.5"></div>
        <div className="parallax-slow absolute bottom-40 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-20" data-speed="0.4"></div>
        <div className="parallax-slow absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-to-r from-green-100 to-teal-100 rounded-full blur-xl opacity-50" data-speed="0.6"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="floating-1 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg">
              <MapPin className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Andaman & Nicobar Islands</span>
            </div>
          </div>
          
          <h1 className="hero-title text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            World Trek
          </h1>
          
          <p className="hero-subtitle text-2xl md:text-3xl font-light mb-8 text-gray-600">
            Your Gateway to Paradise
          </p>
          
          <p className="hero-description text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-12">
            Discover the untouched beauty of the Andaman Islands through expertly crafted adventures. 
            From pristine beaches to vibrant coral reefs, we create memories that last a lifetime.
          </p>

          <div className="hero-badges flex justify-center gap-6 mb-16">
            <div className="floating-2 flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <Ship className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-700">Island Hopping</span>
            </div>
            <div className="floating-1 flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <Camera className="w-6 h-6 text-teal-600" />
              <span className="font-medium text-gray-700">Photography Tours</span>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Discover More</span>
            <ArrowDown className="w-6 h-6 text-teal-600" />
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="section-reveal py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="story-content">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded in 2016 by marine biologist Rajesh Kumar, World Trek began as a passion project 
              to share the incredible biodiversity and cultural richness of the Andaman Islands with 
              the world.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              What started as small group expeditions has grown into a premier travel company, 
              but our commitment remains unchanged: to provide authentic, sustainable, and 
              transformative experiences that connect travelers with the soul of these magical islands.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Award className="w-6 h-6 text-teal-600" />
                <span className="font-medium text-gray-700">Certified Eco-Tourism Operator</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <Globe className="w-6 h-6 text-blue-600" />
                <span className="font-medium text-gray-700">International Safety Standards</span>
              </div>
            </div>
          </div>
          
          <div className="story-image relative">
            <div className="aspect-square bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Camera className="w-24 h-24 text-white/90" />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15"></div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="section-reveal py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide every adventure we create
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="value-card p-8 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="section-reveal py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate experts dedicated to creating your perfect island adventure
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="team-card text-center p-8 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-reveal py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Ready for Your Adventure?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Let us craft the perfect Andaman experience tailored just for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Plan Your Trip
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:border-gray-400">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;