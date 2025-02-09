import { writable } from 'svelte/store';
import { getAllUnread } from '$lib/api/request';
import { parseUnreadData } from '$lib/utils/parseNotificationData';

export interface NotificationState {
    unreadNotices: number;
    unreadIssues: number;
    unreadTelegrams: number;
    unreadRMB: number;
    unreadWA: number;
    unreadNews: number;
    rmbRegion?: string;
    lastFetched: number;
    total: number;
}

export const notifications = writable<NotificationState>({
    unreadNotices: 0,
    unreadIssues: 0,
    unreadTelegrams: 0,
    unreadRMB: 0,
    unreadWA: 0,
    unreadNews: 0,
    lastFetched: 0,
    total: 0
});

const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function fetchNotificationCounts() {
    try {
        const unreadXml = await getAllUnread();
        const unreadData = parseUnreadData(unreadXml);

        notifications.update(state => ({
            ...state,
            unreadNotices: unreadData.notices,
            unreadIssues: unreadData.issues,
            unreadTelegrams: unreadData.telegrams,
            unreadRMB: unreadData.rmb,
            unreadWA: unreadData.wa,
            unreadNews: unreadData.news,
            rmbRegion: unreadData.region,
            lastFetched: Date.now(),
            total: (unreadData.notices + unreadData.issues + unreadData.telegrams + unreadData.rmb + unreadData.wa + unreadData.news)
            
        }));
    } catch (error) {
        console.error('Failed to fetch notification counts:', error);
    }
}

export function initializeNotificationPolling() {
  // Initial fetch
  fetchNotificationCounts();

  // Set up polling interval
  const interval = setInterval(() => {
    fetchNotificationCounts();
  }, FETCH_INTERVAL);

  // Cleanup on app shutdown
  return () => clearInterval(interval);
}

// Add function to manually trigger update
export function refreshNotifications() {
  return fetchNotificationCounts();
}