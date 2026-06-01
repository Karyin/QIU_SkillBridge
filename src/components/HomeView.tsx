import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Search, 
  Sparkles, 
  Users, 
  Star, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  GraduationCap,
  Award,
  Check,
  Clock,
  Heart,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  QrCode,
  ShieldAlert
} from 'lucide-react';
import { Tutor } from '../types';
import { TUTOR_CATEGORIES } from '../data/tutors';

interface HomeViewProps {
  tutors: Tutor[];
  onNavigate: (view: string, extra?: any) => void;
  onSearchQuery: (query: string, categoryId: string) => void;
}

export default function HomeView({ tutors, onNavigate, onSearchQuery }: HomeViewProps) {
  const [searchInput, setSearchInput] = useState('');
  const [timeGreeting, setTimeGreeting] = useState('Good Day');

  // Change campus greeting dynamically based on local time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
       setTimeGreeting('Good Morning 🌅');
    } else if (hours < 18) {
       setTimeGreeting('Good Afternoon ☀️');
    } else {
       setTimeGreeting('Good Evening 🦉');
    }
  }, []);

  // Filter top 3 featured tutors (highest rating & completed sessions)
  const featuredTutors = [...tutors]
    .sort((a, b) => b.rating - a.rating || b.completedSessions - a.completedSessions)
    .slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQuery(searchInput, 'all');
    onNavigate('search');
  };

  const handleQuickTagSearch = (tagName: string) => {
    onSearchQuery(tagName, 'all');
    onNavigate('search');
  };

  const handleCategoryClick = (catId: string) => {
    onSearchQuery('', catId);
    onNavigate('search');
  };

  return (
    <div className="space-y-8 pb-24 text-white">
      
      {/* 1. Header Greetings & Prompt Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-sans text-[10px] font-black uppercase tracking-widest text-slate-400">
              QIU Student Peer Network
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display mt-1">
            {timeGreeting}, <span className="text-blue-400">QIU Learner!</span> 👋
          </h1>
        </div>
      </div>

       {/* 2. Visual Interactive Geometric Cyber Jumbotron Banner with Neon Shapes & Special Effects */}
      <div className="relative rounded-3xl overflow-hidden h-[260px] sm:h-[300px] border border-cyan-500/20 group-hover:border-cyan-400 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-500 shadow-2xl keep-dark font-sans group bg-slate-950">
        
        {/* Advanced Matrix Radial Lighting Grid background */}
        <div className="absolute inset-0 bg-slate-915 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.35),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.3),transparent_55%)] z-0 bg-slate-950" />
        
        {/* High-Contrast Cyber Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 z-0" style={{ maskImage: 'radial-gradient(ellipse at center, black 80%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 80%, transparent 100%)' }} />

        {/* Glowing Orbs (Deeply saturated vibrant gradients with slow auto-pulses) */}
        <div className="absolute top-[10%] left-[8%] w-[160px] h-[160px] rounded-full bg-cyan-500/40 blur-[50px] animate-pulse pointer-events-none mix-blend-screen transition-all duration-700 group-hover:scale-125 z-0" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[190px] h-[190px] rounded-full bg-pink-500/35 blur-[55px] animate-pulse pointer-events-none mix-blend-screen transition-all duration-700 group-hover:scale-115 z-0" style={{ animationDuration: '5s' }} />
        <div className="absolute top-[35%] right-[30%] w-[140px] h-[140px] rounded-full bg-purple-600/35 blur-[60px] animate-pulse pointer-events-none mix-blend-screen z-0" style={{ animationDuration: '6s' }} />

        {/* 1. Interactive Geometric Floating Circles & Rings */}
        <div className="absolute right-[12%] top-[15%] w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/60 animate-[spin_20s_linear_infinite] group-hover:border-cyan-400 group-hover:scale-110 shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-500 z-0" />
        <div className="absolute right-[8%] top-[8%] w-8 h-8 rounded-full border border-pink-500/50 bg-pink-955 bg-pink-950/20 animate-bounce group-hover:bg-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-500 z-0" style={{ animationDuration: '3s' }} />
        <div className="absolute left-[38%] bottom-[12%] w-16 h-16 rounded-full border border-indigo-400/40 group-hover:border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.2)] transition-all duration-500 z-0" />

        {/* 2. Interactive Floating Retro Tech Squares & Geometric Boxes */}
        <div className="absolute left-[15%] bottom-[15%] w-12 h-12 bg-slate-905 bg-slate-900/60 border border-cyan-400/50 rounded-xl rotate-12 group-hover:rotate-45 group-hover:scale-110 shadow-[0_0_18px_rgba(34,211,238,0.2)] transition-all duration-700 z-0" />
        <div className="absolute right-[22%] bottom-[20%] w-16 h-16 bg-slate-905 bg-slate-900/50 border border-purple-500/50 rounded-2xl -rotate-12 group-hover:rotate-12 group-hover:scale-110 shadow-[0_0_22px_rgba(168,85,247,0.2)] transition-all duration-700 z-0" />
        <div className="absolute left-[45%] top-[10%] w-6 h-6 bg-yellow-500/10 border border-yellow-400/40 rounded-lg rotate-45 group-hover:scale-125 transition-transform duration-500 z-0" />

        {/* Dynamic high-tech SVG Constellation Lines & Bright Connecting Nodes */}
        <div className="absolute inset-0 pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="15%" y1="75%" x2="22%" y2="28%" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="22%" y1="28%" x2="45%" y2="10%" stroke="rgba(244, 63, 94, 0.25)" strokeWidth="1" />
            <line x1="45%" y1="10%" x2="72%" y2="18%" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="1.5" />
            <line x1="72%" y1="18%" x2="78%" y2="38%" stroke="rgba(168, 85, 247, 0.35)" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="78%" y1="38%" x2="88%" y2="80%" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
            
            {/* Spinning space orbits in SVG */}
            <circle cx="88%" cy="20%" r="50" fill="none" stroke="rgba(34, 211, 238, 0.25)" strokeWidth="1" strokeDasharray="4 6" className="origin-[88%_20%] animate-[spin_25s_linear_infinite]" />
            <circle cx="15%" cy="85%" r="40" fill="none" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="1" strokeDasharray="3 3" className="origin-[15%_85%] animate-[spin_15s_linear_infinite]" />

            {/* Glowing neon terminal circles */}
            <circle cx="22%" cy="28%" r="5" fill="#22d3ee" className="animate-pulse shadow-[0_0_10px_#22d3ee]" />
            <circle cx="78%" cy="38%" r="4" fill="#c084fc" className="animate-ping" />
            <circle cx="72%" cy="18%" r="5" fill="#f472b6" className="animate-pulse shadow-[0_0_10px_#f472b6]" />
            <circle cx="88%" cy="80%" r="4.5" fill="#10b981" />
            <circle cx="45%" cy="10%" r="4" fill="#38bdf8" />
          </svg>
        </div>

        {/* Sleek Gradient Overlays for perfect structural layout lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-955/45 to-transparent z-1 pointer-events-none bg-slate-950/45" />
        <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-r from-slate-955 via-slate-955/20 to-transparent z-1 pointer-events-none bg-slate-950/20" />

        {/* 3. Gradient highlights along the edges */}
        <div className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 group-hover:opacity-100 group-hover:via-cyan-300 transition-all duration-500 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-80 group-hover:opacity-100 group-hover:via-pink-400 transition-all duration-500 z-10 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-[2.5px] bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-80 group-hover:opacity-100 group-hover:via-indigo-400 transition-all duration-500 z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[2.5px] bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-80 group-hover:opacity-100 group-hover:via-purple-400 transition-all duration-500 z-10 pointer-events-none" />
        
        {/* Real physical laser border line that highlights with bright cyber cyan on hover */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-cyan-400/80 transition-all duration-500 pointer-events-none z-30" />

        {/* Jumbotron Content Area */}
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end max-w-2xl text-white z-10">
          <div className="space-y-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/25 to-indigo-600/30 border border-cyan-400/30 text-cyan-300 text-[9px] font-black uppercase tracking-widest animate-pulse">
              <Sparkles className="h-3 w-3 animate-spin text-cyan-300 shrink-0" /> Quest International University
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white force-light-text leading-tight font-display drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
              Quest Campus Knowledge <br />Exchange & SkillBridge
            </h2>
            <p className="text-slate-200 force-light-text text-xs sm:text-sm max-w-lg leading-relaxed font-normal">
              Unlock academic breakthroughs. Partner directly with top-tier student seniors who cleared the exact same curriculum syllabus with high marks.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Bento Grid Layout (Redesigned for light/dark clarity) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 auto-rows-auto gap-6 font-sans">
        
        {/* Bento 1: Primary Search Panel Hub (Col span 12 on mobile, 8 on desktop) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8 bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden shadow-2xl min-h-[220px]">
          <div className="relative z-10 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3 leading-tight tracking-tight text-white font-display">
              What topic is challenging <br />you <span className="text-gradient">this week?</span>
            </h3>
            <p className="text-slate-300 text-xs mb-5 max-w-md leading-relaxed">
              Find qualified guides who already mastered your specific course chapters. No booking fees, simply swap notes & skills.
            </p>
            
            <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md bg-slate-950/70 border border-white/10 p-1.5 rounded-2xl shadow-inner">
              <div className="flex-grow relative flex items-center">
                <span className="absolute left-3.5 text-xs text-slate-400 pointer-events-none">🔍</span>
                <input 
                  type="text" 
                  value={searchInput}
                  aria-label="Master query"
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g., Python, UI Figma, Accounting, Discrete Math..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-xs focus:outline-none placeholder:text-slate-500 text-white font-medium"
                />
              </div>
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition duration-150 shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
          
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Tag search shortcuts */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">Quick Searches:</span>
            {['Python Foundations', 'Calculus I & II', 'Corporate Tax Code', 'Anatomy & Physiology'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagSearch(tag)}
                className="px-3 py-1 rounded-full bg-slate-955 bg-slate-950/65 hover:bg-blue-600/20 text-slate-200 hover:text-blue-300 border border-white/5 hover:border-blue-500/30 text-[10.5px] font-semibold transition cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Bento 2: Featured Tutor Spotlight Card (Col-span 4, Row-span 2) */}
        {featuredTutors[0] && (
          <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-span-2 bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group border-white/10">
            <div className="absolute top-0 right-0 py-1 px-3 rounded-bl-2xl bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase tracking-widest border-l border-b border-white/5 select-none font-sans font-extrabold">
              ★ Highlight Mentor
            </div>

            <div className="space-y-4">
              <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider block">Spotlight Tutor of the Week</span>
              
              <div className="flex gap-3.5">
                <img 
                  className="w-14 h-14 rounded-2xl object-cover bg-slate-950 ring-2 ring-blue-500/20 shadow-lg shrink-0"
                  src={featuredTutors[0].avatar} 
                  alt={featuredTutors[0].name}
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <h4 
                    className="font-bold text-sm text-white hover:text-blue-400 transition-colors cursor-pointer truncate" 
                    onClick={() => onNavigate('profile', { tutorId: featuredTutors[0].id })}
                  >
                    {featuredTutors[0].name}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                    {featuredTutors[0].title}
                  </p>
                </div>
              </div>

              {/* Subject Badges */}
              <div className="flex flex-wrap gap-1">
                {featuredTutors[0].skills.slice(0, 3).map((s, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-955 bg-slate-905 bg-slate-950 text-slate-200 text-[10px] font-semibold border border-white/5"
                  >
                    {s.name}
                  </span>
                ))}
              </div>

              <div className="bg-slate-955 bg-slate-950/45 border border-white/5 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-slate-400 font-semibold font-bold">Tutor Rating:</span>
                  <span className="text-amber-400 font-bold font-mono">★ {featuredTutors[0].rating.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-slate-400 font-semibold font-bold">Finished Swaps:</span>
                  <span className="text-slate-200 font-bold font-mono">{featuredTutors[0].completedSessions} Sessions</span>
                </div>
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-slate-400 font-semibold font-bold">Rate Cost:</span>
                  <span className="text-blue-400 font-bold font-mono">{featuredTutors[0].hourlyRate} Points/hr</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={() => onNavigate('profile', { tutorId: featuredTutors[0].id })}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition duration-150 shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                Confirm Booking Slot
                <ChevronRight className="h-4 w-4" />
              </button>
              <p className="text-center text-[9px] text-slate-500 mt-2">Study points are gained back by offering your own notes.</p>
            </div>
          </div>
        )}

        {/* Bento 3: Step-by-Step "How SkillSwap Works" (Col span 8) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8 bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 sm:p-7 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">How QIU SkillBridge Works</h4>
                <p className="text-[10px] text-slate-400">Unlock campus peer study support in three seamless steps.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="h-5 w-5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black flex items-center justify-center">1</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Discover</span>
                </div>
                <h5 className="font-bold text-xs text-white">Select Expertise</h5>
                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                  Browse senior mentors by faculty categories. Search custom tags.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black flex items-center justify-center">2</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Interact</span>
                </div>
                <h5 className="font-bold text-xs text-white">Reserve Free Slots</h5>
                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                  Select key tutoring dates. Confirm study goals and coordinate times.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black flex items-center justify-center">3</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Progress</span>
                </div>
                <h5 className="font-bold text-xs text-white">Gain Study Merits</h5>
                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                  Meet in campus labs or online. Build credentials and swap peer skills!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bento 4: Interactive Growth Metrics Tracker (Col-span 4) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between border border-white/10 shadow-2xl relative overflow-hidden min-h-[200px]">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-r from-transparent to-blue-500/5 pointer-events-none"></div>
          
          <div className="flex justify-between items-start">
            <div className="bg-white/10 p-2 rounded-xl">
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-450">Session Velocity</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold block">▲ 14% busier than last semester</span>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">1,240+</p>
            <p className="text-xs text-slate-300">Peer bookings completed on-platform</p>
          </div>

          <div className="space-y-1.5 pt-3">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
            </div>
            <div className="flex justify-between text-[8.5px] text-slate-450 font-semibold font-mono">
              <span>Goal: 1.5k standard bookings</span>
              <span>85% Completed</span>
            </div>
          </div>
        </div>

        {/* Bento 5: High-Quality Testimonial Spotlight (Col-span 4) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 flex flex-col justify-between shadow-2xl min-h-[190px]">
          <div>
            <div className="flex items-center gap-1.5 text-amber-500">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-xs text-slate-200 italic mt-3.5 leading-relaxed font-normal">
              "Connecting with a senior peer who cleared the exact same curriculum module was insanely helpful. Scored an A on my accounting final project!"
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 mt-4 pt-3.5 border-t border-white/5">
            <div className="w-5.5 h-5.5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[9px] font-black text-blue-300">
              S
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-200 block leading-none">Sarah J.</span>
              <span className="text-[8.5px] text-slate-450 font-semibold">TESL Senior Student • QIU Faculty</span>
            </div>
          </div>
        </div>

        {/* Bento 6: Join as a tutor Call To Action Button Banner (Col-span 8) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 border border-blue-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 w-1/5 bg-blue-500/5 transform skew-x-12 pointer-events-none"></div>
          
          <div className="max-w-md z-10 space-y-1">
            <h4 className="font-extrabold text-base tracking-tight text-white force-light-text font-display">
              Earn study credits & help classmates
            </h4>
            <p className="text-xs text-slate-350 leading-relaxed font-normal">
              Register your subject strengths, configure available tutoring times in your student profile, and guide juniors to high grades.
            </p>
          </div>

          <button 
            type="button"
            onClick={() => onNavigate('become-tutor')}
            className="px-5 py-3 bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs rounded-xl transition duration-150 shrink-0 z-10 shadow-lg cursor-pointer"
          >
            Apply as Peer Tutor
          </button>
        </div>

      </div>

      {/* 4. Domain categories fast click selector */}
      <div className="pt-6">
        <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-6 text-white font-sans border-white/8">
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-3.5">
            Filter Tutors by Faculty Domain
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TUTOR_CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className="p-4 bg-slate-950/70 border border-white/8 hover:border-blue-500/40 hover:bg-blue-600/10 rounded-2xl text-left transition group relative cursor-pointer"
              >
                <div className="h-1.5 w-6 rounded bg-blue-500 mb-2 group-hover:w-10 transition-all"></div>
                <p className="text-xs font-black text-white group-hover:text-blue-300 transition-colors">
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-405 text-slate-400 font-mono mt-1 font-semibold">
                  Browse Roster &rarr;
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recommended Roster Directory Showcase */}
      <div className="pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-sans text-[10px] font-black uppercase tracking-wider text-blue-400">Roster Showcase</span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display mt-0.5">Explore Active Peer Instructors</h2>
          </div>
          <button 
            type="button"
            onClick={() => handleCategoryClick('all')}
            className="text-[11px] font-black text-blue-400 hover:text-blue-350 hover:bg-white/10 uppercase tracking-widest bg-white/5 border border-white/10 px-5 py-2.5 rounded-full transition cursor-pointer shrink-0"
          >
            Open Complete Directory &rarr;
          </button>
        </div>

        {/* 3 columns listing with rich information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {tutors.slice(0, 3).map((tutor) => (
            <div key={tutor.id} className="bg-slate-900/40 backdrop-blur-lg border border-white/8 rounded-3xl p-5 flex flex-col justify-between shadow-lg hover:border-white/15 transition-all group hover:scale-[1.01]">
              <div className="space-y-4">
                
                {/* Heading details */}
                <div className="flex items-center gap-3">
                  <img
                    className="w-11 h-11 rounded-xl object-cover bg-slate-950 shadow-md ring-2 ring-white/5"
                    src={tutor.avatar}
                    alt={tutor.name}
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors truncate">{tutor.name}</h3>
                    <p className="text-[10px] text-blue-400 font-mono font-bold tracking-tight uppercase truncate">{tutor.hourlyRate} Points/hr</p>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-slate-200">{tutor.rating.toFixed(1)}</span>
                      <span className="text-[9px] text-slate-450 text-slate-400">({tutor.completedSessions} lessons)</span>
                    </div>
                  </div>
                </div>

                {/* Info parameters */}
                <div className="border-t border-white/5 pt-3 space-y-2">
                  <p className="text-[9.5px] uppercase font-black text-blue-300 bg-blue-500/15 border border-blue-500/10 px-2 py-0.5 rounded-md inline-block font-sans font-extrabold">
                    {tutor.title}
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {tutor.biography}
                  </p>
                </div>

                {/* Key subject skills listed inside card */}
                <div className="flex flex-wrap gap-1">
                  {tutor.skills.slice(0, 3).map((sk, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-0.5 rounded bg-slate-955 bg-slate-905 bg-slate-950 text-slate-350 text-[10px] font-bold border border-white/5"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => onNavigate('profile', { tutorId: tutor.id })}
                  className="w-full text-center py-2.5 bg-white/5 border border-white/8 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition text-[11px] font-bold text-slate-250 rounded-xl cursor-pointer"
                >
                  View Tutor Availability &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
