'use client';

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchProperties,
  createProperty as apiCreateProperty,
  deleteProperty as apiDeleteProperty,
} from "@/lib/api";
import { useSession, signOut as authSignOut } from "@/lib/auth-client";

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
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface PropertyContextType {
  properties: Property[];
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  addProperty: (property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  loading: boolean;
  refreshProperties: () => Promise<void>;
}

export const DEMO_USER: AuthUser = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Hook into Better Auth session for global auth state
  const { data: sessionData, isPending: sessionLoading } = useSession();

  const isLoggedIn = !!sessionData;
  const user: AuthUser | null = sessionData?.user
    ? {
        id: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        avatar:
          sessionData.user.image ||
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
      }
    : null;

  const loadProperties = async () => {
    try {
      setLoading(true);
      // Fetch the first 50 properties on mount for general displays (Dashboard/Home/Manage)
      const res = await fetchProperties({ limit: 50 });
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to fetch properties from API in context:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load properties on mount
  useEffect(() => {
    loadProperties();
  }, []);

  // Dummy login for backward compatibility
  const login = (userData: AuthUser) => {
    console.warn("Client login called. Authentication is handled by Better Auth client directly.");
  };

  const logout = async () => {
    try {
      await authSignOut();
      // Session updates will automatically trigger re-renders due to useSession
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  const addProperty = async (newProp: Property) => {
    try {
      const created = await apiCreateProperty({
        title: newProp.title,
        shortDescription: newProp.shortDescription,
        fullDescription: newProp.fullDescription,
        rent: newProp.rent,
        type: newProp.type,
        bedrooms: newProp.bedrooms,
        bathrooms: newProp.bathrooms,
        area: newProp.area,
        city: newProp.city,
        address: newProp.address,
        images: newProp.images,
        amenities: newProp.amenities,
        ownerId: user?.id || "u1",
        ownerName: user?.name || newProp.ownerName,
        ownerImage: user?.avatar || newProp.ownerImage,
        ownerPhone: newProp.ownerPhone,
        ownerEmail: user?.email || newProp.ownerEmail,
        available: newProp.available,
        status: newProp.status,
        featured: newProp.featured,
      });

      setProperties((prev) => [created, ...prev]);
    } catch (err) {
      console.error("Failed to add property to database:", err);
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await apiDeleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete property from database:", err);
      throw err;
    }
  };

  const isInitialized = !sessionLoading;

  // Prevent flash of loading / unhydrated components
  if (!isInitialized) {
    return (
      <PropertyContext.Provider
        value={{
          properties: [],
          isLoggedIn: false,
          user: null,
          login,
          logout,
          addProperty,
          deleteProperty,
          loading: true,
          refreshProperties: loadProperties,
        }}
      >
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Initializing StayNest...</p>
          </div>
        </div>
      </PropertyContext.Provider>
    );
  }

  return (
    <PropertyContext.Provider
      value={{
        properties,
        isLoggedIn,
        user,
        login,
        logout,
        addProperty,
        deleteProperty,
        loading,
        refreshProperties: loadProperties,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertyProvider");
  }
  return context;
}
