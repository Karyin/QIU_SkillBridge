import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Users, MessageSquare, Pencil, Eraser, Trash2, Clock, Play, Pause, 
  RotateCcw, Plus, Minus, Send, Sparkles, BookOpen, Crown, ChevronRight, Share2,
  Lock, X
} from 'lucide-react';

interface StudyRoomViewProps {
  studentProfile: {
    name: string;
    avatar: string;
    programme: string;
  };
  onNavigate?: (view: string) => void;
}

interface PeerCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderColor: string;
  message: string;
  timestamp: string;
  receiverId?: string | null;
  receiverName?: string | null;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  type: 'study' | 'break';
}

const PRESET_ROOMS = [
  { id: 'cs-101', name: '🚀 Computer Science Sandbox', desc: 'Syllabus, normalizations, & React widgets' },
  { id: 'math-302', name: '📐 Calculus & Linear Algebra Group', desc: 'Equation proofs and vector analysis' },
  { id: 'design-01', name: '🎨 Creative Design & UI/UX Jam', desc: 'Wireframes, layout planning, and colors' },
  { id: 'gen-study', name: '💡 General Peer Q&A', desc: 'Open homework study session & peer help' }
];

const DIAGRAM_STROKES = [
  // Box 1: "Users" Table
  { x1: 150, y1: 150, x2: 280, y2: 150 }, // Top border
  { x1: 280, y1: 150, x2: 280, y2: 230 }, // Right border
  { x1: 280, y1: 230, x2: 150, y2: 230 }, // Bottom border
  { x1: 150, y1: 230, x2: 150, y2: 150 }, // Left border
  // Divider in entity box
  { x1: 150, y1: 175, x2: 280, y2: 175 }, 
  // Text content simulation
  { x1: 160, y1: 165, x2: 220, y2: 165 }, 
  { x1: 160, y1: 195, x2: 180, y2: 195 }, 
  { x1: 160, y1: 215, x2: 210, y2: 215 }, 

  // Arrow pointing right
  { x1: 280, y1: 190, x2: 440, y2: 190 }, 
  { x1: 430, y1: 180, x2: 440, y2: 190 }, 
  { x1: 430, y1: 200, x2: 440, y2: 190 }, 

  // Box 2: "Bookings" Table
  { x1: 440, y1: 150, x2: 570, y2: 150 }, // Top
  { x1: 570, y1: 150, x2: 570, y2: 230 }, // Right
  { x1: 570, y1: 230, x2: 440, y2: 230 }, // Bottom
  { x1: 440, y1: 230, x2: 440, y2: 150 }, // Left
  // Divider in entity box 2
  { x1: 440, y1: 175, x2: 570, y2: 175 },
  // Text content simulation 2
  { x1: 450, y1: 165, x2: 510, y2: 165 }, 
  { x1: 450, y1: 195, x2: 500, y2: 195 }, 
  { x1: 450, y1: 215, x2: 490, y2: 215 }, 

  // Graph or nice Venn diagram nodes
  { x1: 300, y1: 350, x2: 320, y2: 320 },
  { x1: 320, y1: 320, x2: 350, y2: 300 },
  { x1: 350, y1: 300, x2: 390, y2: 300 },
  { x1: 390, y1: 300, x2: 420, y2: 320 },
  { x1: 420, y1: 320, x2: 440, y2: 350 },
  { x1: 440, y1: 350, x2: 420, y2: 380 },
  { x1: 420, y1: 380, x2: 395, y2: 400 },
  { x1: 395, y1: 400, x2: 350, y2: 400 },
  { x1: 350, y1: 400, x2: 320, y2: 380 },
  { x1: 320, y1: 380, x2: 300, y2: 350 }
];

