'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pt-16 text-left">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-600 to-teal-500 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h1
            className="text-5xl font-extrabold text-white mb-5"
            style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
          >
            The Story Behind StayNest
          </h1>
          <p className="text-white/80 text-xl leading-relaxed max-w-2xl mx-auto">
            We set out to build the rental platform we always wished existed — honest listings, real connections, and a process that respects everyone's time.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-teal-600 text-sm font-semibold uppercase tracking-wide mb-3">
                Our Mission
              </p>
              <h2
                className="text-4xl font-extrabold text-slate-800 mb-6"
                style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
              >
                Making Renting Honest, Simple, and Human
              </h2>
              <p className="text-slate-500 leading-relaxed mb-4">
                StayNest was founded in 2022 by a team of renters, landlords, and engineers who had all experienced the frustration of outdated listing platforms, misleading photos, and unresponsive agents.
              </p>
              <p className="text-slate-500 leading-relaxed mb-6">
                We built StayNest to fix all of that — with photo verification, direct owner communication, transparent pricing, and a support team that's actually available when you need them.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: "2022", label: "Founded" },
                  { value: "38", label: "Cities" },
                  { value: "4.9★", label: "App Rating" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-3xl font-extrabold text-blue-600">{value}</p>
                    <p className="text-slate-400 text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=500&fit=crop"
                alt="About StayNest"
                className="rounded-3xl shadow-2xl w-full object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">100% Verified</p>
                    <p className="text-slate-400 text-xs">Every listing checked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-teal-600 text-sm font-semibold uppercase tracking-wide mb-2">
              The People
            </p>
            <h2
              className="text-3xl font-extrabold text-slate-800"
              style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
            >
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Jordan Ellis",
                role: "CEO & Co-founder",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
              },
              {
                name: "Maya Patel",
                role: "CPO & Co-founder",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
              },
              {
                name: "Sam Chen",
                role: "CTO",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
              },
              {
                name: "Isla Moore",
                role: "Head of Design",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
              },
            ].map(({ name, role, image }) => (
              <div key={name} className="text-center group">
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl overflow-hidden group-hover:shadow-lg transition-shadow">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-bold text-slate-800 text-sm">{name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2
            className="text-3xl font-extrabold text-slate-800 mb-4"
            style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
          >
            Ready to Find Your Next Home?
          </h2>
          <p className="text-slate-500 mb-8">
            Join 14,000+ renters who found their perfect space through StayNest.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/explore")}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors border-none cursor-pointer text-sm"
            >
              Explore Properties
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="px-8 py-3.5 border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 font-bold rounded-xl transition-colors cursor-pointer text-sm"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
