'use client';

import React, { useState } from "react";
import { Mail, Phone, MapPin, Globe, CheckCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Invalid email";
    }
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16 text-left">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-teal-600 text-sm font-semibold uppercase tracking-wide mb-2">
            Get in Touch
          </p>
          <h1
            className="text-4xl font-extrabold text-slate-800"
            style={{ fontFamily: "var(--font-heading), Plus Jakarta Sans, sans-serif" }}
          >
            We're Here to Help
          </h1>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Have a question, a problem, or just want to say hello? Our support team responds within 2 hours on business days.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            {[
              {
                icon: Mail,
                title: "Email Us",
                lines: ["support@staynest.com", "partnerships@staynest.com"],
                color: "bg-blue-600",
              },
              {
                icon: Phone,
                title: "Call Us",
                lines: ["+1 (800) 782-9638", "Mon–Fri, 8am–8pm ET"],
                color: "bg-teal-500",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                lines: ["548 Market St, Suite 11", "San Francisco, CA 94104"],
                color: "bg-amber-500",
              },
              {
                icon: Globe,
                title: "Global Offices",
                lines: ["New York · Los Angeles", "Chicago · Miami · Austin"],
                color: "bg-purple-500",
              },
            ].map(({ icon: Icon, title, lines, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start"
              >
                <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm mb-1">{title}</p>
                  {lines.map((l) => (
                    <p key={l} className="text-slate-500 text-sm">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={36} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 mb-3">Message Sent!</h3>
                <p className="text-slate-500 text-sm">
                  Thanks for reaching out, {form.name}. We'll reply to <strong>{form.email}</strong> within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm border-none cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-extrabold text-slate-800 mb-6">Send Us a Message</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      Your Name *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Alex Johnson"
                      className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors h-11 ${
                        errors.name
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      Email Address *
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors h-11 ${
                        errors.email
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 h-11 bg-white"
                    >
                      <option value="">Select a topic…</option>
                      {[
                        "Booking Question",
                        "Property Listing Help",
                        "Account Issue",
                        "Partnership Inquiry",
                        "Press & Media",
                        "General Feedback",
                      ].map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      Message *
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      rows={6}
                      placeholder="Tell us how we can help…"
                      className={`w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors ${
                        errors.message
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border-none cursor-pointer text-sm"
                >
                  <Send size={16} />Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