const BRUSH_COLORS = [
  { value: '#3b82f6', label: 'Royal Blue' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#ef4444', label: 'Ruby Red' },
  { value: '#f59e0b', label: 'Amber Orange' },
  { value: '#8b5cf6', label: 'Grape Purple' },
  { value: '#ec4899', label: 'Bright Pink' },
  { value: 'eraser', label: 'Eraser' }
];

export default function StudyRoomView({ studentProfile, onNavigate }: StudyRoomViewProps) {
  const [availableRooms, setAvailableRooms] = useState<{ id: string; name: string; desc: string }[]>(() => {
    try {
      const stored = localStorage.getItem('qiu_custom_study_rooms');
      const parsed = stored ? JSON.parse(stored) : [];
      return [...PRESET_ROOMS, ...parsed];
    } catch {
      return PRESET_ROOMS;
    }
  });
  const [activeRoom, setActiveRoom] = useState(availableRooms[0] || PRESET_ROOMS[0]);
  const [customRoomId, setCustomRoomId] = useState('');
  const [isJoiningCustom, setIsJoiningCustom] = useState(false);

  // Keep a stable ref of studentProfile for connectToRoom connection context
  const studentProfileRef = useRef(studentProfile);
  useEffect(() => {
    studentProfileRef.current = studentProfile;
  }, [studentProfile]);

  // Connection State (start as 'connecting' to prevent offline splash state flash)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [clientId, setClientId] = useState<string>('');
  const [myColor, setMyColor] = useState<string>('#3b82f6');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [peerCursors, setPeerCursors] = useState<{ [id: string]: PeerCursor }>({});
  
  // Timer State
  const [timer, setTimer] = useState<TimerState>({
    duration: 25 * 60,
    timeLeft: 25 * 60,
    isRunning: false,
    type: 'study'
  });

  // Drawing Tools State
  const [brushColor, setBrushColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  // Chat input
  const [chatInput, setChatInput] = useState('');

  // Refs
  const socketRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  // Simulated peer buddies (to make isolated user experience rich and active!)
  const [botsEnabled, setBotsEnabled] = useState(false);
  const activeBotsRef = useRef<{ id: string; name: string; avatar: string; color: string }[]>([]);
  const botIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Safe draw function
  const drawSegment = useCallback((
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    color: string, 
    size: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color === 'eraser' ? '#0f172a' : color; // Matches canvas solid slate-900 back
    ctx.lineWidth = size;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }, []);

  // WebSocket Connection & Interaction handler
 const connectToRoom = useCallback((roomId: string) => {
  if (socketRef.current) {
    socketRef.current.onclose = null;
    socketRef.current.onerror = null;
    socketRef.current.close();
  }

  setConnectionStatus('connecting');
  setPeerCursors({});
  setChatMessages([]);
  setParticipants([]);
  setClientId('');
  setMyColor('#3b82f6');

  // Clear old whiteboard when switching rooms
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Stop old bot intervals
  if (botIntervalRef.current) {
    clearInterval(botIntervalRef.current);
    botIntervalRef.current = undefined;
  }

  activeBotsRef.current = [];
  setBotsEnabled(false);

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socketUrl = `${protocol}//${window.location.host}`;

  const ws = new WebSocket(socketUrl);
  socketRef.current = ws;

  ws.onopen = () => {
    if (socketRef.current === ws) {
      setConnectionStatus('connected');

      ws.send(JSON.stringify({
        type: 'join',
        roomId,
        name: studentProfileRef.current.name,
        avatar: studentProfileRef.current.avatar
      }));
    }
  };

  ws.onclose = () => {
    if (socketRef.current === ws) {
      setConnectionStatus('disconnected');
    }
  };

  ws.onerror = (evt) => {
    console.error('Study room connection fault:', evt);
    if (socketRef.current === ws) {
      setConnectionStatus('disconnected');
    }
  };

  ws.onmessage = (event) => {
  if (socketRef.current !== ws) return;

  try {
      const payload = JSON.parse(event.data);

      switch (payload.type) {
        case 'join_success': {
          setClientId(payload.clientId);
          setMyColor(payload.color);
          setParticipants(payload.participants);
          setTimer(payload.timer);
          setChatMessages(payload.chatHistory);

          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              (payload.drawHistory || []).forEach((stroke: any) => {
                drawSegment(
                  stroke.x1,
                  stroke.y1,
                  stroke.x2,
                  stroke.y2,
                  stroke.color,
                  stroke.width
                );
              });
            }
          }
          break;
        }

        case 'presence': {
          setParticipants(payload.participants);
          break;
        }

        case 'user_left': {
          setPeerCursors(prev => {
            const next = { ...prev };
            delete next[payload.userId];
            return next;
          });
          break;
        }

        case 'draw': {
          const { x1, y1, x2, y2, color, width } = payload.stroke;
          drawSegment(x1, y1, x2, y2, color, width);
          break;
        }

        case 'clear': {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }
          break;
        }

        case 'cursor_update': {
          const { userId, name, color, cursor } = payload;

          if (cursor) {
            setPeerCursors(prev => ({
              ...prev,
              [userId]: {
                id: userId,
                name,
                color,
                x: cursor.x,
                y: cursor.y
              }
            }));
          } else {
            setPeerCursors(prev => {
              const next = { ...prev };
              delete next[userId];
              return next;
            });
          }
          break;
        }

        case 'chat': {
          setChatMessages(prev => [...prev, payload.message]);
          break;
        }

        case 'timer_update': {
          setTimer(payload.timer);
          break;
        }

        case 'timer_finished': {
          setTimer(payload.timer);

          try {
            const audioCtx = new (
              window.AudioContext ||
              (window as any).webkitAudioContext
            )();

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
          } catch {}

          break;
        }
      }
    } catch (err) {
      console.error('Error unpacking socket packet:', err);
    }
  };
}, [drawSegment]);

  // Handle active room switches
  useEffect(() => {
    connectToRoom(activeRoom.id);
    return () => {
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.onerror = null;
        socketRef.current.close();
      }
    };
  }, [activeRoom, connectToRoom]);

  // Standardize canvas dimensions once mounted
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 800, 480);
      }
    }
  }, []);

  // Quick Chat Auto-Scroll (Local container scrolling to prevent whole-page vertical pull)
