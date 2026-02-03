import React, { useState, useEffect } from 'react';

const techItems = [
  {
    title: 'Autonomy',
    content:
      'The Yumeko AI ecosystem is built around the technology of smart contracts and NFTs, which are completely autonomous and exclude the influence of the human factor.',
    icon: '🤖',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Unchanging conditions',
    content:
      'The conditions of the smart contract cannot be changed by anyone, including the developers. This ensures the stability and reliability of the platform.',
    icon: '🔒',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Transparency',
    content:
      'All transactions and operations are recorded on the blockchain and are available for public viewing. This ensures complete transparency of all processes.',
    icon: '👁️',
    color: 'from-blue-500 to-emerald-500'
  },
  {
    title: 'Full automation',
    content:
      'All processes in the Yumeko AI ecosystem are automated through smart contracts, eliminating the need for manual intervention and ensuring 24/7 operation.',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Decentralization',
    content:
      'The platform operates on a decentralized network, ensuring that no single entity has control over the system and making it resistant to censorship.',
    icon: '🌐',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    title: '100% online',
    content:
      'The platform operates entirely online, allowing users to participate from anywhere in the world at any time, without geographical restrictions.',
    icon: '📡',
    color: 'from-red-500 to-rose-500'
  },
];

const Technology1 = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate through items
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % techItems.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleItemClick = (index) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative container mx-auto mb-20 px-4 lg:px-[115px] py-20">
      <style>
        {`
          @keyframes float-up {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.5; }
          }
          
          @keyframes slide-in {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 20px rgba(33, 110, 255, 0.3); }
            50% { box-shadow: 0 0 40px rgba(33, 110, 255, 0.6); }
          }

          @keyframes border-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          
          .animate-float-up { animation: float-up 3s ease-in-out infinite; }
          .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
          .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }
          .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
          
          .glass-card {
            background: rgba(11, 11, 11, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .gradient-border {
            position: relative;
            background: linear-gradient(90deg, transparent, rgba(33, 110, 255, 0.5), transparent);
            background-size: 200% 100%;
            animation: border-flow 3s linear infinite;
          }
          
          .tech-item-active {
            background: linear-gradient(135deg, rgba(33, 110, 255, 0.2) 0%, rgba(33, 110, 255, 0.05) 100%);
            border: 1px solid rgba(33, 110, 255, 0.5);
          }
          
          .icon-bounce {
            animation: float-up 2s ease-in-out infinite;
          }
        `}
      </style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header Section */}
      <div className="relative flex flex-col items-center gap-6 max-w-[900px] mx-auto text-center mb-16">
        {/* Icon with Animated Ring */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse-ring" />
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl animate-float-up">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24">
              <path d="M11.625 16.5C12.1223 16.5 12.5992 16.3025 12.9508 15.9508C13.3025 15.5992 13.5 15.1223 13.5 14.625C13.5 14.1277 13.3025 13.6508 12.9508 13.2992C12.5992 12.9475 12.1223 12.75 11.625 12.75C11.1277 12.75 10.6508 12.9475 10.2992 13.2992C9.94754 13.6508 9.75 14.1277 9.75 14.625C9.75 15.1223 9.94754 15.5992 10.2992 15.9508C10.6508 16.3025 11.1277 16.5 11.625 16.5Z" fill="white" />
              <path fillRule="evenodd" clipRule="evenodd" d="M5.625 1.5H9C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V7.125C12.75 8.161 13.59 9 14.625 9H16.5C17.4946 9 18.4484 9.39509 19.1517 10.0983C19.8549 10.8016 20.25 11.7554 20.25 12.75V20.625C20.25 21.66 19.41 22.5 18.375 22.5H5.625C5.12772 22.5 4.65081 22.3025 4.29917 21.9508C3.94754 21.5992 3.75 21.1223 3.75 20.625V3.375C3.75 2.339 4.59 1.5 5.625 1.5Z" fill="white" />
              <path d="M14.2502 5.24992C14.2519 3.98846 13.7977 2.76888 12.9712 1.81592C14.6445 2.25588 16.1709 3.13239 17.3943 4.3558C18.6177 5.57922 19.4942 7.10563 19.9342 8.77892C18.9812 7.9524 17.7616 7.49817 16.5002 7.49992H14.6252C14.5257 7.49992 14.4304 7.46041 14.36 7.39008C14.2897 7.31976 14.2502 7.22437 14.2502 7.12492V5.24992Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Smart Contract Technology
          </span>
          <br />
          <span className="text-white">& NFT Innovation</span>
        </h2>

        {/* Description */}
        <p className="text-lg lg:text-xl text-gray-300 max-w-3xl leading-relaxed">
          Decentralized marketing powered by revolutionary blockchain technology. 
          Our open-source smart contract code ensures <span className="text-blue-400 font-semibold">safety</span> and 
          <span className="text-blue-400 font-semibold"> long-term performance</span>.
        </p>

        {/* Auto-play indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'}`} />
          <span>{isAutoPlaying ? 'Auto-playing features' : 'Paused'}</span>
        </div>
      </div>

      {/* Desktop Interactive View */}
      <div className="hidden lg:block relative">
        <div className="glass-card rounded-3xl p-10 max-w-[1200px] mx-auto shadow-2xl">
          <div className="flex gap-8">
            {/* Left Sidebar - Tech List */}
            <div className="flex flex-col gap-3 w-[280px]">
              {techItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(index)}
                  className={`group relative overflow-hidden text-left px-5 py-4 rounded-xl transition-all duration-300 ${
                    activeIndex === index
                      ? 'tech-item-active scale-105 shadow-lg'
                      : 'hover:bg-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Active indicator line */}
                  {activeIndex === index && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r" />
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl transform transition-transform ${
                      activeIndex === index ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      {item.icon}
                    </div>
                    <span className={`font-semibold ${
                      activeIndex === index ? 'text-white' : 'text-gray-300'
                    }`}>
                      {item.title}
                    </span>
                  </div>
                  
                  {/* Progress bar for active item */}
                  {activeIndex === index && isAutoPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500/30">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 animate-progress" 
                           style={{ animation: 'progress 4s linear' }} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Right Content Area */}
            <div className="flex-1 relative">
              <div className="animate-slide-in" key={activeIndex}>
                {/* Large Icon */}
                <div className="mb-6 inline-block">
                  <div className={`text-7xl icon-bounce bg-gradient-to-br ${techItems[activeIndex].color} w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl`}>
                    <span className="filter drop-shadow-lg">{techItems[activeIndex].icon}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-4xl font-bold mb-6 text-white">
                  {techItems[activeIndex].title}
                </h3>

                {/* Content */}
                <p className="text-xl text-gray-300 leading-relaxed max-w-[600px] mb-8">
                  {techItems[activeIndex].content}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300 font-medium">
                    Blockchain Verified
                  </span>
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium">
                    Open Source
                  </span>
                  <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300 font-medium">
                    Secure
                  </span>
                </div>

                {/* Decorative gradient overlay */}
                <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                     style={{ background: `linear-gradient(135deg, ${techItems[activeIndex].color.replace('from-', '').replace(' to-', ', ')})` }} />
              </div>
            </div>
          </div>

          {/* Bottom Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8 pt-6 border-t border-white/10">
            {techItems.map((_, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'w-12 bg-blue-500' 
                    : 'w-8 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View - Enhanced Cards */}
      <div className="lg:hidden space-y-4">
        {techItems.map((item, index) => (
          <div
            key={index}
            className="glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex md:items-start flex-col gap-4 mb-4">
              <div className={`flex-shrink-0 text-4xl w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed text-justify md:text-left">{item.content}</p>
              </div>
            </div>
            
            {/* Decorative bottom border */}
            <div className={`h-1 rounded-full bg-gradient-to-r ${item.color} opacity-50`} />
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
      </style>
    </section>
  );
};

export default Technology1;