  /**
 * Format message time for display in chat
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time string
 */
export const formatMessageTime = (date) => {
  const messageDate = new Date(date);
  const now = new Date();
  
  // If message is from today, show just time
  if (isSameDay(messageDate, now)) {
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  }
  
  // If message is from yesterday, show "Yesterday"
  if (isYesterday(messageDate)) {
    return 'Yesterday';
  }
  
  // If message is from this week, show day name
  if (isThisWeek(messageDate)) {
    return messageDate.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise show short date
  return messageDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format message date for display as a separator in chat
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatMessageDate = (date) => {
  const messageDate = new Date(date);
  const now = new Date();
  
  if (isSameDay(messageDate, now)) {
    return 'Today';
  }
  
  if (isYesterday(messageDate)) {
    return 'Yesterday';
  }
  
  if (isThisWeek(messageDate)) {
    return messageDate.toLocaleDateString([], { weekday: 'long' });
  }
  
  return messageDate.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: isSameYear(messageDate, now) ? undefined : 'numeric'
  });
};

// Helper functions
const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

const isThisWeek = (date) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  return date >= startOfWeek;
};

const isSameYear = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear();
};

/**
 * Format a date as relative time (e.g., "2 minutes ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
};

/**
 * Format a date for display in a consistent format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatStandardDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};