import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, BookOpen, Calendar, PlusCircle, Sparkles, Search, Sun, Moon, User, Globe, MessageSquare, Bell, CheckCircle2, Clock, PenTool } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extra?: any) => void;
  bookingCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  studentProfile?: {
    name: string;
    extraPointBalance: number;
    matricNumber: string;
  };
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'booking' | 'system' | 'ai';
  read: boolean;
}

export default function Navbar({ currentView, onNavigate, bookingCount, theme, onToggleTheme, studentProfile }: NavbarProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Your booking session has been confirmed',
      description: 'Your peer support call with Senior Tutor Alexis has been approved.',
      timestamp: '10m ago',
      type: 'booking',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'New AI tutor recommendation available',
      description: 'AI detected high compatibility matches for Computer Science on your profile.',
      timestamp: '1h ago',
      type: 'ai',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Your learning session starts in 30 minutes',
      description: 'Prepare materials for Peer-To-Peer curriculum syllabus review.',
      timestamp: '30m ago',
      type: 'system',
      read: false,
    }
  ]);

  const [desktopNotifOpen, setDesktopNotifOpen] = useState(false);
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);

  const desktopNotifRef = useRef<HTMLDivElement>(null);
  const mobileNotifRef = useRef<HTMLDivElement>(null);

  // We can track points changes to automatically trigger an unread notification 
  const prevPointsRef = useRef<number | undefined>(studentProfile?.extraPointBalance);

  useEffect(() => {
    if (studentProfile?.extraPointBalance !== undefined) {
      if (prevPointsRef.current !== undefined && studentProfile.extraPointBalance > prevPointsRef.current) {
        const diff = studentProfile.extraPointBalance - prevPointsRef.current;
        // Check if topup size
        const isTopupGroup = [50, 120, 300, 650].includes(diff);
        
        const newNotif: NotificationItem = {
          id: `pts-${Date.now()}`,
          title: isTopupGroup ? '🪙 Wallet Recharge Successful' : '🎟️ Booking Refunded & Credited',
          description: isTopupGroup 
            ? `You have successfully purchased and added +${diff} points to your student wallet!`
            : `Booking canceled. +${diff} points have been refunded and returned to your balance.`,
          timestamp: 'Just now',
          type: isTopupGroup ? 'system' : 'booking',
          read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
        setDesktopNotifOpen(true); // Automatically open the notifications dropdown to show user the notification!
      }
      prevPointsRef.current = studentProfile.extraPointBalance;
    }
  }, [studentProfile?.extraPointBalance]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (desktopNotifRef.current && !desktopNotifRef.current.contains(event.target as Node)) {
        setDesktopNotifOpen(false);
      }
      if (mobileNotifRef.current && !mobileNotifRef.current.contains(event.target as Node)) {
        setMobileNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleClearNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4 flex-nowrap">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 text-left shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg font-bold tracking-tight uppercase text-white whitespace-nowrap leading-none">
              QIU <span className="text-blue-500">SkillBridge</span>
            </span>
            <span className="block font-sans text-[8px] uppercase tracking-widest text-slate-400 font-semibold whitespace-nowrap mt-0.5">
              Peer-To-Peer Learning
            </span>
          </div>
        </button>

        {/* Navigation links for Desktop */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 flex-nowrap shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'home'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
            Home
          </button>

          <button
            onClick={() => onNavigate('search')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'search' || currentView === 'profile'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Search className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
            Find Tutors
          </button>

          <button
            onClick={() => onNavigate('community')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'community'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Globe className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
            Community
          </button>

          <button
            onClick={() => onNavigate('messages')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'messages'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
            Messages
          </button>

          <button
            onClick={() => onNavigate('my-bookings')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors relative whitespace-nowrap shrink-0 ${
              currentView === 'my-bookings'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
            My Bookings
            {bookingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 font-mono text-[9px] font-bold text-white ring-2 ring-slate-950">
                {bookingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('my-profile')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors relative whitespace-nowrap shrink-0 ${
              currentView === 'my-profile'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
            }`}
          >
            <User className="h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0" />
            My Profile
          </button>

          {/* Desktop Notifications Bell Dropdown */}
          <div className="relative shrink-0" ref={desktopNotifRef}>
            <button
              onClick={() => setDesktopNotifOpen(!desktopNotifOpen)}
              className={`p-1.5 lg:p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/25 hover:scale-105 relative ${
                desktopNotifOpen ? 'bg-white/10 text-white border-amber-500/30' : ''
              }`}
              title="Notifications"
            >
              <Bell className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${unreadCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 font-mono text-[9px] font-black text-slate-950 ring-2 ring-slate-900 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>


            {/* Notification Pane */}
            {desktopNotifOpen && (
              <div className="absolute right-0 mt-3.5 w-80 rounded-2xl border border-cyan-500/20 bg-slate-950 border-white/10 shadow-2xl z-50 overflow-hidden text-white font-sans ring-1 ring-cyan-500/10">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/40">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-cyan-500/20 text-cyan-400 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-full border border-cyan-400/10">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Body list */}
                <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mb-2.5 border border-white/5">
                        <Bell className="h-4 w-4 text-slate-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-400">All caught up!</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">No new notifications at this moment.</p>
                    </div>
                  ) : (
                    notifications.map(notif => {
                      let IconComponent = Clock;
                      let iconColor = 'text-amber-400 bg-amber-400/10 border-amber-400/20';
                      if (notif.type === 'booking') {
                        IconComponent = CheckCircle2;
                        iconColor = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                      } else if (notif.type === 'ai') {
                        IconComponent = Sparkles;
                        iconColor = 'text-purple-400 bg-purple-400/10 border-purple-400/20';
                      }

                      return (
                        <div 
                          key={notif.id}
                          onClick={() => handleToggleRead(notif.id)}
                          className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left group/item relative ${
                            notif.read ? 'opacity-60 hover:bg-white/5' : 'bg-cyan-500/[0.02] hover:bg-white/5'
                          }`}
                        >
                          {!notif.read && (
                            <span className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          )}

                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${iconColor}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>

                          <div className="flex-1 space-y-0.5">
                            <p className={`text-xs font-bold leading-snug transition-colors ${notif.read ? 'text-slate-400' : 'text-slate-100 group-hover/item:text-cyan-400'}`}>
                              {notif.title}
                            </p>
                            <p className="text-[10px] text-slate-400 leading-normal font-normal">
                              {notif.description}
                            </p>
                            <p className="text-[9px] text-slate-500 font-mono pt-1">
                              {notif.timestamp}
                            </p>
                          </div>

                          <button
                            onClick={(e) => handleClearNotif(notif.id, e)}
                            className="text-slate-555 text-slate-400 p-1 rounded-md hover:bg-white/5 opacity-0 group-hover/item:opacity-100 transition-all self-center shrink-0"
                            title="Dismiss notification"
                          >
                            <span className="text-[10px] font-bold">✕</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-1 lg:mx-1.5 shrink-0" />

          {studentProfile && (
            <button
              onClick={() => onNavigate('my-profile')}
              className="flex items-center gap-1.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1.5 lg:px-3.5 lg:py-1.5 border border-blue-500/20 text-xs font-bold text-blue-400 font-mono transition-all hover:scale-105 cursor-pointer shrink-0 whitespace-nowrap"
              title="Click to view Peer Wallet of Token Coins on My Profile"
            >
              <span className="text-sm">🪙</span>
              <span>{studentProfile.extraPointBalance} Pts</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('become-tutor')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 lg:px-4 lg:py-2 text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
              currentView === 'become-tutor'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-950 hover:bg-slate-200'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Become a Tutor</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-1.5 lg:p-2 rounded-full text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-200 border border-white/8 hover:scale-105 shrink-0"
            aria-label="Toggle Theme Mode"
            title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Sunset Campus Mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-indigo-500 fill-indigo-500/20" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400 fill-amber-400/20" />
            )}
          </button>
        </nav>

        {/* Mobile quick action menu */}
        <div className="flex items-center gap-2.5 lg:hidden shrink-0">
          {studentProfile && (
            <button
              onClick={() => onNavigate('my-profile')}
              className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1.5 border border-blue-500/20 text-[10.5px] font-extrabold font-mono text-blue-400 shrink-0 cursor-pointer hover:bg-blue-500/20 transition-all"
              title="My Wallet Balance Points"
            >
              <span>🪙</span>
              <span>{studentProfile.extraPointBalance} Lps</span>
            </button>
          )}

          {/* Mobile Notifications Bell Dropdown */}
          <div className="relative" ref={mobileNotifRef}>
            <button
              onClick={() => setMobileNotifOpen(!mobileNotifOpen)}
              className={`p-2 rounded-xl transition-all duration-250 relative border border-white/8 bg-slate-900/40 hover:bg-white/10 ${
                mobileNotifOpen ? 'text-amber-400 bg-white/10 border-amber-500/30' : 'text-slate-200 hover:text-white'
              }`}
              title="Notifications"
            >
              <Bell className={`h-4 w-4 ${unreadCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-300'}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 font-mono text-[9px] font-black text-slate-950 ring-2 ring-slate-900 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Pane */}
            {mobileNotifOpen && (
              <div className="fixed sm:absolute top-16 right-4 left-4 sm:left-auto sm:right-0 sm:w-80 rounded-2xl border border-white/10 bg-slate-950 text-white font-sans shadow-2xl z-50 overflow-hidden ring-1 ring-cyan-500/10">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-slate-900/40">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200 font-sans">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-cyan-500/20 text-cyan-400 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-full border border-cyan-400/10">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Body list */}
                <div className="max-h-[280px] overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mb-2.5 border border-white/5">
                        <Bell className="h-4 w-4 text-slate-500" />
                      </div>
                      <p className="text-xs font-bold text-slate-400">All caught up!</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">No new notifications at this moment.</p>
                    </div>
                  ) : (
                    notifications.map(notif => {
                      let IconComponent = Clock;
                      let iconColor = 'text-amber-400 bg-amber-400/10 border-amber-400/20';
                      if (notif.type === 'booking') {
                        IconComponent = CheckCircle2;
                        iconColor = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
                      } else if (notif.type === 'ai') {
                        IconComponent = Sparkles;
                        iconColor = 'text-purple-400 bg-purple-400/10 border-purple-400/20';
                      }

                      return (
                        <div 
                          key={notif.id}
                          onClick={() => handleToggleRead(notif.id)}
                          className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer text-left group/item relative ${
                            notif.read ? 'opacity-60 hover:bg-white/5' : 'bg-cyan-500/[0.02] hover:bg-white/5'
                          }`}
                        >
                          {!notif.read && (
                            <span className="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          )}

                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${iconColor}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>

                          <div className="flex-1 space-y-0.5">
                            <p className={`text-xs font-bold leading-snug transition-colors ${notif.read ? 'text-slate-400' : 'text-slate-100 group-hover/item:text-cyan-400'}`}>
                              {notif.title}
                            </p>
                            <p className="text-[10px] text-slate-400 leading-normal font-normal">
                              {notif.description}
                            </p>
                            <p className="text-[9px] text-slate-500 font-mono pt-1">
                              {notif.timestamp}
                            </p>
                          </div>

                          <button
                            onClick={(e) => handleClearNotif(notif.id, e)}
                            className="text-slate-400 p-1 rounded-md hover:bg-white/5 opacity-100 transition-all self-center shrink-0"
                            title="Dismiss notification"
                          >
                            <span className="text-[10px] font-bold">✕</span>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-200 border border-white/8 shrink-0"
            aria-label="Toggle Theme Mode"
            title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Sunset Campus Mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 text-indigo-500 fill-indigo-500/20" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400 fill-amber-400/20" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
