import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Info,
  GraduationCap,
  Sparkles,
  Calendar,
  AlertCircle,
  X,
  CheckCircle,
  Check,
  Search,
  Globe,
  MessageSquare,
  User
} from 'lucide-react';

import { Tutor, Booking, Review } from './types';
import { INITIAL_TUTORS } from './data/tutors';

// Import Views
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import SkillSearchView from './components/SkillSearchView';
import TutorProfileView from './components/TutorProfileView';
import BookingFormView from './components/BookingFormView';
import BecomeTutorView from './components/BecomeTutorView';
import MyBookingsView from './components/MyBookingsView';
import MyProfileView from './components/MyProfileView';
import CommunityBoardView from './components/CommunityBoardView';
import MessagesView from './components/MessagesView';
import StudyRoomView from './components/StudyRoomView';

const STORAGE_TUTORS_KEY = 'qiu_sb_tutors_v4';
const STORAGE_BOOKINGS_KEY = 'qiu_sb_bookings_v4';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  
  // Guard to prevent high-speed double-clicks or browser element bubbling on bookmark toggles
  const lastBookmarkRef = useRef<{ id: string, time: number }>({ id: '', time: 0 });
  
  // Sunny Campus (light) vs Starry Cosmos (dark) switcher
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('qiu_sb_theme_v4');
      return (stored === 'light' || stored === 'dark') ? stored : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    try {
      localStorage.setItem('qiu_sb_theme_v4', theme);
    } catch {}
    
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
  }, [theme]);

  // Search parameters parsed dynamically by SkillSearchView
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  // Interactive popup alerts / notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Load from local storage or fallback to static data
  const [tutors, setTutors] = useState<Tutor[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_TUTORS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Tutor[];
        // Filter out tutors with names like "Iky", "iky", "i"
        const filtered = parsed.filter(t => {
          const nameClean = t.name.trim().toLowerCase();
          return nameClean !== 'iky' && nameClean !== 'i' && nameClean !== '';
        });

        // Recovery: restore original system-created tutors if they were corrupted/overwritten by "Lky" or the cat avatar
        const restored = filtered.map(t => {
          const initial = INITIAL_TUTORS.find(init => init.id === t.id);
          if (initial) {
            const lowerName = t.name.trim().toLowerCase();
            // If a standard system tutor got renamed to 'lky' or has the cat avatar, restore it
            if (lowerName === 'lky' || lowerName.includes('timothy') || lowerName.includes('chew') || t.avatar.includes('photo-1514888286974-6c03e2ca1dba')) {
              return initial;
            }
            // Overwrite name, avatar, title, biography, and skills for standard system tutors to automatically apply avatar update fixes instantly
            return {
              ...t,
              name: initial.name,
              avatar: initial.avatar,
              title: initial.title,
              biography: initial.biography,
              skills: initial.skills
            };
          }
          return t;
        });

        // Ensure newly defined system tutors are appended
        const existingIds = new Set(restored.map(t => t.id));
        const missingFromInitial = INITIAL_TUTORS.filter(t => !existingIds.has(t.id));
        return [...restored, ...missingFromInitial];
      }
      return INITIAL_TUTORS;
    } catch {
      return INITIAL_TUTORS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_BOOKINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Booking[];
        // Recover tutorName and tutorAvatar from INITIAL_TUTORS if they match standard tutors to clean up any past corruption
        return parsed.map(b => {
          const initialTutor = INITIAL_TUTORS.find(t => t.id === b.tutorId);
          if (initialTutor) {
            return {
              ...b,
              tutorName: initialTutor.name,
              tutorAvatar: initialTutor.avatar
            };
          }
          return b;
        });
      }
      return [];
    } catch {
      return [];
    }
  });

  // Sync state with local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_TUTORS_KEY, JSON.stringify(tutors));
  }, [tutors]);

  // Active safeguard to purge any unwanted names from state immediately (e.g., "iky", "i")
  useEffect(() => {
    const hasUnwanted = tutors.some(t => {
      const nameClean = t.name.trim().toLowerCase();
      return nameClean === 'iky' && nameClean === 'i' && nameClean === '';
    });
    if (hasUnwanted) {
      setTutors(prev => prev.filter(t => {
        const nameClean = t.name.trim().toLowerCase();
        return nameClean !== 'iky' && nameClean !== 'i' && nameClean !== '';
      }));
    }
  }, [tutors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  // Student Profile State (persistent in localstorage)
  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('qiu_student_profile_v4');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Force reset the name and avatar to Lky if it currently holds Timothy Chew or Timothy, is empty, or uses the specific unwanted Timothy portrait avatar
        if (parsed) {
          const nameLower = (parsed.name || '').trim().toLowerCase();
          const avatarUrl = parsed.avatar || '';
          const isTimothyProfile = nameLower.includes('timothy') || nameLower.includes('chew') || nameLower === '';
          const isTimothyAvatar = avatarUrl.includes('1535713875002') || !avatarUrl;
          if (isTimothyProfile || isTimothyAvatar) {
            parsed.name = 'Lky';
            parsed.avatar = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop';
            try {
              localStorage.setItem('qiu_student_profile_v4', JSON.stringify(parsed));
            } catch {}
          }
        }
        return parsed;
      }
    } catch {}
    const defaultProfile = {
      name: 'Lky',
      matricNumber: 'QIU-24-CS-0032',
      programme: 'Bachelor of Computer Science (Hons)',
      biography: 'Year 2 CS major passionate about database normalizations, SQL, and robust React widgets. Ping me if you want to pair-debug!',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop',
      extraPointBalance: 40,
      baseStudyHours: 12.0
    };
    try {
      localStorage.setItem('qiu_student_profile_v4', JSON.stringify(defaultProfile));
    } catch {}
    return defaultProfile;
  });

  // Startup hook to guarantee Lky identity for student profile and all created cards
  useEffect(() => {
    // 0. Super-robust Global LocalStorage Scanner to intercept any device's historic cached name "Timothy"
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key);
          if (val && (val.toLowerCase().includes('timothy') || val.toLowerCase().includes('chew') || val.toLowerCase().includes('1535713875002'))) {
            try {
              const parsed = JSON.parse(val);
              if (parsed && typeof parsed === 'object') {
                // If it is a simple profile object
                if (!Array.isArray(parsed)) {
                  const nameVal = (parsed.name || '').toLowerCase();
                  const avatarVal = parsed.avatar || '';
                  const isUnwantedName = nameVal.includes('timothy') || nameVal.includes('chew');
                  const isUnwantedAvatar = avatarVal.includes('1535713875002');
                  
                  if (isUnwantedName || isUnwantedAvatar) {
                    parsed.name = 'Lky';
                    parsed.avatar = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop';
                  }
                }
                // If it is an array of tutors/items (specifically check for name property to avoid corrupting bookings)
                if (Array.isArray(parsed)) {
                  parsed.forEach(item => {
                    if (item && typeof item === 'object') {
                      const itemName = (item.name || '').toLowerCase();
                      const itemAvatar = item.avatar || '';
                      const isBadItem = itemName.includes('timothy') || itemName.includes('chew') || itemAvatar.includes('1535713875002');
                      if (isBadItem) {
                        item.name = 'Lky';
                        item.avatar = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop';
                        if (item.title) {
                          item.title = item.title.replace(/Timothy/gi, 'Lky');
                        }
                      }
                    }
                  });
                }
                localStorage.setItem(key, JSON.stringify(parsed));
              } else {
                if (val.toLowerCase().includes('timothy') || val.toLowerCase().includes('chew')) {
                  localStorage.setItem(key, 'Lky');
                }
              }
            } catch {
              // Not a valid JSON, fallback to removing or clearing if it explicitly contains unwanted names
              if (val.toLowerCase().includes('timothy') || val.toLowerCase().includes('chew')) {
                localStorage.removeItem(key);
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Global storage sanitization checked: ", e);
    }

    // 1. Force state & storage profiles containing 'Timothy' or 'Chew' to Lky
    setStudentProfile(prev => {
      const nameClean = (prev.name || '').trim().toLowerCase();
      const avatarUrl = prev.avatar || '';
      const isUnwantedName = nameClean.includes('timothy') || nameClean.includes('chew') || nameClean === '';
      const isUnwantedAvatar = avatarUrl.includes('1535713875002') || !avatarUrl;
      
      if (isUnwantedName || isUnwantedAvatar) {
        const updated = {
          ...prev,
          name: 'Lky',
          avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop'
        };
        try {
          localStorage.setItem('qiu_student_profile_v4', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });

    // 2. Scan and dynamically rename older tutor cards under 'Timothy Chew' / 'Timothy' to 'Lky' with the correct avatar
    setTutors(prevTutors => {
      let changed = false;
      const updated = prevTutors.map(t => {
        // Recovery check: if this is a standard system tutor, but its name or avatar was corrupted to 'lky' or user avatar, restore it!
        const initial = INITIAL_TUTORS.find(init => init.id === t.id);
        if (initial) {
          const lowerName = t.name.trim().toLowerCase();
          if (lowerName === 'lky' || lowerName.includes('timothy') || lowerName.includes('chew') || t.avatar.includes('photo-1514888286974-6c03e2ca1dba')) {
            changed = true;
            return initial;
          }
          return t;
        }

        const tNameLower = t.name.toLowerCase();
        const tAvatar = t.avatar || '';
        const isBadTutor = tNameLower.includes('timothy') || tNameLower.includes('chew') || tAvatar.includes('1535713875002');
        if (isBadTutor) {
          changed = true;
          return {
            ...t,
            name: 'Lky',
            avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop',
            title: t.title.replace(/Timothy/gi, 'Lky')
          };
        }
        return t;
      });
      if (changed) {
        try {
          localStorage.setItem(STORAGE_TUTORS_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prevTutors;
    });
  }, []);

  const [bookmarkedTutorIds, setBookmarkedTutorIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('qiu_bookmarked_tutors_v4');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  // Save student profile and sync with corresponding Tutor card in directory
  const handleSaveProfile = (updatedProfile: any) => {
    // If the student has an active tutor listing, sync their name/avatar/programme/biography
    setTutors(prevTutors => {
      return prevTutors.map(t => {
        if (t.name.toLowerCase() === studentProfile.name.toLowerCase()) {
          return {
            ...t,
            name: updatedProfile.name,
            avatar: updatedProfile.avatar,
            programme: updatedProfile.programme,
            biography: updatedProfile.biography
          };
        }
        return t;
      });
    });

    setStudentProfile(updatedProfile);
    try {
      localStorage.setItem('qiu_student_profile_v4', JSON.stringify(updatedProfile));
    } catch {}
  };

  // Autosave student profile changes to local storage to satisfy " 有edit就保存我的最新"
  useEffect(() => {
    try {
      localStorage.setItem('qiu_student_profile_v4', JSON.stringify(studentProfile));
    } catch {}
  }, [studentProfile]);

  // Toggle mentor bookmark saver with high-speed double-click protection
  const handleToggleBookmark = (tutorId: string) => {
    const now = Date.now();
    if (lastBookmarkRef.current.id === tutorId && now - lastBookmarkRef.current.time < 800) {
      // Debounce and suppress double click alerts
      return;
    }
    lastBookmarkRef.current = { id: tutorId, time: now };

    const isAlreadyBookmarked = bookmarkedTutorIds.includes(tutorId);
    const nextList = isAlreadyBookmarked 
      ? bookmarkedTutorIds.filter(id => id !== tutorId) 
      : [...bookmarkedTutorIds, tutorId];

    setBookmarkedTutorIds(nextList);
    try {
      localStorage.setItem('qiu_bookmarked_tutors_v4', JSON.stringify(nextList));
    } catch {}

    addToast(
      isAlreadyBookmarked 
        ? 'Removed tutor from your Saved list.' 
        : 'Tutor added to your saved bookmarks! ❤️', 
      isAlreadyBookmarked ? 'info' : 'success'
    );
  };

  // Core navigation controller
  const handleNavigate = (view: string, extra?: any) => {
    setCurrentView(view);
    
    if (extra?.tutorId) {
      setSelectedTutorId(extra.tutorId);
    }
    
    // Quick scroll to top on navigate to simulate page refresh
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQueryChange = (query: string, catId: string) => {
    setSearchQuery(query);
    setSearchCategory(catId);
  };

  // Create a simulated booking
  const handleCreateBooking = (bkData: { 
    tutorId: string; 
    date: string; 
    timeSlot: string; 
    type: 'online' | 'in-person'; 
    notes: string; 
    durationHours?: number;
    pointsDeducted?: number;
  }) => {
    const targetTutor = tutors.find(t => t.id === bkData.tutorId);
    if (!targetTutor) return;

    const duration = bkData.durationHours || 1;
    const points = bkData.pointsDeducted !== undefined ? bkData.pointsDeducted : (duration * targetTutor.hourlyRate);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      tutorId: bkData.tutorId,
      tutorName: targetTutor.name,
      tutorAvatar: targetTutor.avatar,
      date: bkData.date,
      timeSlot: bkData.timeSlot,
      type: bkData.type,
      notes: bkData.notes,
      locationOrLink: bkData.type === 'online' ? 'https://zoom.us/j/simulation' : 'QIU Campus Library Room #4',
      status: 'upcoming',
      hasFeedback: false,
      durationHours: duration,
      pointsDeducted: points
    };

    setBookings(prev => [newBooking, ...prev]);

    // Also deduct points from student balance
    setStudentProfile(prev => {
      const updated = {
        ...prev,
        extraPointBalance: Math.max(0, prev.extraPointBalance - points)
      };
      try {
        localStorage.setItem('qiu_student_profile_v4', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    addToast(`Successfully booked peer tutoring with ${targetTutor.name}! Deducted ${points} points. 📅`, 'success');
  };

  const handleCancelBooking = (bookingId: string) => {
    // If it is 'force-update', we just force updating bookings state to update local state mutations (like early completion)
    if (bookingId === 'force-update') {
      setBookings(prev => [...prev]);
      addToast('Awesome job! Peer tutoring session marked as completed. 🎓', 'success');
      return;
    }
    
    const target = bookings.find(b => b.id === bookingId);
    
    if (target && target.status === 'upcoming') {
      const refundPoints = target.pointsDeducted !== undefined ? target.pointsDeducted : (target.durationHours || 1) * (tutors.find(t => t.id === target.tutorId)?.hourlyRate || 10);
      if (refundPoints > 0) {
        setStudentProfile(prev => {
          const updated = {
            ...prev,
            extraPointBalance: prev.extraPointBalance + refundPoints
          };
          try {
            localStorage.setItem('qiu_student_profile_v4', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        addToast(`Refunded ${refundPoints} points / tokens to your student wallet balance! 🪙`, 'success');
      }
    }

    setBookings(prev => prev.filter(b => b.id !== bookingId));
    addToast(target ? `Cancelled appointment session with ${target.tutorName}.` : 'Booking successfully cancelled.', 'info');
  };

  // Submit Feedback Review (this re-calculates the tutor grade dynamically as well!)
  const handleSubmitReview = (tutorId: string, rating: number, comment: string, studentName: string) => {
    setTutors(prevTutors => {
      const updated = prevTutors.map(tutor => {
        if (tutor.id === tutorId) {
          const newReview: Review = {
            id: `rev-${Date.now()}`,
            studentName,
            rating,
            date: new Date().toISOString().split('T')[0],
            comment
          };

          const newReviews = [newReview, ...tutor.reviews];
          const averageRating = newReviews.reduce((sum, rev) => sum + rev.rating, 0) / newReviews.length;

          return {
            ...tutor,
            reviews: newReviews,
            rating: parseFloat(averageRating.toFixed(1)),
            completedSessions: tutor.completedSessions + 1
          };
        }
        return tutor;
      });
      return updated;
    });
    addToast(`Thanks for the review, ${studentName}! Your rating score is live! ⭐`, 'success');
  };

  const handleDeleteReview = (tutorId: string, reviewId: string) => {
    setTutors(prevTutors => {
      return prevTutors.map(tutor => {
        if (tutor.id === tutorId) {
          const newReviews = tutor.reviews.filter(r => r.id !== reviewId);
          const averageRating = newReviews.length > 0 
            ? newReviews.reduce((sum, rev) => sum + rev.rating, 0) / newReviews.length
            : 5.0;

          return {
            ...tutor,
            reviews: newReviews,
            rating: parseFloat(averageRating.toFixed(1))
          };
        }
        return tutor;
      });
    });
    addToast('Peer review deleted successfully. Rating adjusted.', 'info');
  };

  const handleUpdateBookingReviewStatus = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, hasFeedback: true } : b));
  };

  const handleRegisterTutor = (newTutorData: {
    name: string;
    avatar: string;
    title: string;
    biography: string;
    programme: string;
    categories: string[];
    skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Expert' }[];
    experience: string[];
    availability: { day: string; slots: string[] }[];
  }) => {
    // Also sync the details back to student profile
    setStudentProfile(prev => ({
      ...prev,
      name: newTutorData.name,
      avatar: newTutorData.avatar || prev.avatar,
      programme: newTutorData.programme,
      biography: newTutorData.biography
    }));

    const newTutor: Tutor = {
      id: `tutor-user-${Date.now()}`,
      name: newTutorData.name,
      avatar: newTutorData.avatar,
      title: newTutorData.title,
      biography: newTutorData.biography,
      programme: newTutorData.programme,
      categories: newTutorData.categories,
      skills: newTutorData.skills,
      experience: newTutorData.experience,
      availability: newTutorData.availability,
      reviews: [],
      rating: 5.0,
      hourlyRate: 15,
      completedSessions: 0,
      isUserCreated: true
    };

    setTutors(prev => [newTutor, ...prev]);
    addToast(`Welcome ${newTutorData.name}! Your professional Peer Tutor Card is active. ✨`, 'success');
  };

  const handleModifyTutorCard = (updatedTutor: Tutor) => {
    // Also sync the details back to student profile
    setStudentProfile(prev => ({
      ...prev,
      name: updatedTutor.name,
      avatar: updatedTutor.avatar,
      programme: updatedTutor.programme,
      biography: updatedTutor.biography
    }));

    setTutors(prev => prev.map(t => t.id === updatedTutor.id ? { ...updatedTutor, isUserCreated: true } : t));
    addToast('Your Peer Tutor card has been updated successfully! ✨', 'success');
  };

  const handleDeleteTutor = (tutorId: string) => {
    setTutors(prev => prev.filter(t => t.id !== tutorId));
    addToast('Your Peer Tutor card has been deleted and removed from the directory.', 'info');
  };

  // Find currently selected tutor if any
  const currentSelectedTutor = tutors.find(t => t.id === selectedTutorId) || tutors[0];

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-between selection:bg-blue-550 selection:bg-blue-500/30 selection:text-white">
      
      {/* Interactive floating Toast Notifications hub */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3.5 max-w-sm w-full p-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full rounded-2xl p-4 shadow-2xl glass-panel border border-white/12 flex items-start gap-3 bg-slate-950/95 text-white"
            >
              <div className={`p-1.5 rounded-xl shrink-0 ${
                toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                {toast.type === 'success' && <Check className="h-4 w-4 stroke-[2.5]" />}
                {toast.type === 'error' && <AlertCircle className="h-4 w-4" />}
                {toast.type === 'info' && <Info className="h-4 w-4" />}
              </div>
              
              <div className="flex-grow space-y-0.5 text-left">
                <p className="text-xs font-bold font-sans tracking-wide text-white">
                  {toast.type === 'success' ? 'Success Confirmation' : toast.type === 'error' ? 'Something went wrong' : 'Information Info'}
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">{toast.message}</p>
              </div>

              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
                className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Universal Sticky Header Navigation */}
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        bookingCount={bookings.filter(b => b.status === 'upcoming').length}
        theme={theme}
        onToggleTheme={toggleTheme}
        studentProfile={studentProfile}
      />

      {/* Main Dynamic View Area with subtle entrance layout animation */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {currentView === 'home' && (
              <HomeView 
                tutors={tutors} 
                onNavigate={handleNavigate} 
                onSearchQuery={handleQueryChange}
              />
            )}

            {currentView === 'search' && (
              <SkillSearchView 
                tutors={tutors} 
                onNavigate={handleNavigate} 
                initialSearchQuery={searchQuery}
                initialCategory={searchCategory}
                bookmarkedTutorIds={bookmarkedTutorIds}
                onToggleBookmark={handleToggleBookmark}
              />
            )}

            {currentView === 'profile' && selectedTutorId && (
              <TutorProfileView 
                tutor={currentSelectedTutor} 
                onNavigate={handleNavigate} 
                onSubmitReview={handleSubmitReview}
                onDeleteReview={handleDeleteReview}
                bookmarkedTutorIds={bookmarkedTutorIds}
                onToggleBookmark={handleToggleBookmark}
                studentName={studentProfile.name}
              />
            )}

            {currentView === 'book' && selectedTutorId && (
              <BookingFormView 
                tutor={currentSelectedTutor} 
                onSubmitBooking={handleCreateBooking}
                onNavigate={handleNavigate}
                studentProfile={studentProfile}
              />
            )}

            {currentView === 'become-tutor' && (
              <BecomeTutorView 
                onRegisterTutor={handleRegisterTutor}
                onEditTutor={handleModifyTutorCard}
                onDeleteTutor={handleDeleteTutor}
                onNavigate={handleNavigate}
                studentProfile={studentProfile}
                tutors={tutors}
              />
            )}

            {currentView === 'my-bookings' && (
              <MyBookingsView 
                bookings={bookings}
                tutors={tutors}
                onCancelBooking={handleCancelBooking}
                onSubmitReview={handleSubmitReview}
                onNavigate={handleNavigate}
                onUpdateBookingReviewStatus={handleUpdateBookingReviewStatus}
                studentName={studentProfile.name}
              />
            )}

            {currentView === 'my-profile' && (
              <MyProfileView
                tutors={tutors}
                bookings={bookings}
                studentProfile={studentProfile}
                onSaveProfile={handleSaveProfile}
                bookmarkedTutorIds={bookmarkedTutorIds}
                onToggleBookmark={handleToggleBookmark}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'community' && (
              <CommunityBoardView
                studentName={studentProfile.name}
                studentAvatar={studentProfile.avatar}
                studentProgramme={studentProfile.programme}
                onNavigate={handleNavigate}
                addToast={addToast}
              />
            )}

            {currentView === 'messages' && (
              <MessagesView
                tutors={tutors}
                studentName={studentProfile.name}
                studentAvatar={studentProfile.avatar}
                selectedChatTutorId={selectedTutorId}
                onNavigate={handleNavigate}
                addToast={addToast}
              />
            )}

            {currentView === 'study-room' && (
              <StudyRoomView
                studentProfile={studentProfile}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Centered minimalist and honest footer layout */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-12 border-t border-slate-850">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="h-3.5 w-3.5" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-white">
                QIU <span className="text-blue-500">SkillBridge</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Quest International University peer platform for mutual learning and student empowerment.
            </p>
          </div>

          <div className="flex gap-4.5 text-xs font-semibold text-slate-400 justify-center">
            <button onClick={() => handleNavigate('home')} className="hover:text-blue-400 transition-colors cursor-pointer">Home Page</button>
            <span className="text-slate-700 select-none">•</span>
            <button onClick={() => handleNavigate('search')} className="hover:text-blue-400 transition-colors cursor-pointer">Find Tutors</button>
            <span className="text-slate-700 select-none">•</span>
            <button onClick={() => handleNavigate('my-bookings')} className="hover:text-blue-400 transition-colors cursor-pointer">My Bookings</button>
            <span className="text-slate-700 select-none">•</span>
            <button onClick={() => handleNavigate('become-tutor')} className="hover:text-blue-400 transition-colors cursor-pointer">Join as Mentor</button>
          </div>
        </div>

        {/* Note block */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-600 font-mono text-[10px]">
            &copy; {new Date().getFullYear()} QIU SkillBridge. Made with care for the peer exchange community.
          </p>
        </div>
      </footer>

      {/* Mobile-First Persistent Floating Quick-Access Dock Bar */}
      <div className="lg:hidden fixed bottom-5 left-4 right-4 z-50 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] px-3 py-2.5 flex items-center justify-around ring-1 ring-white/5 animate-fade-in">
        {[
          { id: 'home', label: 'Home', icon: Sparkles },
          { id: 'search', label: 'Tutors', icon: Search },
          { id: 'community', label: 'Community', icon: Globe },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'study-room', label: 'Room', icon: GraduationCap }, // Added dynamic quick access link to whiteboards panel
          { id: 'my-bookings', label: 'Bookings', icon: Calendar, badge: bookings.filter(b => b.status === 'upcoming').length },
          { id: 'my-profile', label: 'Profile', icon: User }
        ].map(item => {
          const isActive = currentView === item.id || (item.id === 'search' && currentView === 'profile');
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`flex flex-col items-center justify-center relative p-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive ? 'text-blue-400 scale-110 font-black' : 'text-slate-400 hover:text-slate-250'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="relative">
                <IconComponent className={`h-5 w-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 font-mono text-[9px] font-bold text-white ring-1 ring-slate-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9.5px] font-sans tracking-tight mt-1 font-semibold select-none">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
