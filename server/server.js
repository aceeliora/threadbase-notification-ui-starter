import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "threadbase_secret";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ─── In-memory store ────────────────────────────────────────────────────────
const users = [
  { userId: 1, username: "ada",   password: "password", role: "member" },
  { userId: 2, username: "linus", password: "password", role: "admin"  },
];

// notifications[userId] = array of notification objects
const notifications = {
  1: [
    { id: "n-seed-1", userId: 1, message: "Welcome to Threadbase, Ada!", isRead: false, createdAt: new Date(Date.now() - 60000).toISOString() },
    { id: "n-seed-2", userId: 1, message: "Linus replied to your thread.", isRead: true,  createdAt: new Date(Date.now() - 30000).toISOString() },
  ],
  2: [
    { id: "n-seed-3", userId: 2, message: "Welcome, Linus. You have admin access.", isRead: false, createdAt: new Date(Date.now() - 45000).toISOString() },
  ],
};

// active SSE connections: userId → res
const clients = new Map();

// ─── Auth middleware ─────────────────────────────────────────────────────────
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ─── Helper: push a notification to a connected client ───────────────────────
function notifyUser(userId, payload) {
  const client = clients.get(userId);
  if (!client) return;
  client.write(`data: ${JSON.stringify(payload)}\n\n`);
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Login
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { userId: user.userId, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
  res.json({ token, user: { userId: user.userId, username: user.username, role: user.role } });
});

// SSE stream
app.get("/api/notifications/stream", verifyToken, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const { userId } = req.user;
  clients.set(userId, res);

  // heartbeat every 25s to keep the connection alive through proxies
  const heartbeat = setInterval(() => res.write(": ping\n\n"), 25000);

  req.on("close", () => {
    clients.delete(userId);
    clearInterval(heartbeat);
  });
});

// Fetch notification history
app.get("/api/notifications", verifyToken, (req, res) => {
  const { userId } = req.user;
  res.json(notifications[userId] || []);
});

// Mark one notification as read
app.patch("/api/notifications/:id/read", verifyToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const list = notifications[userId] || [];
  const item = list.find(n => n.id === id);
  if (!item) return res.status(404).json({ error: "Notification not found" });
  item.isRead = true;
  res.json({ ok: true, notification: item });
});

// Test route — push a dummy notification to the calling user
app.post("/api/notifications/test", verifyToken, (req, res) => {
  const { userId, username } = req.user;
  const notification = {
    id:        `n-${Date.now()}`,
    userId,
    message:   `Test notification for ${username} at ${new Date().toLocaleTimeString()}`,
    isRead:    false,
    createdAt: new Date().toISOString(),
  };
  if (!notifications[userId]) notifications[userId] = [];
  notifications[userId].unshift(notification);
  notifyUser(userId, notification);
  res.json({ ok: true, notification });
});

app.listen(PORT, () => console.log(`Threadbase server running on http://localhost:${PORT}`));
