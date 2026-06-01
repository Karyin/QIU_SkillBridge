import { Tutor } from '../types';

export const TUTOR_CATEGORIES = [
  { id: 'all', name: 'All Categories', count: 14 },
  { id: 'programming', name: 'Programming & CS', count: 5 },
  { id: 'math-science', name: 'Math & Science', count: 4 },
  { id: 'languages', name: 'Languages', count: 3 },
  { id: 'business', name: 'Business & Finance', count: 2 },
];

export const INITIAL_TUTORS: Tutor[] = [
  {
    id: 'tutor-1',
    name: 'Arif Bin Azman',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    title: 'Year 3 Bachelor of Computer Science (Hons)',
    biography: 'Passionate about frontend development and programming foundations. I am currently the lead developer of the QIU Web Dev Club and would love to help peers grasp React and Python basics easily!',
    programme: 'Bachelor of Computer Science (Hons)',
    categories: ['programming'],
    skills: [
      { name: 'React.js', level: 'Expert' },
      { name: 'Python Basics', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'JavaScript', level: 'Intermediate' }
    ],
    experience: [
      'Web Dev Committee Member (Intermediate level)',
      'Tutored 15+ juniors in Programming Foundations 1 & 2',
      'Completed a 6-month Software Engineering Internship at a Tech Startup',
      'Developed 4 production React projects'
    ],
    availability: [
      { day: 'Monday', slots: ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Wednesday', slots: ['09:00 AM', '1:00 PM', '3:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-1',
        studentName: 'Lim Wei Ming',
        rating: 5,
        date: '2026-05-14',
        comment: 'Arif explained React state and hooks so much better than the slideshows in class! Super patient and highly recommended.'
      },
      {
        id: 'rev-2',
        studentName: 'Natasha Ameera',
        rating: 4,
        date: '2026-04-28',
        comment: 'Excellent Python guide! The live coding session we did really cleared up my list comprehension doubts.'
      }
    ],
    rating: 4.8,
    hourlyRate: 15, // representing skill coins/credits or simulation points
    completedSessions: 24
  },
  {
    id: 'tutor-2',
    name: 'Lim Wei Jie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    title: 'Year 2 Bachelor of Business Administration (Hons)',
    biography: 'Accounting and Financial Analysis is my forte. If you are struggling with debit/credit ledgers or balance sheets, I can help make them super intuitive with real-world business cases.',
    programme: 'Bachelor of Business Administration (Hons)',
    categories: ['business'],
    skills: [
      { name: 'Financial Accounting', level: 'Expert' },
      { name: 'Excel Foundations', level: 'Expert' },
      { name: 'Corporate Finance', level: 'Intermediate' }
    ],
    experience: [
      'Top student in Financial Accounting 101 with an A+',
      'Peer-mentor under the QIU Business & Accounting Society',
      'Conducted 3 exam revision crash-courses for 40+ students'
    ] as any[],
    availability: [
      { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '2:30 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '11:00 AM', '3:00 PM', '5:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-3',
        studentName: 'Thanesh Kumar',
        rating: 5,
        date: '2026-05-18',
        comment: 'Wei Jie made Ledger entries feel like a game. I got an A for my midterms all thanks to this peer tutoring!'
      }
    ],
    rating: 5.0,
    hourlyRate: 12,
    completedSessions: 18
  },
  {
    id: 'tutor-3',
    name: 'Priya Darshini',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    title: 'Year 3 Bachelor of Medicine & Bachelor of Surgery (MBBS)',
    biography: 'Struggling with Human Anatomy or Biochemistry pathways? Let\'s break down complex Latin terms, physiological frameworks, and memorize them via effective active recall and spaced repetition methods.',
    programme: 'Bachelor of Medicine & Bachelor of Surgery (MBBS)',
    categories: ['math-science'],
    skills: [
      { name: 'Anatomy & Physiology', level: 'Expert' },
      { name: 'Biochemistry', level: 'Expert' },
      { name: 'Medical Terminology', level: 'Expert' }
    ],
    experience: [
      'Consistently in the top 5% of medical cohort',
      'Created anatomy study guides shared across 100+ medical peers',
      'Conducted informal study group sessions since Year 1'
    ] as any[],
    availability: [
      { day: 'Saturday', slots: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'] },
      { day: 'Sunday', slots: ['09:00 AM', '11:00 AM', '2:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-4',
        studentName: 'Sarah Al-Ghabri',
        rating: 5,
        date: '2026-05-10',
        comment: 'Priya has the absolute best mnemonics for cranial nerves! She is incredibly sweet and takes time to make sure you fully understand.'
      },
      {
        id: 'rev-5',
        studentName: 'Ahmad Faiz',
        rating: 5,
        date: '2026-05-02',
        comment: 'The biochemistry maps she drew changed the game for me. Life saver!'
      }
    ],
    rating: 5.0,
    hourlyRate: 20,
    completedSessions: 32
  },
  {
    id: 'tutor-4',
    name: 'Sarah Al-Ghabri',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    title: 'Year 4 Bachelor of Education (Hons)',
    biography: 'Language is all about communication and confidence! I specialize in English pronunciation, academic writing structure, and IELTS exam prep. I can also help teach Arabic (my native tongue).',
    programme: 'Bachelor of Education (TESL) (Hons)',
    categories: ['languages'],
    skills: [
      { name: 'English Academic Writing', level: 'Expert' },
      { name: 'Arabic (Conversational)', level: 'Expert' },
      { name: 'Public Speaking', level: 'Intermediate' }
    ],
    experience: [
      'President of QIU Toastmasters Club (2025/2026)',
      '3 years of teaching English as a second language to international peers',
      'Assisted 20+ students in structured thesis writing peer review'
    ] as any[],
    availability: [
      { day: 'Tuesday', slots: ['1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Friday', slots: ['09:00 AM', '11:00 AM', '3:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-6',
        studentName: 'Lim Wei Jie',
        rating: 5,
        date: '2026-05-20',
        comment: 'Sarah pointed out exactly where my paragraph structure felt weak. My essay scores rose from B to A!'
      }
    ],
    rating: 4.9,
    hourlyRate: 14,
    completedSessions: 21
  },
  {
    id: 'tutor-5',
    name: 'Ahmad Daniel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    title: 'Year 2 Bachelor of Engineering (Hons) Mechatronics',
    biography: 'Calculus, Engineering Dynamics, and basic Electronics doesn\'t have to be daunting. Let\'s sketch diagrams together and break down complex equations step by step using physical models.',
    programme: 'Bachelor of Engineering (Hons) Mechatronics',
    categories: ['math-science'],
    skills: [
      { name: 'Calculus 1 & 2', level: 'Expert' },
      { name: 'Electronics Fundamentals', level: 'Intermediate' },
      { name: 'Physics Mechanics', level: 'Expert' }
    ],
    experience: [
      'A+ grade in Engineering Mathematics I and II',
      'Built a complete smart-home prototype using Arduino and ESP32',
      'Voted most helpful peer mentor in Mechatronics student group'
    ] as any[],
    availability: [
      { day: 'Monday', slots: ['1:00 PM', '3:00 PM', '5:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '1:00 PM', '4:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-7',
        studentName: 'Fatima Zahra',
        rating: 4,
        date: '2026-05-05',
        comment: 'The circuit diagrams Ahmad drew were very helpful. It clicked instantly.'
      }
    ],
    rating: 4.5,
    hourlyRate: 15,
    completedSessions: 12
  },
  {
    id: 'tutor-6',
    name: 'Jenny Rose Tan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    title: 'Year 3 Bachelor of Arts (Hons) Graphic Design',
    biography: 'Wanna build a stellar design portfolio or master Adobe Figma and Photoshop? I tutor design basics, typography, grid assemblies, and portfolio layout planning to help match professional standards.',
    programme: 'Bachelor of Arts (Hons) Graphic Design',
    categories: ['programming'], // Fits loosely or we could add design category, but we'll map or classify
    skills: [
      { name: 'UI/UX Design & Figma', level: 'Expert' },
      { name: 'Adobe Photoshop', level: 'Expert' },
      { name: 'Color Theory & Brand', level: 'Expert' }
    ],
    experience: [
      'Lead Graphic Designer for QIU Student Representative Council',
      'Freelance UI designer with clients in Malaysia and Singapore',
      'Taught 10+ student workshops on Figma and Interface Prototyping'
    ] as any[],
    availability: [
      { day: 'Wednesday', slots: ['2:00 PM', '4:00 PM', '6:00 PM'] },
      { day: 'Saturday', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-8',
        studentName: 'Arif Bin Azman',
        rating: 5,
        date: '2026-05-22',
        comment: 'Jenny teaches UI hacks that normally take years to learn. My project presentation looks double as professional now!'
      }
    ],
    rating: 5.0,
    hourlyRate: 16,
    completedSessions: 19
  },
  {
    id: 'tutor-7',
    name: 'Nicholas Wong',
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&h=150&fit=crop&crop=face',
    title: 'Year 3 Bachelor of Science (Hons) Biotechnology',
    biography: 'Struggling to wrap your head around DNA replication protocols, PCR cycles, or molecular biology pathway mapping? I make biology visual! Let\'s draw flowcharts and map biochemistry pathways together so they click instantly for your labs.',
    programme: 'Bachelor of Science (Hons) Biotechnology',
    categories: ['math-science'],
    skills: [
      { name: 'Molecular Biology', level: 'Expert' },
      { name: 'Biochemistry Pathways', level: 'Expert' },
      { name: 'Lab Report Writing', level: 'Intermediate' }
    ],
    experience: [
      'Top scorer in Gen 301 Biochemistry (A+)',
      'Undergraduate research paper co-author on plant tissue cultures',
      'Informal lab mentor helping juniors with microscope alignments and PCR calibrations'
    ] as any[],
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '11:00 AM', '1:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-9',
        studentName: 'Priya Darshini',
        rating: 5,
        date: '2026-05-21',
        comment: 'Nicholas has the cleanest pathway summaries. He explained PCR so well I actually managed to write my midterm lab report in an afternoon!'
      }
    ],
    rating: 5.0,
    hourlyRate: 14,
    completedSessions: 14
  },
  {
    id: 'tutor-8',
    name: 'Amira Husna',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop&crop=face',
    title: 'Year 2 Bachelor of Corporate Communication (Hons)',
    biography: 'PR writing, campaign structures and framing, or public presenting can be nerve-wracking! I am here to help you build confident presentation skills, review your draft speech outlines, and structure high-scoring reports.',
    programme: 'Bachelor of Corporate Communication (Hons)',
    categories: ['languages'],
    skills: [
      { name: 'Public Relations Framing', level: 'Expert' },
      { name: 'Speech Presentation coaching', level: 'Expert' },
      { name: 'Assignment Structure Review', level: 'Expert' }
    ],
    experience: [
      'Represented QIU in National Corporate Communications Pitching Bowl',
      'Vice President of QIU Debate & Public Speaking Club',
      'Reviewed and proofread 18 junior essays with excellent feedback markers'
    ] as any[],
    availability: [
      { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '3:00 PM'] },
      { day: 'Thursday', slots: ['01:00 PM', '3:00 PM', '5:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-10',
        studentName: 'Arif Bin Azman',
        rating: 5,
        date: '2026-05-19',
        comment: 'Amira helped me dry-run my presentation slides. Usually I am super shy and stutter a lot, but she structured my index notes so well that I got positive feedback from the lecturer!'
      }
    ],
    rating: 5.0,
    hourlyRate: 12,
    completedSessions: 11
  },
  {
    id: 'tutor-9',
    name: 'Kavitha Rajan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    title: 'Year 3 Bachelor of Pharmacy (Hons)',
    biography: 'Pharmacology mechanisms of actions got you feeling matching stress? Let\'s decode drug receptors, dosage math equations, and physiological processes together. No cramming, we\'ll construct solid conceptual links!',
    programme: 'Bachelor of Pharmacy (Hons)',
    categories: ['math-science'],
    skills: [
      { name: 'Pharmacology Concepts', level: 'Expert' },
      { name: 'Clinical Dosage Calculations', level: 'Expert' },
      { name: 'Organic Chem Formulas', level: 'Intermediate' }
    ],
    experience: [
      'Consistent Dean\'s Lister at the Faculty of Pharmacy',
      'Designed active recall study cards used by over 80+ Pharmacy juniors in Exam revision',
      'Conducted pharmacology receptor tutorials as peer study support leader'
    ] as any[],
    availability: [
      { day: 'Thursday', slots: ['10:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Saturday', slots: ['09:00 AM', '11:00 AM', '2:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-11',
        studentName: 'Zackary Lim',
        rating: 5,
        date: '2026-05-24',
        comment: 'I was super confused by dosage dilution equations but Kavitha broke the chemistry fractions down into visual blocks and made it so clear. Best guide!'
      }
    ],
    rating: 5.0,
    hourlyRate: 18,
    completedSessions: 22
  },
  {
    id: 'tutor-10',
    name: 'Tan Kah Seng',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    title: 'Year 3 Bachelor of Computer Science - AI Specialization',
    biography: 'loops, list comprehensions, database SQL tables or python algorithms giving you headache? Don\'t suffer alone lah! Let\'s share screens and do a live pair-debugging session. I can walk you through basic SQL connections, API setup, and structure your lab work neatly.',
    programme: 'Bachelor of Computer Science (Hons)',
    categories: ['programming'],
    skills: [
      { name: 'Python Loops & Algos', level: 'Expert' },
      { name: 'SQL & Database Design', level: 'Expert' },
      { name: 'Debugging & Lab Prep', level: 'Expert' }
    ],
    experience: [
      'Top programmer accolade in Selangor Inter-U Hackathon 2025',
      'Conducted 6 workshops on SQL databases and Python logic models for freshmen',
      'Web and mobile system development lead for several freelance projects in Ipoh'
    ] as any[],
    availability: [
      { day: 'Tuesday', slots: ['2:00 PM', '4:00 PM', '6:00 PM'] },
      { day: 'Friday', slots: ['10:00 AM', '1:05 PM', '3:00 PM', '5:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-12',
        studentName: 'Chong Chee Sheng',
        rating: 5,
        date: '2026-05-23',
        comment: 'Chong Chee Sheng: My Python nested loop algorithm had a memory leak error I could not solve for days. He debugged and walked me through clean scope rules!'
      }
    ],
    rating: 5.0,
    hourlyRate: 15,
    completedSessions: 27
  },
  {
    id: 'tutor-11',
    name: 'Esther Yong Siew Ching',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    title: 'Year 3 Bachelor of Accounting (Hons)',
    biography: 'Auditing standards, corporate tax computation worksheets, and ledger entries are simple when broken down visually. I can help you prepare for critical ACCA and midterm exams with past-year papers and customized quick sheets.',
    programme: 'Bachelor of Accounting (Hons)',
    categories: ['business'],
    skills: [
      { name: 'Corporate Tax Code', level: 'Expert' },
      { name: 'Audit & Assurances', level: 'Expert' },
      { name: 'Double Entry Ledger', level: 'Expert' }
    ],
    experience: [
      'Passed 7 ACCA papers with high merit points on first attempt',
      'Peer auditor under the student council auditing taskforce',
      'Selected as assistant tutor for Introductory Cost Accounting course'
    ] as any[],
    availability: [
      { day: 'Monday', slots: ['02:00 PM', '04:00 PM'] },
      { day: 'Wednesday', slots: ['10:00 AM', '01:00 PM', '03:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-13',
        studentName: 'Nicholas Wong',
        rating: 5,
        date: '2026-05-25',
        comment: 'Esther help me audit my student society budgets and explained tax concepts with incredible patience!'
      }
    ],
    rating: 5.0,
    hourlyRate: 16,
    completedSessions: 15
  },
  {
    id: 'tutor-12',
    name: 'Marcus Tan Sheng He',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
    title: 'Year 2 Bachelor of Arts in English & Communication',
    biography: 'Need detailed feedback reviews on your final thesis drafts or speech presentations? I specialize in report structuring, rhetoric styling, and public communication anxiety coaching. Together we will perfect your slides and delivery!',
    programme: 'Bachelor of Arts in English (Hons)',
    categories: ['languages'],
    skills: [
      { name: 'Thesis Report Structure', level: 'Expert' },
      { name: 'Public Rhetoric Styling', level: 'Expert' },
      { name: 'Literature Analysis', level: 'Intermediate' }
    ],
    experience: [
      'Distinction score in IELTS Academic (Band 8.5)',
      'Winner of the QIU Faculty Colloquium Pitch Challenge 2025',
      'Conducted 4 community public speaking drills since freshman year'
    ] as any[],
    availability: [
      { day: 'Tuesday', slots: ['09:00 AM', '11:00 AM'] },
      { day: 'Friday', slots: ['01:00 PM', '03:00 PM', '05:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-14',
        studentName: 'Jenny Rose Tan',
        rating: 5,
        date: '2026-05-24',
        comment: 'Marcus structured my final thesis slides perfectly! I was so confident during my presentation, and several judges praised the slide sequence.'
      }
    ],
    rating: 5.0,
    hourlyRate: 14,
    completedSessions: 10
  },
  {
    id: 'tutor-13',
    name: 'Syed Hamza',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop&crop=face',
    title: 'Year 1 Bachelor of Computer Science - Intelligent Systems',
    biography: 'Hi! I am a student senior peer guide specializing in helping absolute beginners. I remember how confusing variables, memory allocation, loops, arrays and Git setups were last year. Let\'s make code fun and easy!',
    programme: 'Bachelor of Computer Science (Hons)',
    categories: ['programming'],
    skills: [
      { name: 'Python Basics', level: 'Intermediate' },
      { name: 'VS Code & Git', level: 'Beginner' },
      { name: 'HTML & CSS Essentials', level: 'Beginner' }
    ],
    experience: [
      'Peer helper with the QIU freshman coding cohort',
      'Created step-by-step local git setup guides used by 30+ students',
      'Year 1 representative in the programming logic workshop'
    ] as any[],
    availability: [
      { day: 'Tuesday', slots: ['10:00 AM', '02:00 PM', '04:00 PM'] },
      { day: 'Thursday', slots: ['09:00 AM', '11:00 AM', '03:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-15',
        studentName: 'Ahmad Daniel',
        rating: 4.8,
        date: '2026-05-26',
        comment: 'Syed made setting up my local environment and git super simple! No premium jargon, just clear step-by-step guidance.'
      }
    ],
    rating: 4.8,
    hourlyRate: 10,
    completedSessions: 2
  },
  {
    id: 'tutor-14',
    name: 'Emily Wong',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    title: 'Year 1 Bachelor of Computer Science',
    biography: 'Welcome! I specialize in teaching absolute beginner fundamentals step-by-step. If compiling code scares you, or structures/variables feel overwhelming, let\'s tackle it together with clear drawings and zero technical jargon!',
    programme: 'Bachelor of Computer Science (Hons)',
    categories: ['programming'],
    skills: [
      { name: 'Scratch & Logic Blocks', level: 'Beginner' },
      { name: 'Intro to Markdown', level: 'Beginner' },
      { name: 'Basic Debugging', level: 'Beginner' }
    ],
    experience: [
      'Facilitated the freshman logic boot camp session',
      'Created micro-tutorials for beginner Scratch and flowcharts',
      'Volunteer mentor at the CoderDojo QIU chapter'
    ] as any[],
    availability: [
      { day: 'Monday', slots: ['09:00 AM', '11:00 AM'] },
      { day: 'Friday', slots: ['02:00 PM', '04:00 PM'] }
    ],
    reviews: [
      {
        id: 'rev-16',
        studentName: 'Zulika Halim',
        rating: 4.9,
        date: '2026-05-27',
        comment: 'Emily is so kind and patient! I did not know anything about loops and she made it feel like solving a simple visual puzzle.'
      }
    ],
    rating: 4.9,
    hourlyRate: 8,
    completedSessions: 5
  }
];
