import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Search, 
  Tag, 
  Send, 
  Sparkles, 
  X, 
  ArrowRight,
  User,
  AlertCircle
} from 'lucide-react';

interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  date: string;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  type: 'request' | 'share';
  authorName: string;
  authorAvatar: string;
  authorProgramme: string;
  upvotes: number;
  upvotedByUser: boolean;
  comments: Comment[];
  date: string;
  tags: string[];
}

interface CommunityBoardViewProps {
  studentName: string;
  studentAvatar: string;
  studentProgramme: string;
  onNavigate: (view: string, extra?: any) => void;
  addToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const DEFAULT_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'Looking for a Figma senior to guide on design system components!',
    content: 'Hi! I am building an assignment web-app for my HCI component, but I am struggling with creating auto-layout rows & responsive variant buttons in Figma. Gladly willing to swap and explain SQL joins or Python Pandas in return!',
    category: 'Design & Creative',
    type: 'request',
    authorName: 'Evelyn Tan',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'Bachelor of IT (Hons)',
    upvotes: 14,
    upvotedByUser: false,
    date: '2026-05-25',
    tags: ['Figma', 'UIUX Design', 'Auto Layout'],
    comments: [
      {
        id: 'c-1',
        authorName: 'Marcus Ong',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
        content: 'I can help you with Figma! I scored an A- on that module. I really need help understanding SQL index optimizations, so that’s a perfect match!',
        date: '2026-05-25'
      }
    ]
  },
  {
    id: 'post-react-hooks',
    title: 'Share: Custom React Hooks Cheat Sheet for Clean Local State Management',
    content: 'I put together several helper custom state hooks for managing local double-state, debounce inputs, and persistent dark mode overrides without bloated dependencies. Includes typed code snippets ready for copy-paste!',
    category: 'Applied Coding',
    type: 'share',
    authorName: 'Timothy Lau',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'Bachelor of Software Eng (Hons)',
    upvotes: 35,
    upvotedByUser: false,
    date: '2026-05-25',
    tags: ['React', 'TypeScript', 'Custom Hooks', 'Helper'],
    comments: []
  },
  {
    id: 'post-2',
    title: 'Need help with Excel pivots and complex VLOOKUP/XLOOKUP tables.',
    content: 'Slightly embarrassed to ask, but my corporate accounting spreadsheet homework is due this Thursday and my pivots keep breaking. Looking for someone with business spreadsheet mastery to share screen for 30 minutes!',
    category: 'Business & Finance',
    type: 'request',
    authorName: 'Haziquemel Danish',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'Foundation in Business',
    upvotes: 9,
    upvotedByUser: false,
    date: '2026-05-24',
    tags: ['Excel Pivot', 'VLOOKUP', 'Accounting'],
    comments: []
  },
  {
    id: 'post-cheat-sheet',
    title: 'Shared: Comprehensive Database Normalization & SQL Cheatsheet PDF',
    content: 'I spent the weekend condensing 1NF, 2NF, 3NF, and BCNF normalization patterns with simple, practical examples of student-course systems. Perfect for studying before next Monday’s database design exam. Let me know if you want the PDF link!',
    category: 'Applied Coding',
    type: 'share',
    authorName: 'Marcus Ong',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'Bachelor of CS (Hons)',
    upvotes: 42,
    upvotedByUser: false,
    date: '2026-05-24',
    tags: ['SQL', 'Database Normalization', 'ExamPrep'],
    comments: []
  },
  {
    id: 'post-marketing-strategy',
    title: 'Share: 12-Slide Pitch Deck Template for Startup Contests & Marketing Slides',
    content: 'Sharing a clean, minimalist deck template optimized for modern marketing plans. Clean typography, high-contrast slides, and components designed entirely around traction metrics.',
    category: 'Business & Finance',
    type: 'share',
    authorName: 'Chloe Yap',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'Diploma in Marketing',
    upvotes: 18,
    upvotedByUser: false,
    date: '2026-05-24',
    tags: ['Pitch Deck', 'Business Plan', 'Marketing'],
    comments: []
  },
  {
    id: 'post-ui-colors',
    title: 'Share: Accessibility Checklist & High-Contrast Palette Presets for Student Web-Apps',
    content: 'Compiled 8 beautiful Tailwind CSS theme color combinations that guarantee WCAG AAA contrast safety for backgrounds, text layers, and interaction triggers. Helps you ace the UIUX validation check in software projects!',
    category: 'Design & Creative',
    type: 'share',
    authorName: 'Aris Munandar',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'Creative Media Design',
    upvotes: 27,
    upvotedByUser: false,
    date: '2026-05-23',
    tags: ['UIUX Design', 'TailwindCSS', 'Accessibility'],
    comments: []
  },
  {
    id: 'post-python-ml',
    title: 'Need help debugging PyTorch tensor shape mismatch error in custom CNN layer',
    content: 'My convolutional pooling layer throws an dimension mismatch error when training with our dataset. Looking for guidance on matrix transposition. Happy to swap reviews of Java OOP principles in return!',
    category: 'Applied Coding',
    type: 'request',
    authorName: 'Kishan Pillay',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'Bachelor of Core AI',
    upvotes: 11,
    upvotedByUser: false,
    date: '2026-05-23',
    tags: ['PyTorch', 'Data Science', 'Machine Learning'],
    comments: []
  },
  {
    id: 'post-3',
    title: 'Let’s form an English Speaking & Public Presentation clinic!',
    content: 'We need to build confidence before the end-of-semester pitch presentation. Let’s meet at the library discussion room #2 for a friendly dry-run. No lecturing, just pure supportive group feedback on speech slides, tone, and pacing.',
    category: 'General & Languages',
    type: 'share',
    authorName: 'Sarah Collins',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'TESL Studies',
    upvotes: 21,
    upvotedByUser: false,
    date: '2026-05-23',
    tags: ['Public Speaking', 'English', 'Presentation Pitch'],
    comments: [
      {
        id: 'c-2',
        authorName: 'Kimberly Lim',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
        content: 'Count me in! I absolutely freeze when answering Q&A sessions from assessors. Meet you on Wednesday!',
        date: '2026-05-24'
      }
    ]
  },
  {
    id: 'post-ielts-tips',
    title: 'Looking for a study partner to master IELTS high-band academic writing outlines',
    content: 'Practicing for a target band score of 7.5. Looking for a dedicated peer to swap essay outlines weekly, double-check core vocabulary, and provide layout critiques.',
    category: 'General & Languages',
    type: 'request',
    authorName: 'Samantha Reed',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
    authorProgramme: 'English Language Studies',
    upvotes: 15,
    upvotedByUser: false,
    date: '2026-05-22',
    tags: ['IELTS Prep', 'Academic English', 'Essay Writing'],
    comments: []
  }
];

