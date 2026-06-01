import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Award, 
  Sparkles, 
  Clock, 
  Bookmark, 
  BookOpen, 
  Save, 
  CheckCircle,
  GraduationCap,
  Calendar,
  Heart,
  ChevronRight,
  ShieldAlert,
  Edit,
  Smile,
  Upload
} from 'lucide-react';
import { Tutor, Booking } from '../types';

interface MyProfileViewProps {
  tutors: Tutor[];
  bookings: Booking[];
  studentProfile: {
    name: string;
    matricNumber: string;
    programme: string;
    biography: string;
    avatar: string;
    extraPointBalance: number;
    baseStudyHours: number;
  };
  onSaveProfile: (profile: any) => void;
  bookmarkedTutorIds: string[];
  onToggleBookmark: (tutorId: string) => void;
  onNavigate: (view: string, extra?: any) => void;
}

export default function MyProfileView({
  tutors,
  bookings,
  studentProfile,
  onSaveProfile,
  bookmarkedTutorIds,
  onToggleBookmark,
  onNavigate
}: MyProfileViewProps) {
  // Editing modes
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(studentProfile.name);
  const [matricNumber, setMatricNumber] = useState(studentProfile.matricNumber);
  const [programme, setProgramme] = useState(studentProfile.programme);
  const [biography, setBiography] = useState(studentProfile.biography);
  const [avatar, setAvatar] = useState(studentProfile.avatar);
  const [successMsg, setSuccessMsg] = useState('');

  // Top-Up Simulator state
  const [selectedTier, setSelectedTier] = useState<{id: string, name: string, points: number, priceMyr: number, description: string} | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'fpx' | 'tng' | 'card'>('fpx');
  const [selectedBank, setSelectedBank] = useState<string>('Maybank2u');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [cardError, setCardError] = useState<string>('');
  const [topUpState, setTopUpState] = useState<'idle' | 'paying' | 'success'>('idle');
  const [txnId, setTxnId] = useState<string>('');

  const rechargeTiers = [
    { id: 'tier-1', name: 'Micro Token Pack', points: 50, priceMyr: 5.00, description: 'Perfect for a standard 1-hour fast troubleshooting session.' },
    { id: 'tier-2', name: 'Standard Study Pack', points: 120, priceMyr: 10.00, description: 'Includes 20 BONUS points! Ideal for two regular sessions.' },
    { id: 'tier-3', name: 'Premium Peer Pack', points: 300, priceMyr: 24.00, description: 'Includes 60 BONUS points! Most popular for engineering/CS coursework.' },
    { id: 'tier-4', name: 'Ultimate Semester Pack', points: 650, priceMyr: 50.00, description: 'Includes 150 BONUS points! Best value for full exam-weeks preparation.' }
  ];

  const triggerSimulationPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;

    if (paymentMethod === 'card') {
      const trimmedNum = cardNumber.trim();
      const trimmedName = cardName.trim();
      if (!trimmedNum) {
        setCardError('Please enter your debit or credit card number.');
        return;
      }
      if (!trimmedName) {
        setCardError('Please enter the cardholder Name.');
        return;
      }
      const strippedNumber = trimmedNum.replace(/\s+/g, '');
      if (strippedNumber.length < 12 || isNaN(Number(strippedNumber))) {
        setCardError('Invalid card format. Please enter a valid 12-16 digit card number.');
        return;
      }
    }

    setCardError('');
    setTopUpState('paying');
    
    // Simulate payment merchant delay
    setTimeout(() => {
      const generatedTxn = 'QIU-TXN-' + Math.floor(100000 + Math.random() * 900000);
      setTxnId(generatedTxn);
      setTopUpState('success');
      
      // Update student tokens in state
      onSaveProfile({
        ...studentProfile,
        extraPointBalance: studentProfile.extraPointBalance + selectedTier.points
      });
    }, 1800);
  };

  // Keep editing state in lockstep with profile edits from any source
  React.useEffect(() => {
    if (!isEditing) {
      setName(studentProfile.name);
      setMatricNumber(studentProfile.matricNumber);
      setProgramme(studentProfile.programme);
      setBiography(studentProfile.biography);
      setAvatar(studentProfile.avatar);
    }
  }, [studentProfile, isEditing]);

  // AI SkillBridge typing inputs
  const [majorInput, setMajorInput] = useState(() => {
    try {
      return localStorage.getItem('ai_major_input') || '';
    } catch {
      return '';
    }
  });
  const [skillsInput, setSkillsInput] = useState(() => {
    try {
      return localStorage.getItem('ai_skills_input') || '';
    } catch {
      return '';
    }
  });
  const [customInterestQuery, setCustomInterestQuery] = useState(() => {
    try {
      return localStorage.getItem('ai_custom_query') || '';
    } catch {
      return '';
    }
  });

  const [hasGeneratedMap, setHasGeneratedMap] = useState(() => {
    try {
      return localStorage.getItem('has_generated_ai_map') === 'true';
    } catch {
      return false;
    }
  });
  const [isGeneratingMap, setIsGeneratingMap] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);

  // Calculate dynamic stats
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  
  // Each completed peers study session counts as 1.5 dynamic credit study hours
  const calculatedStudyHours = studentProfile.baseStudyHours + (completedBookings.length * 1.5);

  // Check achievements badges
  const achievements = [
    {
      id: 'pioneer',
      title: 'Pioneer Scholar',
      badgeText: 'Pioneer',
      description: 'Completed registration on the QIU SkillBridge beta peer network.',
      requirement: 'Joined early to share & bridge peer learning skills.',
      iconColor: 'from-amber-500 to-orange-600',
      iconText: '🥇',
      isUnlocked: true // always unlocked for joined users
    },
    {
      id: 'code-cracker',
      title: 'Code Cracker',
      badgeText: 'Technical',
      description: 'Booked a session focused on programming logic, code, or databases.',
      requirement: 'Unlock by booking a Computer Science module with senior mentors.',
      iconColor: 'from-blue-500 to-indigo-600',
      iconText: '💻',
      isUnlocked: bookings.some(b => {
        const t = tutors.find(tutor => tutor.id === b.tutorId);
        const notesMatch = b.notes?.toLowerCase().match(/(code|python|java|sql|prog|algorithm|nested|debug|page|react|site)/);
        const catMatch = t?.categories.includes('programming');
        return !!(notesMatch || catMatch);
      })
    },
    {
      id: 'lab-helper',
      title: 'Lab Helper',
      badgeText: 'In-Campus',
      description: 'Scheduled at least one physical peer slot at the QIU Campus Library.',
      requirement: 'Unlock by scheduling an In-Person meeting type in notes.',
      iconColor: 'from-emerald-500 to-teal-600',
      iconText: '🧪',
      isUnlocked: bookings.some(b => b.type === 'in-person')
    },
    {
      id: 'star-critic',
      title: 'Star Critic',
      badgeText: 'Reviewer',
      description: 'Submitted an experience review rating supporting high tutoring standards.',
      requirement: 'Unlock by completing critical feedback on a finished appointment.',
      iconColor: 'from-purple-500 to-pink-600',
      iconText: '⭐',
      isUnlocked: bookings.some(b => b.hasFeedback)
    }
  ];

  const handleProfileSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name,
      matricNumber,
      programme,
      biography,
      avatar,
      extraPointBalance: studentProfile.extraPointBalance,
      baseStudyHours: studentProfile.baseStudyHours
    });
    setSuccessMsg('Your Student ID Card profile has been synced securely!');
    setIsEditing(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Get bookmarked tutor objects
  const bookmarkedTutors = tutors.filter(t => bookmarkedTutorIds.includes(t.id));

  // Find dynamic matches based on majorInput & skillsInput & customInterestQuery
  const textToMatch = `${majorInput} ${skillsInput} ${customInterestQuery}`.toLowerCase();
  
  let firstMatchTutor: Tutor = tutors[0];
  let secondMatchTutor: Tutor = tutors[1] || tutors[0];

  if (textToMatch.trim() && tutors.length >= 2) {
    const scored = tutors.map(t => {
      let score = 0;
      const tContent = `${t.name} ${t.biography} ${t.skills.map(s => s.name).join(' ')} ${t.categories.join(' ')}`.toLowerCase();
      
      const words = textToMatch.split(/[\s,.\-&]+/);
      words.forEach(w => {
        if (w.length > 2 && tContent.includes(w)) {
          score += 10;
        }
      });
      return { tutor: t, score };
    }).sort((a, b) => b.score - a.score);

    const check = scored.filter(s => s.score > 0).map(s => s.tutor);
    if (check.length >= 2) {
      firstMatchTutor = check[0];
      secondMatchTutor = check[1];
    } else if (check.length === 1) {
      firstMatchTutor = check[0];
      const fallback = tutors.find(t => t.id !== check[0].id);
      if (fallback) secondMatchTutor = fallback;
    }
  }

  const firstTutorSkillsText = firstMatchTutor?.skills.map(s => s.name).slice(0, 2).join(' & ') || 'React & Python';
  const secondTutorSkillsText = secondMatchTutor?.skills.map(s => s.name).slice(0, 2).join(' & ') || 'Excel & Finance';
  const firstTutorAllSkillsText = firstMatchTutor?.skills.map(s => s.name).join(', ') || 'React';
  const secondTutorAllSkillsText = secondMatchTutor?.skills.map(s => s.name).join(', ') || 'Excel';

  return (
    <div className="space-y-8 pb-20 font-sans text-white text-left">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563eb] dark:text-blue-400">My Student Space</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white dark:text-white mt-1 font-display">
            Student Profile & Achievements
          </h1>
          <p className="text-slate-405 text-slate-400 text-sm mt-0.5">
            Optimize your peer identity, view earned badges, and access your favorite saved mentors.
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-2.5 rounded-2xl animate-pulse">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}
      </div>

      {/* 2. Top Student Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* Profile Card & Editor Left (col-span-5) */}
        <div className="lg:col-span-5 space-y-4 text-left">
          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 shadow-xl relative overflow-hidden glass-panel">
            <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full border border-blue-500/20 select-none">
                QIU STUDENT PASS
              </span>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 px-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5 text-blue-400" />
                  Edit Card
                </button>
              )}
            </div>

            {/* Simulated Identity Card Info */}
            {!isEditing ? (
              <div className="space-y-4 font-sans text-left">
                <div className="flex items-center gap-4">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-500/20 bg-slate-950 shadow-md shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-md">
                      <GraduationCap className="h-8 w-8 text-blue-400" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 justify-start">
                      <h2 className="text-lg font-bold text-white tracking-tight">{name}</h2>
                      <span className="text-[10px] bg-slate-950 border border-white/5 py-0.5 px-2 rounded-full font-mono font-bold text-slate-400">
                        STUDENT
                      </span>
                    </div>
                    <p className="text-xs text-blue-400 font-bold font-mono">{matricNumber}</p>
                    <p className="text-[11px] text-slate-300 font-medium">{programme}</p>
                  </div>
                </div>

                <div className="bg-slate-955 bg-slate-950/40 rounded-2xl p-3 border border-white/5 space-y-2 text-left">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block">Personal Study Bio</span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed italic text-left">
                    "{biography || "No personal introduction written yet. Let peer tutors know how you study best!"}"
                  </p>
                </div>

                {/* Quantitative Badges Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-815 bg-slate-950/30 p-2 rounded-xl border border-white/5">
                    <span className="text-[11.5px] font-mono font-bold text-blue-400 block">{calculatedStudyHours} Hrs</span>
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 select-none">STUDY HOURS</span>
                  </div>
                  <div className="bg-slate-815 bg-slate-950/30 p-2 rounded-xl border border-white/5">
                    <span className="text-[11.5px] font-mono font-bold text-amber-400 block">
                      {achievements.filter(a => a.isUnlocked).length} / {achievements.length}
                    </span>
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 select-none">BADGES</span>
                  </div>
                  <div className="bg-slate-815 bg-slate-955 bg-slate-950/30 p-2 rounded-xl border border-white/5">
                    <span className="text-[11.5px] font-mono font-bold text-emerald-400 block">{upcomingBookings.length} Active</span>
                    <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 select-none">RESERVED</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSaveSubmit} className="space-y-3 font-sans text-left">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block" htmlFor="std-name">Full Student Name</label>
                  <input
                    id="std-name"
                    type="text"
                    className="w-full rounded-xl border border-white/8 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Digital Student Matric ID */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block" htmlFor="std-matric">Student Matric Code</label>
                  <input
                    id="std-matric"
                    type="text"
                    className="w-full rounded-xl border border-white/8 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white font-mono"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Programme major */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block" htmlFor="std-major">Degree Programme</label>
                  <input
                    id="std-major"
                    type="text"
                    className="w-full rounded-xl border border-white/8 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    required
                  />
                </div>

                {/* Selectable Avatar Grid */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                      Choose Avatar Photo
                    </label>
                    <span className="text-[9px] text-blue-400 font-bold font-sans">
                      Cats, Dogs, or Upload Custom!
                    </span>
                  </div>
                  <div className="grid grid-cols-8 gap-2">
                    {/* Option: Graduation Cap (No Avatar) */}
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className={`h-11 w-11 rounded-xl transition flex items-center justify-center border cursor-pointer ${
                        !avatar 
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/30' 
                          : 'border-white/5 bg-slate-955 bg-slate-950 text-slate-400 hover:border-white/10 hover:text-white'
                      }`}
                      title="No avatar photo"
                    >
                      <GraduationCap className="h-5 w-5" />
                    </button>

                    {/* Options: Pre-configured cute pet photos */}
                    {[
                      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop',
                      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&h=150&fit=crop',
                      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=150&h=150&fit=crop',
                      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&h=150&fit=crop',
                      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop',
                      'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=150&h=150&fit=crop'
                    ].map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(imgUrl)}
                        className={`h-11 w-11 rounded-xl overflow-hidden transition relative border cursor-pointer ${
                          avatar === imgUrl 
                            ? 'border-blue-500 ring-2 ring-blue-500/30' 
                            : 'border-white/5 opacity-70 hover:opacity-100 hover:border-white/10'
                        }`}
                        title={`Cute Pet ${i + 1}`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`Pet Avatar ${i + 1}`} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}

                    {/* Upload your own file */}
                    <label 
                      className={`h-11 w-11 rounded-xl border border-dashed transition flex flex-col items-center justify-center text-slate-400 hover:text-blue-400 cursor-pointer bg-slate-950 hover:bg-slate-900/60 ${
                        avatar && !avatar.startsWith('https://images.unsplash.com')
                          ? 'border-blue-500 ring-2 ring-blue-500/30 text-blue-400' 
                          : 'border-slate-800 hover:border-blue-500/60'
                      }`}
                      title="Upload custom image file"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-[7.5px] font-bold mt-0.5">Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setAvatar(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Bio text */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block" htmlFor="std-bio">Tutoring bio / preferences</label>
                  <textarea
                    id="std-bio"
                    rows={2}
                    className="w-full rounded-xl border border-white/8 p-2.5 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-1.5 font-sans">
                  <button
                    type="button"
                    onClick={() => {
                      // Reset and cancel
                      setName(studentProfile.name);
                      setMatricNumber(studentProfile.matricNumber);
                      setProgramme(studentProfile.programme);
                      setBiography(studentProfile.biography);
                      setAvatar(studentProfile.avatar);
                      setIsEditing(false);
                    }}
                    className="rounded-xl px-3 py-2 bg-white/5 border border-white/8 text-slate-300 hover:bg-white/10 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1 shadow-md cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Save Identity
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Interactive QIU Peer Token Wallet Widget */}
          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-5 shadow-xl glass-panel text-left space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <div>
                <h4 className="font-extrabold flex items-center gap-1.5 text-blue-400 uppercase tracking-wider text-[11px] font-display">
                  <span>🪙</span> QIU Peer Token Wallet
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Your peer exchange coin balance & rewards</p>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 uppercase tracking-wider">
                Active Student
              </span>
            </div>

            {/* Huge Point Balance Display */}
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">CURRENT WALLET BALANCE</span>
                <span className="text-2xl font-black font-mono text-white tracking-tight flex items-center gap-1">
                  🪙 {studentProfile.extraPointBalance} <span className="text-xs font-bold text-blue-400 uppercase font-sans tracking-wide">Points</span>
                </span>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl font-bold font-mono">
                1 Coin = 1 Point
              </span>
            </div>

            {/* How to Get / Increase Points Section */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 block p-0.5 border-b border-white/5">
                💡 How to Increase or Earn More Points:
              </span>

              <div className="space-y-2.5 text-xs text-slate-300">
                {/* Method 1 */}
                <div className="p-3 rounded-xl border border-white/5 bg-slate-950/20 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wide text-[10px]">
                    <span className="text-xs">🧑‍🏫</span> 1. Become a Peer Tutor / Mentor
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans font-medium">
                    Register yourself as a tutor on the <span className="text-blue-400 font-semibold cursor-pointer underline hover:text-blue-300" onClick={() => onNavigate('become-tutor')}>Join as Mentor</span> page. Set your hourly point rate, complete tutoring sessions, and get credited directly by fellow peers!
                  </p>
                </div>

                {/* Method 2 */}
                <div className="p-3 rounded-xl border border-white/5 bg-slate-950/20 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wide text-[10px]">
                    <span className="text-xs">💬</span> 2. Solve Tasks on the Community Board
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans font-medium">
                    Browse classmate requests on the <span className="text-amber-400 font-semibold cursor-pointer underline hover:text-amber-300" onClick={() => onNavigate('community')}>Community Board</span>. Post expert comments or share notes and code solutions to receive automated peer contributions!
                  </p>
                </div>

                {/* Method 3 (New Interactive Top-up Store & Gateway Simulation) */}
                <div className="p-4 rounded-2xl border border-blue-500/15 bg-blue-500/[0.02] text-left space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wide text-[10px]">
                      <span className="text-xs">💳</span> 3. Recharge / Buy Token Coin Packs
                    </span>
                    <span className="text-[9px] font-mono text-blue-500 font-bold uppercase bg-blue-500/10 px-1.5 py-0.5 rounded">Recharge Store</span>
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-relaxed font-sans font-medium">
                    Need additional points to book seasoned tutors? Purchase points via our campus payment gateway.
                  </p>

                  {topUpState === 'idle' && (
                    <div className="space-y-3 pt-1">
                      {/* Package Grid */}
                      <div className="grid grid-cols-1 gap-2">
                        {rechargeTiers.map((tier) => {
                          const isSelected = selectedTier?.id === tier.id;
                          return (
                            <button
                              type="button"
                              key={tier.id}
                              onClick={() => setSelectedTier(tier)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600/25 border-blue-500 text-white shadow-md shadow-blue-500/5'
                                  : 'bg-slate-950/40 border-white/5 text-slate-300 hover:border-white/10 hover:bg-slate-950/60'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold">{tier.name}</span>
                                <span className="text-xs font-black text-blue-400 font-mono">RM {tier.priceMyr.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-[9.5px] text-slate-400 block line-clamp-1 max-w-[150px]">{tier.description}</span>
                                <span className="text-[10.5px] font-mono font-bold text-blue-300 bg-blue-400/10 px-1.5 py-0.5 rounded-md">
                                  🪙 {tier.points} Points
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {selectedTier && (
                        <div className="mt-3 p-3.5 bg-slate-950/70 border border-white/5 rounded-xl space-y-3 animate-fadeIn">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block border-b border-white/5 pb-1.5">
                            Secure Checkout Gateway
                          </span>
                          
                          {/* Payment Method Selector */}
                          <div className="space-y-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Select Merchant Payment Option:</span>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'fpx', label: '🏦 FPX Bank' },
                                { id: 'tng', label: '📱 TNG eWallet' },
                                { id: 'card', label: '💳 Visa/Master' }
                              ].map((m) => (
                                <button
                                  type="button"
                                  key={m.id}
                                  onClick={() => setPaymentMethod(m.id as any)}
                                  className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold text-center transition-all ${
                                    paymentMethod === m.id
                                      ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                                      : 'bg-slate-900 border-white/5 text-slate-450 hover:bg-slate-800'
                                  }`}
                                >
                                  {m.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Conditional Payment Form Panel */}
                          {paymentMethod === 'fpx' && (
                            <div className="space-y-1.5 animate-fadeIn">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Choose Local Bank</label>
                              <select
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg py-1.5 px-2 text-[11px] text-slate-200 outline-none focus:border-blue-500"
                              >
                                <option value="Maybank2u">Maybank2u (Maybank)</option>
                                <option value="CIMB Clicks">CIMB Clicks</option>
                                <option value="Public Bank">Public Bank Online</option>
                                <option value="RHB Now">RHB Now</option>
                                <option value="Bank Islam">Bank Islam</option>
                                <option value="Hong Leong Connect">Hong Leong Connect</option>
                              </select>
                            </div>
                          )}

                          {paymentMethod === 'tng' && (
                            <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-center space-y-1 animate-fadeIn">
                              <span className="text-emerald-400 text-[10px] font-bold block">Touch 'n Go eWallet Instant checkout</span>
                              <p className="text-[9px] text-slate-400">Loads a secure merchant QR code on authorization.</p>
                            </div>
                          )}

                          {paymentMethod === 'card' && (
                            <div className="space-y-2 animate-fadeIn text-left">
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 block uppercase mb-0.5">Card Number</label>
                                <input
                                  type="text"
                                  value={cardNumber}
                                  onChange={(e) => {
                                    setCardNumber(e.target.value);
                                    setCardError('');
                                  }}
                                  placeholder="e.g. 1234 5678 9101 1121"
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg py-1.5 px-2 text-[11px] text-slate-200 font-mono outline-none focus:border-blue-500/50"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 block uppercase mb-0.5">Cardholder Name</label>
                                <input
                                  type="text"
                                  value={cardName}
                                  onChange={(e) => {
                                    setCardName(e.target.value);
                                    setCardError('');
                                  }}
                                  placeholder="e.g. LEE MIN CHONG"
                                  className="w-full bg-slate-900 border border-white/10 rounded-lg py-1.5 px-2 text-[11px] text-slate-200 font-mono outline-none focus:border-blue-500/50"
                                />
                              </div>
                              {cardError && (
                                <p className="text-[10px] text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 mt-1 animate-pulse text-center">
                                  ⚠️ {cardError}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Checkout Terms Notice */}
                          <p className="text-[9px] text-slate-450 text-slate-400 leading-relaxed">
                            ⚠️ Student wallet transactions are secured under QIU SkillBridge Peer Learning policy. Balance is credited instantaneously.
                          </p>

                          {/* Complete Topup Button */}
                          <button
                            type="button"
                            onClick={triggerSimulationPayment}
                            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 shadow-lg"
                          >
                            <span>🔒 Pay RM {selectedTier.priceMyr.toFixed(2)}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {topUpState === 'paying' && (
                    <div className="p-8 text-center bg-slate-950/80 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4 animate-pulse">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-200 block">Processing Authorization...</span>
                        {paymentMethod === 'fpx' && <p className="text-[9px] text-slate-400 font-mono">Connecting with {selectedBank} secure gateway...</p>}
                        {paymentMethod === 'tng' && <p className="text-[9px] text-slate-400 font-mono">Awaiting Touch 'n Go token handshake...</p>}
                        {paymentMethod === 'card' && <p className="text-[9px] text-slate-400 font-mono">Securing 256-bit SSL transaction...</p>}
                      </div>
                    </div>
                  )}

                  {topUpState === 'success' && selectedTier && (
                    <div className="p-6 bg-slate-950/90 border border-emerald-500/20 text-center rounded-2xl space-y-4 animate-fadeIn">
                      <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-lg">
                        ✓
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-black text-emerald-400 block uppercase tracking-wide">RECHARGE SUCCESSFUL</span>
                        <p className="text-[10.5px] text-slate-350">
                          Credited <strong className="text-white font-mono">{selectedTier.points} Points</strong> to your student peer wallet profile!
                        </p>
                      </div>

                      <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-1.5 text-left text-[9px] font-mono text-slate-450 text-slate-400">
                        <div className="flex justify-between">
                          <span>Purchase Package:</span> <span className="text-slate-200">{selectedTier.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Transaction Ref:</span> <span className="text-slate-200">{txnId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Billing Method:</span> <span className="text-slate-200 uppercase">{paymentMethod} ({paymentMethod === 'fpx' ? selectedBank : 'Instant'})</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTopUpState('idle');
                          setSelectedTier(null);
                        }}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/8 rounded-xl text-xs font-bold transition"
                      >
                        Return to Wallet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Study Tip widget */}
          <div className="bg-slate-900/40 rounded-3xl border border-white/8 p-5 glass-panel text-slate-300 text-xs space-y-2.5 text-left">
            <h4 className="font-bold flex items-center gap-1 text-blue-400 uppercase tracking-wider text-[10px]">
              <Smile className="h-3.5 w-3.5 text-blue-400" />
              PEER EXCHANGE TIPS
            </h4>
            <p className="leading-relaxed font-sans font-medium text-slate-450 dark:text-slate-300">
              Updating your personal Student name here will instantly sync with booking registration and feedback loops. Give accurate data to make library meet-ups seamless!
            </p>
          </div>
        </div>

        {/* Dynamic Achievements & Stats Right (col-span-7) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          
          {/* Section: Achievements Badges */}
          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 shadow-xl glass-panel space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
                <Award className="h-5 w-5 text-amber-400" />
                Top Achievements Panel
              </h2>
              <p className="text-slate-405 text-slate-400 text-xs font-sans font-medium">
                Acquire customized award medallions by completing senior study meet-ups and solving tasks.
              </p>
            </div>

            {/* Micro progress status slider bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-sans font-bold">Total Peer Study Hours: <b className="text-white">{calculatedStudyHours} Hrs</b></span>
                <span className="text-blue-400 font-bold">{Math.round((achievements.filter(a => a.isUnlocked).length / achievements.length) * 100)}% Complete</span>
              </div>
              <div className="h-2 w-full bg-slate-950/60 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-1000"
                  style={{ width: `${(achievements.filter(a => a.isUnlocked).length / achievements.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Badges Grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
              {achievements.map((ach) => (
                <div 
                  key={ach.id}
                  className={`rounded-2xl border p-4 transition-all duration-300 relative flex gap-3 ${
                    ach.isUnlocked 
                      ? 'bg-slate-955 bg-slate-950/40 border-white/8 shadow-md hover:border-white/15' 
                      : 'bg-slate-950/10 border-white/5 opacity-55 saturate-50'
                  }`}
                >
                  <div className={`h-11 w-11 rounded-2xl shrink-0 bg-gradient-to-br ${ach.iconColor} flex items-center justify-center text-lg shadow-md`}>
                    {ach.isUnlocked ? ach.iconText : '🔒'}
                  </div>

                  <div className="space-y-1 my-auto text-left">
                    <div className="flex flex-wrap items-center gap-1 justify-start">
                      <h4 className="font-bold text-xs text-white">{ach.title}</h4>
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-md font-sans">
                        {ach.badgeText}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed font-sans font-medium text-slate-400">{ach.description}</p>
                    
                    {!ach.isUnlocked && (
                      <p className="text-[9.5px] text-rose-400 font-mono font-bold pt-1">
                        Requirement: {ach.requirement}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Saved peer tutors (Bookmarks) */}
          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 shadow-xl glass-panel space-y-4 text-left">
            <div>
              <h2 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
                <Bookmark className="h-5 w-5 text-blue-400" />
                Saved Peer Mentors
              </h2>
              <p className="text-slate-405 text-slate-400 text-xs font-sans font-medium">
                Instantly bookmark your favorite experienced peer leaders. Tap or book in one click.
              </p>
            </div>

            {bookmarkedTutors.length === 0 ? (
              <div className="text-center py-8 rounded-2xl bg-slate-915 bg-slate-952 bg-slate-950/20 p-6 border border-white/5 space-y-2.5">
                <div className="h-8 w-8 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-slate-500 border border-white/5">
                  <Heart className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-300 text-xs">Empty Study Bookmarks</h4>
                  <p className="text-slate-400 text-[10.5px]">
                    Go to the tutors directory and tap the heart icon to save favorite tutors!
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('search')}
                  className="rounded-xl px-4 py-2 bg-blue-600/15 border border-blue-500/20 text-blue-400 hover:bg-blue-600/25 font-bold text-xs cursor-pointer"
                >
                  Explore Active Directory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                {bookmarkedTutors.map((tutor) => (
                  <div 
                    key={tutor.id}
                    className="rounded-2xl border border-white/6 bg-slate-950/30 p-4 flex flex-col justify-between hover:border-white/12 hover:bg-slate-955 bg-slate-950/50 transition-all font-sans text-left"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex gap-2.5 items-center">
                        <img 
                          className="h-10 w-10 rounded-xl object-cover bg-slate-950 shrink-0 border border-white/5" 
                          src={tutor.avatar} 
                          alt={tutor.name}
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5 text-left">
                          <h4 className="font-bold text-xs text-white hover:text-blue-400 transition-colors pointer-events-auto cursor-pointer" onClick={() => onNavigate('profile', { tutorId: tutor.id })}>
                            {tutor.name}
                          </h4>
                          <p className="text-[11px] text-blue-400 font-mono font-bold tracking-tight uppercase truncate max-w-[120px]">{tutor.hourlyRate} Points/hr</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleBookmark(tutor.id)}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-455 text-rose-400 hover:text-rose-300 transition shrink-0 cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-400" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {tutor.skills.slice(0, 2).map((sk, index) => (
                        <span key={index} className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] font-mono font-bold">
                          {sk.name}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-white/5 mt-3 pt-3 flex justify-between items-center text-[10.5px]">
                      <span className="text-amber-400 font-bold font-sans">
                        ★ {tutor.rating}
                      </span>
                      <button
                        onClick={() => onNavigate('profile', { tutorId: tutor.id })}
                        className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        Set Booking 
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
                     {/* Section: AI Custom Skill & Career Recommendations */}
          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 shadow-xl glass-panel space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse fill-indigo-500/20" />
                  AI SkillBridge
                </h2>
                <p className="text-slate-400 text-xs font-sans font-semibold">
                  AI-powered peer matching: Personalized tutor recommendations, complementary skill detection, and interest-aligned learning pathways.
                </p>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-md font-sans">
                Active Co-pilot
              </span>
            </div>

            {/* If Generating: Show beautiful progress loading step sequences */}
            {isGeneratingMap ? (
              <div className="bg-slate-952 bg-slate-950/60 border border-indigo-500/25 rounded-2xl p-6 space-y-4 text-center">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <div className="h-5 w-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  <span className="text-xs text-indigo-300 font-bold">AI Agent Consulting Skill Matrices...</span>
                </div>
                
                <div className="font-mono text-[10px] text-left text-indigo-300 bg-slate-950 p-3.5 rounded-xl border border-white/5 space-y-1.5 max-h-[140px] overflow-y-auto w-full">
                  {generationSteps.map((step, idx) => (
                    <div key={idx} className="animate-fade-in text-indigo-350">
                      &gt; {step}
                    </div>
                  ))}
                  <div className="animate-pulse text-slate-500">&gt; processing graph vector node mappings...</div>
                </div>
              </div>
            ) : !hasGeneratedMap ? (
              /* State 1: Typing console asking user to enter their parameters */
              <div className="bg-slate-952 bg-slate-950/45 border border-white/5 rounded-2xl p-5 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed font-normal mb-1 font-sans">
                  💡 Type your program and desired skills below! The AI matching algorithm will scan bios and list compatible senior buddies for a learning path.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 select-none">
                    <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Your Program / Major</label>
                    <input
                      type="text"
                      value={majorInput}
                      onChange={(e) => {
                        setMajorInput(e.target.value);
                        try {
                          localStorage.setItem('ai_major_input', e.target.value);
                        } catch {}
                      }}
                      placeholder="e.g. Computer Science, Accounting"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1 select-none">
                    <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Target Skills You Want to Acquire</label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => {
                        setSkillsInput(e.target.value);
                        try {
                          localStorage.setItem('ai_skills_input', e.target.value);
                        } catch {}
                      }}
                      placeholder="e.g. React Native, Python Loops, Excel Modeling"
                      className="w-full bg-slate-905 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left select-none">
                  <label className="block text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Additional Biography Keywords, Intersections or Hobbies</label>
                  <textarea
                    rows={2}
                    value={customInterestQuery}
                    onChange={(e) => {
                      setCustomInterestQuery(e.target.value);
                      try {
                        localStorage.setItem('ai_custom_query', e.target.value);
                      } catch {}
                    }}
                    placeholder="e.g. Preparing for Python exam, interested in design clubs or corporate communication"
                    className="w-full bg-slate-905 bg-slate-905 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400 resize-none font-sans font-medium"
                  />
                </div>

                <div className="pt-2 text-center sm:text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsGeneratingMap(true);
                      setGenerationSteps([]);
                      const steps = [
                        `🔍 [NLP Roster Engine] Analyzing curriculum compliance for ${majorInput} syllabus...`,
                        `📊 [Affinity Tuning] Scanning candidate tutor biographies for '${skillsInput}' compatibility...`,
                        `⚡ [Pathway Match] Found compatible peer tutors: ${firstMatchTutor.name} & ${secondMatchTutor.name}!`,
                        `🎉 [Final Map Locked] Customized peer study pathway locked successfully with high compatibility ratio.`
                      ];
                      steps.forEach((step, idx) => {
                        setTimeout(() => {
                          setGenerationSteps(prev => [...prev, step]);
                          if (idx === steps.length - 1) {
                            setIsGeneratingMap(false);
                            setHasGeneratedMap(true);
                            try {
                              localStorage.setItem('has_generated_ai_map', 'true');
                            } catch {}
                          }
                        }, (idx + 1) * 700);
                      });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/25"
                  >
                    <span>Analyze Matching & Learning Path</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* State 2: Map generated completely, showing interactive visual maps & notice banner */
              <div className="space-y-4 text-left">
                
                {/* PROMINENT NOTICE BANNER THAT WAS MISSING OR INVISIBLE */}
                <div className="bg-gradient-to-r from-amber-600 to-indigo-700 border border-amber-400/40 rounded-2xl p-4 shadow-xl text-white font-sans relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 h-16 w-16 bg-white/5 rounded-bl-full pointer-events-none" />
                  <div className="flex gap-3 items-start text-left">
                    <span className="text-2xl shrink-0 select-none animate-bounce">🚀</span>
                    <div className="space-y-1 text-left">
                      <p className="font-extrabold text-sm text-yellow-100 font-display">AI SkillBridge Active Matching Roster</p>
                      <p className="text-xs text-white leading-relaxed font-semibold font-sans text-left">
                        AI analyzed compatibility matching for <b className="text-yellow-200">{majorInput || 'your academic goals'}</b>: Recommended study partners are <b className="underline text-yellow-300 select-all font-black">'{firstMatchTutor.name}'</b> or <b className="underline text-yellow-300 select-all font-black">'{secondMatchTutor.name}'</b> based on your interest in <b className="text-blue-200">'{skillsInput || 'complementary skills'}'</b>!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Map Visual flow Node trees */}
                <div className="bg-slate-950/60 border border-white/6 rounded-2xl p-4 space-y-3 text-left border-white/10">
                  <h4 className="text-[10px] font-bold text-indigo-450 text-indigo-400 uppercase tracking-wider font-mono">Interactive AI Recommended Learning Path</h4>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center py-2 relative">
                    
                    {/* Node 1: Dynamic Student Current Profile */}
                    <div className="p-3 bg-slate-900 border border-white/10 rounded-xl w-full md:w-[30%] text-left">
                      <p className="text-[9px] uppercase font-bold text-slate-400 font-mono">My Profile</p>
                      <p className="font-black text-xs text-white mt-1 truncate">{name} ({majorInput ? majorInput.slice(0, 15) : 'General Study'})</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate font-medium">Interests: {skillsInput ? skillsInput.slice(0, 18) : 'General skills'}</p>
                    </div>

                    {/* Arrow Connector */}
                    <div className="text-indigo-400 font-bold text-lg rotate-90 md:rotate-0">&rarr;</div>

                    {/* Node 2: Tutor 1 Match */}
                    <button 
                      onClick={() => onNavigate('profile', { tutorId: firstMatchTutor.id })}
                      className="p-3 bg-indigo-950/40 border border-indigo-500/40 hover:bg-indigo-955 hover:bg-indigo-950/70 rounded-xl w-full md:w-[30%] transition text-left cursor-pointer group animate-fade-in"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-[9px] uppercase font-bold text-indigo-400 font-mono">Top Compatible</p>
                        <span className="text-[8px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-1 rounded">99% FIT</span>
                      </div>
                      <p className="font-black text-xs text-white mt-1 group-hover:text-indigo-300 transition-colors truncate">{firstMatchTutor.name} ★</p>
                      <p className="text-[10px] text-indigo-300 mt-0.5 font-bold flex items-center gap-0.5">
                        {firstTutorSkillsText} &rarr;
                      </p>
                    </button>

                    {/* Arrow Connector */}
                    <div className="text-indigo-400 font-bold text-lg rotate-90 md:rotate-0">&rarr;</div>

                    {/* Node 3: Tutor 2 Match */}
                    <button 
                      onClick={() => onNavigate('profile', { tutorId: secondMatchTutor.id })}
                      className="p-3 bg-blue-955 bg-blue-950/40 border border-blue-500/40 hover:bg-blue-955 hover:bg-blue-950/70 rounded-xl w-full md:w-[30%] transition text-left cursor-pointer group animate-fade-in"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-[9px] uppercase font-bold text-blue-400 font-mono">Alternative</p>
                        <span className="text-[8px] bg-blue-500/20 text-blue-300 font-mono font-bold px-1 rounded">98% FIT</span>
                      </div>
                      <p className="font-black text-xs text-white mt-1 group-hover:text-blue-300 transition-colors truncate">{secondMatchTutor.name} ★</p>
                      <p className="text-[10px] text-blue-300 mt-0.5 font-bold flex items-center gap-0.5">
                        {secondTutorSkillsText} &rarr;
                      </p>
                    </button>

                  </div>

                  {/* Summary recommendations targets */}
                  <div className="border-t border-white/5 pt-3.5 space-y-2 text-left">
                    <p className="text-[10px] uppercase font-bold text-teal-400 font-mono">Unlocked Actionable Milestones</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                      <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 text-left">
                        <p className="font-black text-xs text-white">1. Connect with {firstMatchTutor.name}</p>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed font-normal mt-0.5">
                          Schedule brief peer mentoring or review core parts of <span className="text-slate-200 font-semibold">"{firstTutorAllSkillsText}"</span>.
                        </p>
                      </div>
                      <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5 text-left">
                        <p className="font-black text-xs text-white">2. Elective supplemental: {secondMatchTutor.name}</p>
                        <p className="text-[10.5px] text-slate-400 leading-relaxed font-normal mt-0.5">
                          Acquire multi-disciplinary knowledge or project help focus on <span className="text-slate-200 font-semibold">"{secondTutorAllSkillsText}"</span>.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex justify-between items-center pt-1.5 font-sans">
                  <button
                    onClick={() => {
                      setHasGeneratedMap(false);
                      setGenerationSteps([]);
                      try {
                        localStorage.removeItem('has_generated_ai_map');
                      } catch {}
                    }}
                    className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition cursor-pointer"
                  >
                    &larr; Reset Map Parameters
                  </button>
                  <p className="text-[9px] font-mono font-bold text-emerald-400">99% SYNERGY INDEX VERIFIED</p>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
