
import React from 'react';
import { Orbit, Sparkles, Zap, Cloud, Rocket, Satellite, Leaf, Sprout, User } from 'lucide-react';

const LiveSpaceBackground: React.FC = () => {
  return (
    <div className="w-full h-full pointer-events-none overflow-hidden select-none">
      {/* --- INFRASTRUCTURE: Galaxies & Clouds --- */}
      <div className="absolute top-[10%] left-[5%] text-purple-400/20 animate-float" style={{ animationDelay: '0s' }}>
        <Orbit size={120} strokeWidth={1} />
      </div>
      <div className="absolute top-[40%] right-[10%] text-blue-400/20 animate-float" style={{ animationDelay: '-2s' }}>
        <Cloud size={180} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[20%] left-[15%] text-pink-400/10 animate-float" style={{ animationDelay: '-4s' }}>
        <Orbit size={240} strokeWidth={0.5} />
      </div>

      {/* --- STEM ELEMENTS: Astronaut (Stylized) --- */}
      <div className="absolute top-[15%] right-[20%] text-white/40 animate-float" style={{ animationDuration: '10s' }}>
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full scale-150 animate-pulse"></div>
          <User size={48} strokeWidth={1.5} className="relative z-10" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-3 bg-cyan-400/30 rounded-full blur-[2px]"></div>
        </div>
      </div>

      {/* --- STEM ELEMENTS: Rocket & Satellite --- */}
      <div className="absolute bottom-[30%] right-[35%] text-cyan-400/20 animate-float" style={{ animationDuration: '15s', animationDelay: '-5s' }}>
        <Rocket size={40} className="-rotate-45" />
      </div>
      <div className="absolute top-[60%] left-[8%] text-indigo-400/30 animate-float" style={{ animationDuration: '20s' }}>
        <Satellite size={32} />
      </div>

      {/* --- PLANT ELEMENTS: Floating Space Garden --- */}
      <div className="absolute top-[25%] left-[25%] text-green-400/20 animate-float" style={{ animationDuration: '9s', animationDelay: '-1s' }}>
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/10 blur-lg rounded-full animate-pulse"></div>
          <Sprout size={36} />
        </div>
      </div>
      <div className="absolute bottom-[15%] right-[15%] text-emerald-400/15 animate-float" style={{ animationDuration: '12s', animationDelay: '-3s' }}>
        <Leaf size={28} className="rotate-45" />
      </div>
      <div className="absolute top-[70%] right-[45%] text-green-400/10 animate-float" style={{ animationDuration: '14s' }}>
        <Sprout size={24} />
      </div>

      {/* --- COSMIC FX: Colliding/Pulsing Stars --- */}
      <div className="absolute top-[30%] right-[30%] text-yellow-200/40 animate-collide" style={{ animationDelay: '0.5s' }}>
        <Sparkles size={40} />
      </div>
      <div className="absolute bottom-[40%] left-[25%] text-white/30 animate-collide" style={{ animationDelay: '2.5s' }}>
        <Sparkles size={24} />
      </div>
      
      {/* Subtle Energy Zap */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400/5 animate-pulse">
        <Zap size={800} strokeWidth={0.05} />
      </div>

      {/* Glowing Blobs for Depth */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-[160px]" />
      <div className="absolute top-[30%] -right-40 w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-100px] left-1/2 w-[700px] h-[700px] bg-indigo-900/40 rounded-full blur-[180px]" />
    </div>
  );
};

export default LiveSpaceBackground;
