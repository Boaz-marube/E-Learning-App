import { NotificationType, RelatedType, TestimonialRole } from './common';

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedId?: string;
  relatedType?: RelatedType;
  createdAt: Date;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: TestimonialRole;
  message: string;
  rating: number;
  avatar?: string;
  courseTitle?: string;
  isActive: boolean;
  createdAt: Date;
}