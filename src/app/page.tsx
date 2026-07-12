'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Users,
  Award,
  ArrowRight,
  Shield,
  Key,
  Bell,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Building2,
  Home as HomeIcon,
  Compass,
  Trees,
  Waves,
  Mountain,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { useProperties } from "@/context/PropertyContext";
import { PropertyCard } from "@/components/PropertyCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Stars } from "@/components/Stars";

const CITIES = [
  { name: "New York", properties: 248, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop" },
  { name: "Los Angeles", properties: 194, image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&h=400&fit=crop" },
  { name: "Miami", properties: 176, image: "https://images.unsplash.com/photo-1533106497176-f3a6d6e5f74c?w=600&h=400&fit=crop" },
  { name: "Chicago", properties: 142, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop" },
  { name: "San Francisco", properties: 118, image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop" },
  { name: "Austin", properties: 97, image: "https://images.unsplash.com/photo-1531218150217-0adbc0f8bd8f?w=600&h=400&fit=crop" },
];

const TESTIMONIALS = [
  { id: "t1", name: "Sarah Mitchell", role: "Graphic Designer, New York", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", rating: 5, comment: "StayNest made finding our dream apartment an absolute breeze. The search filters are spot-on, the listings are accurate, and our host was fantastic. We've recommended it to everyone we know." },
  { id: "t2", name: "James Rodriguez", role: "Software Engineer, San Francisco", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", rating: 5, comment: "As someone who relocates frequently for work, StayNest has become my go-to platform. The quality of properties is consistently high, and the booking process is seamless and transparent." },
  { id: "t3", name: "Priya Sharma", role: "Marketing Director, Chicago", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop", rating: 5, comment: "Listed my condo on StayNest three months ago and have had 100% occupancy since. The dashboard tools make managing bookings effortless. The platform genuinely works for owners." },
  { id: "t4", name: "Tom Walters", role: "Architect, Miami", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", rating: 4, comment: "The property detail pages are incredibly thorough — real photos, accurate amenity lists, verified owner contacts. I always know exactly what I'm getting. StayNest has earned my trust." },
  { id: "t5", name: "Amanda Foster", role: "Travel Blogger, Los Angeles", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop", rating: 5, comment: "I use StayNest exclusively for all my extended stays. It strikes the perfect balance between the curation you get from boutique agencies and the convenience of a modern tech platform. Brilliant." },
];

const FAQS = [
  { q: "How does StayNest verify property listings?", a: "Every listing on StayNest goes through a rigorous 3-step verification process: owner identity check, property address confirmation, and photo authenticity review. Our trust & safety team manually reviews each listing before it goes live." },
  { q: "What payment methods are accepted?", a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), bank transfers, PayPal, and Apple/Google Pay. All transactions are encrypted with bank-level SSL security." },
  { q: "Can I cancel a booking after confirming?", a: "Cancellation policies vary by property and are clearly stated on each listing page before you book. Most owners offer a 48-hour free cancellation window. Refunds are processed within 3-5 business days." },
  { q: "How do I list my property on StayNest?", a: "Creating a listing is free. Simply register for a host account, click 'Add Property', fill in the details and photos, and submit for review. Most listings are approved within 24 hours." },
  { q: "Is StayNest available outside the United States?", a: "We currently operate in 38 cities across the US, Canada, and the UK, with plans to expand to Western Europe and Australia by Q3 2025. Check our Explore page for the latest city coverage." },
  { q: "What happens if there's an issue with the property on arrival?", a: "Contact your host immediately using the in-app messaging. If the issue isn't resolved within 2 hours, our 24/7 support team will step in. We offer a full refund guarantee for properties that materially differ from their listings." },
  { q: "Are pets allowed?", a: "Pet policies are set by individual owners and are clearly labeled on each listing. Use the 'Pet-friendly' filter on our Explore page to see only properties that welcome furry companions." },
  { q: "How is my personal data protected?", a: "StayNest is fully GDPR and CCPA compliant. We never sell your personal data to third parties. You can request a full export or deletion of your data at any time from your account settings." },
];

const CATEGORIES = [
  { label: "Apartments", icon: Building2, count: 842, color: "bg-blue-50 text-blue-600" },
  { label: "Houses", icon: HomeIcon, count: 617, color: "bg-teal-50 text-teal-600" },
  { label: "Villas", icon: Award, count: 204, color: "bg-amber-50 text-amber-600" },
  { label: "Studios", icon: Key, count: 389, color: "bg-purple-50 text-purple-600" },
  { label: "Lofts", icon: Building2, count: 156, color: "bg-rose-50 text-rose-600" },
  { label: "Cabins", icon: Trees, count: 93, color: "bg-green-50 text-green-600" },
  { label: "Beachfront", icon: Waves, count: 74, color: "bg-cyan-50 text-cyan-600" },
  { label: "Mountain", icon: Mountain, count: 61, color: "bg-indigo-50 text-indigo-600" },
];

const CHART_MONTHLY = [
  { month: "Jan", revenue: 42000, bookings: 28 }, { month: "Feb", revenue: 48500, bookings: 32 },
  { month: "Mar", revenue: 54200, bookings: 37 }, { month: "Apr", revenue: 61800, bookings: 43 },
  { month: "May", revenue: 58400, bookings: 40 }, { month: "Jun", revenue: 72100, bookings: 51 },
  { month: "Jul", revenue: 84300, bookings: 59 }, { month: "Aug", revenue: 79800, bookings: 55 },
  { month: "Sep", revenue: 68200, bookings: 46 }, { month: "Oct", revenue: 63400, bookings: 43 },
  { month: "Nov", revenue: 57900, bookings: 38 }, { month: "Dec", revenue: 71200, bookings: 49 },
];

const CHART_TYPES = [
  { name: "Apartments", value: 38 }, { name: "Houses", value: 28 },
  { name: "Villas", value: 14 }, { name: "Studios", value: 11 },
  { name: "Lofts", value: 5 }, { name: "Other", value: 4 },
];
const PIE_COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#8b5cf6", "#ec4899", "#94a3b8"];

export default function Home() {
  const router = useRouter();
  const { properties } = useProperties();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = () => {
    router.push(`/explore?query=${encodeURIComponent(searchQuery)}&type=${searchType}`);
  };

  const navigateToExplore = (params: { query?: string; type?: string }) => {
    let url = "/explore";
    const parts = [];
    if (params.query) parts.push(`query=${encodeURIComponent(params.query)}`);
    if (params.type) parts.push(`type=${params.type}`);
    if (parts.length > 0) url += `?${parts.join("&")}`;
    router.push(url);
  };

  const featured = properties.filter((p) => p.featured).slice(0, 6);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=900&fit=crop&auto=format"
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Over 2,400 verified listings across the US
          </div>
          <h1
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
          >
            Find Your Perfect<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              Home Away
            </span>{" "}
            From Home
          </h1>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover handpicked rental properties in the finest neighborhoods — from
            urban penthouses to mountain retreats.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="City, neighborhood, or address…"
                className="flex-1 outline-none text-slate-700 text-sm placeholder:text-slate-400 bg-transparent h-10"
              />
            </div>
            <div className="flex items-center gap-2 border-l border-gray-100 px-3">
              <Building2 size={18} className="text-slate-400 shrink-0" />
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="outline-none text-slate-600 text-sm bg-transparent pr-4 cursor-pointer h-10 border-none"
              >
                <option value="all">All Types</option>
                {["apartment", "house", "villa", "studio", "loft", "cabin"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  )
                )}
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              <Search size={16} />
              Search
            </button>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Miami Beach", "Manhattan", "Silver Lake", "Chicago", "Malibu"].map(
              (city) => (
                <button
                  key={city}
                  onClick={() => navigateToExplore({ query: city })}
                  className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm rounded-full hover:bg-white/20 transition-colors"
                >
                  {city}
                </button>
              )
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "Properties Listed", value: "2,438+", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: MapPin, label: "Cities Covered", value: "38", color: "text-teal-600", bg: "bg-teal-50" },
              { icon: Users, label: "Happy Renters", value: "14,200+", color: "text-amber-600", bg: "bg-amber-50" },
              { icon: Award, label: "Verified Hosts", value: "1,890+", color: "text-purple-600", bg: "bg-purple-50" },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="flex items-center gap-4">
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                Hand-picked for you
              </p>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-slate-800"
                style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
              >
                Featured Properties
              </h2>
            </div>
            <button
              onClick={() => router.push("/explore")}
              className="hidden md:flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all bg-transparent border-none cursor-pointer"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => router.push("/explore")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors border-none"
            >
              <Compass size={18} />
              Explore All Properties
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
              Browse by type
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              Property Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() =>
                  navigateToExplore({
                    type: cat.label
                      .toLowerCase()
                      .replace("beachfront", "house")
                      .replace("mountain", "cabin"),
                  })
                }
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group bg-white cursor-pointer"
              >
                <div
                  className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <cat.icon size={22} />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {cat.label}
                </span>
                <span className="text-xs text-slate-400">
                  {cat.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
              Why StayNest
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              Renting, Reimagined
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              We've built every feature around making your rental experience
              seamless, safe, and genuinely enjoyable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Verified Listings", desc: "Every property is manually reviewed by our trust & safety team. Photo authenticity guaranteed.", color: "bg-blue-600" },
              { icon: Key, title: "Seamless Booking", desc: "From search to signed lease in under 24 hours. Our streamlined process removes all friction.", color: "bg-teal-500" },
              { icon: Bell, title: "24/7 Support", desc: "Real humans available around the clock to resolve any issue before, during, or after your stay.", color: "bg-amber-500" },
              { icon: Award, title: "Best Price Promise", desc: "We match any lower price you find for the same listing elsewhere — no questions asked.", color: "bg-purple-500" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div
                  className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                Top Destinations
              </p>
              <h2
                className="text-3xl md:text-4xl font-extrabold text-slate-800"
                style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
              >
                Popular Cities
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CITIES.map((city, i) => (
              <button
                key={city.name}
                onClick={() => navigateToExplore({ query: city.name })}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer border-none p-0 ${
                  i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    i < 2 ? "h-64" : "h-48"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 text-left">
                  <h3 className="text-xl font-bold text-white mb-1">{city.name}</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1">
                    <Building2 size={12} />
                    {city.properties} properties
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
              Simple process
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              How StayNest Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-teal-200" />
            {[
              { step: "01", icon: Search, title: "Search & Filter", desc: "Use our powerful search with location, type, price, and amenity filters to find exactly what you're looking for.", color: "bg-blue-600" },
              { step: "02", icon: Compass, title: "Explore & Compare", desc: "Browse detailed property pages with gallery tours, amenity lists, owner profiles, and verified guest reviews.", color: "bg-teal-500" },
              { step: "03", icon: CheckCircle, title: "Book with Confidence", desc: "Contact the owner directly or book instantly. Your deposit is protected by StayNest Guarantee until move-in.", color: "bg-amber-500" },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div
                key={step}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center relative"
              >
                <div
                  className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-5`}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-500">{step}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
              What renters say
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              Trusted by Thousands
            </h2>
          </div>
          {/* Featured testimonial */}
          <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative max-w-3xl">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-white/95">
                &quot;{TESTIMONIALS[testimonialIdx].comment}&quot;
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={TESTIMONIALS[testimonialIdx].image}
                  alt={TESTIMONIALS[testimonialIdx].name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/40"
                />
                <div className="text-left">
                  <p className="font-bold text-white">
                    {TESTIMONIALS[testimonialIdx].name}
                  </p>
                  <p className="text-white/70 text-sm">
                    {TESTIMONIALS[testimonialIdx].role}
                  </p>
                </div>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() =>
                      setTestimonialIdx(
                        (t) => (t - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
                      )
                    }
                    className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white border-none cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setTestimonialIdx((t) => (t + 1) % TESTIMONIALS.length)
                    }
                    className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white border-none cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.filter((_, i) => i !== testimonialIdx)
              .slice(0, 2)
              .map((t) => (
                <div key={t.id} className="bg-slate-50 rounded-2xl p-6 border border-gray-100 text-left">
                  <Stars rating={t.rating} size={14} />
                  <p className="text-slate-600 text-sm leading-relaxed my-4 line-clamp-3">
                    &quot;{t.comment}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
              Market insights
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              Rental Market Trends
            </h2>
            <p className="text-slate-500 mt-3">
              Real-time data from 38 markets across the United States.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left">
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Monthly Booking Revenue
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Platform-wide rental revenue across all listings (2024)
              </p>
              <div className="w-full" style={{ height: "240px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_MONTHLY}>
                    <defs>
                      <linearGradient id="blue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(v: any) => [fmt(v), "Revenue"]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                        fontSize: "13px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fill="url(#blue)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-left">
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Listings by Type
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Distribution of active listings
              </p>
              <div className="w-full" style={{ height: "180px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CHART_TYPES}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {CHART_TYPES.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #f1f5f9",
                        fontSize: "13px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {CHART_TYPES.map((t, i) => (
                  <div key={t.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: PIE_COLORS[i] }}
                      />
                      <span className="text-slate-600">{t.name}</span>
                    </div>
                    <span className="font-semibold text-slate-700">{t.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
              Got questions?
            </p>
            <h2
              className="text-3xl md:text-4xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full p-5 text-left hover:bg-slate-50 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <span className="font-semibold text-slate-800 text-sm pr-4">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp size={18} className="text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 py-20 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-white" />
          </div>
          <h2
            className="text-3xl font-extrabold text-white mb-3"
            style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
          >
            Stay Ahead of the Market
          </h2>
          <p className="text-white/80 mb-8">
            Get weekly curated listings, market trends, and exclusive StayNest deals
            delivered to your inbox.
          </p>
          {newsletterSuccess ? (
            <div className="flex items-center justify-center gap-2 bg-white/20 rounded-2xl py-4 px-6 text-white font-semibold">
              <CheckCircle size={20} />
              You&apos;re on the list! Welcome to StayNest.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white text-slate-700 placeholder:text-slate-400 outline-none text-sm font-medium border-none h-12"
              />
              <button
                onClick={() => {
                  if (newsletterEmail) {
                    setNewsletterSuccess(true);
                  }
                }}
                className="px-6 py-3.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap border-none cursor-pointer h-12 flex items-center justify-center"
              >
                Subscribe Free
              </button>
            </div>
          )}
          <p className="text-white/50 text-xs mt-4">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>
    </div>
  );
}
