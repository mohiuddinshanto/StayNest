'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Modal } from "./Modal";


interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  action?: string;
}

export function LoginPromptModal({ open, onClose, action = "perform this action" }: LoginPromptModalProps) {
  const pathname = usePathname();
  
  // লগিনের পর ফিরে আসার জন্য রিডাইরেক্ট পাথ তৈরি
  const redirectPath = encodeURIComponent(pathname);

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title="Sign In Required"
    >
      <div className="p-6 text-center">
        <p className="text-slate-600 mb-8">
          You need to sign in to <span className="font-semibold text-slate-800">{action}</span>.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href={`/auth?redirect=${redirectPath}`}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-center"
          >
            Sign In
          </Link>
          <Link
            href={`/auth?redirect=${redirectPath}`}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-center"
          >
            Register
          </Link>
        </div>
      </div>
    </Modal>
  );
}