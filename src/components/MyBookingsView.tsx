import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Video, 
  Clock, 
  Trash2, 
  CheckCircle, 
  X,
  Star,
  Sparkles,
  Award
} from 'lucide-react';
import { Booking, Tutor } from '../types';

interface MyBookingsViewProps {
  bookings: Booking[];
  tutors: Tutor[];
  onCancelBooking: (id: string) => void;
  onSubmitReview: (tutorId: string, rating: number, comment: string, studentName: string) => void;
  onNavigate: (view: string, extra?: any) => void;
  onUpdateBookingReviewStatus: (bookingId: string) => void;
  studentName?: string;
}

export default function MyBookingsView({ 
  bookings, 
  tutors, 
  onCancelBooking, 
  onSubmitReview, 
  onNavigate,
  onUpdateBookingReviewStatus,
  studentName
}: MyBookingsViewProps) {
  const [feedbackBooking, setFeedbackBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [error, setError] = useState('');

  const handleOpenFeedback = (booking: Booking) => {
    setFeedbackBooking(booking);
    setRating(5);
    setComment('');
    setReviewerName(studentName || '');
    setError('');
  };

  const submitFeedbackForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) {
      setError('Please provide your name and some experience notes.');
      return;
    }

    if (feedbackBooking) {
      onSubmitReview(feedbackBooking.tutorId, rating, comment, reviewerName);
      onUpdateBookingReviewStatus(feedbackBooking.id);
      setFeedbackBooking(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-sans text-white">
      {/* Header */}
      <div className="text-left">
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-blue-400">Scheduler Logs</span>
        <h1 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-1 font-display">
          My Study Appointments
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review, configure, or provide ratings for scheduled peer learning sessions below.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 backdrop-blur-lg rounded-3xl border border-white/8 p-8 max-w-lg mx-auto space-y-4 shadow-xl">
          <Calendar className="h-10 w-10 text-slate-500 mx-auto" />
          <div className="space-y-1.5">
            <h3 className="font-bold text-white text-base">No Appointed Sessions</h3>
            <p className="text-slate-400 text-xs px-6 leading-relaxed font-sans font-medium">
              You currently have no scheduled learning sessions under senior mentors. Go to tutors directory to book one.
            </p>
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="rounded-2xl px-5 py-3.5 bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-lg cursor-pointer"
          >
            Find Active Tutors Now
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl text-left">
          {bookings.map((booking) => {
            const isUpcoming = booking.status === 'upcoming';
            return (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/8 bg-slate-900/40 backdrop-blur-lg p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/12 transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-blue-500/10 shrink-0 bg-slate-950"
                    src={booking.tutorAvatar}
                    alt={booking.tutorName}
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-left">
                      <h3 className="font-bold text-white text-sm">{booking.tutorName}</h3>
                      <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full border ${
                        booking.status === 'upcoming' 
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' 
                          : booking.status === 'completed'
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                          : 'bg-slate-850 text-slate-400 border-white/5'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                      {booking.pointsDeducted !== undefined && (
                        <span className="text-[9.5px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <span>🪙</span> {booking.pointsDeducted} Pts Cost
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-bold flex items-center gap-1.5 font-sans">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {booking.date} @ <strong className="font-mono text-blue-400">{booking.timeSlot}</strong>
                    </p>

                    <div className="flex items-center gap-5 text-slate-400 text-xs pt-0.5">
                      <span className="flex items-center gap-1 font-bold text-[11px] font-sans">
                        {booking.type === 'online' ? (
                          <>
                            <Video className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            Online Video Match Code: <code className="bg-slate-950 border border-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-blue-450 text-blue-400 ml-1.5">QIU-SBR-{booking.id.slice(-4)}</code>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            In-Person Meeting: Campus Library (Level 2)
                          </>
                        )}
                      </span>
                    </div>

                    {booking.notes && (
                      <p className="text-[11px] text-slate-300 italic mt-2 bg-slate-950/70 p-2.5 rounded-xl border border-white/5 max-w-xl leading-relaxed">
                        "Focus: {booking.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Operations side panel */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto self-end sm:self-center justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 font-sans">
                  {(booking.status === 'completed' || booking.status === 'cancelled') && (
                    <button
                      onClick={() => onNavigate('book', { tutorId: booking.tutorId })}
                      className="rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:bg-blue-600 hover:text-white hover:border-transparent font-bold text-xs px-3.5 py-2.5 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Calendar className="h-3.5 w-3.5 text-blue-400" />
                      Book Again
                    </button>
                  )}

                  {isUpcoming && (
                    <>
                      <button
                        onClick={() => {
                          // direct simulated instant transition rather than tricky alert boxes
                          booking.status = 'completed';
                          onCancelBooking('force-update');
                        }}
                        className="rounded-xl px-3.5 py-2 text-xs font-bold hover:bg-white/5 border border-white/10 text-slate-200 transition cursor-pointer"
                      >
                        Complete Session
                      </button>
                      <button
                        onClick={() => {
                          onCancelBooking(booking.id);
                        }}
                        title={`Cancel appointment and request immediate refund of ${booking.pointsDeducted || 10} points`}
                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/25 hover:border-rose-500/30 px-3 py-2 flex items-center gap-1.5 transition cursor-pointer text-xs font-bold shrink-0 shadow-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Cancel (Refund {booking.pointsDeducted || 10} Pts)</span>
                      </button>
                    </>
                  )}

                  {booking.status === 'completed' && (
                    <>
                      {booking.hasFeedback ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mr-1">
                          <CheckCircle className="h-4 w-4" />
                          Feedback Submitted
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenFeedback(booking)}
                          className="rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 px-4 py-2.5 shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Star className="h-3.5 w-3.5 fill-white/10" />
                          Give Session Feedback
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Give Feedback Modal */}
      {feedbackBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 text-left">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-4 relative text-white">
            <button
              onClick={() => setFeedbackBooking(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-sans text-lg font-bold text-white font-display">Provide Tutor Experience Feedback</h3>
              <p className="text-slate-405 text-slate-400 text-xs leading-relaxed">
                Review your lesson with <strong className="text-slate-200">{feedbackBooking.tutorName}</strong>. 
                Your rating helps maintain high tutoring standards.
              </p>
            </div>

            <form onSubmit={submitFeedbackForm} className="space-y-4 font-sans">
              {/* Stars selection widget */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-350 block">Review Scale</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star 
                        className={`h-7 w-7 ${
                          star <= rating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-slate-800'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-300 pl-2 font-mono">{rating} / 5 stars</span>
                </div>
              </div>

              {/* Your Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-350 block" htmlFor="feedback-name">Your Full Student Name</label>
                <input
                  id="feedback-name"
                  type="text"
                  placeholder="e.g. Rachel Lim"
                  className="w-full rounded-2xl border border-white/8 px-4 py-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white placeholder:text-slate-600"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  required
                />
              </div>

              {/* Your Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-350 block" htmlFor="feedback-experience">Your Comments & Experience</label>
                <textarea
                  id="feedback-experience"
                  rows={4}
                  placeholder="Tell peers what was solved. Did the material help you? Was the tutor patient?"
                  className="w-full rounded-2xl border border-white/8 p-3 text-xs focus:border-blue-500 focus:outline-none bg-slate-950 text-white placeholder:text-slate-600"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="text-rose-405 text-rose-400 font-bold text-xs">{error}</p>
              )}

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFeedbackBooking(null)}
                  className="rounded-2xl px-4 py-2 bg-white/5 border border-white/8 text-slate-300 hover:bg-white/10 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl px-5 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white cursor-pointer"
                >
                  Submit Review Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
