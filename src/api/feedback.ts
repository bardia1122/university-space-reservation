import { USE_MOCK, delay, apiClient } from './client';
import { db } from '../mock/data';
import type {
  Feedback,
  FeedbackCreate,
  Rating,
  RatingCreate,
  Complaint,
  ComplaintCreate,
  Suggestion,
  SuggestionCreate,
} from '../types';

export const feedbackApi = {
  createFeedback: async (data: FeedbackCreate, userId: number): Promise<Feedback> => {
    if (USE_MOCK) {
      await delay();
      return db.feedbacks.create({ ...data, user_id: userId }) as Feedback;
    }
    const res = await apiClient.post<Feedback>('/feedbacks', data);
    return res.data;
  },

  getSpaceFeedbacks: async (spaceId: number): Promise<Feedback[]> => {
    if (USE_MOCK) {
      await delay();
      return db.feedbacks.getBySpace(spaceId);
    }
    const res = await apiClient.get<Feedback[]>(`/feedbacks/space/${spaceId}`);
    return res.data;
  },

  createRating: async (data: RatingCreate, userId: number): Promise<Rating> => {
    if (USE_MOCK) {
      await delay();
      return db.ratings.create({ ...data, user_id: userId }) as Rating;
    }
    const res = await apiClient.post<Rating>('/ratings', data);
    return res.data;
  },

  getSpaceRatings: async (spaceId: number): Promise<Rating[]> => {
    if (USE_MOCK) {
      await delay();
      return db.ratings.getBySpace(spaceId);
    }
    const res = await apiClient.get<Rating[]>(`/ratings/space/${spaceId}`);
    return res.data;
  },

  createComplaint: async (data: ComplaintCreate, userId: number): Promise<Complaint> => {
    if (USE_MOCK) {
      await delay();
      return db.complaints.create({ ...data, user_id: userId }) as Complaint;
    }
    const res = await apiClient.post<Complaint>('/complaints', data);
    return res.data;
  },

  getMyComplaints: async (userId: number): Promise<Complaint[]> => {
    if (USE_MOCK) {
      await delay();
      return db.complaints.getByUser(userId);
    }
    const res = await apiClient.get<Complaint[]>('/complaints/my');
    return res.data;
  },

  getAllComplaints: async (status?: string): Promise<Complaint[]> => {
    if (USE_MOCK) {
      await delay();
      return db.complaints.getAll(status);
    }
    const res = await apiClient.get<Complaint[]>('/complaints', { params: { status } });
    return res.data;
  },

  respondComplaint: async (
    id: number,
    adminResponse: string,
    status: string,
  ): Promise<Complaint> => {
    if (USE_MOCK) {
      await delay();
      const c = db.complaints.respond(id, adminResponse, status);
      if (!c) throw new Error('شکایت یافت نشد');
      return c;
    }
    const res = await apiClient.post<Complaint>(`/complaints/${id}/respond`, {
      admin_response: adminResponse,
      status,
    });
    return res.data;
  },

  createSuggestion: async (data: SuggestionCreate, userId: number): Promise<Suggestion> => {
    if (USE_MOCK) {
      await delay();
      return db.suggestions.create({ ...data, user_id: userId }) as Suggestion;
    }
    const res = await apiClient.post<Suggestion>('/suggestions', data);
    return res.data;
  },

  getSuggestions: async (status?: string): Promise<Suggestion[]> => {
    if (USE_MOCK) {
      await delay();
      return db.suggestions.getAll(status);
    }
    const res = await apiClient.get<Suggestion[]>('/suggestions', { params: { status } });
    return res.data;
  },

  upvoteSuggestion: async (id: number): Promise<Suggestion> => {
    if (USE_MOCK) {
      await delay(200);
      const s = db.suggestions.upvote(id);
      if (!s) throw new Error('پیشنهاد یافت نشد');
      return s;
    }
    const res = await apiClient.post<Suggestion>(`/suggestions/${id}/upvote`);
    return res.data;
  },
};
