'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, CheckCircle } from "lucide-react";
import { useProperties, Property, DEMO_USER } from "@/context/PropertyContext";

export default function AddPropertyPage() {
  const router = useRouter();
  const { isLoggedIn, addProperty } = useProperties();

  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    rent: "",
    type: "apartment",
    bedrooms: "1",
    bathrooms: "1",
    area: "",
    city: "",
    address: "",
    imageUrl: "",
    available: "",
    amenities: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const AMENITY_OPTIONS = [
    "WiFi",
    "Pool",
    "Parking",
    "Air Conditioning",
    "Gym",
    "Kitchen",
    "Smart TV",
    "Security",
    "Garden",
    "Fireplace",
    "Washer/Dryer",
    "Rooftop",
  ];

  // Protect route
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.shortDescription.trim()) {
      e.shortDescription = "Short description is required";
    }
    if (!form.rent || Number(form.rent) <= 0) e.rent = "Valid rent is required";
    if (!form.area || Number(form.area) <= 0) e.area = "Valid area is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.available) e.available = "Available date is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const newProp: Property = {
      id: `p${Date.now()}`,
      title: form.title,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription || form.shortDescription,
      rent: Number(form.rent),
      type: form.type,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      city: form.city,
      address: form.address,
      images: [
        form.imageUrl ||
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&h=560&fit=crop",
      ],
      amenities: form.amenities,
      rating: 0,
      reviewCount: 0,
      reviews: [],
      ownerName: "Alex Johnson",
      ownerImage: DEMO_USER.avatar,
      ownerPhone: "+1 (555) 000-0000",
      ownerEmail: "alex@example.com",
      available: form.available,
      status: "available",
      featured: false,
      createdAt: new Date().toISOString().split("T")[0],
    };

    addProperty(newProp);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-slate-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-3">
            Property Listed!
          </h2>
          <p className="text-slate-500 mb-8">
            Your property has been submitted and will go live after a quick
            review by our team (usually within 24 hours).
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/manage")}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl border-none cursor-pointer"
            >
              View My Properties
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  title: "",
                  shortDescription: "",
                  fullDescription: "",
                  rent: "",
                  type: "apartment",
                  bedrooms: "1",
                  bathrooms: "1",
                  area: "",
                  city: "",
                  address: "",
                  imageUrl: "",
                  available: "",
                  amenities: [],
                });
                setErrors({});
              }}
              className="px-6 py-3 border border-gray-200 text-slate-600 font-semibold bg-white rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Add Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Field = ({
    label,
    error,
    children,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div className="text-left">
      <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="mb-8">
          <h1
            className="text-3xl font-extrabold text-slate-800"
            style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
          >
            List Your Property
          </h1>
          <p className="text-slate-500 mt-2">
            Reach thousands of qualified renters. Listing is free — we only earn
            when you do.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100">
              Basic Information
            </h2>
            <div className="grid gap-5">
              <Field label="Property Title *" error={errors.title}>
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Spacious 2-Bedroom Apartment in Downtown Chicago"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors h-11 ${
                    errors.title
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </Field>
              <Field label="Short Description *" error={errors.shortDescription}>
                <textarea
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  rows={2}
                  placeholder="A compelling 1-2 sentence summary that appears on listing cards"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors ${
                    errors.shortDescription
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </Field>
              <Field label="Full Description">
                <textarea
                  value={form.fullDescription}
                  onChange={(e) => set("fullDescription", e.target.value)}
                  rows={5}
                  placeholder="Describe your property in detail — neighborhood highlights, special features, nearby attractions…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </Field>
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100">
              Property Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <Field label="Monthly Rent ($) *" error={errors.rent}>
                <input
                  value={form.rent}
                  onChange={(e) => set("rent", e.target.value)}
                  type="number"
                  placeholder="e.g. 2500"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none h-11 ${
                    errors.rent
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </Field>
              <Field label="Property Type">
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 h-11"
                >
                  {["apartment", "house", "villa", "studio", "loft", "cabin"].map(
                    (t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    )
                  )}
                </select>
              </Field>
              <Field label="Area (sq ft) *" error={errors.area}>
                <input
                  value={form.area}
                  onChange={(e) => set("area", e.target.value)}
                  type="number"
                  placeholder="e.g. 1200"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none h-11 ${
                    errors.area
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </Field>
              <Field label="Bedrooms">
                <select
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 h-11"
                >
                  {["1", "2", "3", "4", "5", "6"].map((n) => (
                    <option key={n} value={n}>
                      {n} Bedroom{n !== "1" ? "s" : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Bathrooms">
                <select
                  value={form.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 h-11"
                >
                  {["1", "2", "3", "4", "5"].map((n) => (
                    <option key={n} value={n}>
                      {n} Bathroom{n !== "1" ? "s" : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Available From *" error={errors.available}>
                <input
                  value={form.available}
                  onChange={(e) => set("available", e.target.value)}
                  type="date"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none h-11 ${
                    errors.available
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </Field>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100">
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="City *" error={errors.city}>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="e.g. San Francisco"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none h-11 ${
                    errors.city
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </Field>
              <Field label="Full Address *" error={errors.address}>
                <input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Street address, Unit, ZIP"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none h-11 ${
                    errors.address
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </Field>
            </div>
          </div>

          {/* Media */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100">
              Photos
            </h2>
            <Field label="Primary Image URL">
              <input
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="https://images.unsplash.com/…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 h-11"
              />
            </Field>
            {form.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden h-40 bg-slate-100">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((a) => {
                const selected = form.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        amenities: selected
                          ? f.amenities.filter((x) => x !== a)
                          : [...f.amenities, a],
                      }))
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
                      selected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-200 text-slate-600 hover:border-blue-300"
                    }`}
                  >
                    {selected && <Check size={13} />}
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-base flex items-center justify-center gap-2 border-none cursor-pointer"
          >
            <Plus size={20} />
            Submit Listing
          </button>
        </div>
      </div>
    </div>
  );
}
