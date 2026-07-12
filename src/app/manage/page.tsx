'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Building2, CheckCircle, Key, Clock, MapPin, Eye, Trash2 } from "lucide-react";
import { useProperties, Property } from "@/context/PropertyContext";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";

export default function ManagePropertiesPage() {
  const router = useRouter();
  const { isLoggedIn, properties, deleteProperty } = useProperties();
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  // Simulate owned properties by taking the first 6 properties from context
  const myProps = properties.filter((_, i) => i < 6);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              My Properties
            </h1>
            <p className="text-slate-500 mt-1">
              {myProps.length} active listing{myProps.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => router.push("/add-property")}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm border-none cursor-pointer"
          >
            <Plus size={16} />Add New
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Listed",
              value: myProps.length,
              icon: Building2,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Available",
              value: myProps.filter((p) => p.status === "available").length,
              icon: CheckCircle,
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Rented",
              value: myProps.filter((p) => p.status === "rented").length,
              icon: Key,
              color: "bg-teal-50 text-teal-600",
            },
            {
              label: "Pending",
              value: myProps.filter((p) => p.status === "pending").length,
              icon: Clock,
              color: "bg-amber-50 text-amber-600",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-800">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                {["Property", "City", "Rent/mo", "Type", "Status", "Listed", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myProps.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-12 h-10 rounded-xl object-cover shrink-0 bg-slate-100"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 text-sm line-clamp-1 max-w-[200px]">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-0.5 mt-0.5">
                          <MapPin size={10} />
                          {p.address.split(",")[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{p.city}</td>
                  <td className="px-5 py-4 text-sm font-bold text-blue-600">
                    {fmt(p.rent)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="gray">{p.type}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        p.status === "available"
                          ? "green"
                          : p.status === "rented"
                          ? "red"
                          : "amber"
                      }
                    >
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/property/${p.id}`)}
                        className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors border-none cursor-pointer"
                        title="View Property"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(p.id)}
                        className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors border-none cursor-pointer"
                        title="Delete Property"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 text-left">
          {myProps.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="flex gap-3 p-4">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm line-clamp-2">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{p.city}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-blue-600 font-bold text-sm">
                      {fmt(p.rent)}/mo
                    </span>
                    <Badge
                      variant={
                        p.status === "available"
                          ? "green"
                          : p.status === "rented"
                          ? "red"
                          : "amber"
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => router.push(`/property/${p.id}`)}
                  className="flex-1 py-3 flex items-center justify-center gap-1.5 text-blue-600 text-sm font-medium hover:bg-blue-50 border-none bg-transparent cursor-pointer"
                >
                  <Eye size={14} />View
                </button>
                <div className="w-px bg-gray-100" />
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="flex-1 py-3 flex items-center justify-center gap-1.5 text-red-500 text-sm font-medium hover:bg-red-50 border-none bg-transparent cursor-pointer"
                >
                  <Trash2 size={14} />Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Property">
        <div className="p-6 text-left">
          <p className="text-slate-600 text-sm mb-6">
            Are you sure you want to permanently delete this listing? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-3 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteId) deleteProperty(deleteId);
                setDeleteId(null);
              }}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors border-none cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
