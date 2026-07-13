'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchProperties,
  fetchMyProperties,
  createProperty as apiCreateProperty,
  deleteProperty as apiDeleteProperty,
  updateProperty as apiUpdateProperty,
  becomeOwner as apiBecomeOwner,
  fetchOwnerAnalytics,
  fetchUnreadInquiryCount,
} from "@/lib/api";
import { useSession, signOut as authSignOut } from "@/lib/auth-client";

// ============================================
// TYPES
// ============================================

export interface Review {
  id: string;
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
  approvalStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "owner" | "admin";
}

export interface OwnerStats {
  totalProperties: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalRevenue: number;
  totalReviews: number;
  totalInquiries: number;
  unreadInquiries: number;
  statusStats: {
    available?: number;
    rented?: number;
    pending?: number;
    [key: string]: number | undefined;
  };
}

interface PropertyContextType {
  // Auth
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  
  // Properties
  properties: Property[];
  myProperties: Property[];
  loading: boolean;
  refreshProperties: () => Promise<void>;
  refreshMyProperties: () => Promise<void>;
  
  // Property CRUD
  addProperty: (property: Omit<Property, "id" | "rating" | "reviewCount" | "reviews" | "createdAt" | "approvalStatus" | "rejectionReason">) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<void>;
  
  // User Actions
  becomeOwner: () => Promise<void>;
  isOwner: boolean;
  isAdmin: boolean;
  
  // Analytics
  ownerStats: OwnerStats | null;
  refreshOwnerStats: () => Promise<void>;
  
  // Notifications
  unreadInquiryCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  // ============================================
  // STATE
  // ============================================
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ownerStats, setOwnerStats] = useState<OwnerStats | null>(null);
  const [unreadInquiryCount, setUnreadInquiryCount] = useState<number>(0);
  
  const { data: sessionData, isPending: sessionLoading, refetch: refetchSession } = useSession();

  // ============================================
  // DERIVED STATE
  // ============================================
  
  const isLoggedIn = !!sessionData;
  const userRole = (sessionData?.user as any)?.role || "user";
  const isOwner = userRole === "owner" || userRole === "admin";
  const isAdmin = userRole === "admin";

  const user: AuthUser | null = sessionData?.user
    ? {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatar:
          sessionData.user.image ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
        role: userRole,
      }
    : null;

  // ============================================
  // DATA FETCHING FUNCTIONS
  // ============================================
  
  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await fetchProperties({ limit: 50 });
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMyProperties = async () => {
    if (!isLoggedIn) {
      setMyProperties([]);
      return;
    }
    try {
      const data = await fetchMyProperties();
      setMyProperties(data);
    } catch (err) {
      console.error("Failed to fetch my properties:", err);
    }
  };

  const loadOwnerStats = async () => {
    if (!isOwner || !isLoggedIn) {
      setOwnerStats(null);
      return;
    }
    try {
      const data = await fetchOwnerAnalytics();
      const unreadRes = await fetchUnreadInquiryCount();
      setOwnerStats({
        ...data,
        unreadInquiries: unreadRes.unreadCount,
      });
    } catch (err) {
      console.error("Failed to fetch owner stats:", err);
    }
  };

  const loadUnreadCount = async () => {
    if (!isLoggedIn) {
      setUnreadInquiryCount(0);
      return;
    }
    try {
      const data = await fetchUnreadInquiryCount();
      setUnreadInquiryCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================
  
  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadMyProperties();
      loadUnreadCount();
      if (isOwner) {
        loadOwnerStats();
      }
    } else {
      setMyProperties([]);
      setOwnerStats(null);
      setUnreadInquiryCount(0);
    }
  }, [isLoggedIn, isOwner]);

  // ============================================
  // AUTH FUNCTIONS
  // ============================================
  
  const login = (userData: AuthUser) => {
    console.warn("Authentication is handled by Better Auth.");
  };

  const logout = async () => {
    try {
      await authSignOut();
      setMyProperties([]);
      setOwnerStats(null);
      setUnreadInquiryCount(0);
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  // ============================================
  // USER ACTIONS
  // ============================================
  
  const becomeOwner = async () => {
    try {
      await apiBecomeOwner();
      await refetchSession(); // Refetch session to get updated role
      // Refresh owner data after role update
      await loadOwnerStats();
      await loadMyProperties();
    } catch (err) {
      console.error("Failed to become owner:", err);
      throw err;
    }
  };

  // ============================================
  // PROPERTY CRUD OPERATIONS
  // ============================================
  
  const addProperty = async (
    newProp: Omit<Property, "id" | "rating" | "reviewCount" | "reviews" | "createdAt" | "approvalStatus" | "rejectionReason">
  ): Promise<Property> => {
    try {
      const created = await apiCreateProperty({
        ...newProp,
        ownerId: user?.id || "",
      });
      setProperties((prev) => [created, ...prev]);
      if (isOwner) {
        setMyProperties((prev) => [created, ...prev]);
        await loadOwnerStats();
      }
      return created;
    } catch (err) {
      console.error("Failed to add property:", err);
      throw err;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
    try {
      const updated = await apiUpdateProperty(id, updates);
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      setMyProperties((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      return updated;
    } catch (err) {
      console.error("Failed to update property:", err);
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await apiDeleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      setMyProperties((prev) => prev.filter((p) => p.id !== id));
      if (isOwner) {
        await loadOwnerStats();
      }
    } catch (err) {
      console.error("Failed to delete property:", err);
      throw err;
    }
  };

  // ============================================
  // REFRESH FUNCTIONS
  // ============================================
  
  const refreshProperties = async () => {
    await loadProperties();
  };

  const refreshMyProperties = async () => {
    await loadMyProperties();
  };

  const refreshOwnerStats = async () => {
    await loadOwnerStats();
  };

  const refreshUnreadCount = async () => {
    await loadUnreadCount();
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (sessionLoading) {
    return (
      <PropertyContext.Provider
        value={{
          isLoggedIn: false,
          user: null,
          login,
          logout,
          properties: [],
          myProperties: [],
          loading: true,
          refreshProperties,
          refreshMyProperties,
          addProperty,
          updateProperty,
          deleteProperty,
          becomeOwner,
          isOwner: false,
          isAdmin: false,
          ownerStats: null,
          refreshOwnerStats,
          unreadInquiryCount: 0,
          refreshUnreadCount,
        }}
      >
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Loading StayNest...</p>
          </div>
        </div>
      </PropertyContext.Provider>
    );
  }

  // ============================================
  // CONTEXT PROVIDER
  // ============================================
  
  return (
    <PropertyContext.Provider
      value={{
        // Auth
        isLoggedIn,
        user,
        login,
        logout,
        
        // Properties
        properties,
        myProperties,
        loading,
        refreshProperties,
        refreshMyProperties,
        
        // CRUD
        addProperty,
        updateProperty,
        deleteProperty,
        
        // User Actions
        becomeOwner,
        isOwner,
        isAdmin,
        
        // Analytics
        ownerStats,
        refreshOwnerStats,
        
        // Notifications
        unreadInquiryCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
}