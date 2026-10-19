import { useAuth } from "../auth/AuthContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function HomePage() {
  const { user } = useAuth();
  const { state } = useNotifications();

  return (
    <div>
      <h2 style={{ marginBottom: "0.5rem" }}>Welcome, {user?.username}!</h2>
      <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
        You have <strong>{state.unreadCount}</strong> unread notification{state.unreadCount !== 1 ? "s" : ""}.
      </p>
      <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", border: "1px solid #e2e8f0" }}>
        <h3 style={{ marginBottom: "0.75rem", fontSize: "0.95rem", color: "#475569" }}>How to test</h3>
        <ol style={{ fontSize: "0.85rem", lineHeight: 1.8, paddingLeft: "1.25rem", color: "#64748b" }}>
          <li>Open DevTools → Network → filter to <code>stream</code>. The SSE connection should show as <strong>pending</strong>.</li>
          <li>In Thunder Client or curl, call <code>POST /api/notifications/test</code> with your Bearer token.</li>
          <li>The bell badge should increment. The EventStream panel should show the new frame.</li>
          <li>Click the bell to open the dropdown (once you build it).</li>
          <li>Click a notification — badge should drop immediately (optimistic update).</li>
        </ol>
      </div>
    </div>
  );
}
