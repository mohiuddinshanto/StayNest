'use client';

import React, { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Filter, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useProperties } from "@/context/PropertyContext";
import { PropertyCard } from "@/components/PropertyCard";
import { Badge } from "@/components/Badge";

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { properties } = useProperties();

  // Get initial values from query parameters
  const initialQuery = searchParams.get("query") || "";
  const initialType = searchParams.get("type") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("any");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const PER_PAGE = 8;

  // Sync state if search params change externally (e.g. navigation link clicks)
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setType(searchParams.get("type") || "all");
    setPage(1);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...properties];
    if (query) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.city.toLowerCase().includes(query.toLowerCase()) ||
          p.address.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (type !== "all") {
      list = list.filter((p) => p.type === type);
    }
    if (minPrice) {
      list = list.filter((p) => p.rent >= Number(minPrice));
    }
    if (maxPrice) {
      list = list.filter((p) => p.rent <= Number(maxPrice));
    }
    if (beds !== "any") {
      list = list.filter((p) =>
        beds === "5+" ? p.bedrooms >= 5 : p.bedrooms === Number(beds)
      );
    }
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.rent - a.rent);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return list;
  }, [properties, query, type, minPrice, maxPrice, beds, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const clearFilters = () => {
    setQuery("");
    setType("all");
    setMinPrice("");
    setMaxPrice("");
    setBeds("any");
    setSortBy("newest");
    setPage(1);
    // Clear URL parameters as well
    router.push("/explore");
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <h1
            className="text-3xl font-extrabold text-slate-800 mb-6"
            style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
          >
            Explore Properties
          </h1>
          {/* Search + Sort Row */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-slate-50 border border-gray-200 rounded-xl px-4 py-3">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search city, title, address…"
                className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
              {query && (
                <button onClick={() => setQuery("")} className="bg-transparent border-none cursor-pointer">
                  <X size={14} className="text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-colors cursor-pointer ${
                showFilters
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              <Filter size={16} />
              {showFilters ? "Hide Filters" : "Filters"}
            </button>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-600 outline-none cursor-pointer h-12"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                  Property Type
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none h-11"
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
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                  Min Rent ($/mo)
                </label>
                <input
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="e.g. 1000"
                  type="number"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none h-11"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                  Max Rent ($/mo)
                </label>
                <input
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="e.g. 10000"
                  type="number"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none h-11"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                  Bedrooms
                </label>
                <select
                  value={beds}
                  onChange={(e) => {
                    setBeds(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none h-11"
                >
                  <option value="any">Any</option>
                  {["1", "2", "3", "4", "5+"].map((b) => (
                    <option key={b} value={b}>
                      {b} Bed{b !== "1" ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 md:col-span-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium bg-transparent border-none cursor-pointer"
                >
                  <X size={14} />
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-500 text-sm">
            <span className="font-semibold text-slate-800">
              {filtered.length}
            </span>{" "}
            properties found
          </p>
        </div>
        {paginated.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No properties found
            </h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your search or clearing filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm border-none cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginated.map((p) => (
              <PropertyCard key={p.id} property={p} compact />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  page === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border border-gray-200 text-slate-600 hover:border-blue-300 bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
