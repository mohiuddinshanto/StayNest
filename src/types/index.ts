// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  propertyId?: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

// ============================================
// PROPERTY TYPES
// ============================================

export interface Property {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  rent: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  address: string;
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  ownerId?: string;
  ownerName: string;
  ownerImage: string;
  ownerPhone: string;
  ownerEmail: string;
  available: string;
  status: "available" | "rented" | "pending";
  featured: boolean;
  approvalStatus: "pending" | "approved" | "rejected"; // Added for approval system
  rejectionReason?: string; // Added for rejection reason
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PropertiesResponse {
  success: boolean;
  data: Property[];
  pagination: Pagination;
  message?: string;
}

export interface PropertyResponse {
  success: boolean;
  data: Property;
  message?: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  message?: string;
}

export interface PropertyFilters {
  q?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  sort?: string;
  page?: number;
  limit?: number;
  ownerId?: string;
  featured?: boolean;
  city?: string;
}

// ============================================
// INQUIRY TYPES
// ============================================

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  type: "message" | "schedule_viewing";
  message: string;
  preferredDate?: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface InquiriesResponse {
  success: boolean;
  data: Inquiry[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface OwnerAnalytics {
  totalProperties: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalRevenue: number;
  totalReviews: number;
  totalInquiries: number;
  statusStats: {
    available?: number;
    rented?: number;
    pending?: number;
    [key: string]: number | undefined;
  };
}

export interface OwnerPropertyAnalytics {
  property: Property;
  totalInquiries: number;
  unreadInquiries: number;
  totalReviews: number;
  averageRating: number;
  inquiries: Inquiry[];
  reviews: Review[];
}

export interface AdminAnalytics {
  ownerAnalytics: {
    ownerId: string;
    ownerName: string;
    ownerEmail: string;
    propertyCount: number;
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    totalRevenue: number;
    totalReviews: number;
    totalInquiries: number;
  }[];
  grandTotal: {
    platformTotalRevenue: number;
    platformTotalProperties: number;
    platformTotalApproved: number;
    platformTotalPending: number;
    platformTotalRejected: number;
    platformTotalReviews: number;
    platformTotalUsers: number;
    platformTotalOwners: number;
    platformTotalAdmins: number;
    platformTotalInquiries: number;
  };
  distributions: {
    typeDistribution: { _id: string; count: number }[];
    cityDistribution: { _id: string; count: number }[];
  };
  monthlyTrends: { month: string; count: number }[];
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminProperty {
  id: string;
  title: string;
  rent: number;
  type: string;
  city: string;
  address: string;
  images: string[];
  status: "available" | "rented" | "pending";
  ownerName: string;
  ownerEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
}

export interface AdminPropertiesResponse {
  success: boolean;
  data: AdminProperty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// ============================================
// RESPONSE TYPES (for API consistency)
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
}