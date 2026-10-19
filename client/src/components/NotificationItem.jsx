import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

function formatNotificationDate(notification) {
  const value = notification.createdAt ?? notification.timestamp;
  if (!value) return "Just now";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Just now" : date.toLocaleString();
}

export default function NotificationItem({ notification, onClose }) {
  const { dispatch } = useNotifications();

  const { mutate: markRead, isPending } = useMutation({
    mutationFn: (id) =>
      apiClient.patch(`/api/notifications/${encodeURIComponent(id)}/read`),
    onMutate: (id) => {
      dispatch({ type: "MARK_READ", payload: id });
    },
    onError: async (error) => {
      try {
        const response = await apiClient.get("/api/notifications");
        dispatch({ type: "LOAD_NOTIFICATIONS", payload: response.data });
      } catch (rollbackError) {
        console.error(
          "[NotificationItem] Could not reload notifications after mark-read failed:",
          rollbackError,
        );
      }
      console.error("[NotificationItem] Mark-read request failed:", error);
    },
  });

  function handleClick() {
    if (!notification.isRead && !isPending) {
      markRead(notification.id);
    }
    onClose?.();
  }

  const isUnread = !notification.isRead;

  return (
    <li style={{ borderBottom: "1px solid #f1f5f9" }}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${isUnread ? "Unread: " : "Read: "}${notification.message}`}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-start",
          gap: 11,
          padding: "13px 16px",
          color: "inherit",
          background: isUnread ? "#eff6ff" : "#fff",
          border: 0,
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            flex: "0 0 8px",
            width: 8,
            height: 8,
            marginTop: 5,
            borderRadius: "50%",
            background: isUnread ? "#4f46e5" : "transparent",
          }}
        />
        <span style={{ display: "block", minWidth: 0, flex: 1 }}>
          <span
            style={{
              display: "block",
              color: "#1e293b",
              fontSize: 13,
              fontWeight: isUnread ? 600 : 400,
              lineHeight: 1.45,
              overflowWrap: "anywhere",
            }}
          >
            {notification.message}
          </span>
          <time
            dateTime={notification.createdAt ?? notification.timestamp}
            style={{ display: "block", marginTop: 5, color: "#64748b", fontSize: 11 }}
          >
            {formatNotificationDate(notification)}
          </time>
        </span>
      </button>
    </li>
  );
}
