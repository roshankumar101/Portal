import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

/**
 * Service for bulk notification actions
 * Handles operations that require server-side processing for safety
 */

// Cloud Function reference
const markAllNotificationsReadFn = httpsCallable(functions, 'markAllNotificationsRead');

/**
 * Mark all unread notifications as read for the current user
 * Processes notifications in batches on the server for safety
 * @returns {Promise<Object>} Result with count of updated notifications
 */
export async function markAllAsReadForCurrentUser() {
  try {
    console.log('🔄 Marking all notifications as read for current user...');
    
    const result = await markAllNotificationsReadFn();
    
    console.log('✅ Notifications marked as read:', result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error marking notifications as read:', error);
    throw new Error(`Failed to mark notifications as read: ${error.message}`);
  }
}

/**
 * Get count of unread notifications for current user
 * This is a client-side helper that can be used for UI updates
 * @param {Array} notifications - Array of notification objects
 * @returns {number} Count of unread notifications
 */
export function getUnreadCount(notifications = []) {
  return notifications.filter(notification => !notification.isRead).length;
}

/**
 * Check if user has any unread notifications
 * @param {Array} notifications - Array of notification objects
 * @returns {boolean} True if user has unread notifications
 */
export function hasUnreadNotifications(notifications = []) {
  return notifications.some(notification => !notification.isRead);
}
