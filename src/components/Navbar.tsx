'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Compass,
  Info,
  Mail,
  ChevronDown,
  Plus,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { useProperties } from "@/context/PropertyContext";
import toast from "react-hot-toast";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout, becomeOwner } = useProperties();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isOwnerOrAdmin = user?.role === "owner" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const isPlainUser = user?.role === "user";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when pathname changes
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "About", href: "/about", icon: Info },
    { label: "Contact", href: "/contact", icon: Mail },
  ];

  const isTransparent = pathname === "/" && !scrolled && !mobileOpen;

  const handleLogoutClick = async () => {
    const toastId = toast.loading("Signing out...");
    try {
      await logout();
      toast.success("Signed out successfully!", { id: toastId });
      router.push("/");
    } catch (err: any) {
      toast.error("Failed to sign out", { id: toastId });
    }
  };

  const handleBecomeOwner = async () => {
    const toastId = toast.loading("Upgrading your account...");
    try {
      await becomeOwner();
      toast.success("You're now an owner!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to become an owner", { id: toastId });
    }
  };


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <span
              className={`text-xl font-extrabold tracking-tight ${
                isTransparent ? "text-white" : "text-slate-800"
              }`}
            >
              Stay
              <span
                className="text-blue-600"
                style={{ color: isTransparent ? "#93c5fd" : "#2563eb" }}
              >
                Nest
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isTransparent
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn && user ? (
              <>
                {isOwnerOrAdmin && (
                  <>
                    <Link
                      href="/add-property"
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      <Plus size={15} />
                      Add Property
                    </Link>
                    <Link
                      href="/manage"
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isTransparent
                          ? "text-white/90 hover:bg-white/10"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Settings size={16} />
                    </Link>
                  </>
                )}
                {isPlainUser && (
                  <button
                    onClick={handleBecomeOwner}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Plus size={15} />
                    Become an Owner
                  </button>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isTransparent
                        ? "text-white/90 hover:bg-white/10"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ShieldCheck size={16} />
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isTransparent
                      ? "text-white/90 hover:bg-white/10"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard size={16} />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-200"
                    />
                    <span
                      className={`text-sm font-medium ${
                        isTransparent ? "text-white" : "text-slate-700"
                      }`}
                    >
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={isTransparent ? "text-white/70" : "text-slate-400"}
                    />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                      {isOwnerOrAdmin && (
                        <>
                          <Link
                            href="/manage"
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Settings size={15} />
                            Manage Properties
                          </Link>
                          <Link
                            href="/add-property"
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <Plus size={15} />
                            Add Property
                          </Link>
                        </>
                      )}
                      {isPlainUser && (
                        <button
                          onClick={handleBecomeOwner}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          <Plus size={15} />
                          Become an Owner
                        </button>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                        >
                          <ShieldCheck size={15} />
                          Admin Panel
                        </Link>
                      )}
                      <div className="my-1 border-t border-gray-100" />
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isTransparent
                      ? "text-white/90 hover:bg-white/10"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100"
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu
                size={20}
                className={isTransparent ? "text-white" : "text-slate-700"}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {navLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <l.icon size={16} />
                {l.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
            {isLoggedIn && user ? (
              <>
                {isOwnerOrAdmin && (
                  <>
                    <Link
                      href="/add-property"
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium bg-teal-500 text-white"
                    >
                      <Plus size={16} />
                      Add Property
                    </Link>
                    <Link
                      href="/manage"
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Settings size={16} />
                      Manage Properties
                    </Link>
                  </>
                )}
                {isPlainUser && (
                  <button
                    onClick={handleBecomeOwner}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium bg-teal-500 text-white"
                  >
                    <Plus size={16} />
                    Become an Owner
                  </button>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <ShieldCheck size={16} />
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white"
              >
                <LogIn size={16} />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}