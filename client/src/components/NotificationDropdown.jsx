import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

const panelStyle = {
  position: "absolute",
  top: "calc(100% + 10px)",
  right: 0,
  zIndex: 50,
  width: "min(360px, calc(100vw - 2rem))",
  overflow: "hidden",
  color: "#0f172a",
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  boxShadow: "0 18px 48px rgba(15, 23, 42, 0.2)",
};

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const notifications = state?.notifications ?? [];

  return (
    <section
      role="dialog"
      aria-label="Notifications"
      style={panelStyle}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 16px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Notifications</h2>
          <p style={{ margin: "3px 0 0", color: "#64748b", fontSize: 12 }}>
            {state?.unreadCount ?? 0} unread
          </p>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "MARK_ALL_READ" })}
          disabled={!notifications.some((notification) => !notification.isRead)}
          style={{
            padding: "6px 8px",
            color: "#4f46e5",
            background: "transparent",
            border: 0,
            borderRadius: 6,
            cursor: notifications.some((notification) => !notification.isRead)
              ? "pointer"
              : "default",
            fontSize: 12,
            fontWeight: 600,
            opacity: notifications.some((notification) => !notification.isRead)
              ? 1
              : 0.5,
            whiteSpace: "nowrap",
          }}
        >
          Mark all as read
        </button>
      </header>

      {notifications.length > 0 ? (
        <ul
          style={{
            maxHeight: 380,
            margin: 0,
            padding: 0,
            overflowY: "auto",
            listStyle: "none",
          }}
        >
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
            />
          ))}
        </ul>
      ) : (
        <p
          style={{
            margin: 0,
            padding: "28px 16px",
            color: "#64748b",
            textAlign: "center",
            fontSize: 13,
          }}
        >
          You’re all caught up.
        </p>
      )}
    </section>
  );
}
