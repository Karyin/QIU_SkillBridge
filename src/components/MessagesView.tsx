import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  Circle, 
  CheckCheck, 
  User, 
  Clock, 
  FileText, 
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Video,
  ArrowLeft
} from 'lucide-react';
import { Tutor } from '../types';

interface Message {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: 'image' | 'file';
    url?: string;
  };
}

interface ChatThread {
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  tutorTitle: string;
  tutorOnline: boolean;
  messages: Message[];
  unread: boolean;
}

interface MessagesViewProps {
  tutors: Tutor[];
  studentName: string;
  studentAvatar: string;
  selectedChatTutorId: string | null;
  onNavigate: (view: string, extra?: any) => void;
  addToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const DEFAULT_CHATS: ChatThread[] = [
  {
    tutorId: 'tutor-1',
    tutorName: 'Arif Bin Azman',
    tutorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    tutorTitle: 'Year 3 Bachelor of Computer Science',
    tutorOnline: true,
    unread: true,
    messages: [
      {
        id: 'm-1',
        sender: 'tutor',
        text: 'Hi there! I saw you booked a session for Python loops and functions. Do you have some code ready or should we start from the absolute basics?',
        timestamp: '10:24 AM'
      },
      {
        id: 'm-2',
        sender: 'student',
        text: 'Hello Arif! Yes, I have some basic scripts that throw recursion exceptions. I will share them with you as soon as we meet.',
        timestamp: '10:28 AM'
      },
      {
        id: 'm-3',
        sender: 'tutor',
        text: 'Awesome! That works perfectly. I am looking forward to our session tomorrow in library room #3. Let me know if you want to invite a friend to learn together too.',
        timestamp: '10:30 AM'
      }
    ]
  },
  {
    tutorId: 'tutor-2',
    tutorName: 'Lim Wei Jie',
    tutorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    tutorTitle: 'Year 2 Bachelor of Business Admin',
    tutorOnline: false,
    unread: false,
    messages: [
      {
        id: 'm-4',
        sender: 'tutor',
        text: 'Hey Tim! The financial statement sheet you sent looks correct, but let’s review the ledger double entries to make sure it matches.',
        timestamp: 'Yesterday'
      },
      {
        id: 'm-5',
        sender: 'student',
        text: 'Yes! That is exactly what I need help with. The ledger balances are giving me some alignment trouble.',
        timestamp: 'Yesterday'
      }
    ]
  }
];

export default function MessagesView({
  tutors,
  studentName,
  studentAvatar,
  selectedChatTutorId,
  onNavigate,
  addToast
}: MessagesViewProps) {
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    let list: ChatThread[] = [];
    try {
      const stored = localStorage.getItem('qiu_chat_threads_v4');
      if (stored) {
        list = JSON.parse(stored) as ChatThread[];
      }
    } catch {}

    // Ensure all default chats are populated if not already present
    const tMap = new Map<string, ChatThread>();
    list.forEach(t => tMap.set(t.tutorId, t));

    DEFAULT_CHATS.forEach(def => {
      if (!tMap.has(def.tutorId)) {
        tMap.set(def.tutorId, def);
      }
    });

    // If there's a selectedChatTutorId, let's make sure it is also in the map,
    // if not, we try to create it from the active tutors list.
    if (selectedChatTutorId && !tMap.has(selectedChatTutorId)) {
      const targetTutor = tutors.find(t => t.id === selectedChatTutorId);
      if (targetTutor) {
        tMap.set(selectedChatTutorId, {
          tutorId: targetTutor.id,
          tutorName: targetTutor.name,
          tutorAvatar: targetTutor.avatar,
          tutorTitle: targetTutor.title,
          tutorOnline: true,
          unread: false,
          messages: [
            {
              id: `m-init-${Date.now()}`,
              sender: 'tutor',
              text: `Hello! Thanks for reaching out to my Peer Tutor slot. Let’s collaborate and work on your study goals!`,
              timestamp: 'Just now'
            }
          ]
        });
      }
    }

    return Array.from(tMap.values());
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    if (selectedChatTutorId) return selectedChatTutorId;
    return DEFAULT_CHATS[0].tutorId;
  });

  const [mobileShowChat, setMobileShowChat] = useState<boolean>(!!selectedChatTutorId);

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeEmojiMenu, setActiveEmojiMenu] = useState(false);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = (type: 'image' | 'file') => {
    if (type === 'image') {
      photoInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    // Resolve target thread
    const targetThread = threads.find(t => t.tutorId === activeThreadId) || threads[0];
    if (!targetThread) return;
    const targetTutorId = targetThread.tutorId;

    let fileUrl = '';
    if (type === 'image') {
      fileUrl = URL.createObjectURL(file);
    }

    const newMessage: Message = {
      id: `msg-user-upload-${Date.now()}`,
      sender: 'student',
      text: type === 'image' ? `Shared photo: ${file.name}` : `Shared file: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: {
        name: file.name,
        type: type,
        url: fileUrl || undefined
      }
    };

    setThreads(prev => prev.map(t => {
      if (t.tutorId === targetTutorId) {
        return {
          ...t,
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));

    addToast(`Successfully uploaded & shared: "${file.name}"! 🚀`, 'success');

    // Simulate friendly reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMessage: Message = {
        id: `msg-bot-upload-${Date.now()}`,
        sender: 'tutor',
        text: `Thanks for uploading this! I received the "${file.name}" attachment. I will review it right away so we can cover it in our next peer tutoring slot!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => prev.map(t => {
        if (t.tutorId === targetTutorId) {
          return {
            ...t,
            messages: [...t.messages, botMessage]
          };
        }
        return t;
      }));
    }, 1500);

    // Reset input
    e.target.value = '';
  };

  // Sync back to localstorage whenever threads mutate
  useEffect(() => {
    try {
      localStorage.setItem('qiu_chat_threads_v4', JSON.stringify(threads));
    } catch {}
  }, [threads]);

  // Ensure activeThreadId is always valid and in sync with threads
  useEffect(() => {
    if (threads.length > 0) {
      const exists = threads.some(t => t.tutorId === activeThreadId);
      if (!exists) {
        setActiveThreadId(threads[0].tutorId);
      }
    }
  }, [threads, activeThreadId]);

  // Handle selectedChatTutorId navigation updates from other views (like a direct message button on a profile)
  useEffect(() => {
    if (selectedChatTutorId) {
      setThreads(prev => {
        const existing = prev.find(t => t.tutorId === selectedChatTutorId);
        if (!existing) {
          // Find tutor details
          const targetTutor = tutors.find(t => t.id === selectedChatTutorId);
          if (targetTutor) {
            const newThread: ChatThread = {
              tutorId: targetTutor.id,
              tutorName: targetTutor.name,
              tutorAvatar: targetTutor.avatar,
              tutorTitle: targetTutor.title,
              tutorOnline: true,
              unread: false,
              messages: [
                {
                  id: `m-init-${Date.now()}`,
                  sender: 'tutor',
                  text: `Hello! Thanks for reaching out to my Peer Tutor slot. Let’s collaborate and work on your study goals!`,
                  timestamp: 'Just now'
                }
              ]
            };
            return [newThread, ...prev];
          }
        }
        return prev;
      });
      setActiveThreadId(selectedChatTutorId);
      setMobileShowChat(true);
    }
  }, [selectedChatTutorId, tutors]);

  // Scroll to bottom strictly within sub-container to avoid page layout shifts
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  const activeThread = threads.find(t => t.tutorId === activeThreadId) || threads[0];

  const prevMessagesCountRef = useRef<number>(0);
  const currentMessagesCount = activeThread?.messages?.length || 0;

  useEffect(() => {
    // Scroll instantly on thread change
    scrollToBottom('auto');
    prevMessagesCountRef.current = currentMessagesCount;
  }, [activeThreadId]);

  useEffect(() => {
    // Scroll smoothly on true message increase
    if (currentMessagesCount > prevMessagesCountRef.current) {
      scrollToBottom('smooth');
    }
    prevMessagesCountRef.current = currentMessagesCount;
  }, [currentMessagesCount]);

  // Simulator bot response patterns
  const getSimulatedReply = (tutorName: string, query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Hey there! Glad to chat. What specific university courses or tutorial assignments can we focus on today?`;
    }
    if (q.includes('meet') || q.includes('time') || q.includes('library') || q.includes('where')) {
      return `I usually prefer meeting in the QIU main library discussion room #3 or lobby desks. I’m also fully down for a remote Zoom screen-share if that works better for you!`;
    }
    if (q.includes('thanks') || q.includes('thank you') || q.includes('perfect')) {
      return `Anytime! Helping each other out is what the peer network is all about. Let's study smart together.`;
    }
    if (q.includes('cost') || q.includes('points') || q.includes('swap')) {
      return `Since it's a completely free campus SkillBridge, we can just trade points/hours! I teach you Python loops, and you can share some of your finance study sheets or design reviews. Deal?`;
    }
    return `That sounds interesting! Let me look into that syllabus chapter details. I scored well in this module last semester, so we can definitely tackle it together during our booked session.`;
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Resolve the actual thread being viewed in the UI
    const targetThread = threads.find(t => t.tutorId === activeThreadId) || threads[0];
    if (!targetThread) return;

    const targetTutorId = targetThread.tutorId;

    const newMessage: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message
    setThreads(prev => prev.map(t => {
      if (t.tutorId === targetTutorId) {
        return {
          ...t,
          messages: [...t.messages, newMessage],
          unread: false
        };
      }
      return t;
    }));

    setMessageInput('');
    setActiveEmojiMenu(false);

    // Trigger simulated tutor typing with 1-second delay
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyText = getSimulatedReply(targetThread.tutorName || 'Tutor', textToSend);

      const botMessage: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: 'tutor',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => prev.map(t => {
        if (t.tutorId === targetTutorId) {
          return {
            ...t,
            messages: [...t.messages, botMessage]
          };
        }
        return t;
      }));
    }, 1550);
  };

  const handleQuickSnippetClick = (snippet: string) => {
    handleSendMessage(snippet);
  };

  const quickSnippets = [
    "Are we meeting in-person or on Zoom?",
    "Thanks for the explanation! See you tomorrow.",
    "Can we reschedule our session to Friday 3 PM?",
    "Here is the student exercise sheet we talked about."
  ];

  const emotes = ['👍', '🙌', '✨', '🎓', '🤓', '💡', '🎉', '🔥'];

  return (
    <div className="space-y-4 pb-12 text-white font-sans flex flex-col justify-between text-left">
      
      {/* Messages Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 px-1 shrink-0 text-left">
        <div>
          <div className="flex items-center gap-2 text-left">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">
              Direct Peer Contact messaging
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display mt-1 text-left">
            QIU Swap <span className="text-blue-400">Messages Panel</span> 💬
          </h1>
        </div>
      </div>

      {/* Primary Inbox View container */}
      <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-900/40 backdrop-blur-lg border border-white/8 rounded-3xl overflow-hidden shadow-2xl h-[500px]">
        
        {/* Left Drawer roster column (span 4) */}
        <div className={`md:col-span-4 border-r border-white/5 flex flex-col bg-slate-950/20 h-full overflow-y-auto scrollbar-none no-scrollbar text-left ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-white/5 text-left">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2 font-display">My Peer Threads</h3>
            <p className="text-[10px] text-slate-500">Fast contact with active student mentors.</p>
          </div>

          <div className="flex-grow divide-y divide-white/5 text-left">
            {threads.map(thr => {
              const matchesActive = thr.tutorId === activeThreadId;
              const hasUnread = thr.unread;
              const lastMsg = thr.messages[thr.messages.length - 1];

              return (
                <button
                  key={thr.tutorId}
                  onClick={() => {
                    setActiveThreadId(thr.tutorId);
                    setMobileShowChat(true);
                    // Mark as read
                    setThreads(prev => prev.map(t => t.tutorId === thr.tutorId ? { ...t, unread: false } : t));
                  }}
                  className={`w-full text-left p-4 flex gap-3 hover:bg-white/5 transition relative cursor-pointer ${
                    matchesActive ? 'bg-blue-600/10 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={thr.tutorAvatar}
                      alt={thr.tutorName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    {thr.tutorOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex justify-between items-start text-left">
                      <h4 className={`text-xs font-bold text-white truncate ${hasUnread ? 'text-blue-300' : ''}`}>
                        {thr.tutorName}
                      </h4>
                      <span className="text-[8px] text-slate-500 font-mono font-bold shrink-0 text-right">
                        {lastMsg ? lastMsg.timestamp : '10:00 AM'}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 truncate mt-0.5 font-medium">{thr.tutorTitle}</p>
                    <p className="text-[10.5px] text-slate-300 truncate mt-1.5 font-normal leading-relaxed text-slate-350">
                      {lastMsg ? lastMsg.text : 'Thread opened'}
                    </p>
                  </div>

                  {hasUnread && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Conversation column (span 8) */}
        {activeThread ? (
          <div className={`md:col-span-8 flex flex-col justify-between h-full bg-slate-950/10 text-left ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            
            {/* Thread Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/30 text-left gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 text-left min-w-0">
                {/* Back to threads button list on mobile view */}
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition shrink-0 border border-white/5"
                  title="Back to inbox"
                  type="button"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <img
                  src={activeThread.tutorAvatar}
                  alt={activeThread.tutorName}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-white/5 shadow shrink-0"
                />
                <div className="text-left">
                  <h3 className="font-bold text-sm text-white leading-tight">{activeThread.tutorName}</h3>
                  <div className="flex items-center gap-1.5 mt-1 leading-none">
                    <span className={`h-1.5 w-1.5 rounded-full ${activeThread.tutorOnline ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                    <span className="text-[9px] text-slate-400 font-bold">
                      {activeThread.tutorOnline ? 'Active Online Study Helper' : 'Away (Will respond soon)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => onNavigate('profile', { tutorId: activeThread.tutorId })}
                  className="px-3.5 py-1.5 hover:bg-white/5 border border-white/8 text-slate-300 hover:text-white rounded-lg text-[10px] sm:text-[10.5px] font-semibold transition"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Conversation Messages area */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto scrollbar-none no-scrollbar p-4 space-y-4 bg-transparent max-h-[300px] text-left"
            >
              
              <div className="text-center py-2 select-none">
                <span className="px-3 py-1 rounded-full bg-blue-500/5 text-slate-500 text-[9px] tracking-widest uppercase font-extrabold border border-white/5 font-sans">
                  🛡️ Chat logs encrypted strictly for classroom assignment review
                </span>
              </div>

              {activeThread.messages.map((m, idx) => {
                const isUser = m.sender === 'student';
                return (
                  <div
                    key={m.id || idx}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full text-left`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%] text-left">
                      {!isUser && (
                        <img
                          src={activeThread.tutorAvatar}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover shrink-0 select-none hidden sm:block mb-1 opacity-70"
                        />
                      )}

                      <div className="space-y-1 text-left">
                        <div className={`p-3.5 rounded-2xl text-[11.5px] leading-relaxed relative text-left ${
                          isUser 
                            ? 'bg-blue-600 text-white rounded-br-none shadow-[0_4px_12px_rgba(37,99,235,0.2)] font-normal' 
                            : 'bg-slate-905 bg-slate-900 text-slate-200 border border-white/5 rounded-bl-none font-normal'
                        }`}>
                          {m.attachment && (
                            <div className="mb-2 p-2 bg-slate-950/80 rounded-xl border border-white/8 flex flex-col gap-1.5 text-[10px] sm:text-[10.5px] text-left">
                              {m.attachment.type === 'image' ? (
                                <>
                                  <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                                    <ImageIcon className="h-4 w-4" />
                                    <span>Photo Shared</span>
                                  </div>
                                  {m.attachment.url && (
                                    <img 
                                      src={m.attachment.url} 
                                      alt={m.attachment.name} 
                                      className="max-h-48 w-full object-cover rounded-lg border border-white/10 mt-1"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                </>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                                  <div className="min-w-0 flex-1 text-left">
                                    <p className="font-mono text-white truncate text-[10.5px]" title={m.attachment.name}>
                                      {m.attachment.name}
                                    </p>
                                    <span className="text-[8px] text-slate-500 uppercase font-mono tracking-wider">File Attachment</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          <p>{m.text}</p>
                        </div>
                        
                        <div className={`flex items-center gap-1.5 text-[8.5px] text-slate-500 ${isUser ? 'justify-end' : 'justify-start'} font-bold font-mono px-1`}>
                          <span>{m.timestamp}</span>
                          {isUser && <CheckCheck className="h-3 w-3 text-blue-400" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bot Active Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start w-full">
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <img
                      src={activeThread.tutorAvatar}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover shrink-0 hidden sm:block mb-1 opacity-75"
                    />
                    <div className="bg-slate-900 border border-white/5 p-3.5 rounded-2xl rounded-bl-none text-slate-400 flex items-center gap-1 text-xs">
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce animate-none" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-150 animate-none" />
                      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-300 animate-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>



            {/* Reply entry bar */}
            <div className="p-4 border-t border-white/5 bg-slate-955 bg-slate-952 bg-slate-950/20 flex items-center gap-2 relative shrink-0">
              
              {/* Hidden file inputs for uploading */}
              <input 
                type="file" 
                ref={photoInputRef} 
                onChange={(e) => handleFileChange(e, 'image')} 
                accept="image/*" 
                className="hidden" 
              />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => handleFileChange(e, 'file')} 
                className="hidden" 
              />

              {/* Upload button triggers */}
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => triggerFileInput('image')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
                  title="Upload Photo / Screenshot"
                >
                  <ImageIcon className="h-4.5 w-4.5 text-blue-400" />
                </button>
                <button
                  type="button"
                  onClick={() => triggerFileInput('file')}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
                  title="Upload Academic Document"
                >
                  <Paperclip className="h-4.5 w-4.5 text-amber-500" />
                </button>
              </div>

              {/* Chat Text Input field */}
              <div className="flex-grow relative flex items-center">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(messageInput);
                    }
                  }}
                  placeholder={`Chat with ${activeThread.tutorName || 'tutor'}...`}
                  className="w-full bg-slate-950 border border-white/8 px-4 py-3 pr-10 rounded-2xl text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600 font-sans font-medium"
                />

                {/* Emoji popover toggler */}
                <button
                  type="button"
                  onClick={() => setActiveEmojiMenu(!activeEmojiMenu)}
                  className="absolute right-3.5 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Smile className="h-4.5 w-4.5 text-blue-400" />
                </button>

                {/* Emoji List overlay popover */}
                {activeEmojiMenu && (
                  <div className="absolute right-0 bottom-14 bg-slate-900 border border-white/12 rounded-2xl p-2.5 shadow-2xl flex gap-1.5 z-10 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    {emotes.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setMessageInput(prev => prev + em);
                          setActiveEmojiMenu(false);
                        }}
                        className="p-1 px-1.5 text-sm hover:scale-120 hover:bg-white/5 rounded-md transition duration-100 cursor-pointer"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleSendMessage(messageInput)}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition shadow flex items-center justify-center cursor-pointer shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="col-span-12 md:col-span-8 flex flex-col items-center justify-center text-center p-8 text-white space-y-3">
            <div className="text-3xl">📭</div>
            <p className="font-bold text-sm">Select a colleague conversation log to read</p>
          </div>
        )}

      </div>

    </div>
  );
}
