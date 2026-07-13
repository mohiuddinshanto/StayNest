import type {
  Property,
  PropertyFilters,
  PropertiesResponse,
  PropertyResponse,
  ReviewsResponse,
  Review,
  Inquiry,
  InquiriesResponse,
  OwnerAnalytics,
  OwnerPropertyAnalytics,
  AdminAnalytics,
  AdminUser,
  AdminPropertiesResponse,
} from "@/types";

// Route through Next.js proxy so session cookies are forwarded as Bearer tokens
const API_URL = "/api/backend";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

// ============================================
// PROPERTY FUNCTIONS
// ============================================

export async function fetchProperties(
  filters: PropertyFilters = {}
): Promise<PropertiesResponse> {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.type) params.set("type", filters.type);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.beds) params.set("beds", filters.beds);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.ownerId) params.set("ownerId", filters.ownerId);
  if (filters.featured) params.set("featured", "true");
  if (filters.city) params.set("city", filters.city);

  const query = params.toString();
  const res = await fetch(`${API_URL}/properties${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  return handleResponse<PropertiesResponse>(res);
}

export async function fetchPropertyById(id: string): Promise<Property> {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    credentials: "include",
  });
  const data = await handleResponse<PropertyResponse>(res);
  return data.data;
}

export async function createProperty(
  property: Omit<Property, "id" | "rating" | "reviewCount" | "reviews" | "createdAt" | "approvalStatus" | "rejectionReason"> & {
    ownerId: string;
  }
): Promise<Property> {
  const res = await fetch(`${API_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(property),
    credentials: "include",
  });
  const data = await handleResponse<PropertyResponse>(res);
  return data.data;
}

export async function deleteProperty(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse(res);
}

export async function updateProperty(
  id: string,
  updates: Partial<
    Omit<Property, "id" | "rating" | "reviewCount" | "reviews" | "createdAt" | "ownerId" | "ownerName" | "ownerImage" | "ownerEmail" | "approvalStatus" | "rejectionReason">
  >
): Promise<Property> {
  const res = await fetch(`${API_URL}/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
    credentials: "include",
  });
  const data = await handleResponse<PropertyResponse>(res);
  return data.data;
}

export async function fetchMyProperties(): Promise<Property[]> {
  const res = await fetch(`${API_URL}/my-properties`, {
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: Property[] }>(res);
  return data.data;
}
export async function fetchMyRentals(): Promise<Property[]> {
  const res = await fetch(`${API_URL}/my-rentals`, {
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: Property[] }>(res);
  return data.data;
}

export async function rentProperty(id: string): Promise<Property> {
  const res = await fetch(`${API_URL}/properties/${id}/rent`, {
    method: "POST",
    credentials: "include",
  });
  const data = await handleResponse<PropertyResponse>(res);
  return data.data;
}

// ============================================
// REVIEW FUNCTIONS
// ============================================

export async function fetchReviews(propertyId: string): Promise<Review[]> {
  const res = await fetch(`${API_URL}/reviews/${propertyId}`, {
    credentials: "include",
  });
  const data = await handleResponse<ReviewsResponse>(res);
  return data.data;
}

export async function createReview(review: {
  propertyId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: Review }>(res);
  return data.data;
}

// ============================================
// USER/OWNER ACTIONS
// ============================================

export async function becomeOwner(): Promise<{ success: boolean; role: string }> {
  const res = await fetch(`${API_URL}/users/me/become-owner`, {
    method: "PATCH",
    credentials: "include",
  });
  return handleResponse<{ success: boolean; role: string }>(res);
}

// ============================================
// INQUIRY FUNCTIONS
// ============================================

export async function createInquiry(inquiryData: {
  propertyId: string;
  type: "message" | "schedule_viewing";
  message: string;
  preferredDate?: string;
}): Promise<Inquiry> {
  const res = await fetch(`${API_URL}/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inquiryData),
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: Inquiry }>(res);
  return data.data;
}

