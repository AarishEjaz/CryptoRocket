import React, { useState, useEffect } from "react";

const Partners1 = () => {
  const [selected, setSelected] = useState("total");
  const [animatedStats, setAnimatedStats] = useState({
    accounts: 0,
    totalUSD: 0
  });
  const [copiedAddress, setCopiedAddress] = useState(null);

  const statsData = {
    total: {
      accounts: 3475770,
      accountsChange: "+225",
      totalUSD: 1471629306,
      usdChange: "+3,920",
      icon: "🌐",
      color: "from-blue-500 to-cyan-500"
    },
    eth: {
      accounts: 1230000,
      accountsChange: "+150",
      totalUSD: 750000000,
      usdChange: "+2,100",
      icon: "⟠",
      color: "from-purple-500 to-indigo-500"
    },
    tron: {
      accounts: 980000,
      accountsChange: "+60",
      totalUSD: 450000000,
      usdChange: "+1,200",
      icon: "⚡",
      color: "from-red-500 to-orange-500"
    },
    busd: {
      accounts: 1265770,
      accountsChange: "+15",
      totalUSD: 271629306,
      usdChange: "+620",
      icon: "💰",
      color: "from-yellow-500 to-blue-500"
    },
  };

  const contracts = [
    { label: "ETH", value: "0x5acc84e5C26885e1D43f88c6C11598667FB97", network: "Ethereum", color: "from-purple-500 to-indigo-500" },
    { label: "TRON", value: "TREbhaFEYekP1uCtLRdJLBXz4D5vzzgBVp", network: "Tron Network", color: "from-red-500 to-orange-500" },
    { label: "BUSD", value: "0x5acc84e5C26885e1D43f88c6C11598667FB97", network: "BSC Chain", color: "from-yellow-500 to-blue-500" },
  ];

  // Animate numbers when selection changes
  useEffect(() => {
    const targetAccounts = statsData[selected].accounts;
    const targetUSD = statsData[selected].totalUSD;
    
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        accounts: Math.floor(targetAccounts * easeOut),
        totalUSD: Math.floor(targetUSD * easeOut)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          accounts: targetAccounts,
          totalUSD: targetUSD
        });
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [selected]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(index);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <section className="relative py-20 overflow-hidden" id="about">
      <style>
        {`
          @keyframes float-stats {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 30px rgba(33, 110, 255, 0.3); }
            50% { box-shadow: 0 0 60px rgba(33, 110, 255, 0.6); }
          }
          
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes shimmer-bg {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }

          @keyframes counter-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes checkmark {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: 0; }
          }
          
          .animate-float-stats { animation: float-stats 4s ease-in-out infinite; }
          .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
          .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
          .animate-counter-up { animation: counter-up 0.4s ease-out forwards; }
          
          .glass-card {
            background: rgba(11, 11, 11, 0.6);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .shimmer-bg {
            background: linear-gradient(90deg, 
              transparent 0%, 
              rgba(255, 255, 255, 0.03) 50%, 
              transparent 100%);
            background-size: 200% 100%;
            animation: shimmer-bg 3s ease-in-out infinite;
          }
          
          .stat-card-active {
            background: linear-gradient(135deg, rgba(33, 110, 255, 0.15) 0%, rgba(33, 110, 255, 0.05) 100%);
            border: 1px solid rgba(33, 110, 255, 0.4);
          }

          .checkmark-animate {
            stroke-dasharray: 100;
            animation: checkmark 0.5s ease-out forwards;
          }
        `}
      </style>

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative container mx-auto md:px-4 lg:px-[115px] space-y-16">
        {/* Header */}
        <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto text-center">
          {/* Animated Icon */}
          <div className="relative animate-float-stats">
            <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse-glow" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.25 2.25C2.05109 2.25 1.86032 2.32902 1.71967 2.46967C1.57902 2.61032 1.5 2.80109 1.5 3V12C1.5 12.1989 1.57902 12.3897 1.71967 12.5303C1.86032 12.671 2.05109 12.75 2.25 12.75H12C12.1989 12.75 12.3897 12.671 12.5303 12.5303C12.671 12.3897 12.75 12.1989 12.75 12V3C12.75 2.80109 12.671 2.61032 12.5303 2.46967C12.3897 2.32902 12.1989 2.25 12 2.25H2.25ZM12 14.25H2.25C1.65326 14.25 1.08097 14.0129 0.65901 13.591C0.237053 13.169 0 12.5967 0 12V3C0 2.40326 0.237053 1.83097 0.65901 1.40901C1.08097 0.987053 1.65326 0.75 2.25 0.75H12C12.5967 0.75 13.169 0.987053 13.591 1.40901C14.0129 1.83097 14.25 2.40326 14.25 3V12C14.25 12.5967 14.0129 13.169 13.591 13.591C13.169 14.0129 12.5967 14.25 12 14.25Z" fill="white"/>
                <path d="M21.75 9.75H15.75C15.5511 9.75 15.3603 9.82902 15.2197 9.96967C15.079 10.1103 15 10.3011 15 10.5V21C15 21.1989 15.079 21.3897 15.2197 21.5303C15.3603 21.671 15.5511 21.75 15.75 21.75H21.75C21.9489 21.75 22.1397 21.671 22.2803 21.5303C22.421 21.3897 22.5 21.1989 22.5 21V10.5C22.5 10.3011 22.421 10.1103 22.2803 9.96967C22.1397 9.82902 21.9489 9.75 21.75 9.75ZM21.75 23.25H15.75C15.1533 23.25 14.581 23.0129 14.159 22.591C13.7371 22.169 13.5 21.5967 13.5 21V10.5C13.5 9.90326 13.7371 9.33097 14.159 8.90901C14.581 8.48705 15.1533 8.25 15.75 8.25H21.75C22.3467 8.25 22.919 8.48705 23.341 8.90901C23.7629 9.33097 24 9.90326 24 10.5V21C24 21.5967 23.7629 22.169 23.341 22.591C22.919 23.0129 22.3467 23.25 21.75 23.25Z" fill="white"/>
                <path d="M2.25 23.25C1.65326 23.25 1.08097 23.0129 0.65901 22.591C0.237053 22.169 0 21.5967 0 21V15.75C0 15.1533 0.237053 14.581 0.65901 14.159C1.08097 13.7371 1.65326 13.5 2.25 13.5H8.25C8.84674 13.5 9.41903 13.7371 9.84099 14.159C10.2629 14.581 10.5 15.1533 10.5 15.75V21C10.5 21.5967 10.2629 22.169 9.84099 22.591C9.41903 23.0129 8.84674 23.25 8.25 23.25H2.25Z" fill="white"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Partner Results
            </span>
            <br />
            <span className="text-white">Verified on Blockchain</span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl">
            All data is stored in the blockchain and can be publicly verified. 
            <span className="text-blue-400 font-semibold"> 100% transparent</span> and 
            <span className="text-cyan-400 font-semibold"> immutable</span>.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Live Data</span>
            </div>
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-300">Blockchain Verified</span>
            </div>
          </div>
        </div>

        {/* Stats Cards Container */}
        <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
          {/* Main Stats Card */}
          <div className="glass-card rounded-3xl md:p-8 p-2 lg:p-10 shadow-2xl overflow-hidden relative">
            {/* Shimmer Background */}
            <div className="absolute inset-0 shimmer-bg pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              {/* Network Selector */}
              <div className="flex justify-center">
                <div className="glass-card rounded-full p-1.5 inline-flex gap-1 md:justify-center overflow-x-auto">
                  {Object.keys(statsData).map((item) => (
                    <button
                      key={item}
                      onClick={() => setSelected(item)}
                      className={`relative px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                        selected === item
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span className="text-xl">{statsData[item].icon}</span>
                        <span className="capitalize">{item}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Display */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Accounts Count */}
                <div className="text-center lg:text-left space-y-4 animate-counter-up">
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-base font-medium">Accounts Count</span>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-3">
                    <span className={`text-5xl lg:text-6xl font-bold bg-gradient-to-r ${statsData[selected].color} bg-clip-text text-transparent`}>
                      {formatNumber(animatedStats.accounts)}
                    </span>
                    <div className="glass-card px-4 py-2 rounded-full">
                      <span className="text-blue-400 font-bold text-xl">
                        {statsData[selected].accountsChange}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Active participants on the platform</p>
                </div>

                {/* Total USD */}
                <div className="text-center lg:text-left space-y-4 animate-counter-up" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base font-medium">Total Result (USD)</span>
                  </div>
                  <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-3">
                    <span className={`text-5xl lg:text-6xl font-bold bg-gradient-to-r ${statsData[selected].color} bg-clip-text text-transparent`}>
                      ${formatNumber(animatedStats.totalUSD)}
                    </span>
                    <div className="glass-card px-4 py-2 rounded-full">
                      <span className="text-blue-400 font-bold text-xl">
                        {statsData[selected].usdChange}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Total earnings distributed to partners</p>
                </div>
              </div>

              {/* Additional Info Bar */}
              <div className="glass-card rounded-2xl p-4 border-l-4 border-blue-500">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <p className="text-sm text-gray-300">
                    Data updates in real-time from blockchain transactions. Last updated: <span className="text-blue-400 font-semibold">Just now</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Contracts Card */}
          <div className="glass-card rounded-3xl p-2 lg:p-10 shadow-2xl overflow-hidden relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Header */}
            <div className="flex items-center md:flex-row flex-col gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">Smart Contract Addresses</h3>
                <p className="text-sm text-gray-400">Verified and audited on blockchain</p>
              </div>
            </div>

            {/* Contract List */}
            <div className="space-y-4">
              {contracts.map((contract, index) => (
                <div
                  key={index}
                  className="group glass-card rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Side - Network Info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${contract.color} flex items-center justify-center shadow-lg`}>
                        <span className="text-2xl font-bold text-white">{contract.label[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold text-white">{contract.label}</h4>
                          <span className="glass-card px-2 py-1 rounded text-xs text-blue-400 font-medium">x3 / x4</span>
                        </div>
                        <p className="text-sm text-gray-400">{contract.network}</p>
                      </div>
                    </div>

                    {/* Right Side - Address & Actions */}
                    <div className="flex items-center gap-3">
                      <div className="glass-card px-4 py-2 rounded-lg font-mono text-sm text-gray-300 max-w-xs overflow-hidden">
                        <span className="block truncate">{contract.value}</span>
                      </div>
                      
                      {/* Copy Button */}
                      <button
                        onClick={() => copyToClipboard(contract.value, index)}
                        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 group-hover:scale-110"
                      >
                        {copiedAddress === index ? (
                          <svg className="w-5 h-5 text-blue-400 checkmark-animate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>

                      {/* View on Explorer */}
                      <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 group-hover:scale-110">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Badge */}
            <div className="mt-6 glass-card rounded-xl p-4 border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-300">
                  <span className="text-blue-400 font-semibold">Security Audited</span> - All contracts are open-source and have been audited by independent security firms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners1;