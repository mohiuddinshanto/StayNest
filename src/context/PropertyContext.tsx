'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

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
  reviews: Review[];
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
  addProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
}

const REVIEWS: Review[] = [
  { id: "r1", userName: "Sarah Mitchell", userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop", rating: 5, comment: "Absolutely stunning property! Clean, spacious, and exactly as described. The host was incredibly responsive and helpful throughout our stay.", date: "2024-11-15" },
  { id: "r2", userName: "James Rodriguez", userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop", rating: 4, comment: "Great location and lovely amenities. Would definitely stay again. Minor issue with parking but overall a fantastic experience.", date: "2024-10-28" },
  { id: "r3", userName: "Priya Sharma", userImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop", rating: 5, comment: "Perfect for our family. The neighborhood was safe, quiet, and the kids loved every inch of the property. Five stars without hesitation.", date: "2024-10-10" },
  { id: "r4", userName: "Tom Walters", userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop", rating: 5, comment: "We extended our stay twice — that says it all. The property feels like a real home and the host goes above and beyond.", date: "2024-09-22" },
];

const INITIAL_PROPERTIES: Property[] = [
  {
    id: "p1", title: "Luxury Oceanfront Villa with Private Pool",
    shortDescription: "Stunning 4-bed villa with private pool and direct ocean views. Ideal for families seeking resort-style living.",
    fullDescription: "Experience the ultimate in coastal luxury with this magnificent 4-bedroom oceanfront villa. Set across three floors with panoramic Atlantic Ocean views from every room, this property combines modern architecture with resort-style living. The open-plan kitchen and living area flows seamlessly to a private heated pool and sun terrace. The master bedroom features a walk-in wardrobe and an en-suite spa bathroom. You're just a short walk from world-class restaurants and the famous South Beach boardwalk.",
    rent: 4500, type: "villa", bedrooms: 4, bathrooms: 3, area: 2800,
    city: "Miami", address: "1247 Ocean Drive, Miami Beach, FL 33139",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Pool", "Air Conditioning", "Gym", "Kitchen", "Smart TV", "Parking", "Security"], rating: 4.9, reviewCount: 47, reviews: REVIEWS,
    ownerName: "Carlos Hernandez", ownerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    ownerPhone: "+1 (305) 555-0198", ownerEmail: "carlos.h@staynest.com",
    available: "2025-01-15", status: "available", featured: true, createdAt: "2024-06-01",
  },
  {
    id: "p2", title: "Modern Skyline Apartment in Midtown Manhattan",
    shortDescription: "Sleek 2-bed apartment with floor-to-ceiling windows and breathtaking NYC skyline views.",
    fullDescription: "Located in the heart of Midtown Manhattan, this contemporary 2-bedroom apartment offers breathtaking city skyline views from floor-to-ceiling windows. The space features premium finishes, a chef's kitchen with Bosch appliances, and a private terrace. Building amenities include a 24-hour concierge, rooftop lounge, and state-of-the-art fitness center. Steps from Central Park, luxury shopping on Fifth Avenue, and world-renowned dining.",
    rent: 5800, type: "apartment", bedrooms: 2, bathrooms: 2, area: 1200,
    city: "New York", address: "350 W 42nd St, New York, NY 10036",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Air Conditioning", "Gym", "Kitchen", "Smart TV", "Concierge", "Rooftop Terrace"], rating: 4.8, reviewCount: 63, reviews: REVIEWS,
    ownerName: "Emily Chen", ownerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    ownerPhone: "+1 (212) 555-0147", ownerEmail: "emily.c@staynest.com",
    available: "2025-01-01", status: "available", featured: true, createdAt: "2024-05-15",
  },
  {
    id: "p3", title: "Charming Craftsman Home in Silver Lake",
    shortDescription: "Beautifully restored 3-bed craftsman bungalow with sunlit garden and designer kitchen in trendy Silver Lake.",
    fullDescription: "Nestled in one of LA's most vibrant neighborhoods, this beautifully restored 3-bedroom Craftsman bungalow blends vintage charm with modern comforts. Original hardwood floors, exposed beam ceilings, and an updated gourmet kitchen create an inviting retreat. The private backyard garden features a mature lemon tree and string-lit patio — perfect for alfresco dining. A short stroll to the Silver Lake Reservoir, boutique coffee shops, and acclaimed restaurants.",
    rent: 3200, type: "house", bedrooms: 3, bathrooms: 2, area: 1750,
    city: "Los Angeles", address: "847 Griffith Park Blvd, Los Angeles, CA 90026",
    images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Smart TV", "Parking", "Washer/Dryer", "Garden"], rating: 4.7, reviewCount: 38, reviews: REVIEWS,
    ownerName: "Marcus Webb", ownerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
    ownerPhone: "+1 (323) 555-0264", ownerEmail: "marcus.w@staynest.com",
    available: "2025-02-01", status: "available", featured: true, createdAt: "2024-07-10",
  },
  {
    id: "p4", title: "Stylish River North Loft with City Views",
    shortDescription: "Industrial-chic 1-bed loft in Chicago's most sought-after River North neighborhood with spectacular skyline views.",
    fullDescription: "This stunning industrial-chic loft occupies the 18th floor of a converted warehouse in Chicago's vibrant River North arts district. Soaring 14-foot ceilings, exposed brick walls, and polished concrete floors create a dramatic backdrop for the open-plan living space. Custom steel-and-glass partitions define the sleeping area while preserving the breathtaking lake and skyline panorama. The building features a rooftop deck, co-working lounge, and concierge service.",
    rent: 2800, type: "loft", bedrooms: 1, bathrooms: 1, area: 950,
    city: "Chicago", address: "412 N Wells St, Chicago, IL 60654",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Smart TV", "Gym", "Rooftop", "Concierge"], rating: 4.6, reviewCount: 29, reviews: REVIEWS,
    ownerName: "Priya Sharma", ownerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
    ownerPhone: "+1 (312) 555-0319", ownerEmail: "priya.s@staynest.com",
    available: "2025-01-20", status: "available", featured: true, createdAt: "2024-08-05",
  },
  {
    id: "p5", title: "Secluded Mountain Cabin near Lake Tahoe",
    shortDescription: "Cozy 2-bed log cabin surrounded by towering pines, with a stone fireplace and wraparound deck.",
    fullDescription: "Escape to this idyllic mountain cabin just 15 minutes from Lake Tahoe's south shore. Constructed from hand-hewn Douglas fir logs, the cabin exudes warmth and authenticity. Curl up beside the floor-to-ceiling stone fireplace after a day of skiing, hiking, or kayaking. The wraparound deck offers serene forest views and the occasional visit from local deer. Fully equipped kitchen, outdoor BBQ grill, and a private hot tub complete the experience.",
    rent: 1900, type: "cabin", bedrooms: 2, bathrooms: 1, area: 1100,
    city: "San Francisco", address: "3280 Tahoe Keys Blvd, South Lake Tahoe, CA 96150",
    images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Fireplace", "Kitchen", "Hot Tub", "BBQ Grill", "Parking", "Smart TV"], rating: 4.9, reviewCount: 52, reviews: REVIEWS,
    ownerName: "David Park", ownerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    ownerPhone: "+1 (530) 555-0427", ownerEmail: "david.p@staynest.com",
    available: "2025-01-10", status: "available", featured: false, createdAt: "2024-04-20",
  },
  {
    id: "p6", title: "Sleek South Congress Studio with Hotel Perks",
    shortDescription: "Fully furnished studio in Austin's most vibrant corridor with concierge service and rooftop pool.",
    fullDescription: "Positioned on the lively South Congress Avenue, this turnkey studio apartment blends the privacy of home with the luxury of a boutique hotel. The 650 sq ft studio is smartly designed with a queen Murphy bed, integrated home office nook, and a spa-inspired bathroom. Residents enjoy access to the building's rooftop saltwater pool, co-working lounge, and dedicated concierge. Within walking distance of Austin's best live music venues, restaurants, and vintage shops.",
    rent: 1650, type: "studio", bedrooms: 1, bathrooms: 1, area: 650,
    city: "Austin", address: "1512 S Congress Ave, Austin, TX 78704",
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Pool", "Gym", "Concierge", "Smart TV"], rating: 4.5, reviewCount: 41, reviews: REVIEWS,
    ownerName: "Lisa Torres", ownerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    ownerPhone: "+1 (512) 555-0583", ownerEmail: "lisa.t@staynest.com",
    available: "2025-01-05", status: "available", featured: false, createdAt: "2024-09-12",
  },
  {
    id: "p7", title: "Beachfront Cottage on Miami's Key Biscayne",
    shortDescription: "Charming 2-bed cottage steps from the sand with a private dock and spectacular Biscayne Bay views.",
    fullDescription: "This enchanting beachfront cottage sits directly on Key Biscayne's pristine shoreline, offering unobstructed views of Biscayne Bay and the Miami skyline beyond. Crisp white-washed interiors, plantation shutters, and wide-plank oak floors create a timeless coastal aesthetic. The wraparound porch is the perfect spot for sunset cocktails. A private dock accommodates kayaks and paddleboards. Just minutes from Bill Baggs Cape Florida State Park.",
    rent: 3800, type: "house", bedrooms: 2, bathrooms: 2, area: 1400,
    city: "Miami", address: "820 Crandon Blvd, Key Biscayne, FL 33149",
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Private Dock", "BBQ Grill", "Parking", "Smart TV"], rating: 4.8, reviewCount: 33, reviews: REVIEWS,
    ownerName: "Marco Delgado", ownerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    ownerPhone: "+1 (305) 555-0762", ownerEmail: "marco.d@staynest.com",
    available: "2025-03-01", status: "rented", featured: false, createdAt: "2024-03-08",
  },
  {
    id: "p8", title: "Designer Penthouse in San Francisco's Nob Hill",
    shortDescription: "Extraordinary 3-bed penthouse with 360° views of the Bay, Golden Gate Bridge, and Alcatraz.",
    fullDescription: "Crowning the summit of Nob Hill, this extraordinary penthouse apartment offers some of the most coveted views in all of San Francisco. Floor-to-ceiling glass walls frame a panorama that sweeps from the Golden Gate Bridge to the Bay Bridge, with Alcatraz floating in the foreground. The 3,200 sq ft interior showcases museum-quality art, bespoke Italian furniture, and a professional-grade kitchen. An expansive wraparound terrace with outdoor kitchen completes this unparalleled residence.",
    rent: 8500, type: "apartment", bedrooms: 3, bathrooms: 3, area: 3200,
    city: "San Francisco", address: "1000 Mason St, San Francisco, CA 94108",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Air Conditioning", "Gym", "Kitchen", "Smart TV", "Terrace", "Concierge", "Wine Cellar"], rating: 5.0, reviewCount: 18, reviews: REVIEWS,
    ownerName: "Rachel Kim", ownerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
    ownerPhone: "+1 (415) 555-0893", ownerEmail: "rachel.k@staynest.com",
    available: "2025-02-15", status: "available", featured: false, createdAt: "2024-02-14",
  },
  {
    id: "p9", title: "Historic Brooklyn Townhouse with Private Garden",
    shortDescription: "Beautifully renovated 4-bed brownstone townhouse in Park Slope with a landscaped private garden.",
    fullDescription: "This landmark 1890s brownstone has been meticulously restored and sensitively updated to offer modern living within a deeply historic shell. Spread across four floors with original millwork, decorative fireplaces, and restored tin ceilings, the house retains its soul while offering every contemporary convenience. The chef's kitchen opens to a professionally landscaped private garden — an urban oasis. Superb Park Slope location close to Prospect Park and the F/G trains.",
    rent: 6200, type: "house", bedrooms: 4, bathrooms: 3, area: 2600,
    city: "New York", address: "438 President St, Brooklyn, NY 11215",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Garden", "Kitchen", "Smart TV", "Parking", "Fireplace", "Washer/Dryer"], rating: 4.7, reviewCount: 26, reviews: REVIEWS,
    ownerName: "Amanda Foster", ownerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    ownerPhone: "+1 (718) 555-0951", ownerEmail: "amanda.f@staynest.com",
    available: "2025-04-01", status: "pending", featured: false, createdAt: "2024-01-30",
  },
  {
    id: "p10", title: "Bright Wicker Park Apartment with Rooftop",
    shortDescription: "Contemporary 2-bed apartment in Chicago's arts hub with access to a shared rooftop garden.",
    fullDescription: "Situated in the heart of Wicker Park — Chicago's most creative and culturally rich neighborhood — this bright, airy 2-bedroom apartment occupies the top floor of a fully renovated 1920s greystone. Vaulted ceilings, skylights, and oversized casement windows flood the interior with natural light. A stunning chef's kitchen with Calacatta marble counters anchors the open living plan. Exclusive rooftop garden access with city views. Walk to some of Chicago's best independent restaurants, galleries, and boutiques.",
    rent: 2400, type: "apartment", bedrooms: 2, bathrooms: 1, area: 1050,
    city: "Chicago", address: "1642 N Damen Ave, Chicago, IL 60647",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Smart TV", "Rooftop", "Washer/Dryer"], rating: 4.6, reviewCount: 34, reviews: REVIEWS,
    ownerName: "James Torres", ownerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    ownerPhone: "+1 (773) 555-0128", ownerEmail: "james.t@staynest.com",
    available: "2025-01-25", status: "available", featured: false, createdAt: "2024-10-01",
  },
  {
    id: "p11", title: "East Austin Artist's Loft near Rainey Street",
    shortDescription: "Raw, sun-drenched 1-bed loft in a converted printing warehouse, 5 minutes from Rainey Street.",
    fullDescription: "Once the city's premier printing house, this thoughtfully converted loft retains its industrial heritage — exposed steel trusses, concrete columns, and original heart pine floors — while offering refined contemporary comfort. The 1,100 sq ft single-floor layout is anchored by a dramatic 22-foot ceiling with original skylights. A mezzanine sleeping area affords privacy while maintaining the open, airy volume below. Located in East Austin's thriving arts corridor, steps from the city's best cocktail bars and music venues.",
    rent: 2100, type: "loft", bedrooms: 1, bathrooms: 1, area: 1100,
    city: "Austin", address: "78 Rainey St, Austin, TX 78701",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Smart TV", "Gym", "Bike Storage"], rating: 4.5, reviewCount: 22, reviews: REVIEWS,
    ownerName: "Nick Vasquez", ownerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
    ownerPhone: "+1 (512) 555-0374", ownerEmail: "nick.v@staynest.com",
    available: "2025-02-10", status: "available", featured: false, createdAt: "2024-11-05",
  },
  {
    id: "p12", title: "Malibu Cliffside Home with Infinity Pool",
    shortDescription: "Iconic 5-bed architectural masterpiece perched above the Pacific with an infinity pool and private beach access.",
    fullDescription: "This iconic five-bedroom Malibu retreat sits dramatically above the Pacific on a private 3-acre promontory. Designed by a Pritzker Prize-winning architect, the residence is anchored by a 60-foot infinity-edge pool that appears to merge with the ocean horizon. Walls of glass dissolve the boundary between the sweeping interior and the panoramic ocean deck. A funicular descends to a private white-sand cove. Fully staffed option available. An incomparable Southern California living experience.",
    rent: 15000, type: "villa", bedrooms: 5, bathrooms: 5, area: 6800,
    city: "Los Angeles", address: "24200 Pacific Coast Hwy, Malibu, CA 90265",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&h=560&fit=crop", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=560&fit=crop"],
    amenities: ["WiFi", "Infinity Pool", "Air Conditioning", "Gym", "Private Beach", "Smart TV", "Concierge", "Wine Cellar", "Home Theater"],
    rating: 5.0, reviewCount: 11, reviews: REVIEWS,
    ownerName: "Sophia Lane", ownerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    ownerPhone: "+1 (310) 555-0619", ownerEmail: "sophia.l@staynest.com",
    available: "2025-03-15", status: "available", featured: false, createdAt: "2024-12-01",
  },
];

export const DEMO_USER: AuthUser = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop",
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const storedProperties = localStorage.getItem("staynest_properties");
      const storedLoggedIn = localStorage.getItem("staynest_isLoggedIn");
      const storedUser = localStorage.getItem("staynest_user");

      if (storedProperties) {
        setProperties(JSON.parse(storedProperties));
      } else {
        localStorage.setItem("staynest_properties", JSON.stringify(INITIAL_PROPERTIES));
      }

      if (storedLoggedIn === "true") {
        setIsLoggedIn(true);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
    setIsInitialized(true);
  }, []);

  // Sync state to localStorage on changes (only after initial load has finished)
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("staynest_properties", JSON.stringify(properties));
    } catch (e) {
      console.error("Failed to sync properties to localStorage:", e);
    }
  }, [properties, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("staynest_isLoggedIn", String(isLoggedIn));
      if (user) {
        localStorage.setItem("staynest_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("staynest_user");
      }
    } catch (e) {
      console.error("Failed to sync auth state to localStorage:", e);
    }
  }, [isLoggedIn, user, isInitialized]);

  const login = (userData: AuthUser) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const addProperty = (newProp: Property) => {
    setProperties((prev) => [newProp, ...prev]);
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  // Prevent flash of loading / unhydrated components
  if (!isInitialized) {
    return (
      <PropertyContext.Provider
        value={{
          properties: INITIAL_PROPERTIES,
          isLoggedIn: false,
          user: null,
          login,
          logout,
          addProperty,
          deleteProperty,
        }}
      >
        {children}
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
