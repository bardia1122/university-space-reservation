export type UserRole = 'student' | 'organization' | 'admin' | 'super_admin';

export interface User {
  id: number;
  full_name: string;
  email: string;
  student_id?: string;
  phone?: string;
  department?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export type SpaceType =
  | 'football_field'
  | 'futsal_field'
  | 'cultural_plaza'
  | 'seminar_hall'
  | 'conference_hall'
  | 'exhibition_booth'
  | 'festival_booth';

export type SpaceStatus = 'active' | 'maintenance' | 'inactive';

export interface Space {
  id: number;
  name: string;
  name_en?: string;
  space_type: SpaceType;
  description?: string;
  capacity?: number;
  location?: string;
  floor?: string;
  building?: string;
  status: SpaceStatus;
  amenities?: string[];
  rules?: string;
  image_url?: string;
  avg_rating: number;
  total_ratings: number;
  requires_admin_approval: boolean;
  advance_booking_days: number;
  min_advance_hours: number;
  created_at: string;
}

export type ReservationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'expired';

export type ActivityType =
  | 'sports'
  | 'cultural'
  | 'educational'
  | 'conference'
  | 'exhibition'
  | 'festival'
  | 'other';

export interface Reservation {
  id: number;
  user_id: number;
  space_id: number;
  reservation_date: string;
  start_time: string;
  end_time: string;
  activity_type: ActivityType;
  activity_title: string;
  activity_description?: string;
  expected_attendees?: number;
  organization_name?: string;
  status: ReservationStatus;
  admin_note?: string;
  created_at: string;
  user?: User;
  space?: Space;
}

export interface Feedback {
  id: number;
  space_id: number;
  reservation_id?: number;
  content: string;
  is_anonymous: boolean;
  sentiment?: string;
  sentiment_score?: number;
  keywords?: string;
  ai_summary?: string;
  is_analyzed: boolean;
  created_at: string;
  user?: User;
}

export interface Rating {
  id: number;
  space_id: number;
  reservation_id?: number;
  overall_score: number;
  cleanliness_score?: number;
  equipment_score?: number;
  management_score?: number;
  comment?: string;
  sentiment?: string;
  ai_summary?: string;
  created_at: string;
  user?: User;
}

export interface Complaint {
  id: number;
  space_id?: number;
  reservation_id?: number;
  category: string;
  title: string;
  description: string;
  is_anonymous: boolean;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: number;
  admin_response?: string;
  responded_at?: string;
  sentiment?: string;
  ai_analysis?: string;
  created_at: string;
  user?: User;
}

export interface Suggestion {
  id: number;
  title: string;
  description: string;
  category?: string;
  upvotes: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  ai_priority_score?: number;
  ai_summary?: string;
  created_at: string;
  user?: User;
}

export interface DashboardStats {
  total_reservations: number;
  pending_reservations: number;
  approved_reservations: number;
  total_users: number;
  total_spaces: number;
  open_complaints: number;
  avg_rating: number;
}

export interface SpaceUsageStats {
  space_id: number;
  space_name: string;
  total_reservations: number;
  approved_count: number;
  rejected_count: number;
  avg_rating: number;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface ReservationCreate {
  space_id: number;
  reservation_date: string;
  start_time: string;
  end_time: string;
  activity_type: ActivityType;
  activity_title: string;
  activity_description?: string;
  expected_attendees?: number;
  organization_name?: string;
}

export interface FeedbackCreate {
  space_id: number;
  reservation_id?: number;
  content: string;
  is_anonymous: boolean;
}

export interface RatingCreate {
  space_id: number;
  reservation_id?: number;
  overall_score: number;
  cleanliness_score?: number;
  equipment_score?: number;
  management_score?: number;
  comment?: string;
}

export interface ComplaintCreate {
  space_id?: number;
  reservation_id?: number;
  category: string;
  title: string;
  description: string;
  is_anonymous: boolean;
}

export interface SuggestionCreate {
  title: string;
  description: string;
  category?: string;
}