export default function CommunityBoardView({ 
  studentName, 
  studentAvatar, 
  studentProgramme, 
  onNavigate,
  addToast 
}: CommunityBoardViewProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const stored = localStorage.getItem('qiu_community_posts_v5');
      return stored ? JSON.parse(stored) : DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState<'all' | 'request' | 'share'>('all');
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  
  // Create / Edit Post Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Applied Coding');
  const [newType, setNewType] = useState<'request' | 'share'>('request');
  const [newTagsString, setNewTagsString] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('qiu_community_posts_v5', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setEditingPostId(null);
    setNewTitle('');
    setNewContent('');
    setNewTagsString('');
    setNewType('request');
  };

  const startEditPost = (post: CommunityPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewContent(post.content);
    setNewCategory(post.category);
    setNewType(post.type || 'request');
    setNewTagsString(post.tags.join(', '));
    setIsCreateOpen(true);
  };

  const handleDeletePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.filter(p => p.id !== postId));
    addToast('Successfully deleted your community board post card! 🗑️', 'info');
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
    }
  };

  const handleUpvote = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isUpvoted = post.upvotedByUser;
        return {
          ...post,
          upvotes: isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          upvotedByUser: !isUpvoted
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorName: studentName,
      authorAvatar: studentAvatar,
      content: commentInput.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInput('');
    addToast('Your input response has been added to this community topic! 💬', 'success');
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      addToast('Please complete both Title and Description fields.', 'error');
      return;
    }

    const tagsArray = newTagsString
      ? newTagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [newCategory];

    if (editingPostId) {
      setPosts(prev => prev.map(post => {
        if (post.id === editingPostId) {
          return {
            ...post,
            title: newTitle.trim(),
            content: newContent.trim(),
            category: newCategory,
            type: newType,
            tags: tagsArray
          };
        }
        return post;
      }));
      addToast('Successfully updated your community bulletin post! 🌍✏️', 'success');
      setEditingPostId(null);
    } else {
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        type: newType,
        authorName: studentName,
        authorAvatar: studentAvatar,
        authorProgramme: studentProgramme,
        upvotes: 1,
        upvotedByUser: true,
        date: new Date().toISOString().split('T')[0],
        tags: tagsArray,
        comments: []
      };

      setPosts(prev => [newPost, ...prev]);
      addToast('Successfully pinned your learning request on the Community Board! 🌍', 'success');
    }

    setIsCreateOpen(false);
    
    // Clear Form
    setNewTitle('');
    setNewContent('');
    setNewTagsString('');
    setNewType('request');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesType = selectedType === 'all' || post.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = ['All', 'Applied Coding', 'Design & Creative', 'Business & Finance', 'General & Languages'];

  return (
    <div className="space-y-8 pb-24 text-white font-sans text-left">
      
      {/* Dynamic header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">
              Campus Bulletin Board
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display mt-1">
            QIU Peer <span className="text-blue-400">Community Hub</span> 🌍
          </h1>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition duration-150 shadow-lg cursor-pointer max-w-max"
        >
          <Plus className="h-4 w-4" />
          Post New Request
        </button>
      </div>

      {/* AI banner highlight */}
      <div className="relative rounded-3xl overflow-hidden border border-white/8 bg-slate-900/40 backdrop-blur-md p-6 flex flex-col sm:flex-row sm:items-center gap-4.5 justify-between select-none">
        <div className="flex gap-3 items-start sm:items-center">
          <div className="h-10 w-10 shrink-0 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center font-mono">
            💡
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">Need a customized learning exchange?</h3>
            <p className="text-[10.5px] text-slate-400 leading-relaxed max-w-xl">
              Describe your study block below or click "Post New Request." Classmates who excel in your challenge area will see your pin and contact you to swap knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Modern, high-contrast Study Room Entry Card */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-slate-900/40 via-indigo-950/20 to-slate-900/40 backdrop-blur-md p-6 flex flex-col md:flex-row items-center gap-6 justify-between select-none">
        <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex gap-4 items-start md:items-center text-left">
          <div className="h-12 w-12 shrink-0 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-xl">
            ✍️
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-extrabold uppercase tracking-widest text-indigo-400">
              Co-Study Lab
            </div>
            <h3 className="font-black text-sm text-white mt-1.5 uppercase tracking-tight">Dynamic Co-Study Room & Shared Whiteboard</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl mt-1">
              Enter our live virtual playground! Co-study with peers, sketch on the responsive real-time shared whiteboard, coordinate your focus intervals using the synced Pomodoro clock, and text each other instantly in dedicated study rooms.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('study-room')}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-550 border border-indigo-500/30 text-white rounded-2xl font-bold text-xs transition duration-150 shadow-lg cursor-pointer shrink-0 w-full md:w-auto justify-center"
        >
          <span>Enter Live Room</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Filter panel & Search Row */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search */}
          <div className="md:col-span-5 relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic keys (e.g., Figma, SQL)..."
              className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500 font-sans font-medium"
            />
          </div>

          {/* Quick Post Type filter picker */}
          <div className="md:col-span-7 flex gap-1.5 bg-slate-950/45 p-1 rounded-2xl border border-white/5 items-center">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 py-1.5 text-center rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-blue-600 border border-blue-500/20 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Content
            </button>
            <button
              onClick={() => setSelectedType('request')}
              className={`flex-1 py-1.5 text-center rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                selectedType === 'request'
                  ? 'bg-amber-600/15 border border-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🙋 Help Requests
            </button>
            <button
              onClick={() => setSelectedType('share')}
              className={`flex-1 py-1.5 text-center rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                selectedType === 'share'
                  ? 'bg-emerald-600/15 border border-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📢 Resource Shares
            </button>
          </div>

        </div>

        {/* Categories toggler */}
        <div className="flex flex-wrap gap-1.5 items-center pt-2.5 border-t border-white/5">
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 mr-2 font-mono">Core Area:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-semibold transition border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600/15 border-blue-500/30 text-blue-300'
                  : 'bg-slate-950/40 border-white/5 hover:border-white/12 text-slate-350 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Main post roster grid & right comments panel drawer if active */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Posts Area */}
        <div className={`space-y-4 ${activeCommentsPostId ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 border border-white/8 rounded-3xl space-y-4">
              <div className="text-3xl">📭</div>
              <div>
                <h4 className="font-bold text-white text-sm">No Pinned Requests Found</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                  Be the first one on your campus block to pin a request for study help!
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Create Community Board Post
              </button>
            </div>
          ) : (
            filteredPosts.map(post => {
              const isActive = activeCommentsPostId === post.id;
              return (
                <div
                  key={post.id}
                  onClick={() => setActiveCommentsPostId(isActive ? null : post.id)}
                  className={`bg-slate-900/45 hover:bg-slate-900/60 border border-white/8 rounded-3xl p-5 sm:p-6 transition-all cursor-pointer relative ${
                    isActive ? 'ring-2 ring-blue-500/40 border-transparent shadow-2xl' : 'hover:scale-[1.005]'
                  }`}
                >
                  <div className="space-y-3.5">
                    
                    {/* Author block */}
                    <div className="flex items-center justify-between gap-2 text-left">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-8 h-8 rounded-full border border-white/10 object-cover"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-white leading-none">{post.authorName}</p>
                          <p className="text-[9.5px] text-slate-400 mt-0.5">{post.authorProgramme}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[9px] font-black uppercase tracking-wider">
                        <span className={`px-2 py-0.5 rounded-md border ${
                          post.type === 'share'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}>
                          {post.type === 'share' ? '📢 Share' : '🙋 Request'}
                        </span>
                        <span className="text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md font-sans font-extrabold">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content area */}
                    <div className="space-y-1.5 text-left">
                      <h3 className="font-bold text-sm text-white leading-tight hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {post.content}
                      </p>
                    </div>

                    {/* Tag bubbles */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tg, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded bg-slate-950 text-slate-350 text-[10px] border border-white/5 font-mono"
                        >
                          # {tg}
                        </span>
                      ))}
                    </div>

                    {/* Actions bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2 font-sans">
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                        
                        {/* Upvote button */}
                        <button
                          type="button"
                          onClick={(e) => handleUpvote(post.id, e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                            post.upvotedByUser
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-955 bg-slate-950/60 hover:bg-slate-950 hover:text-white border-white/5'
                          }`}
                        >
                          <ThumbsUp className={`h-3.5 w-3.5 ${post.upvotedByUser ? 'fill-white' : ''}`} />
                          <span className="font-mono">{post.upvotes}</span>
                        </button>

                        {/* Comments summary */}
                        <div className="flex items-center gap-1.5 hover:text-white transition">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{post.comments.length} Response{post.comments.length !== 1 ? 's' : ''}</span>
                        </div>

                        {post.authorName === studentName && (
                          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                            <button
                              type="button"
                              onClick={(e) => startEditPost(post, e)}
                              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider cursor-pointer"
                              title="Edit post draft"
                            >
                              Edit
                            </button>
                            <span className="text-white/20 select-none">|</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeletePost(post.id, e)}
                              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider cursor-pointer"
                              title="Delete post"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-555 text-slate-500 font-bold font-mono">
                        Posted: {post.date}
                      </span>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Replies Drawer */}
        {activeCommentsPostId && (
          <div className="lg:col-span-5 bg-slate-900 border border-white/12 rounded-3xl p-5 space-y-4 shadow-2xl relative sticky top-24 max-h-[480px] flex flex-col justify-between">
            {(() => {
              const currentPost = posts.find(p => p.id === activeCommentsPostId);
              if (!currentPost) return null;
              
              return (
                <>
                  <div className="space-y-4 flex-grow overflow-y-auto pr-1 text-left">
                    
                    {/* Drawer Header Close Button */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                        <h4 className="font-bold text-xs text-white uppercase tracking-wider font-display">Discuss Student Pin</h4>
                      </div>
                      <button
                        onClick={() => setActiveCommentsPostId(null)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Post Context summary */}
                    <div className="p-3 bg-slate-950/50 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[11px] font-bold text-white line-clamp-1">{currentPost.title}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-normal">{currentPost.content}</p>
                    </div>

                    {/* Standard Comments stack */}
                    <div className="space-y-3.5 pt-2">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Responses ({currentPost.comments.length})</p>
                      
                      {currentPost.comments.length === 0 ? (
                        <div className="text-center py-8 bg-slate-915 bg-slate-950/30 rounded-2xl border border-white/5">
                          <p className="text-xs text-slate-500 font-sans">No responses yet. Share your experience below!</p>
                        </div>
                      ) : (
                        currentPost.comments.map(c => (
                          <div key={c.id} className="p-3 bg-slate-915 bg-slate-950/40 border border-white/5 rounded-2xl space-y-2 text-white">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-2">
                                <img
                                  src={c.authorAvatar}
                                  alt={c.authorName}
                                  className="w-5.5 h-5.5 rounded-full object-cover border border-white/10"
                                />
                                <span className="text-[11px] font-bold text-blue-300">{c.authorName}</span>
                              </div>
                              <span className="text-[8px] text-slate-500 font-mono">{c.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-200 leading-relaxed font-sans font-medium">{c.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                  {/* Reply Input Section */}
                  <form onSubmit={(e) => handleAddComment(currentPost.id, e)} className="border-t border-white/5 pt-3 mt-4 space-y-2 shrink-0">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Offer your knowledge swap or suggest a study tip..."
                        className="flex-grow rounded-xl bg-slate-950 px-3.5 py-2 text-xs border border-white/5 focus:outline-none focus:border-blue-500 text-white placeholder:text-slate-600 font-sans"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition cursor-pointer shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </>
              );
            })()}
          </div>
        )}

      </div>

      {/* Creation Modal View */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCreateModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/12 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative z-10 text-white space-y-5"
            >
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3 text-left">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span className="font-display font-black text-sm uppercase tracking-wider text-white">
                    {editingPostId ? 'EDIT STUDY HELP BOARD CARD' : 'PIN STUDY HELP BOARD CARD'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePostSubmit} className="space-y-4 text-xs font-semibold text-left">
                
                {/* Segmented post type selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Post Type Direction</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-white/8 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setNewType('request')}
                      className={`py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        newType === 'request'
                          ? 'bg-amber-600/15 border border-amber-500/20 text-amber-300'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🙋 Help Request
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType('share')}
                      className={`py-2 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        newType === 'share'
                          ? 'bg-emerald-600/15 border border-emerald-500/20 text-emerald-300'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📢 Resource Share
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor="post-title" className="text-[10px] uppercase font-bold text-slate-400 block">
                    {newType === 'share' ? 'Resource Title / Share Name' : 'Post Title / Learning Target'}
                  </label>
                  <input
                    id="post-title"
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={newType === 'share' ? "e.g., Shared: Complete SQL Database Normalization Cheat Sheet..." : "e.g., Stuck on Excel pivot tables & XLOOKUP tables..."}
                    className="w-full rounded-xl border border-white/8 px-4 py-3 bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Categories select wrapper */}
                <div className="space-y-1.5">
                  <label htmlFor="post-category" className="text-[10px] uppercase font-bold text-slate-400 block">Academic Category Domain</label>
                  <select
                    id="post-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/8 px-3.5 py-3 bg-slate-950 text-white cursor-pointer focus:outline-none focus:border-blue-500"
                  >
                    <option value="Applied Coding">Applied Coding & CS</option>
                    <option value="Design & Creative">Design & Creative Layout</option>
                    <option value="Business & Finance">Business & Finance Administration</option>
                    <option value="General & Languages">General & Languages Swap</option>
                  </select>
                </div>

                {/* Tags array string input */}
                <div className="space-y-1.5">
                  <label htmlFor="post-tags" className="text-[10px] uppercase font-bold text-slate-400 block">Specific Skills / Courses Tags (Comma Separated)</label>
                  <input
                    id="post-tags"
                    type="text"
                    value={newTagsString}
                    onChange={(e) => setNewTagsString(e.target.value)}
                    placeholder="e.g., Python, Pandas, Matplotlib, DataScience"
                    className="w-full rounded-xl border border-white/8 px-4 py-3 bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[9px] text-slate-500 font-normal">Add short tags separated by commas to increase visibility.</p>
                </div>

                {/* Detailed descriptions */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="post-content" className="text-[10px] uppercase font-bold text-slate-400 block">
                    {newType === 'share' ? 'Resource Content Description & Key Takeaways' : 'Detailed Challenge Description & What You Offer to Swap'}
                  </label>
                  <textarea
                    id="post-content"
                    rows={4}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder={newType === 'share' ? "Describe the cheat sheet, practice code files, study guides, or slide references you are sharing." : "Briefly pin your specific chapter difficulties, syllabus codes, and what skill, lesson or study sheet material you can share in reward swap."}
                    className="w-full rounded-xl border border-white/8 p-4 bg-slate-950 text-white focus:outline-none focus:border-blue-500 leading-relaxed font-normal font-sans"
                  />
                </div>

                {/* Submit button row */}
                <div className="pt-2 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="px-4.5 py-2.5 rounded-xl text-slate-450 text-slate-450 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    Cancel Drawer
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black transition cursor-pointer font-bold"
                  >
                    {editingPostId ? 'Save Bullet Update' : 'Pin Post on Board'}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
