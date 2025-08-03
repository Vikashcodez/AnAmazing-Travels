import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const TravelHero = () => {
  const mountRef = useRef(null);
  const [displayText, setDisplayText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  
  const welcomeText = "Welcome to TravelExplorer";
  const dynamicTexts = [
    "Where Adventures Begin",
    "Discover Your Next Journey",
    "Luxury Travel Experiences",
    "Explore Beyond Boundaries"
  ];

  // Three.js Background with Floating Particles
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x4a6bff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.x += 0.0001;
      particlesMesh.rotation.y += 0.0002;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Typing animation for welcome text
  useEffect(() => {
    let charIndex = 0;
    const typeWelcome = () => {
      if (charIndex < welcomeText.length) {
        setDisplayText(prev => prev + welcomeText.charAt(charIndex));
        charIndex++;
        setTimeout(typeWelcome, 100);
      } else {
        setTypingComplete(true);
      }
    };
    
    typeWelcome();
    
    return () => clearTimeout(typeWelcome);
  }, []);

  // Rotating text animation after welcome text completes
  useEffect(() => {
    if (!typingComplete) return;
    
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 100;
    
    const typeDynamicText = () => {
      const fullText = dynamicTexts[currentIndex];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
        typingSpeed = 50;
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
        typingSpeed = 100;
      }
      
      setDisplayText(`${welcomeText}\n${currentText}`);
      
      if (!isDeleting && currentText === fullText) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % dynamicTexts.length;
        typingSpeed = 500;
      }
      
      setTimeout(typeDynamicText, typingSpeed);
    };
    
    const timer = setTimeout(typeDynamicText, 1000);
    
    return () => clearTimeout(timer);
  }, [typingComplete]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 to-blue-950">
      {/* Three.js Background */}
      <div ref={mountRef} className="absolute inset-0 z-0 opacity-30" />
      
      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Typing Animation Container */}
        <div className="min-h-[200px] sm:min-h-[250px] flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white whitespace-pre-line leading-tight">
            {displayText}
            <span className="ml-1 inline-block w-1 h-8 sm:h-10 bg-blue-400 animate-pulse"></span>
          </h1>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <button className="relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 group overflow-hidden">
            <span className="relative z-10">Explore Destinations</span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
          <button className="relative px-8 py-4 bg-transparent border-2 border-blue-400 text-blue-100 hover:text-white font-semibold rounded-lg transition-all duration-300 group overflow-hidden">
            <span className="relative z-10">View Packages</span>
            <span className="absolute inset-0 bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce">
          <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TravelHero;