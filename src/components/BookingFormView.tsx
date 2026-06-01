import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Video, 
  ChevronLeft, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Sparkles,
  Info,
  Star
} from 'lucide-react';
import { Tutor } from '../types';

interface BookingFormViewProps {
  tutor: Tutor;
  onSubmitBooking: (booking: { 
    tutorId: string; 
    date: string; 
    timeSlot: string; 
    type: 'online' | 'in-person'; 
    notes: string;
    durationHours?: number;
    pointsDeducted?: number;
  }) => void;
  onNavigate: (view: string, extra?: any) => void;
  studentProfile?: {
    name: string;
    extraPointBalance: number;
    matricNumber: string;
    programme: string;
    biography: string;
    avatar: string;
  };
}

export default function BookingFormView({ tutor, onSubmitBooking, onNavigate, studentProfile }: BookingFormViewProps) {
  // Generate a list of 5 next available dates starting tomorrow
  const datesList = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + 1 + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return {
      raw: d.toISOString().split('T')[0],
      dayName,
      formattedDate,
    };
  });

  const [selectedDateObj, setSelectedDateObj] = useState(datesList[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [bookedStatus, setBookedStatus] = useState(false);
  const [formError, setFormError] = useState('');

  // Calculate dynamic token/point conversion rate
  const pointsCost = Math.round(tutor.hourlyRate * durationHours);
  const userBalance = studentProfile?.extraPointBalance ?? 0;
  const isInsufficient = userBalance < pointsCost;

  // Find if tutor has availability on this selected day
  const matchingDayAvailability = tutor.availability.find(
    (avail) => avail.day.toLowerCase() === selectedDateObj.dayName.toLowerCase()
  );

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setFormError('Please select a specific hourly time slot from the active list.');
      return;
    }

    if (isInsufficient) {
      setFormError(`Insufficient points! You need ${pointsCost} points but currently have only ${userBalance} points.`);
      return;
    }

    onSubmitBooking({
      tutorId: tutor.id,
      date: `${selectedDateObj.dayName}, ${selectedDateObj.formattedDate}`,
      timeSlot: selectedSlot,
      type: sessionType,
      notes,
      durationHours,
      pointsDeducted: pointsCost
    });

    setFormError('');
    setBookedStatus(true);
  };

  if (bookedStatus) {
    return (
      <div className="mx-auto max-w-lg text-center bg-slate-900/60 backdrop-blur-lg p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 my-10 relative overflow-hidden text-white leading-relaxed">
        {/* Decorative corner flash */}
        <div className="absolute top-0 right-0 h-28 w-28 bg-blue-500/10 rounded-bl-full pointer-events-none" />
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 animate-bounce">
          <CheckCircle className="h-10 w-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="font-sans text-2xl font-extrabold text-white tracking-tight font-display">Booking Initiated!</h1>
          <p className="text-slate-300 text-sm font-sans font-medium">
            Your learning session with <strong className="text-white">{tutor.name}</strong> is safely registered. A calendar invite has been simulation-sent.
          </p>
        </div>

        {/* Breakdown detail card */}
        <div className="rounded-3xl bg-slate-950/80 border border-white/8 p-5 text-left divide-y divide-white/5 space-y-3">
          <div className="flex items-center gap-3 pb-3">
            <img 
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500/10 bg-slate-900" 
              src={tutor.avatar} 
              alt={tutor.name}
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-bold text-xs text-white">{tutor.name}</p>
              <p className="text-[11px] text-blue-400 font-mono font-bold tracking-tight uppercase mt-0.5">{tutor.hourlyRate} Points/hr</p>
            </div>
          </div>

          <div className="pt-3 space-y-2.5 text-xs text-slate-200 font-sans">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Session Schedule:</span>
              <span className="font-bold">{selectedDateObj.dayName}, {selectedSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Classroom Mode:</span>
              <span className="font-semibold flex items-center gap-1 text-slate-100">
                {sessionType === 'online' ? (
                  <>
                    <Video className="h-3.5 w-3.5 text-blue-400" />
                    Online Video Bridge
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-blue-400" />
                    In-Person QIU Library
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-2.5">
              <span className="text-slate-400 font-bold">Session Duration:</span>
              <span className="font-bold text-slate-200">{durationHours.toFixed(1)} Hours</span>
            </div>
            <div className="flex justify-between text-blue-350">
              <span className="font-bold text-blue-400">Total Tokens Deducted:</span>
              <span className="font-extrabold text-blue-400 underline decoration-blue-500/30">{pointsCost} Points</span>
            </div>
            {notes.trim() && (
              <div className="pt-2">
                <span className="text-slate-400 font-bold block mb-1">Lesson Goals:</span>
                <p className="text-[11px] bg-slate-900 border border-white/5 p-2.5 rounded-xl text-slate-300 italic">
                  "{notes}"
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-2.5 font-sans">
          <button
            onClick={() => onNavigate('my-bookings')}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            Review Active Appointments
            <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/10 font-bold text-xs text-slate-200 transition cursor-pointer"
          >
            Back to Home Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto font-sans text-white">
      {/* Back link */}
      <button
        onClick={() => onNavigate('profile', { tutorId: tutor.id })}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-blue-400 transition cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to profile
      </button>

      {/* Header */}
      <div>
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-blue-400">Scheduler</span>
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-white sm:text-3xl mt-1 font-display">
          Reserve Learning Session
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-medium">
          Coordinate time, location, and focus topic with senior student manager <strong className="text-slate-100">{tutor.name}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Booking Form Panel */}
        <form onSubmit={handleBookingSubmit} className="md:col-span-2 bg-slate-900/40 backdrop-blur-lg rounded-3xl p-6 border border-white/8 shadow-2xl space-y-6 text-white border-white/10">
          {/* 1. Date Selector Cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">1. Select Target Date</label>
            <div className="grid grid-cols-5 gap-2">
              {datesList.map((dt) => {
                const isSelected = selectedDateObj.raw === dt.raw;
                const matchesAvail = tutor.availability.some(
                  (av) => av.day.toLowerCase() === dt.dayName.toLowerCase()
                );

                return (
                  <button
                    type="button"
                    key={dt.raw}
                    onClick={() => {
                      setSelectedDateObj(dt);
                      setSelectedSlot('');
                    }}
                    className={`rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white font-bold'
                        : matchesAvail
                        ? 'bg-blue-500/10 border-blue-500/25 text-blue-300 hover:bg-blue-600/15'
                        : 'bg-slate-950 border-white/5 text-slate-600 opacity-55'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-tight">
                      {dt.dayName.slice(0, 3)}
                    </span>
                    <span className="text-xs font-bold mt-1">
                      {dt.formattedDate.split(' ')[1].replace(',', '')}
                    </span>
                    <span className="text-[8px] mt-0.5 opacity-80 scale-90 @sm:block truncate select-none">
                      {matchesAvail ? 'Available' : 'Unscheduled'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Slot Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">2. Select Available Time</label>
            
            {!matchingDayAvailability ? (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/15 p-4 text-xs text-amber-300 flex gap-2 items-center leading-relaxed font-sans font-medium">
                <Info className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  {tutor.name} is not scheduled to tutor on <strong>{selectedDateObj.dayName}s</strong>. Please choose another date block!
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {matchingDayAvailability.slots.map((slot) => {
                  const isSlotSel = selectedSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-xl py-2 px-3 text-center text-xs font-bold font-mono transition-all border cursor-pointer ${
                        isSlotSel
                          ? 'bg-blue-600 border-blue-600 text-white font-extrabold'
                          : 'bg-slate-955 bg-slate-950 text-slate-300 border-white/8 hover:bg-white/5'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Choose Lesson Type */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">3. Learning Venue Mode</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setSessionType('online')}
                className={`rounded-2xl p-4 text-left transition-all border flex gap-3.5 items-center cursor-pointer ${
                  sessionType === 'online'
                    ? 'border-blue-500 bg-blue-500/15 text-blue-200 ring-1 ring-blue-500'
                    : 'border-white/8 bg-slate-955 bg-slate-950 text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${sessionType === 'online' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Online Video Classroom</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Zoom / Google Meet simulation links will be sent</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSessionType('in-person')}
                className={`rounded-2xl p-4 text-left transition-all border flex gap-3.5 items-center cursor-pointer ${
                  sessionType === 'in-person'
                    ? 'border-blue-500 bg-blue-500/15 text-blue-200 ring-1 ring-blue-500'
                    : 'border-white/8 bg-slate-955 bg-slate-950 text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${sessionType === 'in-person' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">In-Person Library Match</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Meet at the QIU Campus Central Library (Level 2)</p>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Active Token Conversion & Duration Selector */}
          <div className="space-y-3.5 bg-slate-950/60 p-4.5 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-left">
                  4. Choose Session Duration
                </label>
                <p className="text-[10px] text-slate-400 mt-0.5 text-left">Select how many hours you wish to book.</p>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-bold font-mono">
                {tutor.hourlyRate} Pts/hr
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[1.0, 1.5, 2.0, 2.5, 3.0].map((hours) => {
                const isSelected = durationHours === hours;
                const cost = Math.round(tutor.hourlyRate * hours);
                return (
                  <button
                    type="button"
                    key={hours}
                    onClick={() => setDurationHours(hours)}
                    className={`rounded-xl py-2 px-1 flex flex-col items-center justify-center transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white font-bold'
                        : 'bg-slate-900 border-white/8 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono">{hours.toFixed(1)} hr</span>
                    <span className="text-[9px] opacity-75 mt-0.5">{cost} Pts</span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/5 pt-3 mt-3 flex flex-row justify-between items-center gap-2">
              <div className="text-left">
                <span className="text-[11px] font-semibold text-slate-405 text-slate-400 block">YOUR WALLET BALANCE</span>
                <span className="text-xs font-bold text-slate-200 font-mono">
                  🪙 {userBalance} Points
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-410 text-slate-400 block">TOTAL SESSION COST</span>
                <span className="text-sm font-extrabold text-blue-400 font-mono">
                  ⚡ {pointsCost} Points
                </span>
              </div>
            </div>

            {isInsufficient && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-[11px] text-rose-300 flex gap-2 items-center leading-relaxed text-left">
                <span className="shrink-0 text-rose-400 font-bold">⚠️</span>
                <span>
                  Your point balance of <strong>{userBalance} Pts</strong> is less than <strong>{pointsCost} Pts</strong>. Sign up as a tutor/mentor to earn more, or choose a shorter duration!
                </span>
              </div>
            )}
          </div>

          {/* 5. Support inputs / Goals notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-left" htmlFor="session-notes">
              5. Goals & Lesson Prerequisites (Optional)
            </label>
            <textarea
              id="session-notes"
              rows={3}
              placeholder="What questions, assignment equations, or module topics should we tackle during this session?"
              className="w-full rounded-2xl border border-white/8 p-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white placeholder:text-slate-600 text-left"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {formError && (
            <p className="text-rose-400 font-bold text-xs">{formError}</p>
          )}

          {/* Form Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white transition-all shadow-lg hover:shadow-blue-500/15 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Verify & Complete Booking
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Tutor Mini-card Context info */}
        <section className="bg-slate-955 bg-slate-950/60 rounded-3xl p-5 border border-white/8 sticky top-24 space-y-4 shadow-xl">
          <h3 className="text-slate-400 text-[10px] uppercase font-bold tracking-widest block border-b border-white/5 pb-2 font-display">Tutor Detail</h3>
          
          <div className="flex gap-3">
            <img 
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500/10 shrink-0 bg-slate-900" 
              src={tutor.avatar} 
              alt={tutor.name}
              referrerPolicy="no-referrer"
            />
            <div className="space-y-0.5 text-left">
              <p className="font-bold text-white text-xs">{tutor.name}</p>
              <p className="text-[11px] text-slate-300 leading-normal font-semibold truncate max-w-[200px]">{tutor.title}</p>
              <p className="text-[10px] text-blue-400 font-mono font-bold tracking-tight uppercase pt-1">{tutor.hourlyRate} Points/hr</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3 space-y-2 text-left">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(tutor.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-800'}`} 
                />
              ))}
              <span className="text-[11px] font-bold text-slate-300 pl-1">{tutor.rating.toFixed(1)} rating</span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed italic">
              "We will cover exact slides and clear tutorials so you get full confidence before exam starts!"
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
