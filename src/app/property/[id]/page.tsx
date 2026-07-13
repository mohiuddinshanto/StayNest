'use client';

import React, { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
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
  Pencil,
  Calendar,
} from "lucide-react";

import { useProperties } from "@/context/PropertyContext";
import { PropertyCard } from "@/components/PropertyCard";
import { Stars } from "@/components/Stars";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import { LoginPromptModal } from "@/components/LoginPromptModal";
import { fetchPropertyById, createReview, createInquiry, fetchProperties } from "@/lib/api";
import type { Property } from "@/types";
import toast from "react-hot-toast";

interface PageProps {
  params: Promise<{ id: string }>;
}

function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const hasMultiple = images.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: hasMultiple });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-slate-100">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((img, i) => (
              <div key={i} className="relative flex-[0_0_100%] min-w-0">
                <img
                  src={img}
                  alt={`${title} - photo ${i + 1}`}
                  className="w-full h-96 md:h-[480px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

        {hasMultiple && (
          <>
            <button
              onClick={scrollPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors border-none cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors border-none cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all border-none cursor-pointer p-0 ${
                    i === selectedIndex
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 transition-all border-none cursor-pointer p-0 ${
                i === selectedIndex
                  ? "ring-2 ring-blue-600 ring-offset-2"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { isLoggedIn, user } = useProperties();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Property[]>([]);

  // Contact (Message Owner) modal state
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMsg, setContactMsg] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);

  // Schedule Viewing modal state
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleMsg, setScheduleMsg] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleSent, setScheduleSent] = useState(false);
  const [sendingSchedule, setSendingSchedule] = useState(false);

  // Login prompt modal state
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [loginPromptAction, setLoginPromptAction] = useState("perform this action");

  // Review states
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await fetchPropertyById(id);
      setProperty(data);

      // Load related properties in same city
      const relatedRes = await fetchProperties({ city: data.city, limit: 4 });
      setRelated(relatedRes.data.filter((p) => p.id !== data.id).slice(0, 3));
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  const isOwnProperty =
    !!user &&
    !!property &&
    (user.id === property.ownerId || user.email === property.ownerEmail);

  const openLoginPrompt = (action: string) => {
    setLoginPromptAction(action);
    setLoginPromptOpen(true);
  };

  const handleContactOwnerClick = () => {
    if (!isLoggedIn) {
      openLoginPrompt("message the owner");
      return;
    }
    setContactOpen(true);
  };

  const handleScheduleViewingClick = () => {
    if (!isLoggedIn) {
      openLoginPrompt("schedule a viewing");
      return;
    }
    setScheduleOpen(true);
  };

  const handleSendMessage = async () => {
    if (!contactMsg.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSendingMsg(true);
    try {
      await createInquiry({
        propertyId: id,
        type: "message",
        message: contactMsg,
      });
      setMsgSent(true);
      toast.success("Message sent to owner!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSendingMsg(false);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleMsg.trim()) {
      toast.error("Please enter a message");
      return;
    }
    if (!scheduleDate) {
      toast.error("Please select a preferred date");
      return;
    }
    setSendingSchedule(true);
    try {
      await createInquiry({
        propertyId: id,
        type: "schedule_viewing",
        message: scheduleMsg,
        preferredDate: scheduleDate,
      });
      setScheduleSent(true);
      toast.success("Viewing request sent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule viewing");
    } finally {
      setSendingSchedule(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openLoginPrompt("leave a review");
      return;
    }
    if (!userComment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    setSubmittingReview(true);
    const toastId = toast.loading("Submitting review...");
    try {
      await createReview({
        propertyId: id,
        userName: user?.name || "Guest",
        userImage: user?.avatar,
        rating: userRating,
        comment: userComment,
      });

      toast.success("Review posted successfully!", { id: toastId });
      setUserComment("");
      setUserRating(5);
      // Reload property to show new review and updated rating
      await loadProperty();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review", { id: toastId });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
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
            <PropertyGallery images={property.images} title={property.title} />

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
                {isOwnProperty && <Badge variant="blue">Your Property</Badge>}
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

            {/* Reviews Section */}
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
                    const count = property.reviews
                      ? property.reviews.filter((r) => r.rating === star).length
                      : 0;
                    const pct = property.reviews && property.reviews.length
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

              {/* Submit Review Form - hidden for the property owner */}
              {!isOwnProperty && (
                <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6 mb-8 text-left">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                        Rating
                      </label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            className="bg-transparent border-none cursor-pointer p-0.5"
                          >
                            <Star
                              size={24}
                              className={
                                star <= userRating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                        Your Comment
                      </label>
                      <textarea
                        rows={4}
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Tell us about your experience..."
                        disabled={submittingReview}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 border-none cursor-pointer disabled:opacity-60"
                    >
                      <Send size={15} />
                      {submittingReview ? "Posting..." : "Post Review"}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-5">
                {property.reviews && property.reviews.length > 0 ? (
                  property.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="border-b border-gray-100 pb-5 last:border-0"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={r.userImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop"}
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
                  ))
                ) : (
                  <p className="text-slate-400 text-sm py-4">No reviews yet. Be the first to share your thoughts!</p>
                )}
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

              {isOwnProperty ? (
                <button
                  onClick={() => router.push(`/manage/edit/${id}`)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border-none cursor-pointer"
                >
                  <Pencil size={16} />
                  Edit Property
                </button>
              ) : (
                <>
                  <button
                    onClick={handleContactOwnerClick}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mb-3 border-none cursor-pointer"
                  >
                    Contact Owner
                  </button>
                  <button
                    onClick={handleScheduleViewingClick}
                    className="w-full py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent font-semibold rounded-xl transition-colors text-sm cursor-pointer"
                  >
                    Schedule a Viewing
                  </button>
                </>
              )}
            </div>

            {/* Owner Card */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 text-left">
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                Property Owner
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={property.ownerImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"}
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
                {property.ownerPhone && (
                  <a
                    href={`tel:${property.ownerPhone}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <Phone size={14} />
                    {property.ownerPhone}
                  </a>
                )}
                {property.ownerEmail && (
                  <a
                    href={`mailto:${property.ownerEmail}`}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <Mail size={14} />
                    {property.ownerEmail}
                  </a>
                )}
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

      {/* Contact / Message Owner Modal */}
      <Modal
        open={contactOpen}
        onClose={() => {
          setContactOpen(false);
          setMsgSent(false);
          setContactMsg("");
        }}
        title="Message Owner"
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
                setContactMsg("");
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
                src={property.ownerImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"}
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
                Message
              </label>
              <textarea
                rows={4}
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder={`Hi ${property.ownerName}, I'm interested in renting ${property.title}...`}
                disabled={sendingMsg}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={sendingMsg}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-60"
            >
              <Send size={16} />
              {sendingMsg ? "Sending..." : "Send Message"}
            </button>
          </div>
        )}
      </Modal>

      {/* Schedule Viewing Modal */}
      <Modal
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
          setScheduleSent(false);
          setScheduleMsg("");
          setScheduleDate("");
        }}
        title="Schedule a Viewing"
      >
        {scheduleSent ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Viewing Requested!
            </h3>
            <p className="text-slate-500 text-sm">
              {property.ownerName} will confirm your preferred date shortly.
            </p>
            <button
              onClick={() => {
                setScheduleOpen(false);
                setScheduleSent(false);
                setScheduleMsg("");
                setScheduleDate("");
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
                src={property.ownerImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop"}
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
                Preferred Date
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  disabled={sendingSchedule}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-11"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                Message
              </label>
              <textarea
                rows={4}
                value={scheduleMsg}
                onChange={(e) => setScheduleMsg(e.target.value)}
                placeholder={`Hi ${property.ownerName}, I'd like to schedule a viewing for ${property.title}...`}
                disabled={sendingSchedule}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
            </div>
            <button
              onClick={handleScheduleSubmit}
              disabled={sendingSchedule}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-60"
            >
              <Send size={16} />
              {sendingSchedule ? "Sending..." : "Request Viewing"}
            </button>
          </div>
        )}
      </Modal>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        open={loginPromptOpen}
        onClose={() => setLoginPromptOpen(false)}
        action={loginPromptAction}
      />
    </div>
  );
}