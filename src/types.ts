export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Review {
  id: string;
  studentName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Availability {
  day: string; // e.g., "Monday", "Wednesday"
  slots: string[]; // e.g., ["10:00 AM", "2:00 PM"]
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  biography: string;
  programme: string;
  categories: string[];
  skills: Skill[];
  experience: string[];
  availability: Availability[];
  reviews: Review[];
  rating: number;
  hourlyRate: number; // or points, e.g. "Free (Peer Exchange)" or "$15/hr" / "Points Exchange"
  completedSessions: number;
  isUserCreated?: boolean;
}

export interface Booking {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  date: string;
  timeSlot: string;
  type: 'online' | 'in-person';
  locationOrLink: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  hasFeedback: boolean;
  durationHours?: number;
  pointsDeducted?: number;
}

export interface TutorApplication {
  name: string;
  email: string;
  programme: string;
  yearOfStudy: string;
  selectedSkills: { name: string; level: string }[];
  experience: string;
  biography: string;
  status: 'pending' | 'approved';
}
