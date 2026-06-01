import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  X, 
  CheckCircle, 
  ChevronRight,
  Sparkles,
  Info,
  Check,
  Calendar,
  Clock,
  Trash2,
  Edit,
  Star,
  Award,
  ChevronDown
} from 'lucide-react';
import { Tutor } from '../types';

interface BecomeTutorViewProps {
  onRegisterTutor: (newTutor: {
    name: string;
    avatar: string;
    title: string;
    biography: string;
    programme: string;
    categories: string[];
    skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Expert' }[];
    experience: string[];
    availability: { day: string; slots: string[] }[];
  }) => void;
  onEditTutor?: (updatedTutor: Tutor) => void;
  onDeleteTutor?: (tutorId: string) => void;
  onNavigate: (view: string, extra?: any) => void;
  studentProfile?: {
    name: string;
    matricNumber: string;
    programme: string;
    biography: string;
    avatar: string;
  };
  tutors?: Tutor[];
}

const COMMON_SKILLS = [
  'Python Foundations', 'Calculus I & II', 'Accounting Ledgers', 'React.js Development', 
  'Medical Anatomy', 'Adobe Figma Design', 'English Thesis Proofing', 'Discrete Mathematics'
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PRESET_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
  '05:00 PM', '06:00 PM'
];

export default function BecomeTutorView({ 
  onRegisterTutor, 
  onEditTutor,
  onDeleteTutor,
  onNavigate, 
  studentProfile,
  tutors 
}: BecomeTutorViewProps) {

  // Check if current student is already signed up as a peer tutor in the directory
  const activeTutorCard = tutors?.find(t => t.isUserCreated === true || t.id.startsWith('tutor-user-'));

  // Mode state: 'dashboard' or 'form'
  const [viewMode, setViewMode] = useState<'dashboard' | 'form'>(
    activeTutorCard ? 'dashboard' : 'form'
  );

  const [name, setName] = useState(studentProfile?.name || '');
  const [programme, setProgramme] = useState(studentProfile?.programme || '');
  const [yearOfStudy, setYearOfStudy] = useState('Year 2');
  const [biography, setBiography] = useState('');
  const [category, setCategory] = useState('programming');
  
  // Custom skills management
  const [skillsList, setSkillsList] = useState<{ name: string; level: 'Beginner' | 'Intermediate' | 'Expert' }[]>([
    { name: '', level: 'Expert' }
  ]);

  // Experiences list
  const [experiences, setExperiences] = useState<string[]>(['']);

  // Custom availability state: dynamic array of day objects
  const [availability, setAvailability] = useState<{ day: string; slots: string[] }[]>([
    { day: 'Monday', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
    { day: 'Thursday', slots: ['09:00 AM', '03:00 PM'] }
  ]);

  // New slot entry state for each day to dynamically type in a custom text field
  const [customSlotTexts, setCustomSlotTexts] = useState<{ [key: string]: string }>({});

  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [isDeletingConfirm, setIsDeletingConfirm] = useState(false);

  // Parse details when editing an existing card
  useEffect(() => {
    if (activeTutorCard && viewMode === 'form') {
      setName(activeTutorCard.name);
      setProgramme(activeTutorCard.programme);
      setBiography(activeTutorCard.biography);
      setCategory(activeTutorCard.categories[0] || 'programming');
      setSkillsList(activeTutorCard.skills.length > 0 ? activeTutorCard.skills : [{ name: '', level: 'Expert' }]);
      setExperiences(activeTutorCard.experience.length > 0 ? activeTutorCard.experience : ['']);
      setAvailability(activeTutorCard.availability.length > 0 ? activeTutorCard.availability : [
        { day: 'Monday', slots: ['10:00 AM', '02:00 PM'] }
      ]);
    }
  }, [activeTutorCard, viewMode]);

  // Skills helpers
  const handleAddSkill = () => {
    setSkillsList(prev => [...prev, { name: '', level: 'Intermediate' }]);
  };

  const handleRemoveSkill = (index: number) => {
    setSkillsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index: number, field: 'name' | 'level', value: string) => {
    setSkillsList(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  // Experiences helpers
  const handleAddExperience = () => {
    setExperiences(prev => [...prev, '']);
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (index: number, value: string) => {
    setExperiences(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Availability core helpers
  const handleAddAvailableDay = (day: string) => {
    if (availability.some(a => a.day === day)) return;
    setAvailability(prev => [...prev, { day, slots: ['10:00 AM', '02:00 PM'] }]);
  };

  const handleRemoveAvailableDay = (day: string) => {
    setAvailability(prev => prev.filter(a => a.day !== day));
  };

  const handleTogglePresetSlot = (dayName: string, slot: string) => {
    setAvailability(prev => {
      return prev.map(a => {
        if (a.day === dayName) {
          const hasSlot = a.slots.includes(slot);
          return {
            ...a,
            slots: hasSlot ? a.slots.filter(s => s !== slot) : [...a.slots, slot]
          };
        }
        return a;
      });
    });
  };

  const handleAddCustomSlot = (dayName: string) => {
    const text = customSlotTexts[dayName]?.trim();
    if (!text) return;

    setAvailability(prev => {
      return prev.map(a => {
        if (a.day === dayName) {
          if (a.slots.includes(text)) return a;
          return {
            ...a,
            slots: [...a.slots, text]
          };
        }
        return a;
      });
    });

    setCustomSlotTexts(prev => ({
      ...prev,
      [dayName]: ''
    }));
  };

  const handleRemoveSlot = (dayName: string, slotToRemove: string) => {
    setAvailability(prev => {
      return prev.map(a => {
        if (a.day === dayName) {
          return {
            ...a,
            slots: a.slots.filter(s => s !== slotToRemove)
          };
        }
        return a;
      });
    });
  };

  // Form Submit (Creates or edits the card)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !programme.trim() || !biography.trim()) {
      setFormError('Please fulfill all mandatory personal details (Name, Course Programme, Student Bio).');
      return;
    }

    const validSkills = skillsList.filter(s => s.name.trim() !== '');
    if (validSkills.length === 0) {
      setFormError('Please add at least one specific tutoring category skill strength.');
      return;
    }

    const validExp = experiences.filter(exp => exp.trim() !== '');
    if (validExp.length === 0) {
      setFormError('Please specify at least one tutoring experience / academic merit.');
      return;
    }

    // Must have at least one slot
    const activeSchedules = availability.filter(a => a.slots.length > 0);
    if (activeSchedules.length === 0) {
      setFormError('Please select at least one available tutoring time slot.');
      return;
    }

    if (activeTutorCard && onEditTutor) {
      // Edit Mode
      onEditTutor({
        ...activeTutorCard,
        name,
        programme,
        biography,
        categories: [category],
        skills: validSkills,
        experience: validExp,
        availability: activeSchedules
      });
      setViewMode('dashboard');
    } else {
      // Creation Mode
      onRegisterTutor({
        name,
        avatar: studentProfile?.avatar || `https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop`,
        title: `${yearOfStudy} student peer helper in ${validSkills[0].name}`,
        biography,
        programme,
        categories: [category],
        skills: validSkills,
        experience: validExp,
        availability: activeSchedules
      });
      setFormSuccess(true);
    }
    setFormError('');
  };

  // Delete card handler with safety callbacks
  const handleDeleteCard = () => {
    if (activeTutorCard && onDeleteTutor) {
      onDeleteTutor(activeTutorCard.id);
      setIsDeletingConfirm(false);
      setViewMode('form');
      
      // reset forms
      setName(studentProfile?.name || '');
      setBiography('');
      setSkillsList([{ name: '', level: 'Expert' }]);
      setExperiences(['']);
      setAvailability([
        { day: 'Tuesday', slots: ['10:00 AM', '02:00 PM'] }
      ]);
    }
  };

  if (formSuccess) {
    return (
      <div className="mx-auto max-w-lg text-center bg-slate-900/60 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 my-10 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 h-28 w-28 bg-blue-500/10 rounded-bl-full pointer-events-none" />
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 animate-bounce">
          <CheckCircle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-sans text-2xl font-extrabold text-white tracking-tight font-display">Tutor Profile Online!</h1>
          <p className="text-slate-305 text-slate-300 text-sm font-sans font-medium">
            Congratulations, your professional peer tutoring card is now active. Students can book your customizable available hours immediately.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-2.5 font-sans">
          <button
            onClick={() => onNavigate('search')}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            Go To Tutor Roster Directory
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => {
              setFormSuccess(false);
              setViewMode('dashboard');
            }}
            className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/10 font-bold text-xs text-slate-200 transition cursor-pointer"
          >
            Manage My Profile Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto font-sans text-white">
      
      {/* 1. TUTOR PROFILE DASHBOARD (If they are currently registered) */}
      {viewMode === 'dashboard' && activeTutorCard && (
        <div className="space-y-6 text-left">
          <div className="bg-gradient-to-r from-blue-900/30 via-slate-900/40 to-purple-900/20 backdrop-blur-lg border border-white/8 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 py-1.5 px-4 rounded-bl-2xl bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest border-l border-b border-emerald-500/10">
              ● Live tutoring card
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <img 
                src={activeTutorCard.avatar} 
                alt={activeTutorCard.name}
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-blue-500/20 bg-slate-950 shadow-2xl shrink-0"
              />

              <div className="text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
                    {activeTutorCard.name}
                  </h1>
                  <span className="text-[10px] font-bold text-blue-300 bg-blue-500/15 border border-blue-500/20 px-2 py-0.5 rounded-md font-sans">
                    Verified Mentor
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{activeTutorCard.programme}</p>
                
                {/* Stats panel */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs pt-1">
                  <span className="flex items-center text-amber-400 gap-1.5 font-bold font-mono">
                    ★ {activeTutorCard.rating.toFixed(1)} <span className="text-slate-400 font-sans font-normal">Rating</span>
                  </span>
                  <span className="text-slate-600 font-sans">•</span>
                  <span className="text-slate-300 font-bold font-mono">
                    {activeTutorCard.completedSessions} <span className="text-slate-400 font-sans font-normal">Learners</span>
                  </span>
                  <span className="text-slate-600 font-sans">•</span>
                  <span className="text-blue-400 font-bold font-mono">
                    {activeTutorCard.hourlyRate} SkillBridge pts/hr
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 mt-6 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subject Expertise</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTutorCard.skills.map((s, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/5 font-semibold text-slate-200 text-[11px]"
                    >
                      {s.name} • <span className="text-[9.5px] text-blue-400">{s.level}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Available Schedule</span>
                <div className="space-y-1">
                  {activeTutorCard.availability.map((a, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-[11px] text-slate-300">
                      <span className="font-bold text-white w-16">{a.day}:</span>
                      <span className="text-[10.5px] text-slate-400 overflow-hidden text-ellipsis line-clamp-1">
                        {a.slots.join(' | ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dashboard Control buttons */}
            <div className="flex flex-wrap justify-end gap-3 mt-8 pt-5 border-t border-white/5 font-sans">
              <button
                type="button"
                onClick={() => setIsDeletingConfirm(prev => !prev)}
                className="px-4.5 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 hover:border-rose-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Resign / Delete Tutor Listing
              </button>

              <button
                type="button"
                onClick={() => setViewMode('form')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                Edit Tutor Profile Details
              </button>
            </div>
          </div>

          {/* Delete double confirmation state */}
          <AnimatePresence>
            {isDeletingConfirm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-955 bg-rose-950/20 border border-rose-500/30 p-5 rounded-2xl space-y-3.5 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
                    <Trash2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white">Permanently delete your tutoring card?</h3>
                    <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed font-sans font-medium text-slate-350">
                      This action will immediately delete your tutoring card from the roster list. Any active booking requests from peers will remain intact, but you won't receive any new student listings. Crucial credentials cannot be restored.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end text-[11px] font-bold font-sans">
                  <button
                    type="button"
                    onClick={() => setIsDeletingConfirm(false)}
                    className="px-3.5 py-1.5 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Keep Profile Listing
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCard}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition cursor-pointer"
                  >
                    Confirm, Delete My Tutor Card
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 2. REGISTRATION OR EDIT FORM */}
      {viewMode === 'form' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between text-left">
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-blue-400">
                {activeTutorCard ? "Profile Settings" : "Tutor Center"}
              </span>
              <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white sm:text-3xl mt-1 font-display">
                {activeTutorCard ? "Edit Tutor Card details" : "Register as Peer Tutor"}
              </h1>
              <p className="text-slate-400 text-xs mt-1 font-sans">
                Customize your academic skills, configure available times, and manage your tutoring bio roster presence.
              </p>
            </div>
            {activeTutorCard && (
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-white/5 border border-white/8 px-4 py-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                Back to Dashboard
              </button>
            )}
          </div>

          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/8 shadow-2xl relative text-left">
            <form onSubmit={handleFormSubmit} className="space-y-8">
              
              {/* Section 1: Student Identity */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2.5 font-display">
                  1. Tutor Identity & Faculty course
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block" htmlFor="tutor-name">Full Student Name *</label>
                    <input
                      id="tutor-name"
                      type="text"
                      className="w-full rounded-2xl border border-white/8 px-4 py-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block" htmlFor="tutor-programme">University Course Course *</label>
                    <input
                      id="tutor-programme"
                      type="text"
                      className="w-full rounded-2xl border border-white/8 px-4 py-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white"
                      value={programme}
                      onChange={(e) => setProgramme(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block" htmlFor="tutor-year">Current Year of Study *</label>
                    <select
                      id="tutor-year"
                      className="w-full rounded-2xl border border-white/8 px-4 py-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white cursor-pointer"
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                    >
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                      <option value="Year 3">Year 3</option>
                      <option value="Year 4">Year 4 & above</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block" htmlFor="tutor-concept">Subject Field Category *</label>
                    <select
                      id="tutor-concept"
                      className="w-full rounded-2xl border border-white/8 px-4 py-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white cursor-pointer animate-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="programming">Computer Science & Programming</option>
                      <option value="math-science">Mathematics & General Science</option>
                      <option value="business">Accounting, Business & Corporate Finance</option>
                      <option value="languages">Languages & Academic Writing</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Subject Strengths */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <h3 className="text-sm font-bold text-white font-display">
                    2. Specific Subject Strength tags
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Skill
                  </button>
                </div>

                <div className="space-y-3">
                  {skillsList.map((skill, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="e.g. React.js hooks, SQL schema, organic structures..."
                        className="flex-1 rounded-2xl border border-white/8 px-4 py-3 text-xs focus:outline-none focus:border-blue-500 bg-slate-950 text-white placeholder:text-slate-600"
                        value={skill.name}
                        aria-label={`Skill tag name ${index + 1}`}
                        onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                      />

                      <select
                        className="rounded-2xl border border-white/8 px-3 py-3 text-xs bg-slate-950 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        value={skill.level}
                        aria-label={`Skill level ${index + 1}`}
                        onChange={(e) => handleSkillChange(index, 'level', e.target.value as any)}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>

                      {skillsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="p-3 border border-white/8 rounded-2xl hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/30 text-slate-450 text-slate-400 transition cursor-pointer"
                          aria-label="Remove Skill Strength"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Common Tags picker helper */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Fast-pick tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_SKILLS.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => {
                          if (!skillsList.some(s => s.name.toLowerCase() === tag.toLowerCase())) {
                            const firstEmptyIdx = skillsList.findIndex(s => s.name === '');
                            if (firstEmptyIdx !== -1) {
                              handleSkillChange(firstEmptyIdx, 'name', tag);
                            } else {
                              setSkillsList(prev => [...prev, { name: tag, level: 'Expert' }]);
                            }
                          }
                        }}
                        className="rounded-full bg-white/5 hover:bg-blue-600/20 hover:text-blue-305 border border-white/5 px-3 py-1 text-[10px] text-slate-200 transition cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Availability Schedule Config (Requested available hours builder!) */}
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-2.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">
                      3. Availability Days & Tutoring Slots
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Toggle default available hours or add a customized slot below.</p>
                  </div>
                  
                  {/* Select menu to add a day */}
                  <div className="relative group">
                    <select
                      className="rounded-xl border border-white/8 px-3 py-1.5 text-xs bg-slate-950 text-white cursor-pointer focus:outline-none focus:border-blue-500 font-bold"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          handleAddAvailableDay(val);
                          e.target.value = ''; // Reset
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>+ Add tutoring day</option>
                      {WEEK_DAYS.filter(d => !availability.some(av => av.day === d)).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4 mt-3">
                  {availability.map((sched) => (
                    <div 
                      key={sched.day} 
                      className="bg-slate-955 bg-slate-950/60 rounded-2xl border border-white/5 p-4.5 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                          <span className="text-xs font-bold text-white">{sched.day}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAvailableDay(sched.day)}
                          className="text-[10px] font-bold text-rose-455 text-rose-400 hover:text-rose-300 flex items-center gap-0.5 transition cursor-pointer"
                          title="Remove entirely"
                        >
                          <X className="h-3.5 w-3.5" /> Remove Day
                        </button>
                      </div>

                      {/* Display preset toggle buttons */}
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block pb-1">Toggle Standard Times</span>
                        <div className="flex flex-wrap gap-1">
                          {PRESET_SLOTS.map(slot => {
                            const active = sched.slots.includes(slot);
                            return (
                              <button
                                type="button"
                                key={slot}
                                onClick={() => handleTogglePresetSlot(sched.day, slot)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition cursor-pointer border ${
                                  active 
                                    ? 'bg-blue-600 border-blue-500 text-white font-bold' 
                                    : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/10 hover:text-white'
                                }`}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Slot Adding */}
                      <div className="pt-2 flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="e.g. 05:30 PM, Afternoon slots..."
                          className="flex-1 rounded-xl border border-white/5 px-3 py-2 text-[11px] focus:outline-none focus:border-blue-500 bg-slate-900 text-white placeholder:text-slate-650"
                          value={customSlotTexts[sched.day] || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomSlotTexts(prev => ({ ...prev, [sched.day]: val }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomSlot(sched.day);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomSlot(sched.day)}
                          className="px-3.5 py-2 hover:bg-blue-600 bg-white/5 hover:text-white border border-white/5 text-slate-300 text-[10.5px] font-bold rounded-xl transition cursor-pointer"
                        >
                          + Custom slot
                        </button>
                      </div>

                      {/* Applied slots preview */}
                      {sched.slots.length > 0 ? (
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                          {sched.slots.map(s => (
                            <span 
                              key={s}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10.5px] text-blue-300 font-bold"
                            >
                              {s}
                              <button
                                type="button"
                                onClick={() => handleRemoveSlot(sched.day, s)}
                                className="text-[9px] hover:text-rose-400 hover:bg-white/5 p-0.5 rounded cursor-pointer font-bold"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-rose-455 text-rose-450 dark:text-rose-400 font-bold italic pt-1.5">✕ No scheduled hour slots added! Card is invisible on this day.</p>
                      )}
                    </div>
                  ))}

                  {availability.length === 0 && (
                    <div className="text-center p-8 border border-dashed border-white/5 rounded-2xl bg-slate-950/40">
                      <p className="text-slate-400 text-xs">No active available days configured. Click "+ Add tutoring day" above to define your tutoring slots!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Teaching Credentials Experiences */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5 font-display">
                  <h3 className="text-sm font-bold text-white">
                    4. General Teaching Merits / Academics
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add merit
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {experiences.map((exp, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="e.g. Scored A+ in Discrete Math, Converted 2 juniors to high scorers, Web dev lead..."
                        className="flex-grow rounded-2xl border border-white/8 px-4 py-3 text-xs focus:outline-none focus:border-blue-500 bg-slate-950 text-white placeholder:text-slate-600"
                        value={exp}
                        aria-label={`Academic merit ${index + 1}`}
                        onChange={(e) => handleExperienceChange(index, e.target.value)}
                      />
                      {experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(index)}
                          className="p-3 border border-white/8 rounded-2xl hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/30 text-slate-450 text-slate-450 text-slate-400 transition cursor-pointer"
                          aria-label="Remove Merit"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Biography */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2.5 font-display">
                  5. Tutor Intro Biography
                </h3>

                <div className="space-y-2">
                  <textarea
                    rows={5}
                    placeholder="Talk about why you are passionate to tutor peers. What is your teaching style? What materials/resources do you provide?"
                    className="w-full rounded-2xl border border-white/8 p-4 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white placeholder:text-slate-600 leading-relaxed font-sans font-medium"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    required
                  />
                </div>
              </div>

              {formError && (
                <p className="text-rose-400 font-bold text-xs">{formError}</p>
              )}

              {/* Form Action Submit */}
              <div className="pt-4 flex gap-3 flex-wrap justify-end font-sans">
                <button
                  type="button"
                  onClick={() => {
                    if (activeTutorCard) {
                      setViewMode('dashboard');
                    } else {
                      onNavigate('home');
                    }
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/8 text-slate-350 text-slate-300 text-xs font-bold hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  {activeTutorCard ? "Save Roster Modifications" : "Submit Tutor Application"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
