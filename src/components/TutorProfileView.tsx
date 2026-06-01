import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  BookOpen, 
  MapPin, 
  ChevronLeft, 
  MessageSquare, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Send,
  X,
  Sparkles,
  Heart,
  UserCheck
} from 'lucide-react';
import { Tutor, Review } from '../types';

interface TutorProfileViewProps {
  tutor: Tutor;
  onNavigate: (view: string, extra?: any) => void;
  onSubmitReview: (tutorId: string, rating: number, comment: string, studentName: string) => void;
  onDeleteReview: (tutorId: string, reviewId: string) => void;
  bookmarkedTutorIds?: string[];
  onToggleBookmark?: (tutorId: string) => void;
  studentName?: string;
}

export default function TutorProfileView({ 
  tutor, 
  onNavigate, 
  onSubmitReview, 
  onDeleteReview,
  bookmarkedTutorIds = [],
  onToggleBookmark,
  studentName = ''
}: TutorProfileViewProps) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const isBookmarked = bookmarkedTutorIds.includes(tutor.id);

  // Leave a review state variables
  const [userRating, setUserRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(studentName);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Simulated Chat Box State variables
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'tutor'; text: string; time: string }>>([
    { sender: 'tutor', text: `Hi classmate! I'm ${tutor.name.split(' ')[0]}. What modules or exam topics are on your mind?`, time: 'Just now' }
  ]);
  const [pendingMessage, setPendingMessage] = useState('');

  // Automatically refresh reviewerName when studentName changes or modal is triggered
  React.useEffect(() => {
    if (showReviewModal) {
      setReviewerName(studentName);
    }
  }, [showReviewModal, studentName]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      setReviewError('Please specify your name and write some helpful feedback comments.');
      return;
    }
    onSubmitReview(tutor.id, userRating, reviewComment, reviewerName);
    
    // reset form
    setReviewComment('');
    setUserRating(5);
    setReviewError('');
    setShowReviewModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingMessage.trim()) return;

    const userMsg = pendingMessage;
    // append user message
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: 'Now' }]);
    setPendingMessage('');

    // Simulate smart contextual tutor response after 1.1 seconds
    setTimeout(() => {
      const msgLower = userMsg.toLowerCase();
      let responseText = '';
      
      // See if they mentioned one of this specific tutor's listed skills
      const matchedSkill = tutor.skills.find(sk => msgLower.includes(sk.name.toLowerCase()));
      
      if (msgLower.includes('hi') || msgLower.includes('hello') || msgLower.includes('hey') || msgLower.includes('yo') || msgLower.includes('morning') || msgLower.includes('afternoon') || msgLower.includes('wechat') || msgLower.includes('whatsapp')) {
        responseText = `Hey classmate! 👋 Great to connect! I am currently taking the ${tutor.programme}. What specific questions or assignments are you working on today? Let's check it out together lah!`;
      } else if (msgLower.includes('exam') || msgLower.includes('quiz') || msgLower.includes('test') || msgLower.includes('fail') || msgLower.includes('past year') || msgLower.includes('pyq') || msgLower.includes('midterm') || msgLower.includes('study')) {
        responseText = `Ayo, midterm or exam prep can be super stressful, but don't worry! I actually compiled some personal review sheets, formula lists, or past-year question breakdowns for this. Once you book a slot, I can pass them to you! We got this, don't worry ya.`;
      } else if (msgLower.includes('free') || msgLower.includes('price') || msgLower.includes('money') || msgLower.includes('how much') || msgLower.includes('pay') || msgLower.includes('fee') || msgLower.includes('coin') || msgLower.includes('credit')) {
        responseText = `Ah! No need to pay real money at all ya. This is a Peer Study-Bridge setup under our QIU classmates! It's completely free, and the credits listed are just standard study-hour values. You just pick any open slot on my schedule and we can meet up loh!`;
      } else if (msgLower.includes('where') || msgLower.includes('location') || msgLower.includes('place') || msgLower.includes('meet') || msgLower.includes('library') || msgLower.includes('online') || msgLower.includes('zoom') || msgLower.includes('gmeet') || msgLower.includes('teams')) {
        responseText = `We can easily do either: an online share-screen call (super easy to troubleshoot code, formulas, or slides), or we can meet in-person at our QIU Campus Library Level 2 (the tables near the corner is our favorite study spot!). Just select your choice when booking, ya!`;
      } else if (msgLower.includes('time') || msgLower.includes('when') || msgLower.includes('date') || msgLower.includes('day') || msgLower.includes('slot') || msgLower.includes('schedule') || msgLower.includes('calendar')) {
        const days = tutor.availability.map(a => a.day).join(' and ');
        responseText = `I\'m generally quite free on ${days}! You can click the 'Book peer session' button to select standard times that match your class timetable. Let me know if you face scheduling issues ya!`;
      } else if (msgLower.includes('hard') || msgLower.includes('difficult') || msgLower.includes('stuck') || msgLower.includes('cannot') || msgLower.includes('error') || msgLower.includes('help') || msgLower.includes('struggle') || msgLower.includes('confused')) {
        responseText = `Aiseh, I totally understand. This topic is notoriously tricky for classmates in our course. But don't give up! We can break it down step-by-step. Just book a swift slot so we can go over your specific roadblock ya.`;
      } else if (matchedSkill) {
        responseText = `Wow, ${matchedSkill.name}! Yes, that's exactly my core focus specialty. Honestly, the key to mastering ${matchedSkill.name} is just understanding the foundation models and doing active practice. I have some shortcut templates and summary diagrams ready for you!`;
      } else if (msgLower.includes('thanks') || msgLower.includes('thank you') || msgLower.includes('ok') || msgLower.includes('okay') || msgLower.includes('alright') || msgLower.includes('sure')) {
        responseText = `No problem! Happy to help peers. Go ahead and schedule a slot whenever you are ready, and feel free to outline what you want to solve in the booking notes. See you soon!`;
      } else {
        responseText = `Got it! Honestly, QIU subjects get real intense near assignment deadlines, so let's start early. If you want to jump straight into solving this, just select a slot via the scheduling button. I'll make sure to prepare relevant study material beforehand!`;
      }

      setChatMessages(prev => [...prev, { sender: 'tutor', text: responseText, time: 'Just now' }]);
    }, 1100);
  };

  return (
    <div className="space-y-6 pb-20 font-sans text-white">
      {/* 1. Profile Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('search')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-blue-400 transition cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to directory list
        </button>
        <button
          onClick={() => onToggleBookmark?.(tutor.id)}
          className={`flex items-center gap-1.5 text-xs font-semibold border rounded-xl px-4 py-2 transition cursor-pointer ${
            isBookmarked 
              ? 'border-red-500 bg-red-500/10 text-red-400' 
              : 'border-white/8 bg-slate-900/40 text-slate-200 hover:bg-white/5'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
          {isBookmarked ? 'Saved in My Favorites' : 'Bookmark Mentor'}
        </button>
      </div>

      {/* 2. Hero Card for profile detail overview */}
      <section className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <img
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover bg-slate-950 ring-4 ring-blue-500/15 shadow-md shrink-0"
              src={tutor.avatar}
              alt={tutor.name}
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1.5 font-sans">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white font-display">{tutor.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/15 px-2.5 py-0.5 rounded-full">
                  <UserCheck className="h-3 w-3" />
                  Verified Peer Mentor
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200">{tutor.title}</p>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide flex items-center gap-1.5 mt-0.5">
                <span className="bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/10 font-bold uppercase tracking-wider">
                  {tutor.hourlyRate} Points/hr
                </span>
              </p>
              
              {/* Ratings and dynamic volume stats */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-slate-200">{tutor.rating.toFixed(1)}</span>
                  <span className="text-slate-450">({tutor.reviews.length} written reviews)</span>
                </div>
                <span className="text-slate-700 hidden sm:inline">•</span>
                <span className="text-xs text-slate-350 font-medium font-sans text-slate-300">
                  <strong className="text-white">{tutor.completedSessions}</strong> successful sessions
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto self-stretch md:self-auto pt-4 md:pt-0">
            <button
              onClick={() => onNavigate('messages', { tutorId: tutor.id })}
              className="flex-1 rounded-2xl border border-white/8 bg-white/5 hover:bg-white/10 py-3.5 px-4 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
              Chat To Coordinate
            </button>
            <button
              onClick={() => onNavigate('book', { tutorId: tutor.id })}
              className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 px-5 text-xs font-bold text-white transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5" />
              Book peer session
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="pt-6 border-t border-white/5 space-y-3">
          <h2 className="text-xs font-extrabold text-slate-405 uppercase tracking-wider">About Me & style</h2>
          <p className="text-slate-305 text-sm leading-relaxed max-w-3xl whitespace-pre-line font-sans text-slate-300">
            {tutor.biography}
          </p>
        </div>
      </section>

      {/* 4. Credentials & Skills Matrix Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Side: Skills & Strengths */}
        <div className="md:col-span-2 space-y-6">
          {/* Skills Breakdown */}
          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <h3 className="font-extrabold text-white text-base font-display">Qualified Skill Strengths</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {tutor.skills.map((skill, si) => (
                <div key={si} className="rounded-2xl border border-white/5 p-3.5 bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{skill.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      skill.level === 'Expert' 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : skill.level === 'Intermediate'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {skill.level}
                    </span>
                  </div>
                  {/* Visual gauge representation matching the level */}
                  <div className="h-1.5 w-full bg-slate-850 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        skill.level === 'Expert' 
                          ? 'bg-blue-500 w-full' 
                          : skill.level === 'Intermediate'
                          ? 'bg-indigo-500 w-2/3'
                          : 'bg-slate-500 w-1/3'
                      }`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peer Achievements / Experiences */}
          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-400" />
              <h3 className="font-extrabold text-white text-base font-display">Teaching & Course Credibility</h3>
            </div>
            <ul className="space-y-3">
              {(tutor.experience as string[]).map((exp, val) => (
                <li key={val} className="flex gap-3 text-sm text-slate-200 items-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-sans text-xs leading-relaxed text-slate-300">{exp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Reviews Area */}
          <div className="bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2 font-display">
                <Star className="h-5 w-5 fill-blue-500/5 text-blue-400" />
                Student Reviews ({tutor.reviews.length})
              </h3>
              <button
                onClick={() => setShowReviewModal(true)}
                className="rounded-xl border border-blue-500/30 text-blue-300 hover:bg-white/5 px-3.5 py-2 text-xs font-bold transition cursor-pointer"
              >
                Write Experience Review
              </button>
            </div>

            {tutor.reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-sans">
                No class feedback left for this tutor yet. Be the first to share review comments!
              </div>
            ) : (
              <div className="divide-y divide-white/5 space-y-4">
                {tutor.reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{rev.studentName}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-850 text-slate-800'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-sans">
                        <span className="text-slate-505 text-slate-400 font-mono text-[10px]">{rev.date}</span>
                        {rev.studentName === studentName && (
  <button
    onClick={() => onDeleteReview(tutor.id, rev.id)}
    className="text-rose-400 hover:text-rose-300 font-bold text-[10px] bg-rose-500/10 hover:bg-rose-500/20 px-2 py-0.5 rounded transition-all cursor-pointer"
    title="Delete this review"
  >
    Delete
  </button>
)}
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed italic font-sans px-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Availability Widget */}
        <div className="space-y-6">
          <div className="bg-slate-950/60 border border-white/8 text-white rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-xs text-blue-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
              <Clock className="h-4 w-4" />
              Availability Grid
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
              Book this tutor ahead of time to secure your slot. They typically host sessions on:
            </p>

            <div className="space-y-3 pt-2">
              {tutor.availability.map((avail, index) => (
                <div key={index} className="rounded-2xl bg-slate-900/55 p-3.5 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{avail.day}</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-extrabold pb-[1px]">
                      {avail.slots.length} Slots
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {avail.slots.map((slot, sIdx) => (
                      <span key={sIdx} className="font-mono text-[9px] bg-slate-950 border border-white/5 text-slate-300 px-2.5 py-1 rounded-lg">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('book', { tutorId: tutor.id })}
              className="w-full text-center py-3.5 bg-blue-600 hover:bg-blue-700 font-bold text-xs transition duration-200 text-white mt-4 block rounded-2xl shadow-md cursor-pointer hover:shadow-blue-500/10"
            >
              Select Live Slots & Book
            </button>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-4 relative text-white">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-sans text-lg font-bold text-white font-display">Write Session Review</h3>
              <p className="text-slate-400 text-xs">Share your peer learning experience under tutor {tutor.name}.</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 font-sans">
              {/* Star Selection Row */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-350 block">Rating Scale</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star 
                        className={`h-7 w-7 ${
                          star <= userRating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-slate-805 text-slate-800'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-300 pl-2 font-mono">{userRating} / 5 stars</span>
                </div>
              </div>

              {/* Your Name */}
              <div className="space-y-1.5 col-span-1">
                <label className="text-xs font-bold text-slate-350 block" htmlFor="reviewer-name">Your Full Name</label>
                <input
                  id="reviewer-name"
                  type="text"
                  placeholder="e.g. Rachel Lim"
                  className="w-full rounded-2xl border border-white/8 px-4 py-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                />
              </div>

              {/* Review details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-350 block" htmlFor="reviewer-comment">Your Comments & Experience</label>
                <textarea
                  id="reviewer-comment"
                  rows={4}
                  placeholder="Explain what was accomplished or why the peer tutoring session was useful..."
                  className="w-full rounded-2xl border border-white/8 p-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              {reviewError && (
                <p className="text-rose-455 text-rose-400 font-bold text-xs">{reviewError}</p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="rounded-2xl px-4 py-2 bg-white/5 border border-white/8 text-slate-300 hover:bg-white/10 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl px-5 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-md cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Simulation Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col h-[480px]">
            {/* Header */}
            <div className="bg-slate-950 p-4 text-white flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <img
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20 bg-slate-950"
                  src={tutor.avatar}
                  alt={tutor.name}
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-xs text-white">{tutor.name}</h3>
                  <span className="text-[9px] text-blue-400 flex items-center gap-1 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Online QIU Classmate
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-900/60 font-sans">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
                >
                  <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                      : 'bg-slate-950 text-slate-100 border border-white/8 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-555 text-slate-500 mt-1 font-mono font-medium">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Footer Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-white/5 flex gap-2">
              <input
                type="text"
                placeholder="Ask about materials or prerequisites..."
                className="flex-1 rounded-2xl border border-white/8 px-4 py-2.5 text-xs text-white bg-slate-900 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                value={pendingMessage}
                aria-label="Ask a question"
                onChange={(e) => setPendingMessage(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!pendingMessage.trim()}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 p-2.5 text-white transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer font-bold"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
