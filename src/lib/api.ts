import type {
  Property,
  PropertyFilters,
  PropertiesResponse,
  PropertyResponse,
  ReviewsResponse,
  Review,
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
  property: Omit<Property, "id" | "rating" | "reviewCount" | "reviews" | "createdAt"> & {
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
    Omit<Property, "id" | "rating" | "reviewCount" | "reviews" | "createdAt" | "ownerId" | "ownerName" | "ownerImage" | "ownerEmail">
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
