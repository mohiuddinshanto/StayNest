'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  MapPin,
  AlertCircle,
  Star,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { useProperties } from "@/context/PropertyContext";
import {
  fetchAllPropertiesAdmin,
  updatePropertyApprovalStatus,
  deletePropertyAdmin,
  fetchAdminAnalytics,
} from "@/lib/api";
import type { AdminProperty, AdminAnalytics } from "@/types";
import { Badge } from "@/components/Badge";
import { Modal } from "@/components/Modal";
import toast from "react-hot-toast";

// NOTE: AdminAnalytics is assumed to look roughly like:
// {
//   totalRevenue: number;
//   totalProperties: number;
//   totalUsers: number;
//   ownerAnalytics: {
//     ownerId: string;
//     ownerName: string;
//     ownerEmail: string;
//     propertyCount: number;
//     totalRevenue: number;
//     totalReviews: number;
//     totalInquiries: number;
//   }[];
// }
// If your actual @/types definition uses different field names, adjust the
// accessors below (search for `as any` fallbacks).

type Tab = "pending" | "all" | "revenue";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);

const approvalBadgeVariant = (status?: string) =>
  status === "approved" ? "green" : status === "rejected" ? "red" : "amber";

export default function AdminPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useProperties();

  const [activeTab, setActiveTab] = useState<Tab>("pending");

  // Pending Approvals tab
  const [pendingProps, setPendingProps] = useState<AdminProperty[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingLoaded, setPendingLoaded] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Any in-flight status change (approve / reject / set-to-pending), keyed by property id.
  // Used to disable the relevant Actions buttons in the "All Properties" tab while a request is in flight.
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Reject modal
  const [rejectTarget, setRejectTarget] = useState<AdminProperty | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  // All Properties tab
  const [allProps, setAllProps] = useState<AdminProperty[]>([]);
  const [allLoading, setAllLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);

  // Delete modal (admin)
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Revenue & Sales tab
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);

  // Protect route: admins only
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  const loadPending = useCallback(async () => {
    setPendingLoading(true);
    try {
      const res = await fetchAllPropertiesAdmin("pending");
      setPendingProps(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load pending properties");
    } finally {
      setPendingLoading(false);
      setPendingLoaded(true);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setAllLoading(true);
    try {
      const res = await fetchAllPropertiesAdmin();
      setAllProps(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load properties");
    } finally {
      setAllLoading(false);
      setAllLoaded(true);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetchAdminAnalytics();
      setAnalytics(res);
    } catch (err: any) {
      toast.error(err.message || "Failed to load analytics");
    } finally {
      setAnalyticsLoading(false);
      setAnalyticsLoaded(true);
    }
  }, []);

  // Lazy-load each tab's data the first time it's opened
  useEffect(() => {
    if (!isLoggedIn || !user || user.role !== "admin") return;
    if (activeTab === "pending" && !pendingLoaded) loadPending();
    if (activeTab === "all" && !allLoaded) loadAll();
    if (activeTab === "revenue" && !analyticsLoaded) loadAnalytics();
  }, [activeTab, isLoggedIn, user, pendingLoaded, allLoaded, analyticsLoaded, loadPending, loadAll, loadAnalytics]);

  if (!isLoggedIn || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Applies a fresh property record (as returned by the API) to both the
  // "Pending Approvals" and "All Properties" lists, so every view stays in sync
  // no matter which tab the change was made from — no full page reload needed.
  const applyStatusUpdate = (updated: AdminProperty) => {
    setAllProps((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
    setPendingProps((prev) => {
      if (updated.approvalStatus === "pending") {
        const exists = prev.some((p) => p.id === updated.id);
        return exists
          ? prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
          : [...prev, updated];
      }
      // No longer pending (approved or rejected) — drop it from the pending list.
      return prev.filter((p) => p.id !== updated.id);
    });
  };

  // Used by the "Pending Approvals" tab's Approve button.
  const handleApprove = async (id: string) => {
    setApprovingId(id);
    const toastId = toast.loading("Approving listing...");
    try {
      const updated = await updatePropertyApprovalStatus(id, "approved");
      applyStatusUpdate(updated as unknown as AdminProperty);
      toast.success("Listing approved!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to approve listing", { id: toastId });
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectTarget || !rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setRejecting(true);
    const toastId = toast.loading("Rejecting listing...");
    try {
      const updated = await updatePropertyApprovalStatus(
        rejectTarget.id,
        "rejected",
        rejectReason.trim()
      );
      applyStatusUpdate(updated as unknown as AdminProperty);
      toast.success("Listing rejected", { id: toastId });
      setRejectTarget(null);
      setRejectReason("");
    } catch (err: any) {
      toast.error(err.message || "Failed to reject listing", { id: toastId });
    } finally {
      setRejecting(false);
    }
  };

  // Generic handler used by the "All Properties" tab Actions — covers Approve
  // and "Set to Pending" (Reject still routes through the reason modal above).
  const handleSetStatus = async (id: string, approvalStatus: "approved" | "pending") => {
    setStatusUpdatingId(id);
    const toastId = toast.loading(
      approvalStatus === "approved" ? "Approving listing..." : "Moving listing to pending..."
    );
    try {
      const updated = await updatePropertyApprovalStatus(id, approvalStatus);
      applyStatusUpdate(updated as unknown as AdminProperty);
      toast.success(
        approvalStatus === "approved" ? "Listing approved!" : "Listing set back to pending",
        { id: toastId }
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update listing status", { id: toastId });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const toastId = toast.loading("Deleting listing...");
    try {
      await deletePropertyAdmin(deleteId);
      setAllProps((prev) => prev.filter((p) => p.id !== deleteId));
      setPendingProps((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Listing deleted successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete listing", { id: toastId });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // Shared Actions button group for the "All Properties" tab — always offers
  // whichever transitions make sense given the property's current approvalStatus.
  const renderPropertyActions = (p: AdminProperty) => {
    const isUpdating = statusUpdatingId === p.id;
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {p.approvalStatus !== "approved" && (
          <button
            onClick={() => handleSetStatus(p.id, "approved")}
            disabled={isUpdating}
            title="Approve"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold rounded-lg transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            <CheckCircle size={13} />
            Approve
          </button>
        )}
        {p.approvalStatus !== "rejected" && (
          <button
            onClick={() => {
              setRejectTarget(p);
              setRejectReason("");
            }}
            disabled={isUpdating}
            title="Reject"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-lg transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            <XCircle size={13} />
            Reject
          </button>
        )}
        {p.approvalStatus !== "pending" && (
          <button
            onClick={() => handleSetStatus(p.id, "pending")}
            disabled={isUpdating}
            title="Set to Pending"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-semibold rounded-lg transition-colors border-none cursor-pointer disabled:opacity-50"
          >
            <RotateCcw size={13} />
            Set to Pending
          </button>
        )}
        <button
          onClick={() => setDeleteId(p.id)}
          disabled={isUpdating}
          className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors border-none cursor-pointer disabled:opacity-50 shrink-0"
          title="Delete Property"
        >
          <Trash2 size={13} />
        </button>
      </div>
    );
  };

  const ownerRows = ((analytics as any)?.ownerAnalytics || (analytics as any)?.owners || [])
    .slice()
    .sort((a: any, b: any) => (b.totalRevenue || 0) - (a.totalRevenue || 0));

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "pending", label: "Pending Approvals", icon: Clock },
    { key: "all", label: "All Properties", icon: Building2 },
    { key: "revenue", label: "Revenue & Sales", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 text-left">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1
              className="text-3xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              Admin Panel
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage listings, approvals, and platform revenue
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border-none cursor-pointer ${
                activeTab === key
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={15} />
              {label}
              {key === "pending" && pendingProps.length > 0 && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === key ? "bg-white/20 text-white" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {pendingProps.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ============================================ */}
        {/* TAB 1: PENDING APPROVALS */}
        {/* ============================================ */}
        {activeTab === "pending" && (
          <>
            {pendingLoading ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading pending listings...</p>
              </div>
            ) : pendingProps.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <CheckCircle size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">All caught up!</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto">
                  There are no properties waiting for approval right now.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-left">
                {pendingProps.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 p-5">
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        className="w-full sm:w-32 h-32 sm:h-24 rounded-xl object-cover shrink-0 bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-800 text-base line-clamp-1">
                              {p.title}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                              <MapPin size={11} />
                              {p.address}
                            </p>
                          </div>
                          <Badge variant="amber">pending</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-slate-500">
                          <span className="font-bold text-blue-600">{fmt(p.rent)}/mo</span>
                          <span>Owner: {p.ownerName}</span>
                          <span>{p.city}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleApprove(p.id)}
                            disabled={approvingId === p.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors border-none cursor-pointer disabled:opacity-50"
                          >
                            {approvingId === p.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectTarget(p);
                              setRejectReason("");
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-xl transition-colors border-none cursor-pointer"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ============================================ */}
        {/* TAB 2: ALL PROPERTIES */}
        {/* ============================================ */}
        {activeTab === "all" && (
          <>
            {allLoading ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading properties...</p>
              </div>
            ) : allProps.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <Building2 size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No properties found</h3>
                <p className="text-slate-400 text-sm">
                  Properties listed on the platform will appear here.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-gray-100">
                      <tr>
                        {["Property", "Owner", "City", "Rent/mo", "Approval", "Status", "Actions"].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {allProps.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0]}
                                alt={p.title}
                                className="w-12 h-10 rounded-xl object-cover shrink-0 bg-slate-100"
                              />
                              <p className="font-semibold text-slate-800 text-sm line-clamp-1 max-w-[200px]">
                                {p.title}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">{p.ownerName}</td>
                          <td className="px-5 py-4 text-sm text-slate-600">{p.city}</td>
                          <td className="px-5 py-4 text-sm font-bold text-blue-600">
                            {fmt(p.rent)}
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
                            </div>
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
                          <td className="px-5 py-4">{renderPropertyActions(p)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4 text-left">
                  {allProps.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <div className="flex gap-3 p-4">
                        <img
                          src={p.images?.[0]}
                          alt={p.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm line-clamp-2">
                            {p.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {p.ownerName} · {p.city}
                          </p>
                          <div className="flex items-center flex-wrap gap-2 mt-2">
                            <span className="text-blue-600 font-bold text-sm">
                              {fmt(p.rent)}/mo
                            </span>
                            <Badge variant={approvalBadgeVariant(p.approvalStatus)}>
                              {p.approvalStatus || "pending"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 px-4 pb-4">
                        {renderPropertyActions(p)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ============================================ */}
        {/* TAB 3: REVENUE & SALES */}
        {/* ============================================ */}
        {activeTab === "revenue" && (
          <>
            {analyticsLoading ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading analytics...</p>
              </div>
            ) : !analytics ? (
              <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                <DollarSign size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No analytics available</h3>
                <p className="text-slate-400 text-sm">Platform analytics will appear here.</p>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    {
                      label: "Platform Total Revenue",
                      value: fmt((analytics as any).totalRevenue),
                      icon: DollarSign,
                      color: "bg-green-50 text-green-600",
                    },
                    {
                      label: "Total Properties",
                      value: (analytics as any).totalProperties ?? 0,
                      icon: Building2,
                      color: "bg-blue-50 text-blue-600",
                    },
                    {
                      label: "Total Users",
                      value: (analytics as any).totalUsers ?? 0,
                      icon: Users,
                      color: "bg-teal-50 text-teal-600",
                    },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div
                      key={label}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 text-left"
                    >
                      <div
                        className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-slate-800">{value}</p>
                        <p className="text-xs text-slate-400">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Owner Revenue Table */}
                {ownerRows.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-gray-100 shadow-sm text-center">
                    <Users size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-1">No owner data yet</h3>
                    <p className="text-slate-400 text-sm">
                      Owner revenue breakdown will appear here once listings generate activity.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50 border-b border-gray-100">
                          <tr>
                            {[
                              "Owner",
                              "Email",
                              "Properties",
                              "Total Revenue",
                              "Reviews",
                              "Inquiries",
                            ].map((h) => (
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
                          {ownerRows.map((o: any) => (
                            <tr key={o.ownerId} className="hover:bg-slate-50 transition-colors">
                              <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                                {o.ownerName}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-500">{o.ownerEmail}</td>
                              <td className="px-5 py-4 text-sm text-slate-600">
                                {o.propertyCount}
                              </td>
                              <td className="px-5 py-4 text-sm font-bold text-green-600">
                                {fmt(o.totalRevenue)}
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Star size={12} className="text-amber-400" />
                                  {o.totalReviews}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <MessageSquare size={12} className="text-blue-400" />
                                  {o.totalInquiries}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4 text-left">
                      {ownerRows.map((o: any) => (
                        <div
                          key={o.ownerId}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                        >
                          <p className="font-bold text-slate-800 text-sm">{o.ownerName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{o.ownerEmail}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm">
                            <span className="font-bold text-green-600">
                              {fmt(o.totalRevenue)}
                            </span>
                            <span className="text-slate-500">{o.propertyCount} properties</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Star size={11} className="text-amber-400" />
                              {o.totalReviews} reviews
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={11} className="text-blue-400" />
                              {o.totalInquiries} inquiries
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => !rejecting && setRejectTarget(null)}
        title="Reject Listing"
      >
        <div className="p-6 text-left">
          <p className="text-slate-600 text-sm mb-1">
            Rejecting <span className="font-semibold text-slate-800">{rejectTarget?.title}</span>
          </p>
          <p className="text-slate-400 text-xs mb-4">
            This reason will be visible to the property owner.
          </p>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
            <AlertCircle size={12} />
            Reason for rejection
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="e.g. Images are unclear, address could not be verified..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 resize-none"
          />
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setRejectTarget(null)}
              disabled={rejecting}
              className="flex-1 py-3 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 bg-white cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              disabled={rejecting || !rejectReason.trim()}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {rejecting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Reject Listing
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal (Admin) */}
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
              {deleting && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}