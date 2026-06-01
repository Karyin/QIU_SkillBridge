import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor?: { x: number; y: number } | null;
}

interface RoomState {
  roomId: string;
  drawHistory: any[];
  chatHistory: any[];
  participants: Map<WebSocket, Participant>;
  timer: {
    duration: number;
    timeLeft: number;
    isRunning: boolean;
    type: 'study' | 'break';
  };
  timerInterval?: NodeJS.Timeout;
}

const rooms = new Map<string, RoomState>();

function getOrCreateRoom(roomId: string): RoomState {
  const existing = rooms.get(roomId);
  if (existing) return existing;

  const newRoom: RoomState = {
    roomId,
    drawHistory: [],
    chatHistory: [],
    participants: new Map(),
    timer: {
      duration: 25 * 60,
      timeLeft: 25 * 60,
      isRunning: false,
      type: 'study'
    }
  };

  rooms.set(roomId, newRoom);
  return newRoom;
}

// Color palettes for cursors and names
const PEER_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f43f5e'
];

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Middleware to parse body JSON to support possible future server APIs
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", activeRooms: rooms.size });
  });

  // Attach WebSocket server on the same HTTP server
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  // Broadcast function helpers
  const broadcastToRoom = (room: RoomState, payload: any, excludeWs?: WebSocket) => {
    const rawPayload = JSON.stringify(payload);
    room.participants.forEach((_, ws) => {
      if (ws === excludeWs) return;
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(rawPayload);
      }
    });
  };

  // Synchronize timer ticks inside active rooms
  const startRoomTimer = (room: RoomState) => {
    if (room.timerInterval) return;
    
    room.timerInterval = setInterval(() => {
      if (!room.timer.isRunning) {
        clearInterval(room.timerInterval);
        room.timerInterval = undefined;
        return;
      }

      if (room.timer.timeLeft > 0) {
        room.timer.timeLeft--;
        // Broadcast periodic ticks (every 1 second or throttled. Let's broadcast every tick)
        broadcastToRoom(room, {
          type: 'timer_update',
          timer: room.timer
        });
      } else {
        // Timer reached 0! Swap sessions
        const isBreak = room.timer.type === 'study';
        room.timer.type = isBreak ? 'break' : 'study';
        room.timer.duration = isBreak ? 5 * 60 : 25 * 60;
        room.timer.timeLeft = room.timer.duration;
        
        // Auto pause on completion
        room.timer.isRunning = false;
        clearInterval(room.timerInterval);
        room.timerInterval = undefined;

        // Broadcast session completion & state change
        broadcastToRoom(room, {
          type: 'timer_finished',
          timer: room.timer
        });
      }
    }, 1000);
  };

  wss.on('connection', (ws) => {
    let currentRoomId: string | null = null;
    let clientId: string | null = null;

    ws.on('message', (messageData) => {
      try {
        const message = JSON.parse(messageData.toString());

        switch (message.type) {
          case 'join': {
            const { roomId, name, avatar } = message;
            currentRoomId = roomId;
            clientId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

            const room = getOrCreateRoom(roomId);
            
            // Randomly assign a unique distinct color
            const color = PEER_COLORS[room.participants.size % PEER_COLORS.length];

            const participant: Participant = {
              id: clientId,
              name,
              avatar,
              color,
              cursor: null
            };

            room.participants.set(ws, participant);

            // 1. Acknowledge server-side join and feed historical logs & state
            ws.send(JSON.stringify({
              type: 'join_success',
              clientId: clientId,
              color: color,
              drawHistory: room.drawHistory,
              chatHistory: room.chatHistory,
              timer: room.timer,
              participants: Array.from(room.participants.values())
            }));

            // 2. Alert classmates in room of new join
            broadcastToRoom(room, {
              type: 'presence',
              participants: Array.from(room.participants.values())
            }, ws);

            break;
          }

          case 'draw': {
            if (!currentRoomId) return;
            const room = rooms.get(currentRoomId);
            if (!room) return;

            // Track state locally to rebuild board for late-joiners
            room.drawHistory.push(message.stroke);
            if (room.drawHistory.length > 5000) {
              room.drawHistory.shift(); // Keep size bounded
            }

            // Real-time propagation to other students
            broadcastToRoom(room, {
              type: 'draw',
              stroke: message.stroke
            }, ws);
            break;
          }

          case 'clear': {
            if (!currentRoomId) return;
            const room = rooms.get(currentRoomId);
            if (!room) return;

            room.drawHistory = [];
            broadcastToRoom(room, {
              type: 'clear'
            });
            break;
          }

          case 'cursor': {
            if (!currentRoomId) return;
            const room = rooms.get(currentRoomId);
            if (!room) return;

            const participant = room.participants.get(ws);
            if (participant) {
              participant.cursor = message.cursor;
              // Broadcast cursors quickly, skip original client for minimal latency
              broadcastToRoom(room, {
                type: 'cursor_update',
                userId: participant.id,
                name: participant.name,
                color: participant.color,
                cursor: message.cursor
              }, ws);
            }
            break;
          }

          case 'chat': {
            if (!currentRoomId) return;
            const room = rooms.get(currentRoomId);
            if (!room) return;

            const participant = room.participants.get(ws);
            if (participant) {
              const { receiverId, receiverName } = message;
              const chatItem = {
                id: `msg-${Date.now()}-${Math.random().toString(36).substr(2,4)}`,
                senderId: participant.id,
                senderName: participant.name,
                senderAvatar: participant.avatar,
                senderColor: participant.color,
                message: message.message,
                receiverId: receiverId || null,
                receiverName: receiverName || null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };

              if (receiverId) {
                // Find receiver socket
                let receiverWs: any = null;
                for (const [pWs, p] of room.participants.entries()) {
                  if (p.id === receiverId) {
                    receiverWs = pWs;
                    break;
                  }
                }
                const responsePayload = JSON.stringify({
                  type: 'chat',
                  message: chatItem
                });
                
                // Send to sender
                if (ws.readyState === 1) { // WebSocket.OPEN is 1
                  ws.send(responsePayload);
                }
                // Send to receiver
                if (receiverWs && receiverWs !== ws && receiverWs.readyState === 1) {
                  receiverWs.send(responsePayload);
                }
              } else {
                // Public chat
                room.chatHistory.push(chatItem);
                if (room.chatHistory.length > 150) {
                  room.chatHistory.shift();
                }

                broadcastToRoom(room, {
                  type: 'chat',
                  message: chatItem
                });
              }
            }
            break;
          }

          case 'timer_control': {
            if (!currentRoomId) return;
            const room = rooms.get(currentRoomId);
            if (!room) return;

            const { action, duration, timerType } = message;

            if (action === 'start') {
              room.timer.isRunning = true;
              startRoomTimer(room);
            } else if (action === 'pause') {
              room.timer.isRunning = false;
            } else if (action === 'reset') {
              room.timer.isRunning = false;
              room.timer.type = timerType || 'study';
              room.timer.duration = (timerType === 'break' ? 5 : 25) * 60;
              room.timer.timeLeft = room.timer.duration;
            } else if (action === 'adjust') {
              room.timer.timeLeft = Math.max(0, room.timer.timeLeft + duration);
            }

            broadcastToRoom(room, {
              type: 'timer_update',
              timer: room.timer
            });
            break;
          }
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    });

    ws.on('close', () => {
      if (currentRoomId) {
        const room = rooms.get(currentRoomId);
        if (room) {
          const departingUser = room.participants.get(ws);
          room.participants.delete(ws);

          if (room.participants.size === 0) {
            // Room is empty, clear interval to preserve system resources
            if (room.timerInterval) {
              clearInterval(room.timerInterval);
              room.timerInterval = undefined;
            }
            // Keep room in memory so that drawings and chats are persistent upon return
            // rooms.delete(currentRoomId);
          } else {
            // Notify remaining classmates
            broadcastToRoom(room, {
              type: 'presence',
              participants: Array.from(room.participants.values())
            });
            if (departingUser) {
              broadcastToRoom(room, {
                type: 'user_left',
                userId: departingUser.id,
                name: departingUser.name
              });
            }
          }
        }
      }
    });
  });

  // Mount Vite development server with hot-reload or serve static react files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[QIU SkillBridge Server] Live at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("CRITICAL error bootstrapping our server:", error);
});
