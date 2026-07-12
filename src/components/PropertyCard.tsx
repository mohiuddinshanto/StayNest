'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Bed, Bath, Square, Heart } from "lucide-react";
import { Stars } from "./Stars";
import { Badge, BadgeVariant } from "./Badge";
import { Property } from "@/context/PropertyContext";

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export function PropertyCard({ property, compact }: PropertyCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);

  const typeColor: Record<string, BadgeVariant> = {
    apartment: "blue",
    house: "teal",
    villa: "amber",
    studio: "gray",
    loft: "blue",
    cabin: "teal",
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const handleCardClick = () => {
    router.push(`/property/${property.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
    >
      <div className="relative overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            compact ? "h-44" : "h-52"
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <Heart
            size={15}
            className={liked ? "fill-red-500 text-red-500" : "text-slate-500"}
          />
        </button>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant={typeColor[property.type] || "gray"}>
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </Badge>
          {property.featured && <Badge variant="amber">Featured</Badge>}
        </div>
        <div className="absolute bottom-3 right-3">
          <Badge
            variant={
              property.status === "available"
                ? "green"
                : property.status === "rented"
                ? "red"
                : "amber"
            }
          >
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        <p className="flex items-center gap-1 text-slate-500 text-sm mb-3">
          <MapPin size={13} className="text-teal-500 shrink-0" />
          {property.city}
        </p>
        <div className="flex items-center gap-3 text-slate-500 text-sm mb-4">
          <span className="flex items-center gap-1">
            <Bed size={13} className="text-blue-500" />
            {property.bedrooms}
          </span>
          <span className="text-slate-200">|</span>
          <span className="flex items-center gap-1">
            <Bath size={13} className="text-blue-500" />
            {property.bathrooms}
          </span>
          <span className="text-slate-200">|</span>
          <span className="flex items-center gap-1">
            <Square size={13} className="text-blue-500" />
            {property.area.toLocaleString()} ft²
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xl font-bold text-blue-600">
              {fmt(property.rent)}
            </span>
            <span className="text-slate-400 text-sm">/mo</span>
          </div>
          <div className="flex items-center gap-1">
            <Stars rating={property.rating} size={12} />
            <span className="text-slate-500 text-xs ml-1">
              {property.rating} ({property.reviewCount})
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