export async function fetchReceivedInquiries(
  status?: "unread" | "read",
  page?: number,
  limit?: number
): Promise<InquiriesResponse> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));

  const query = params.toString();
  const res = await fetch(
    `${API_URL}/inquiries/received${query ? `?${query}` : ""}`,
    { credentials: "include" }
  );
  return handleResponse<InquiriesResponse>(res);
}

export async function fetchSentInquiries(
  page?: number,
  limit?: number
): Promise<InquiriesResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));

  const query = params.toString();
  const res = await fetch(
    `${API_URL}/inquiries/sent${query ? `?${query}` : ""}`,
    { credentials: "include" }
  );
  return handleResponse<InquiriesResponse>(res);
}

export async function fetchInquiryById(id: string): Promise<Inquiry> {
  const res = await fetch(`${API_URL}/inquiries/${id}`, {
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: Inquiry }>(res);
  return data.data;
}

export async function markInquiryAsRead(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_URL}/inquiries/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string }>(res);
}

export async function deleteInquiry(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_URL}/inquiries/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string }>(res);
}

export async function fetchPropertyInquiries(propertyId: string): Promise<Inquiry[]> {
  const res = await fetch(`${API_URL}/inquiries/property/${propertyId}`, {
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: Inquiry[] }>(res);
  return data.data;
}

export async function fetchUnreadInquiryCount(): Promise<{ success: boolean; unreadCount: number }> {
  const res = await fetch(`${API_URL}/inquiries/unread/count`, {
    credentials: "include",
  });
  return handleResponse<{ success: boolean; unreadCount: number }>(res);
}

// ============================================
// ANALYTICS FUNCTIONS
// ============================================

export async function fetchOwnerAnalytics(): Promise<OwnerAnalytics> {
  const res = await fetch(`${API_URL}/owner/analytics`, {
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: OwnerAnalytics }>(res);
  return data.data;
}

export async function fetchPropertyAnalytics(propertyId: string): Promise<OwnerPropertyAnalytics> {
  const res = await fetch(`${API_URL}/owner/analytics/${propertyId}`, {
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: OwnerPropertyAnalytics }>(res);
  return data.data;
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const res = await fetch(`${API_URL}/admin/analytics`, {
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: AdminAnalytics }>(res);
  return data.data;
}

// ============================================
// ADMIN FUNCTIONS
// ============================================

export async function fetchPendingProperties(
  page?: number,
  limit?: number
): Promise<AdminPropertiesResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));

  const query = params.toString();
  const res = await fetch(
    `${API_URL}/admin/properties/pending${query ? `?${query}` : ""}`,
    { credentials: "include" }
  );
  return handleResponse<AdminPropertiesResponse>(res);
}

export async function fetchAllPropertiesAdmin(
  status?: "pending" | "approved" | "rejected",
  page?: number,
  limit?: number
): Promise<AdminPropertiesResponse> {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));

  const query = params.toString();
  const res = await fetch(
    `${API_URL}/admin/properties/all${query ? `?${query}` : ""}`,
    { credentials: "include" }
  );
  return handleResponse<AdminPropertiesResponse>(res);
}

export async function updatePropertyApprovalStatus(
  id: string,
  approvalStatus: "pending" | "approved" | "rejected",
  rejectionReason?: string
): Promise<Property> {
  const res = await fetch(`${API_URL}/admin/properties/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approvalStatus, rejectionReason }),
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; message: string; data: Property }>(res);
  return data.data;
}

export async function deletePropertyAdmin(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_URL}/admin/properties/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<{ success: boolean; message: string }>(res);
}

export async function fetchAllUsers(): Promise<AdminUser[]> {
  const res = await fetch(`${API_URL}/admin/users`, {
    credentials: "include",
  });
  const data = await handleResponse<{ success: boolean; data: AdminUser[] }>(res);
  return data.data;
}
