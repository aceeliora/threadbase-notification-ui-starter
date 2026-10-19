import { useNotifications } from "../context/NotificationContext.jsx";

// TODO Task 2: Add unread badge
// TODO Task 3: Add click-outside dropdown
//
// Steps:
// 1. Read `unreadCount` from useNotifications().state
// 2. Add a useState for `open` (boolean)
// 3. Add a useRef on the outer container div
// 4. Render the badge ONLY when unreadCount > 0 (conditional render, not CSS hide)
//    Cap at 99+: {unreadCount > 99 ? "99+" : unreadCount}
//    Add aria-label to the button: `Notifications, ${unreadCount} unread`
// 5. Add useEffect that runs when `open` is true:
//    - add document mousedown listener
//    - close when !containerRef.current.contains(e.target)
//    - return cleanup: remove the listener
// 6. When open, render <NotificationDropdown onClose={() => setOpen(false)} />

export default function NotificationBell() {
  // TODO: implement badge and click-outside dropdown
  return (
    <div style={{ position: "relative" }}>
      <button
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.3rem", color: "#fff" }}
        aria-label="Notifications"
      >
        🔔
      </button>
      {/* badge goes here */}
      {/* dropdown goes here */}
    </div>
  );
}
