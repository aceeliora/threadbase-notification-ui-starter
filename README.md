# Threadbase — Notification UI Starter

Starter repo for **LU 4.8 — In-App Notification System**.

The SSE stream is already wired. The reducer has empty stubs. Your job: implement the four reducer cases, add the badge to the bell, build the click-outside dropdown, and wire optimistic mark-as-read.

## Setup

```bash
# Terminal 1 — server
cd server && cp .env.example .env && npm install && npm start

# Terminal 2 — client
cd client && cp .env.development.example .env.development && npm install && npm run dev
```

Demo accounts (password: `password`): **Ada** (member) · **Linus** (admin)

## Files to edit

| File | What to do |
|------|------------|
| `client/src/reducers/notificationReducer.js` | Fill all four action cases |
| `client/src/components/NotificationBell.jsx` | Add badge + click-outside dropdown |
| `client/src/components/NotificationDropdown.jsx` | Create — list + mark-all button |
| `client/src/components/NotificationItem.jsx` | Create — optimistic mark-as-read |

Do **not** edit `hooks/useSSE.js`, `server/`, or any other file.

## Test your work

```bash
# Trigger a push to the logged-in user
curl -X POST http://localhost:3001/api/notifications/test \
  -H "Authorization: Bearer <token>"
```

Or use Thunder Client / Postman. Badge should increment. Dropdown should open. Click a notification — badge should drop **before** the API responds.
