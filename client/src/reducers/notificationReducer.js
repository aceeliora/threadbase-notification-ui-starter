export const initialState = {
  notifications: [],
  unreadCount: 0,
};

export function notificationReducer(state, action) {
  switch (action.type) {

    case "ADD_NOTIFICATION":
      // TODO: prepend action.payload to notifications, slice to max 50, increment unreadCount
      return state;

    case "MARK_READ":
      // TODO: find notification by action.payload (id)
      // TODO: guard — return state unchanged if target is missing OR already read
      // TODO: map over array to set isRead: true on the matching item
      // TODO: use Math.max(0, state.unreadCount - 1) for the new count
      return state;

    case "MARK_ALL_READ":
      // TODO: set every notification's isRead to true, reset unreadCount to 0
      return state;

    case "LOAD_NOTIFICATIONS":
      // TODO: replace notifications array with action.payload
      // TODO: compute unreadCount as action.payload.filter(n => !n.isRead).length
      return state;

    default:
      return state;
  }
}
