import React from "react";
import { Wrench, Clock, Sparkles } from "lucide-react";

export default function Maintain() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[99]">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-700/50">
        
        {/* Animated top border */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-pulse"></div>

        {/* Content */}
        <div className="p-8">
          {/* Icon with animated background */}
          <div className="relative mb-6 flex justify-center">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]">
              <Wrench className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
            🚧 Website Under Maintenance 🚧
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-center mb-6 leading-relaxed">
            We're upgrading our website to serve you better! The site will be under maintenance and we'll be back{" "}
            <span className="font-semibold text-cyan-400">as soon as possible</span>.
          </p>

          {/* Feature badges */}
          <div className="flex justify-center gap-3 mb-6">
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Improved</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">As soon as possible</span>
            </div>
          </div>

          {/* Thank you message */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-4">
              Thank you for your patience — we'll be back soon with an improved experience.
            </p>

            {/* Animated dots */}
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-20 bg-gradient-to-t from-slate-950 to-transparent"></div>
      </div>
    </div>
  );
}
