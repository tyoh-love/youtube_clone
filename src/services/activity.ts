import api from './api';

export type ActivityType = 'video_watch' | 'like' | 'comment';

export interface ActivityDetails {
  videoId: string;
  action?: string;
  timestamp: string;
  additionalInfo?: any;
}

export interface Activity {
  id: string;
  userId: string;
  activityType: ActivityType;
  details: string;
  timestamp: string;
}

export interface CreateActivityData {
  activityType: ActivityType;
  details: ActivityDetails;
}

const ActivityService = {
  async logActivity(data: CreateActivityData): Promise<Activity> {
    const response = await api.post<Activity>('/activities', {
      activityType: data.activityType,
      details: JSON.stringify(data.details)
    });
    return response.data;
  },

  async getActivities(): Promise<Activity[]> {
    const response = await api.get<Activity[]>('/activities');
    return response.data;
  },

  // Utility functions for common activities
  async logVideoWatch(videoId: string, additionalInfo?: any): Promise<Activity> {
    return this.logActivity({
      activityType: 'video_watch',
      details: {
        videoId,
        action: 'watch',
        timestamp: new Date().toISOString(),
        additionalInfo
      }
    });
  },

  async logVideoLike(videoId: string, action: 'like' | 'unlike'): Promise<Activity> {
    return this.logActivity({
      activityType: 'like',
      details: {
        videoId,
        action,
        timestamp: new Date().toISOString()
      }
    });
  },

  async logComment(videoId: string, commentId: string): Promise<Activity> {
    return this.logActivity({
      activityType: 'comment',
      details: {
        videoId,
        action: 'comment',
        timestamp: new Date().toISOString(),
        additionalInfo: { commentId }
      }
    });
  }
};

export default ActivityService;
