'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Building2,
  CheckCircle,
  Key,
  Clock,
  MapPin,
  Eye,
  Trash2,
  Pencil,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useProperties } from "@/context/PropertyContext";
import { fetchMyProperties, deleteProperty as deletePropertyApi } from "@/lib/api";
import type { Property } from "@/types";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import toast from "react-hot-toast";

export default function ManagePropertiesPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useProperties();
  const [myProps, setMyProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Protect route
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }, [isLoggedIn, router]);

  const loadMyProperties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyProperties();
      setMyProps(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load your properties");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch the owner's own properties directly (includes pending/rejected listings
  // that don't show up in the global, publicly-approved properties list)
  useEffect(() => {
    if (!isLoggedIn || !user) return;
    loadMyProperties();
  }, [isLoggedIn, user, loadMyProperties]);

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const toastId = toast.loading("Deleting listing...");
    try {
      await deletePropertyApi(deleteId);
      setMyProps((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Listing deleted successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete listing", { id: toastId });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  const approvalBadgeVariant = (status?: string) =>
    status === "approved" ? "green" : status === "rejected" ? "red" : "amber";

  const pendingApprovalCount = myProps.filter((p) => p.approvalStatus === "pending").length;
  const approvedCount = myProps.filter((p) => p.approvalStatus === "approved").length;
  const rejectedCount = myProps.filter((p) => p.approvalStatus === "rejected").length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="text-left">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 text-left"
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

        {/* Approval Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Approval Pending",
              value: pendingApprovalCount,
              icon: AlertCircle,
              color: "bg-amber-50 text-amber-600",
            },
            {
              label: "Approved",
              value: approvedCount,
              icon: CheckCircle,
              color: "bg-green-50 text-green-600",
            },
            {
              label: "Rejected",
              value: rejectedCount,
              icon: XCircle,
              color: "bg-red-50 text-red-500",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 text-left"
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

        {/* Loading state */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
            <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading your listings...</p>
          </div>
        ) : myProps.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
            <Building2 size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No listings yet</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              List your rental property on StayNest and start earning revenue today.
            </p>
            <button
              onClick={() => router.push("/add-property")}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl border-none cursor-pointer"
            >
              Create First Listing
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                    {["Property", "City", "Rent/mo", "Type", "Status", "Approval", "Listed", "Actions"].map((h) => (
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
                        {p.status === "rented" && p.rentedByName && (
                          <p className="text-[11px] text-slate-400 mt-1">Rented by {p.rentedByName}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div
                          title={
                            p.approvalStatus === "rejected" && p.rejectionReason
                              ? p.rejectionReason
                              : undefined
                          }
                        >
                          <Badge variant={approvalBadgeVariant(p.approvalStatus)}>
                            {p.approvalStatus || "pending"}
                          </Badge>
                          {p.approvalStatus === "rejected" && p.rejectionReason && (
                            <p className="text-[11px] text-red-400 mt-1 max-w-[160px] line-clamp-1">
                              {p.rejectionReason}
                            </p>
                          )}
                        </div>
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
                            onClick={() => router.push(`/manage/edit/${p.id}`)}
                            className="w-8 h-8 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center transition-colors border-none cursor-pointer"
                            title="Edit Property"
                          >
                            <Pencil size={14} />
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
                      <div className="flex items-center flex-wrap gap-2 mt-2">
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
                        {p.status === "rented" && p.rentedByName && (
                          <span className="text-[11px] text-slate-400">Rented by {p.rentedByName}</span>
                        )}
                        <Badge variant={approvalBadgeVariant(p.approvalStatus)}>
                          {p.approvalStatus || "pending"}
                        </Badge>
                      </div>
                      {p.approvalStatus === "rejected" && p.rejectionReason && (
                        <p className="text-[11px] text-red-400 mt-1 line-clamp-2">
                          {p.rejectionReason}
                        </p>
                      )}
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
                      onClick={() => router.push(`/manage/edit/${p.id}`)}
                      className="flex-1 py-3 flex items-center justify-center gap-1.5 text-amber-600 text-sm font-medium hover:bg-amber-50 border-none bg-transparent cursor-pointer"
                    >
                      <Pencil size={14} />Edit
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
          </>
        )}
      </div>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={() => !deleting && setDeleteId(null)} title="Delete Property">
        <div className="p-6 text-left">
          <p className="text-slate-600 text-sm mb-6">
            Are you sure you want to permanently delete this listing? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              disabled={deleting}
              className="flex-1 py-3 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 bg-white cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {deleting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