useEffect(() => {
  requestAnimationFrame(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  });
}, [chatMessages]);

  // Coordinate conversion helper (Client absolute coords down to 800x480 responsive canvas)
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Scale accurately based on CSS bounding rectangle dimensions
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    return { x: Math.round(x), y: Math.round(y) };
  };

  // Whiteboard drawing event handlers
  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e.cancelable) e.preventDefault();
    isDrawingRef.current = true;
    const coords = getCanvasCoordinates(e);
    lastPosRef.current = coords;
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e.cancelable) e.preventDefault();
    const coords = getCanvasCoordinates(e);

    // Dynamic Server Cursor Sync
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && !('touches' in e)) {
      socketRef.current.send(JSON.stringify({
        type: 'cursor',
        cursor: coords
      }));
    }

    if (!isDrawingRef.current) return;

    const x1 = lastPosRef.current.x;
    const y1 = lastPosRef.current.y;
    const x2 = coords.x;
    const y2 = coords.y;

    const currentColor = isEraser ? 'eraser' : brushColor;
    drawSegment(x1, y1, x2, y2, currentColor, brushSize);

    // Propagate drawing stroke to classmate sessions
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'draw',
        stroke: { x1, y1, x2, y2, color: currentColor, width: brushSize }
      }));
    }

    lastPosRef.current = coords;
  };

  const handleStopDrawing = () => {
    isDrawingRef.current = false;
    // Broadcast cursor removal
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'cursor',
        cursor: null
      }));
    }
  };

  const handleCanvasMouseLeave = () => {
    if (isDrawingRef.current) {
      handleStopDrawing();
    }
  };

  // Clear Board Button Handler
  const handleClearBoard = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'clear' }));
    }
  };

  // Direct message composer
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat',
        message: chatInput,
        receiverId: null,
        receiverName: null
      }));
      setChatInput('');
    }
  };

  // Shared clock control sender
  const sendTimerControl = (action: string, extra?: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'timer_control',
        action,
        ...extra
      }));
    }
  };

  // CUSTOM STUDY ROOM JOINER
  const handleJoinCustomRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomId.trim()) return;

    const formattedId = customRoomId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    
    // Check if room already in available rooms
    const existing = availableRooms.find(r => r.id === formattedId);
    if (existing) {
      setActiveRoom(existing);
      setIsJoiningCustom(false);
      setCustomRoomId('');
      return;
    }

    const newRoomObj = {
      id: formattedId,
      name: `🔑 Custom: #${formattedId.toUpperCase()}`,
      desc: 'Privately created workspace room'
    };

    const updatedRooms = [...availableRooms, newRoomObj];
    setAvailableRooms(updatedRooms);
    
    try {
      const customOnly = updatedRooms.filter(r => !PRESET_ROOMS.some(p => p.id === r.id));
      localStorage.setItem('qiu_custom_study_rooms', JSON.stringify(customOnly));
    } catch {}

    setActiveRoom(newRoomObj);
    setIsJoiningCustom(false);
    setCustomRoomId('');
  };

  // SIMULATOR BUDDIES IMPLEMENTATION ("AI Peers summoner")
  // Simulates classmates chatting and sketch lines to demonstrate whiteboard collaboration dynamically
  const toggleBots = () => {
    if (botsEnabled) {
      // Disable bots
      setBotsEnabled(false);
      if (botIntervalRef.current) {
        clearInterval(botIntervalRef.current);
        botIntervalRef.current = undefined;
      }
      activeBotsRef.current = [];
      setPeerCursors(prev => {
  const next = { ...prev };
  Object.keys(next).forEach(id => {
    if (id.startsWith('bot-')) {
      delete next[id];
    }
  });
  return next;
});
      // Request updated server participants
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'presence_request' }));
      }
    } else {
      // Enable peer students
      setBotsEnabled(true);
      const mockBots = [
        { id: 'bot-1', name: 'ZhiHao [Peer Year 3]', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80', color: '#10b981' },
        { id: 'bot-2', name: 'Elena [Peer Year 2]', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80', color: '#f59e0b' }
      ];
      activeBotsRef.current = mockBots;

      // Add bots to participant sidebar visually
      setParticipants(prev => {
        // Exclude duplicate bot entries
        const nonBot = prev.filter(p => !p.id.startsWith('bot-'));
        return [
          ...nonBot,
          ...mockBots.map(b => ({ id: b.id, name: b.name, avatar: b.avatar, color: b.color }))
        ];
      });

      // Inject greeting simulation chats
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-msg-welcome-${Date.now()}`,
          senderId: 'bot-2',
          senderName: 'Elena [Peer Year 2]',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
          senderColor: '#f59e0b',
          message: "Hello classmate! 👋 I've entered this room and opened up my homework. What core topic are we studying?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      let botActionCounter = 0;
      // Start polling logic inside client ref
      botIntervalRef.current = setInterval(() => {
        botActionCounter++;
        const randomBot = mockBots[Math.floor(Math.random() * mockBots.length)];

        // Option A: Bot sends academic chat (every 4 action cycles)
        if (botActionCounter % 4 === 0) {
          const chats = [
            "Let's trace a concept layout on the whiteboard! Feel free to sketch over my drawings too. ✏️",
            "This Pomodoro study clock is super handy. Mind if I click 'Start Study Sprint' to lock down a 25m slot?",
            "Your workspace is gorgeous. Let's finish the database normalization schemas before the deadline!",
            "Did anyone try the SQL join exercise on page 42? It keeps throwing syntax problems.",
            "Awesome, the interactive lines draw perfectly in real time! Check this diagram!"
          ];
          const chosenMsg = chats[Math.floor(Math.random() * chats.length)];
          setChatMessages(prev => [
            ...prev,
            {
              id: `bot-m-${botActionCounter}-${Date.now()}`,
              senderId: randomBot.id,
              senderName: randomBot.name,
              senderAvatar: randomBot.avatar,
              senderColor: randomBot.color,
              message: chosenMsg,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        } 
        
        // Option B: Bot draws a precise physical diagram stroke!
        else {
          const botCanvas = canvasRef.current;
          if (botCanvas) {
            const strokeIndex = (botActionCounter - 1) % DIAGRAM_STROKES.length;
            const stroke = DIAGRAM_STROKES[strokeIndex];

            const startX = stroke.x1;
            const startY = stroke.y1;
            const endX = stroke.x2;
            const endY = stroke.y2;

            // Execute locally
            drawSegment(startX, startY, endX, endY, randomBot.color, 3);

            // Propagate through live WebSocket so other tabs see client drawing actions!
   
if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
  socketRef.current.send(JSON.stringify({
    type: 'draw',
    stroke: {
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      color: randomBot.color,
      width: 3
    }
  }));

  // Move cursor
  socketRef.current.send(JSON.stringify({
    type: 'cursor',
    cursor: { x: endX, y: endY }
  }));
}
          }
        }
 }, 4000); // Trigger interesting events periodically (slightly faster drawing pacing)
    }
  };
  // Clean bot loops on view unmount
  useEffect(() => {
    return () => {
      if (botIntervalRef.current) {
        clearInterval(botIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 font-sans">
      
      {onNavigate && (
        <div className="flex justify-start mb-4">
          <button
            onClick={() => onNavigate('community')}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            ← Go Back to Community Hub
          </button>
        </div>
      )}

      {/* Title & Banner Header */}
      <div className="relative mb-6 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 border border-blue-500/10 p-6 sm:p-8 shrink-0">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-semibold text-blue-400 mb-3 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Dynamic Shared Study Room & Whiteboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase sm:leading-none">
              Interactive Co-Study Lab
            </h1>
            <p className="mt-1.5 text-xs text-slate-300 max-w-xl font-normal leading-relaxed">
              Study dynamically with fellow peers! Co-draw database schemas or coding algorithms on the shared whiteboard, coordinate study milestones with the synchronized Pomodoro clock, and text instantly inside your classroom workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-center shrink-0">
            {/* Summon AI buddies button */}
            <button
              onClick={toggleBots}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border transition-all ${
                botsEnabled 
                  ? 'bg-amber-500/25 border-amber-400/40 text-amber-300' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
              }`}
              title="Adds virtual classmates to help verify canvas mirroring & timer syncing"
            >
              <Sparkles className={`h-4 w-4 ${botsEnabled ? 'animate-spin' : ''}`} />
              {botsEnabled ? "Classmates Online" : "Summon Partner Buddies"}
            </button>

            {/* Connection Indicator badge */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-white/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
                  connectionStatus === 'connecting' ? 'bg-amber-400 animate-pulse' : 'bg-red-500'
                }`} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
                  {connectionStatus === 'connected' ? 'Hub Synchronized' :
                   connectionStatus === 'connecting' ? 'Calibrating...' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Rooms menu in left, Workspace center, Chat sidebar right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT COLUMN: ROOMS AND PRESENCE (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-4 text-left">
          
          {/* Study Rooms Menu */}
          <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-sans">Active Rooms</h3>
              <button
                onClick={() => setIsJoiningCustom(true)}
                className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 hover:underline"
              >
                + Custom
              </button>
            </div>

            {isJoiningCustom ? (
              <form onSubmit={handleJoinCustomRoom} className="space-y-2 mb-3">
                <input
                  type="text"
                  value={customRoomId}
                  onChange={(e) => setCustomRoomId(e.target.value)}
                  placeholder="e.g. exams-prep"
                  className="w-full text-xs bg-slate-950 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsJoiningCustom(false)}
                    className="text-[10px] font-bold text-slate-400 px-2 py-1 hover:bg-white/5 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-[10px] bg-blue-600 text-white font-bold px-3 py-1 rounded hover:bg-blue-500"
                  >
                    Enter Room
                  </button>
                </div>
              </form>
            ) : null}

            <div className="space-y-2">
              {availableRooms.map(room => {
                const isActive = activeRoom.id === room.id;
                const isPreset = PRESET_ROOMS.some(p => p.id === room.id);
                return (
                  <div key={room.id} className="group relative">
                    <button
                      onClick={() => setActiveRoom(room)}
                      className={`w-full text-left p-3 pr-8 rounded-xl border transition-all ${
                        isActive 
                          ? 'bg-blue-600/10 border-blue-500/35 text-white shadow-sm' 
                          : 'border-white/5 bg-slate-950/20 hover:bg-white/5 hover:border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <BookOpen className={`h-3.5 w-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold line-clamp-1">{room.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 leading-normal font-sans font-normal">
                        {room.desc}
                      </p>
                    </button>
                    {!isPreset && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextRooms = availableRooms.filter(r => r.id !== room.id);
                          setAvailableRooms(nextRooms);
                          try {
                            const customOnly = nextRooms.filter(r => !PRESET_ROOMS.some(p => p.id === r.id));
                            localStorage.setItem('qiu_custom_study_rooms', JSON.stringify(customOnly));
                          } catch {}
                          if (isActive) {
                            setActiveRoom(PRESET_ROOMS[0]);
                          }
                        }}
                        className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-150"
                        title="Delete custom room"
                      >
                        <Trash2 className="h-3 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Students Presences */}
          <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 mb-3 border-b border-white/5 pb-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 font-sans">Students Online ({participants.length})</span>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[220px] lg:max-h-full">
              {participants.map(part => {
                const isMe = part.id === clientId;
                return (
                  <div 
                    key={part.id} 
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-white/5 transition-all text-left"
                  >
                    <div className="flex items-center gap-2">
                      <img 
                        src={part.avatar} 
                        alt={part.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-lg border object-cover"
                        style={{ borderColor: part.color }}
                      />
                      <div className="text-left leading-normal">
                        <div className="text-xs font-bold text-white flex items-center gap-1 text-wrap break-all line-clamp-1">
                          {part.name}
                          {isMe && <span className="text-[8px] px-1 bg-blue-500/20 text-blue-400 border border-blue-500/10 rounded font-bold">Me</span>}
                        </div>
                        <p className="text-[8px] text-slate-400 font-mono">ID: {part.id.substr(0, 8)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: part.color, boxShadow: `0 0 6px ${part.color}` }}
                      />
                    </div>
                  </div>
                );
              })}

              {participants.length === 0 && (
                <div className="py-8 text-center text-slate-500 font-sans text-[11px] font-normal">
                  Synchronizing room roster list...
                </div>
              )}
            </div>
            
            <div className="mt-3 bg-slate-950/60 border border-white/5 rounded-xl p-2.5 text-center shrink-0">
              <div className="flex items-center justify-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider font-sans mb-1">
                <Share2 className="h-3 w-3 text-blue-400" /> Room Invitation Code
              </div>
              <p className="text-[11px] font-mono text-cyan-400 font-bold tracking-widest">{activeRoom.id.toUpperCase()}</p>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: WHITEBOARD & SYNC TIMER (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col gap-4 text-center">
          
          {/* TOP SECTION: Synced Pomodoro Clock */}
          <div className="rounded-2xl border border-indigo-500/10 bg-indigo-950/15 backdrop-blur-sm p-4 flex flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3 bg-slate-950/40 p-2.5 rounded-xl border border-white/5 shrink-0">
              <div className="relative">
                <Clock className={`h-6 w-6 ${timer.isRunning ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '8s' }} />
                {timer.isRunning && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />}
              </div>
              <div>
                <span className="block text-[8px] font-semibold uppercase tracking-wider text-slate-400 font-sans">
                  {timer.type === 'study' ? '📖 Synced Study Sprint' : '☕ Synced Rest Pause'}
                </span>
                <span className="text-xl font-black font-mono text-white tracking-wider leading-none">
                  {formatTime(timer.timeLeft)}
                </span>
              </div>
            </div>

            {/* Timer Controllers */}
            <div className="flex items-center gap-1 flex-1 justify-end">
              <button
                onClick={() => sendTimerControl(timer.isRunning ? 'pause' : 'start')}
                className={`p-2 rounded-lg transition-transform hover:scale-105 border flex items-center justify-center ${
                  timer.isRunning 
                    ? 'bg-rose-500/15 border-rose-500/20 text-rose-400 hover:bg-rose-500/25' 
                    : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                }`}
                title={timer.isRunning ? "Pause Study Clock" : "Start Co-Study Clock"}
              >
                {timer.isRunning ? <Pause className="h-4 w-4 shrink-0" /> : <Play className="h-4 w-4 shrink-0" />}
              </button>

              <button
                onClick={() => sendTimerControl('reset', { timerType: 'study' })}
                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 font-sans text-xs font-bold"
                title="Reset to 25m Focus Session"
              >
                <div className="flex items-center gap-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">25m Study</span>
                </div>
              </button>

              <button
                onClick={() => sendTimerControl('reset', { timerType: 'break' })}
                className="p-2 rounded-lg bg-orange-600/10 border border-orange-500/20 hover:bg-orange-600/20 text-orange-400 font-sans text-xs font-bold"
                title="Switches to 5-minute break co-study reset"
              >
                <div className="flex items-center gap-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">5m Break</span>
                </div>
              </button>

              <button
                onClick={() => sendTimerControl('adjust', { duration: 60 })}
                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300"
                title="Add 1 Extra Minute"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => sendTimerControl('adjust', { duration: -60 })}
                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300"
                title="Deduct 1 Minute"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* MAIN CANVAS: Digital Whiteboard */}
          <div className="flex flex-col rounded-2xl border border-white/8 bg-slate-900 overflow-hidden relative shadow-md">
            
            {/* Whiteboard Controls Panel */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 border-b border-white/8 shrink-0">
              
              {/* Brush Tools */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEraser(false)}
                  className={`p-2 rounded-lg transition-colors border ${
                    !isEraser 
                      ? 'bg-blue-600 text-white border-blue-500/40 shadow-sm' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title="Drawing Pencil tool"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsEraser(true)}
                  className={`p-2 rounded-lg transition-colors border ${
                    isEraser 
                      ? 'bg-amber-600 text-white border-amber-500/40 shadow-sm' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title="Eraser tool (matches dark background)"
                >
                  <Eraser className="h-4 w-4" />
                </button>

                <div className="h-5 w-[1px] bg-white/10 mx-1" />

                {/* Color Buttons */}
                {!isEraser && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {BRUSH_COLORS.filter(bc => bc.value !== 'eraser').map(bc => {
                      const isSelected = brushColor === bc.value;
                      return (
                        <button
                          key={bc.value}
                          onClick={() => setBrushColor(bc.value)}
                          className={`w-5 h-5 rounded-full border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                            isSelected ? 'ring-2 ring-white/60 scale-110 border-white' : 'border-slate-800'
                          }`}
                          style={{ backgroundColor: bc.value }}
                          title={bc.label}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Stroke sizes and clean operations */}
              <div className="flex items-center gap-3">
                
                {/* Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-sans">Brush size</span>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-16 h-1 bg-slate-800 rounded-lg cursor-pointer accent-blue-500"
                  />
                  <span className="text-xs font-mono text-slate-300 w-4 font-bold text-center shrink-0">{brushSize}px</span>
                </div>

                <div className="h-5 w-[1px] bg-white/10" />

                {/* Clear Whiteboard */}
                <button
                  onClick={handleClearBoard}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600/10 border border-red-500/20 hover:bg-red-600/25 text-red-400 p-2 text-xs font-bold transition-all shrink-0 cursor-pointer"
                  title="Clear Whiteboard contents for all active members in room"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear Board</span>
                </button>
              </div>
            </div>

            {/* Digital Interactive Stage */}
            <div 
              ref={canvasContainerRef}
              className="relative w-full aspect-video bg-slate-900 border-none overflow-hidden"
              style={{ cursor: isEraser ? 'cell' : 'crosshair' }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleStartDrawing}
                onMouseMove={handleDraw}
                onMouseUp={handleStopDrawing}
                onMouseLeave={handleCanvasMouseLeave}
                onTouchStart={handleStartDrawing}
                onTouchMove={handleDraw}
                onTouchEnd={handleStopDrawing}
                className="absolute inset-0 w-full h-full object-contain bg-transparent block"
              />

              {/* Floating Active Classmates Bubbles (Top-right corner overlay) */}
              <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md py-1 px-2.5 rounded-full border border-white/10 shadow-lg pointer-events-auto select-none transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-0.5" />
                <span className="text-[9px] text-slate-400 font-bold mr-1 hidden sm:inline">Online:</span>
                <div className="flex -space-x-2.5 overflow-hidden">
                  {participants.map(part => {
                    const isMe = part.id === clientId;
                    return (
                      <div 
                        key={part.id} 
                        className="relative group/avatar transition-transform duration-100" 
                        title={`${part.name}${isMe ? ' (Me)' : ''}`}
                      >
                        <img 
                          src={part.avatar} 
                          alt={part.name}
                          className="w-6 h-6 rounded-full border border-slate-900 object-cover"
                          style={{ borderColor: part.color }}
                        />
                        <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 bg-slate-950/95 border border-white/10 rounded-lg text-[9px] text-white font-bold whitespace-nowrap shadow-xl pointer-events-none opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-150 z-30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: part.color }} />
                          {part.name} {isMe ? "(Me)" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cursors Overlay Frame (loops through cursors of peer classmates inside actual coordinates space) */}
              <div className="absolute inset-0 pointer-events-none w-full h-full">
                {(Object.values(peerCursors) as PeerCursor[]).map(pc => {
                  // Render peer cursor with exact percentage representation relative to 800x480 coordinate model
                  const leftPercentage = `${(pc.x / 800) * 100}%`;
                  const topPercentage = `${(pc.y / 480) * 100}%`;

                  return (
                    <div 
                      key={pc.id}
                      className="absolute transition-all duration-75 text-left flex flex-col pointer-events-none select-none z-10"
                      style={{ 
                        left: leftPercentage, 
                        top: topPercentage,
                        transform: 'translate(-2px, -2px)'
                      }}
                    >
                      {/* Stylized custom arrow cursor */}
                      <svg 
                        width="14" 
                        height="18" 
                        viewBox="0 0 14 18" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
                      >
                        <path 
                          d="M0.5 0.5V16L4.5 12L7.5 17.5L10.5 16L7.5 10.5L12 10.5L0.5 0.5Z" 
                          fill={pc.color} 
                          stroke="white" 
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>

                      {/* Display name tag of drawing classmate */}
                      <span 
                        className="text-[8px] font-bold text-slate-950 px-1 py-0.5 mt-1 rounded shadow-sm border font-mono select-none"
                        style={{ backgroundColor: pc.color, borderColor: '#ffffff' }}
                      >
                        {pc.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Offline fallback Overlay */}
              {connectionStatus === 'disconnected' && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-40 text-center">
                  <div className="w-12 h-12 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center mb-3">
                    <Trash2 className="h-6 w-6 text-red-400" />
                  </div>
                  <h4 className="text-sm font-black uppercase text-slate-100 font-sans">WebSocket Server Disconnected</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm font-sans font-normal">
                    Could not connect to the real-time node. Please refresh to start server.ts, or verify if the developer server is fully booted.
                  </p>
                  <button
                    onClick={() => connectToRoom(activeRoom.id)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 text-xs font-bold rounded-lg transition-all"
                  >
                    Reinitialize Secure Connection
                  </button>
                </div>
              )}
            </div>

            {/* Instruction tooltip */}
            <div className="bg-slate-950/40 p-2 border-t border-white/8 flex items-center justify-between text-left shrink-0 font-sans text-[10px]">
              <div className="text-slate-400">
                ✏️ Drag or touch to sketch on standard <span className="font-mono text-cyan-400 font-bold">800x480</span> aspect-locked canvas. Stroke coordinates and eraser points broadcast live!
              </div>
              <div className="text-cyan-400 font-bold hidden sm:block">
                ● Canvas Synchronized
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: INTEGRATED PUBLIC CHAT SIDEBAR (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden h-[500px] lg:h-auto items-stretch">
          
          <div className="bg-slate-950/80 p-3.5 border-b border-white/5 text-left flex items-center gap-2 shrink-0">
            <MessageSquare className="h-4 w-4 text-blue-400" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Study Session Chat</h3>
              <p className="text-[9px] text-slate-400 font-normal">Room ID: #{activeRoom.id.toUpperCase()}</p>
            </div>
          </div>

          {/* Chats Bubbles Container */}
          <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-950/20 text-left min-h-0">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-slate-500 h-full">
                <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center mb-2 border border-white/5">
                  <MessageSquare className="h-4 w-4 text-slate-600" />
                </div>
                <p className="text-xs font-bold text-slate-400">Classroom silence</p>
                <p className="text-[10px] text-slate-500 max-w-[150px] mt-0.5 leading-snug font-normal">No messages posted yet. Start drafting a message below!</p>
              </div>
            ) : (
              chatMessages.map(msg => {
                const isMe = msg.senderId === clientId;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-2 max-w-[90%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto text-left'}`}
                  >
                    <img 
                      src={msg.senderAvatar} 
                      alt={msg.senderName}
                      referrerPolicy="no-referrer"
                      className="w-6.5 h-6.5 rounded-lg border object-cover mt-0.5 shrink-0"
                      style={{ borderColor: msg.senderColor }}
                    />
                    
                    <div>
                      <div className="flex items-center gap-1.5 justify-start mb-0.5 flex-wrap">
                        <span 
                          className="text-[9px] font-bold line-clamp-1 hover:underline cursor-pointer"
                          style={{ color: msg.senderColor }}
                        >
                          {msg.senderName}
                        </span>
                        <span className="text-[8px] text-slate-500 font-mono">{msg.timestamp}</span>
                      </div>

                      <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed break-all ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                          : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form message composer */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-3 bg-slate-950/80 border-t border-white/5 flex gap-1.5 shrink-0"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Post a study question..."
              maxLength={250}
              disabled={connectionStatus !== 'connected'}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={connectionStatus !== 'connected' || !chatInput.trim()}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-550 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
