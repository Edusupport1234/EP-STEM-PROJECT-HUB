
import React from 'react';
import { Search, User as UserIcon, Plus, ChevronDown, MessageSquare, Trophy, Home, LogOut } from 'lucide-react';
import LiveSpaceBackground from './LiveSpaceBackground';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onSearch: (val: string) => void;
  onHome: () => void;
  onCreate: () => void;
  onCommunity: () => void;
  onChallenges: () => void;
  onLogout: () => void;
  activeView: string;
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ children, onSearch, onHome, onCreate, onCommunity, onChallenges, onLogout, activeView, user }) => {
  const isHomeActive = activeView === 'grid' || activeView === 'detail';
  const isDiscussionsActive = activeView === 'community';
  const isChallengesActive = activeView === 'challenges';

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* GLOBAL LIVE WALLPAPER */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${activeView === 'community' ? 'opacity-30' : 'opacity-100'}`}>
        <LiveSpaceBackground />
      </div>

      {/* Top Navbar */}
      <header className="bg-[#6b1e8e]/95 backdrop-blur-xl text-white sticky top-0 z-50 border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div 
              className="flex items-center cursor-pointer group shrink-0"
              onClick={onHome}
            >
              <div className="flex flex-col items-center">
                <div className="flex items-baseline space-x-0.5">
                   <span className="text-[#f43f5e] font-black text-2xl italic leading-none group-hover:rotate-[-5deg] transition-transform">S</span>
                   <span className="text-[#fbbf24] font-black text-2xl italic leading-none group-hover:translate-y-[-2px] transition-transform">T</span>
                   <span className="text-[#10b981] font-black text-2xl italic leading-none group-hover:translate-y-[2px] transition-transform">E</span>
                   <span className="text-[#0ea5e9] font-black text-2xl italic leading-none group-hover:rotate-[5deg] transition-transform">M</span>
                </div>
                <div className="bg-[#0ea5e9] px-2 py-0.5 mt-0.5 rounded-sm">
                   <span className="text-white text-[9px] font-black tracking-[0.2em] uppercase leading-none">ACADEMY</span>
                </div>
              </div>
            </div>

            {/* Navigation - Page Toggles */}
            <nav className="hidden lg:flex items-center justify-center space-x-12 text-[12px] font-black uppercase tracking-[0.15em] flex-grow">
               <button 
                onClick={onHome} 
                className={`transition-all relative py-2 flex items-center space-x-2 group ${isHomeActive ? 'text-yellow-400' : 'text-white/60 hover:text-white'}`}
               >
                 <Home className={`w-4 h-4 transition-transform group-hover:scale-110 ${isHomeActive ? 'fill-yellow-400/20' : ''}`} />
                 <span>HOME</span>
                 {isHomeActive && (
                   <div className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
                 )}
               </button>

               <button 
                onClick={onCommunity} 
                className={`transition-all relative py-2 flex items-center space-x-2 group ${isDiscussionsActive ? 'text-yellow-400' : 'text-white/60 hover:text-white'}`}
               >
                 <MessageSquare className={`w-4 h-4 transition-transform group-hover:scale-110 ${isDiscussionsActive ? 'fill-yellow-400/20' : ''}`} />
                 <span>DISCUSSIONS</span>
                 {isDiscussionsActive && (
                   <div className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
                 )}
               </button>

               <button 
                onClick={onChallenges}
                className={`transition-all relative py-2 flex items-center space-x-2 group ${isChallengesActive ? 'text-yellow-400' : 'text-white/60 hover:text-white'}`}
               >
                 <Trophy className={`w-4 h-4 transition-transform group-hover:scale-110 ${isChallengesActive ? 'fill-yellow-400/20' : ''}`} />
                 <span>CHALLENGES</span>
                 {isChallengesActive && (
                   <div className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400 rounded-full animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
                 )}
               </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-5 shrink-0">
              {user.role === 'admin' && (
                <button 
                  onClick={onCreate}
                  className="bg-yellow-400 text-[#6b1e8e] px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center hover:bg-white transition-all shadow-xl active:scale-95 group/add"
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> ADD PROJECT
                </button>
              )}
              
              <div className="flex items-center space-x-4 border-l border-white/20 pl-5">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest truncate max-w-[80px]">{user.username}</span>
                  <span className="text-[7px] font-black text-yellow-400 uppercase tracking-widest">{user.role}</span>
                </div>
                {/* Fixed: Used rounded-xl to prevent gaps/distortion around the robot icon */}
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center cursor-pointer border-2 border-white/30 hover:border-yellow-400 hover:bg-white/30 transition-all group/user overflow-hidden shadow-lg">
                  <img 
                    src={user.avatarSeed} 
                    alt={user.username} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}&backgroundColor=b6e3f4`;
                    }}
                  />
                </div>
                <button 
                  onClick={onLogout}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors group/logout"
                  title="Logout"
                >
                   <LogOut className="w-5 h-5 group-hover/logout:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10">
        {children}
      </main>

      <footer className="bg-[#0a0118]/95 backdrop-blur-md text-slate-500 py-20 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-10">
            <div className="flex flex-col items-center opacity-30 hover:opacity-100 transition-all duration-500">
                <div className="flex items-baseline space-x-1">
                   <span className="text-white font-black text-3xl italic">S</span>
                   <span className="text-white font-black text-3xl italic">T</span>
                   <span className="text-white font-black text-3xl italic">E</span>
                   <span className="text-white font-black text-3xl italic">M</span>
                </div>
                <div className="bg-white px-2 py-0.5 rounded-sm mt-1">
                   <span className="text-black text-[10px] font-black tracking-[0.4em] uppercase">ACADEMY</span>
                </div>
            </div>
          </div>
          <p className="text-[11px] font-black tracking-[0.6em] uppercase text-white/40 mb-2">Singapore's Premier STEM Learning Hub</p>
          <p className="text-[9px] font-medium opacity-20 uppercase tracking-[0.1em]">© 2024 STEM Academy Global</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
