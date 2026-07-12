export interface Review {
  id: string;
  propertyId?: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

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
