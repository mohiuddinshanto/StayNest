'use client';

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle, Save, ArrowLeft, Plus, X } from "lucide-react";
import { useProperties } from "@/context/PropertyContext";
import { fetchPropertyById, updateProperty } from "@/lib/api";
import type { Property } from "@/types";
import toast from "react-hot-toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditPropertyPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { isLoggedIn, user, refreshProperties } = useProperties();

  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);

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
    images: [""] as string[],
    available: "",
    amenities: [] as string[],
    status: "available" as "available" | "rented" | "pending",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

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
      router.push(`/auth?redirect=/manage/edit/${id}`);
    }
  }, [isLoggedIn, router, id]);

  // Load existing property data
  useEffect(() => {
    async function load() {
      try {
        setLoadingProperty(true);
        const data = await fetchPropertyById(id);
        
        // Ownership check
        if (user && data.ownerId !== user.id && data.ownerEmail !== user.email) {
          toast.error("Forbidden: You do not own this property listing");
          router.push("/manage");
          return;
        }

        setProperty(data);
        setForm({
          title: data.title,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription || "",
          rent: String(data.rent),
          type: data.type,
          bedrooms: String(data.bedrooms),
          bathrooms: String(data.bathrooms),
          area: String(data.area),
          city: data.city,
          address: data.address,
          images: data.images && data.images.length ? data.images : [""],
          available: data.available,
          amenities: data.amenities || [],
          status: data.status || "available",
        });
      } catch (err: any) {
        console.error("Failed to load property:", err);
        toast.error("Failed to fetch property details");
        router.push("/manage");
      } finally {
        setLoadingProperty(false);
      }
    }

    if (isLoggedIn && user) {
      load();
    }
  }, [id, isLoggedIn, user, router]);

  if (!isLoggedIn || loadingProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const setImage = (index: number, value: string) => {
    setForm((f) => {
      const images = [...f.images];
      images[index] = value;
      return { ...f, images };
    });
  };

  const addImageField = () => {
    setForm((f) => ({ ...f, images: [...f.images, ""] }));
  };

  const removeImageField = (index: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.length > 1 ? f.images.filter((_, i) => i !== index) : f.images,
    }));
  };

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
    if (!form.images.some((img) => img.trim())) {
      e.images = "At least one image URL is required";
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    setErrors({});
    setSaving(true);

    const toastId = toast.loading("Saving changes...");
    try {
      const updates = {
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
        images: form.images.map((img) => img.trim()).filter(Boolean),
        amenities: form.amenities,
        available: form.available,
        status: form.status,
      };

      await updateProperty(id, updates);
      await refreshProperties();
      
      toast.success("Property updated successfully!", { id: toastId });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to update property. Check details.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-slate-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-3">
            Changes Saved!
          </h2>
          <p className="text-slate-500 mb-8">
            Your property updates have been successfully saved and published.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/manage")}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl border-none cursor-pointer"
            >
              View My Properties
            </button>
            <button
              onClick={() => router.push(`/property/${id}`)}
              className="px-6 py-3 border border-gray-200 text-slate-600 font-semibold bg-white rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              View Listing
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/manage")}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors bg-transparent border-none cursor-pointer mb-2"
            >
              <ArrowLeft size={13} />
              Back to My Properties
            </button>
            <h1
              className="text-3xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              Edit Listing
            </h1>
            <p className="text-slate-500 mt-1">
              Update details, pricing, and availability for your rental property.
            </p>
          </div>
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

          {/* Status Select */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-gray-100">
              Listing Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as any)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 h-11"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="pending">Pending</option>
                </select>
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
            <Field label="Image URLs *" error={errors.images}>
              <div className="space-y-3">
                {form.images.map((img, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-2">
                      <input
                        value={img}
                        onChange={(e) => setImage(index, e.target.value)}
                        placeholder="https://images.unsplash.com/…"
                        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none h-11 ${
                          errors.images
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                        }`}
                      />
                      {form.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 text-slate-400 hover:text-red-500 hover:border-red-300 bg-white cursor-pointer transition-colors"
                          aria-label="Remove image"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                    {img && (
                      <div className="mt-2 rounded-xl overflow-hidden h-40 bg-slate-100">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Field>
            <button
              type="button"
              onClick={addImageField}
              className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={16} />
              Add Another Image
            </button>
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
            disabled={saving}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-base flex items-center justify-center gap-2 border-none cursor-pointer"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}