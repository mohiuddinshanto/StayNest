'use client';

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  ChevronRight,
  ChevronLeft,
  Bed,
  Bath,
  Square,
  CheckCircle,
  Phone,
  Mail,
  Shield,
  Send,
  Wifi,
  Waves,
  Car,
  Wind,
  Dumbbell,
  Utensils,
  Tv,
  Coffee,
  Trees,
  Bell,
  Check,
  Star,
} from "lucide-react";

import { useProperties } from "@/context/PropertyContext";
import { PropertyCard } from "@/components/PropertyCard";
import { Stars } from "@/components/Stars";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { properties } = useProperties();

  const property = properties.find((p) => p.id === id);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMsg, setContactMsg] = useState("");
  const [msgSent, setMsgSent] = useState(false);

  const AMENITY_ICONS: Record<string, any> = {
    WiFi: Wifi,
    Pool: Waves,
    Parking: Car,
    "Air Conditioning": Wind,
    Gym: Dumbbell,
    Kitchen: Utensils,
    "Smart TV": Tv,
    Coffee: Coffee,
    Security: Shield,
    Garden: Trees,
    Concierge: Bell,
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-700 mb-3">
            Property not found
          </h2>
          <button
            onClick={() => router.push("/explore")}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl border-none cursor-pointer"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const related = properties
    .filter((p) => p.id !== id && p.city === property.city)
    .slice(0, 3);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-white pt-20 text-left">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button
            onClick={() => router.push("/")}
            className="hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer"
          >
            Home
          </button>
          <ChevronRight size={14} />
          <button
            onClick={() => router.push("/explore")}
            className="hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer"
          >
            Explore
          </button>
          <ChevronRight size={14} />
          <span className="text-slate-600 line-clamp-1">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={property.images[galleryIdx]}
                  alt={property.title}
                  className="w-full h-96 md:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setGalleryIdx(
                          (i) =>
                            (i - 1 + property.images.length) %
                            property.images.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors border-none cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setGalleryIdx((i) => (i + 1) % property.images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors border-none cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  {galleryIdx + 1} / {property.images.length}
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIdx(i)}
                    className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 transition-all border-none cursor-pointer p-0 ${
                      i === galleryIdx
                        ? "ring-2 ring-blue-600 ring-offset-2"
                        : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title + Badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="blue">
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </Badge>
                {property.featured && <Badge variant="amber">Featured</Badge>}
                <Badge
                  variant={
                    property.status === "available"
                      ? "green"
                      : property.status === "rented"
                      ? "red"
                      : "amber"
                  }
                >
                  {property.status.charAt(0).toUpperCase() +
                    property.status.slice(1)}
                </Badge>
              </div>
              <h1
                className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3"
                style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
              >
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin size={15} className="text-teal-500" />
                  {property.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <Stars rating={property.rating} size={14} />
                  <span className="font-semibold text-slate-700">
                    {property.rating}
                  </span>{" "}
                  ({property.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                {
                  icon: Square,
                  label: "Area",
                  value: `${property.area.toLocaleString()} ft²`,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="bg-slate-50 rounded-2xl p-4 text-center border border-gray-100"
                >
                  <Icon size={22} className="text-blue-600 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-800">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                About This Property
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {property.fullDescription}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {property.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a] || Check;
                  return (
                    <div
                      key={a}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-gray-100 text-sm text-slate-600"
                    >
                      <CheckCircle size={15} className="text-teal-500 shrink-0" />
                      {a}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6">
                Guest Reviews
              </h2>
              <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 rounded-2xl">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-blue-600">
                    {property.rating}
                  </p>
                  <Stars rating={property.rating} />
                  <p className="text-xs text-slate-400 mt-1">
                    {property.reviewCount} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = property.reviews.filter(
                      (r) => r.rating === star
                    ).length;
                    const pct = property.reviews.length
                      ? (count / property.reviews.length) * 100
                      : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 w-4">{star}</span>
                        <Star
                          size={10}
                          className="text-amber-400 fill-amber-400"
                        />
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-slate-400 w-4">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-5">
                {property.reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border-b border-gray-100 pb-5 last:border-0"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={r.userImage}
                        alt={r.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">
                          {r.userName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Stars rating={r.rating} size={12} />
                          <span className="text-xs text-slate-400">
                            {new Date(r.date).toLocaleDateString("en-US", {
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Price Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6 text-left">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-extrabold text-blue-600">
                  {fmt(property.rent)}
                </span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <div className="flex items-center gap-1 mb-5">
                <Stars rating={property.rating} size={13} />
                <span className="text-slate-500 text-sm">
                  {property.rating} · {property.reviewCount} reviews
                </span>
              </div>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Available From</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(property.available).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Property Type</span>
                  <span className="font-semibold text-slate-700 capitalize">
                    {property.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">City</span>
                  <span className="font-semibold text-slate-700">
                    {property.city}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setContactOpen(true)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mb-3 border-none cursor-pointer"
              >
                Contact Owner
              </button>
              <button className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-55 bg-transparent font-semibold rounded-xl transition-colors text-sm cursor-pointer">
                Schedule a Viewing
              </button>
            </div>

            {/* Owner Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 text-left">
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                Property Owner
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={property.ownerImage}
                  alt={property.ownerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-slate-800">{property.ownerName}</p>
                  <p className="text-xs text-teal-600 flex items-center gap-1">
                    <CheckCircle size={12} />
                    Verified Host
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <a
                  href={`tel:${property.ownerPhone}`}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Phone size={14} />
                  {property.ownerPhone}
                </a>
                <a
                  href={`mailto:${property.ownerEmail}`}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                >
                  <Mail size={14} />
                  {property.ownerEmail}
                </a>
              </div>
            </div>

            {/* Safety */}
            <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 text-left">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-0.5">
                    StayNest Guarantee
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your deposit is fully protected until you&apos;ve checked in and
                    confirmed the property matches its listing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        {related.length > 0 && (
          <div className="mt-16 text-left">
            <h2
              className="text-2xl font-extrabold text-slate-800 mb-6"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              More in {property.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Modal
        open={contactOpen}
        onClose={() => {
          setContactOpen(false);
          setMsgSent(false);
          setContactMsg("");
        }}
        title="Contact Owner"
      >
        {msgSent ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Message Sent!
            </h3>
            <p className="text-slate-500 text-sm">
              {property.ownerName} will get back to you within 24 hours.
            </p>
            <button
              onClick={() => {
                setContactOpen(false);
                setMsgSent(false);
              }}
              className="mt-5 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm border-none cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4 text-left">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <img
                src={property.ownerImage}
                alt={property.ownerName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {property.ownerName}
                </p>
                <p className="text-xs text-teal-600">
                  Verified Host · Responds within 2 hrs
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                Your Name
              </label>
              <input
                placeholder="Enter your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-11"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                Your Email
              </label>
              <input
                placeholder="your@email.com"
                type="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-11"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                Message
              </label>
              <textarea
                rows={4}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder={`Hi ${property.ownerName}, I'm interested in renting ${property.title}...`}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
            </div>
            <button
              onClick={() => setMsgSent(true)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <Send size={16} />
              Send Message
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
