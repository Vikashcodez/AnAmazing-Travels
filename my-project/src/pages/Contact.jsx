import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, User, MessageSquare, 
  Calendar, Users, Star, CheckCircle, Facebook, Instagram, 
  Twitter, Youtube, Globe, Compass, Ship, Camera, ArrowRight
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    travelDate: '',
    groupSize: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const heroRef = useRef(null);
  const contactInfoRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);

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
          { opacity: 0, y: 60, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
        );
        
        gsap.fromTo('.hero-subtitle', 
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
        );

        // Floating animations
        gsap.to('.floating-1', {
          y: -20,
          duration: 3,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        });

        gsap.to('.floating-2', {
          y: -15,
          x: 10,
          duration: 4,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
          delay: 0.5
        });

        // Contact info cards animation
        gsap.fromTo('.contact-card', 
          { opacity: 0, y: 50, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.8, 
            stagger: 0.15,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: contactInfoRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Form animation
        gsap.fromTo('.form-container', 
          { opacity: 0, x: -50 },
          { 
            opacity: 1, 
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Map animation
        gsap.fromTo('.map-container', 
          { opacity: 0, x: 50 },
          { 
            opacity: 1, 
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mapRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        // Parallax effects
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

        // Section reveals
        gsap.utils.toArray('.section-reveal').forEach(section => {
          gsap.fromTo(section, 
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        });

      };
      
      document.head.appendChild(scrollTriggerScript);
    };
    
    document.head.appendChild(gsapScript);

    return () => {
      if (document.head.contains(gsapScript)) {
        document.head.removeChild(gsapScript);
      }
      if (document.head.contains(scrollTriggerScript)) {
        document.head.removeChild(scrollTriggerScript);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        travelDate: '',
        groupSize: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 9876 543 210', '+91 9876 543 211'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@worldtrek.com', 'bookings@worldtrek.com'],
      color: 'from-teal-500 to-green-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Marine Drive, Port Blair', 'Andaman & Nicobar Islands'],
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Mon - Sat: 9:00 AM - 7:00 PM', 'Sun: 10:00 AM - 4:00 PM'],
      color: 'from-green-500 to-teal-500'
    }
  ];

  const socialLinks = [
    { icon: Facebook, color: 'hover:text-blue-600', bg: 'hover:bg-blue-50' },
    { icon: Instagram, color: 'hover:text-pink-600', bg: 'hover:bg-pink-50' },
    { icon: Twitter, color: 'hover:text-blue-400', bg: 'hover:bg-blue-50' },
    { icon: Youtube, color: 'hover:text-red-600', bg: 'hover:bg-red-50' }
  ];

  const quickServices = [
    { icon: Ship, title: 'Island Hopping', desc: 'Multi-island adventures' },
    { icon: Camera, title: 'Photography Tours', desc: 'Capture memories' },
    { icon: Compass, title: 'Adventure Sports', desc: 'Thrilling activities' },
    { icon: Globe, title: 'Cultural Tours', desc: 'Local experiences' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="parallax-slow absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-20" data-speed="0.3"></div>
        <div className="parallax-slow absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-teal-100 to-green-100 rounded-full blur-2xl opacity-30" data-speed="0.5"></div>
        <div className="parallax-slow absolute bottom-40 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-15" data-speed="0.4"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center px-6 pt-20">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="floating-1 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg">
              <MapPin className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Let's Plan Your Adventure</span>
            </div>
          </div>
          
          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          
          <p className="hero-subtitle text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ready to explore the pristine beauty of Andaman Islands? Get in touch with our travel experts 
            and let's create your perfect island adventure together.
          </p>

          <div className="floating-2 mt-12 flex justify-center gap-4">
            {quickServices.map((service, index) => (
              <div key={index} className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <service.icon className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-700">{service.title}</p>
                  <p className="text-xs text-gray-500">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section ref={contactInfoRef} className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-card bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 mb-1">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div ref={formRef} className="form-container">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Send us a Message
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-gray-600">Your message has been sent successfully. We'll get back to you soon!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 peer"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-4 top-4 text-gray-500 transition-all duration-300 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-teal-600 peer-valid:-translate-y-2 peer-valid:scale-75">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 peer"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-4 top-4 text-gray-500 transition-all duration-300 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-teal-600 peer-valid:-translate-y-2 peer-valid:scale-75">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                        placeholder="Phone Number"
                      />
                    </div>
                    
                    <div className="relative">
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                        required
                      >
                        <option value="">Select Service</option>
                        <option value="island-hopping">Island Hopping</option>
                        <option value="photography">Photography Tours</option>
                        <option value="adventure">Adventure Sports</option>
                        <option value="cultural">Cultural Tours</option>
                        <option value="custom">Custom Package</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="date"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="relative">
                      <select
                        name="groupSize"
                        value={formData.groupSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Group Size</option>
                        <option value="1-2">1-2 People</option>
                        <option value="3-5">3-5 People</option>
                        <option value="6-10">6-10 People</option>
                        <option value="10+">10+ People</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us about your dream vacation..."
                      required
                    ></textarea>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Map and Additional Info */}
          <div ref={mapRef} className="map-container space-y-8">
            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Find Us</h3>
              <div className="aspect-video bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-500">Marine Drive, Port Blair</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <button
                    key={index}
                    className={`w-14 h-14 rounded-xl border border-gray-200 flex items-center justify-center transition-all duration-300 ${social.color} ${social.bg} hover:scale-110 hover:shadow-lg`}
                  >
                    <social.icon className="w-6 h-6" />
                  </button>
                ))}
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                Stay updated with our latest adventures and travel tips!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="section-reveal py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-teal-600 mb-2">24/7</div>
              <p className="text-gray-600">Customer Support</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">48hr</div>
              <p className="text-gray-600">Response Time</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-cyan-600 mb-2">100%</div>
              <p className="text-gray-600">Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;