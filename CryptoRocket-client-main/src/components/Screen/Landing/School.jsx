import React, { useState, useEffect } from "react";

const School = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: "🎓", label: "Expert Training", color: "from-blue-400 to-cyan-400" },
    { icon: "🚀", label: "Fast Growth", color: "from-purple-400 to-pink-400" },
    { icon: "💎", label: "Exclusive Content", color: "from-yellow-400 to-orange-400" },
    { icon: "🏆", label: "Proven Results", color: "from-blue-400 to-emerald-400" }
  ];

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <style>
        {`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
          }
          
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 0.4; }
            100% { transform: scale(1.2); opacity: 0; }
          }
          
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes shimmer-text {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }

          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 40px rgba(33, 110, 255, 0.4), 0 0 80px rgba(33, 110, 255, 0.2); }
            50% { box-shadow: 0 0 60px rgba(33, 110, 255, 0.6), 0 0 120px rgba(33, 110, 255, 0.3); }
          }

          @keyframes slide-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
          .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 4s ease infinite;
          }
          .animate-shimmer-text {
            background-size: 200% auto;
            animation: shimmer-text 3s linear infinite;
          }
          .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
          .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
          .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
          
          .glass-card {
            background: rgba(11, 11, 11, 0.6);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .text-background {
            -webkit-text-stroke: 1px rgba(68, 158, 255, 0.3);
            text-shadow: 0 0 80px rgba(68, 158, 255, 0.5);
          }

          .feature-card-hover {
            transition: all 0.3s ease;
          }
          
          .feature-card-hover:hover {
            transform: translateY(-5px) scale(1.05);
          }
        `}
      </style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle, rgba(68, 158, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative container mx-auto px-2 lg:px-[115px]">
        {/* Giant Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none w-full">
          <h2 
            className="text-[120px] sm:text-[180px] lg:text-[280px] xl:text-[350px] font-black text-center text-background opacity-5"
            style={{
              background: 'linear-gradient(180deg, rgba(68, 158, 255, 0.4) 0%, rgba(14, 30, 60, 0.2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
            }}
          >
            SCHOOL
          </h2>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="animate-bounce-subtle mb-8">
            <div className="glass-card px-6 py-3 rounded-full flex items-center gap-3 shadow-lg">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse-ring" />
                <span className="relative text-3xl">🎓</span>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                EXCLUSIVE TRAINING PROGRAM
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-center leading-tight mb-6 animate-slide-up">
            <span className="block bg-gradient-to-br from-blue-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient-shift">
              Forsage School is an
            </span>
            <span className="block mt-2 bg-gradient-to-br from-cyan-200 via-blue-200 to-cyan-300 bg-clip-text text-transparent animate-gradient-shift" style={{ animationDelay: '0.5s' }}>
              exclusive training course
            </span>
            <span className="block mt-2 text-white">
              designed specifically for those who
            </span>
            <span className="block mt-2 relative inline-block">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-shimmer-text">
                unlock their full potential
              </span>
              <span className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full -z-10 animate-pulse" />
            </span>
            <span className="block mt-2 text-white">
              with <span className="text-blue-400 font-black">Forsage!</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg lg:text-xl text-gray-300 text-center max-w-3xl mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Transform your journey with expert-led courses, proven strategies, and a community of successful partners ready to help you succeed.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 w-full max-w-4xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center feature-card-hover"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className={`text-4xl mb-3 inline-block p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  {feature.icon}
                </div>
                <p className="text-sm font-semibold text-white">{feature.label}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <a
              href="https://school.forsage.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-75 group-hover:opacity-100 blur-lg transition duration-300 animate-glow-pulse" />
              
              {/* Button */}
              <button className="relative px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full font-bold text-lg text-white shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/50 flex items-center gap-3">
                <span>Start Learning Now</span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </a>

            {/* Secondary Button */}
            <a
              href="https://school.forsage.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <button className="px-10 py-5 glass-card border-2 border-blue-500/30 rounded-full font-bold text-lg text-white hover:bg-white/5 hover:border-blue-500 transition-all duration-300 group-hover:scale-105 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Preview</span>
              </button>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <p className="text-sm text-gray-400">Expert Lessons</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <p className="text-sm text-gray-400">Active Students</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-sm text-gray-400">Support Access</p>
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="mt-12 glass-card rounded-3xl p-8 max-w-3xl border-l-4 border-blue-500 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex md:items-start flex-col gap-4">
              <span className="text-5xl">💬</span>
              <div>
                <p className="text-gray-300 italic mb-4">
                  "Forsage School completely transformed my understanding of the platform. The training is comprehensive, practical, and delivered by people who truly know what they're doing."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                    JS
                  </div>
                  <div>
                    <p className="text-white font-semibold">John Smith</p>
                    <p className="text-sm text-gray-400">Top Performer, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-400 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Certified Training</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Community Access</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Proven Methods</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default School;