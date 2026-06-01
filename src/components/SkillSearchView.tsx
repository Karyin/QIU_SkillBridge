import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Star, 
  BookOpen, 
  X,
  MapPin,
  Clock,
  ArrowUpDown,
  CornerRightDown,
  Heart
} from 'lucide-react';
import { Tutor } from '../types';
import { TUTOR_CATEGORIES } from '../data/tutors';

interface SkillSearchViewProps {
  tutors: Tutor[];
  onNavigate: (view: string, extra?: any) => void;
  initialSearchQuery: string;
  initialCategory: string;
  bookmarkedTutorIds?: string[];
  onToggleBookmark?: (tutorId: string) => void;
}

export default function SkillSearchView({ 
  tutors, 
  onNavigate, 
  initialSearchQuery, 
  initialCategory,
  bookmarkedTutorIds = [],
  onToggleBookmark
}: SkillSearchViewProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  // Levels: 'All' | 'Beginner' | 'Intermediate' | 'Expert'
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  
  // Sort condition: 'rating' (high to low), 'sessions' (most finished), 'rate' (low to high or high to low)
  const [sortBy, setSortBy] = useState<string>('rating');

  // Filter & Search Logic
  const filteredTutors = useMemo(() => {
    return tutors
      .filter((tutor) => {
        // Keyword matches tutor Name, Biography, Course Programme, or specific Skills list
        const queryLower = searchQuery.toLowerCase().trim();
        const matchesKeyword = !queryLower || 
          tutor.name.toLowerCase().includes(queryLower) ||
          tutor.biography.toLowerCase().includes(queryLower) ||
          tutor.programme.toLowerCase().includes(queryLower) ||
          tutor.skills.some(s => s.name.toLowerCase().includes(queryLower));

        // Category filter
        const matchesCategory = selectedCategory === 'all' || tutor.categories.includes(selectedCategory);

        // Level matcher: at least one of the tutor's skills matches selected level
        const matchesLevel = selectedLevel === 'All' || 
          tutor.skills.some(s => s.level.toLowerCase() === selectedLevel.toLowerCase());

        return matchesKeyword && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        } else if (sortBy === 'sessions') {
          return b.completedSessions - a.completedSessions;
        } else if (sortBy === 'rate') {
          return a.hourlyRate - b.hourlyRate;
        }
        return 0;
      });
  }, [tutors, searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Auto scroll window to top when specific filters change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, selectedLevel, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('All');
    setSortBy('rating');
  };

  return (
    <div className="space-y-6 pb-20 font-sans text-white">
      {/* Page Header */}
      <div>
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-blue-400">Active Directory</span>
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-1 font-display">
          Find QIU Peer Tutors
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore student guides who have earned stellar remarks across key university faculties.
        </p>
      </div>

      {/* Main Search and filter layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 items-start">
        {/* Sidebar Filters Widget - Desktop */}
        <aside className="space-y-4 lg:sticky lg:top-24 bg-slate-900/40 backdrop-blur-lg p-5 rounded-3xl border border-white/8 shadow-2xl relative z-10 text-white">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-blue-400" />
              Filter Matrix
            </h3>
            {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'All' || sortBy !== 'rating') && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-slate-400 hover:text-blue-400 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                Reset All
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Keyword Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                aria-label="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, skills..."
                className="w-full rounded-2xl border border-white/8 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Category List Filters */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Academic Domain</label>
            <div className="flex flex-col gap-1">
              {TUTOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold text-left transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20 shadow-sm'
                      : 'text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`font-mono text-[9px] ${
                    selectedCategory === cat.id ? 'text-blue-300 font-bold' : 'text-slate-500'
                  }`}>
                    {cat.id === 'all' 
                      ? tutors.length 
                      : tutors.filter(t => t.categories.includes(cat.id)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Skill Level Selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Skill Level Match</label>
            <div className="grid grid-cols-2 gap-1">
              {['All', 'Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-xl py-1.5 px-2 text-center text-[10px] font-semibold transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-300 border border-white/8 hover:bg-white/5'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Sort selection */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">Sorting Principle</label>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <select
                className="w-full rounded-2xl border border-white/8 bg-slate-955 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none transition-all appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Highest Rated ⭐</option>
                <option value="sessions">Most Completed Sessions 📅</option>
                <option value="rate">SkillPoints: Logically Ascending 🪙</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Tutor Cards List Grid - 3 cols on desktop */}
        <section className="lg:col-span-3 space-y-4">
          {/* Quick Active criteria summary banner */}
          <div className="flex h-11 items-center justify-between rounded-2xl bg-slate-950/75 px-4 py-2 text-xs border border-white/8">
            <span className="font-semibold text-slate-350 text-slate-300">
              Showing <span className="font-extrabold text-blue-400">{filteredTutors.length}</span> matching tutor(s)
            </span>
            <div className="hidden sm:flex items-center gap-2 text-slate-400 font-medium">
              <span>Category: <strong className="text-slate-200 capitalize">{selectedCategory}</strong></span>
              <span>•</span>
              <span>Level: <strong className="text-slate-200">{selectedLevel}</strong></span>
            </div>
          </div>

          {/* Core Grid */}
          {filteredTutors.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/10 rounded-3xl border border-dashed border-white/10 space-y-4 max-w-xl mx-auto mt-6 text-white text-slate-300">
              <SlidersHorizontal className="h-10 w-10 text-slate-555 text-slate-500 mx-auto" />
              <div className="space-y-1.5">
                <h3 className="font-bold text-white text-base">No Peer Tutors Found</h3>
                <p className="text-slate-400 text-xs px-6">
                  We currently lack active senior students matching that precise query or filter state. Seek tutors in other directories or apply yourself!
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="rounded-xl px-4 py-2 bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition shadow-md cursor-pointer"
              >
                Clear All Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filteredTutors.map((tutor) => (
                  <motion.div
                    key={tutor.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col justify-between rounded-3xl border border-white/8 bg-slate-900/40 backdrop-blur-md p-6 shadow-xl hover:border-white/15 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all group text-white"
                  >
                    <div>
                      {/* Tutor card header */}
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <img
                            className="h-12 w-12 rounded-xl object-cover ring-2 ring-blue-500/10 shadow-sm"
                            src={tutor.avatar}
                            alt={tutor.name}
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">
                              {tutor.name}
                            </h3>
                            <p className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">{tutor.hourlyRate} Points/hr</p>
                          </div>
                        </div>

                        {/* Rating block & heart bookmark */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {onToggleBookmark && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleBookmark(tutor.id);
                              }}
                              className={`p-1.5 rounded-xl border border-white/8 transition duration-150 cursor-pointer ${
                                bookmarkedTutorIds?.includes(tutor.id)
                                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:text-rose-350 shadow-sm shadow-rose-500/10'
                                  : 'bg-slate-950/40 text-slate-400 hover:text-white border-white/5'
                              }`}
                              title={bookmarkedTutorIds?.includes(tutor.id) ? 'Remove saved' : 'Bookmark mentor'}
                            >
                              <Heart className={`h-3.5 w-3.5 ${bookmarkedTutorIds?.includes(tutor.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          )}
                          
                          <div className="flex items-center gap-1 bg-amber-500/10 rounded-lg px-2 py-1 text-xs border border-amber-500/20">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                            <span className="font-bold font-mono text-amber-300">{tutor.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content stats */}
                      <div className="py-4 space-y-3">
                        <p className="text-xs font-semibold text-blue-300 bg-blue-500/15 border border-blue-500/10 px-2 py-0.5 rounded-md inline-block font-sans font-extrabold">
                          {tutor.title}
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {tutor.biography}
                        </p>
                      </div>

                      {/* Key Skills Tags grouped beautifully */}
                      <div className="space-y-1.5 pt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qualified Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {tutor.skills.map((skill, si) => (
                            <span
                              key={si}
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                                skill.level === 'Expert' 
                                  ? 'bg-blue-500/15 text-blue-300 border-blue-500/20'
                                  : skill.level === 'Intermediate'
                                  ? 'bg-violet-500/15 text-violet-300 border-violet-500/20'
                                  : 'bg-slate-905 bg-slate-950 text-slate-300 border-white/5'
                              }`}
                            >
                              {skill.name} • <span className="text-[9px] opacity-75">{skill.level}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom action panel */}
                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-semibold text-slate-300">
                          {tutor.availability.length} Active Days Available
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onNavigate('profile', { tutorId: tutor.id })}
                        className="rounded-xl px-4 py-2 bg-white text-slate-950 font-bold text-xs hover:bg-blue-600 hover:text-white transition shadow-sm cursor-pointer"
                      >
                        View Profile
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
