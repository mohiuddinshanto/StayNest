'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Eye,
  Star,
  TrendingUp,
  DollarSign,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useProperties } from "@/context/PropertyContext";
import { Badge } from "@/components/Badge";

const CHART_MONTHLY = [
  { month: "Jan", revenue: 42000, bookings: 28 },
  { month: "Feb", revenue: 48500, bookings: 32 },
  { month: "Mar", revenue: 54200, bookings: 37 },
  { month: "Apr", revenue: 61800, bookings: 43 },
  { month: "May", revenue: 58400, bookings: 40 },
  { month: "Jun", revenue: 72100, bookings: 51 },
  { month: "Jul", revenue: 84300, bookings: 59 },
  { month: "Aug", revenue: 79800, bookings: 55 },
  { month: "Sep", revenue: 68200, bookings: 46 },
  { month: "Oct", revenue: 63400, bookings: 43 },
  { month: "Nov", revenue: 57900, bookings: 38 },
  { month: "Dec", revenue: 71200, bookings: 49 },
];

const CHART_TYPES = [
  { name: "Apartments", value: 38 },
  { name: "Houses", value: 28 },
  { name: "Villas", value: 14 },
  { name: "Studios", value: 11 },
  { name: "Lofts", value: 5 },
  { name: "Other", value: 4 },
];

const PIE_COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#8b5cf6", "#ec4899", "#94a3b8"];

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user, properties } = useProperties();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect route
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }, [isLoggedIn, router]);

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

  // Simulate owned properties
  const myProps = properties.slice(0, 6);
  const totalRevenue = myProps.reduce((s, p) => s + p.rent, 0);

  const dashData = CHART_MONTHLY.slice(-6).map((d) => ({
    ...d,
    income: Math.round(d.revenue / 12),
    expenses: Math.round((d.revenue / 12) * 0.22),
  }));

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 text-left">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100"
            />
            <div>
              <p className="text-slate-400 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-extrabold text-slate-800">{user.name}</h1>
            </div>
          </div>
          <button
            onClick={() => router.push("/add-property")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm border-none cursor-pointer self-start sm:self-center"
          >
            <Plus size={16} />Add Property
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8 text-left">
          {[
            {
              label: "Monthly Revenue",
              value: fmt(totalRevenue),
              change: "+12.4%",
              icon: DollarSign,
              color: "bg-blue-600",
              trend: true,
            },
            {
              label: "Active Listings",
              value: String(myProps.filter((p) => p.status === "available").length),
              change: "+2 this month",
              icon: Building2,
              color: "bg-teal-500",
              trend: true,
            },
            {
              label: "Total Views",
              value: "3,847",
              change: "+18% vs last month",
              icon: Eye,
              color: "bg-amber-500",
              trend: true,
            },
            {
              label: "Avg. Rating",
              value: (
                myProps.reduce((s, p) => s + p.rating, 0) / (myProps.length || 1)
              ).toFixed(1),
              change: "From 94 reviews",
              icon: Star,
              color: "bg-purple-500",
              trend: false,
            },
          ].map(({ label, value, change, icon: Icon, color, trend }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">
                  {label}
                </p>
                <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-800 mb-1">{value}</p>
              <p
                className={`text-xs font-medium flex items-center gap-1 ${
                  trend ? "text-green-500" : "text-slate-400"
                }`}
              >
                {trend && <TrendingUp size={11} />}
                {change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 text-left">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="mb-5">
              <h3 className="font-bold text-slate-800">Income vs Expenses</h3>
              <p className="text-xs text-slate-400">Last 6 months</p>
            </div>
            <div className="w-full min-h-[220px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dashData} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(v: any, name?: any) => [
                        fmt(v),
                        name === "income" ? "Income" : "Expenses",
                      ]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #f1f5f9",
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="income" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expenses" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] w-full bg-slate-50 animate-pulse rounded-xl" />
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 mb-1">Portfolio Split</h3>
              <p className="text-xs text-slate-400 mb-4">By property type</p>
            </div>
            <div className="w-full flex justify-center items-center min-h-[170px]">
              {mounted ? (
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={CHART_TYPES.slice(0, 4)}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {CHART_TYPES.slice(0, 4).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #f1f5f9",
                        fontSize: 13,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[170px] w-full bg-slate-50 animate-pulse rounded-xl" />
              )}
            </div>
            <div className="space-y-1.5 mt-2">
              {CHART_TYPES.slice(0, 4).map((t, i) => (
                <div key={t.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: PIE_COLORS[i] }}
                    />
                    <span className="text-slate-500">{t.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800">Recent Properties</h3>
            <button
              onClick={() => router.push("/manage")}
              className="text-sm text-blue-600 font-medium hover:underline border-none bg-transparent cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myProps.slice(0, 3).map((p) => (
              <div
                key={p.id}
                onClick={() => router.push(`/property/${p.id}`)}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-14 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 text-xs line-clamp-1">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.city}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-blue-600">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
