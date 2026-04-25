"use client";

import React from "react";
import { Button } from "@/components/custom/button";
import { 
  IconShieldOff, 
  IconMail, 
  IconArrowLeft, 
  IconLockAccess 
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function NoRolePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950 px-6">
      <div className="max-w-md w-full text-center space-y-8 p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
        
        {/* Icon Header */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 scale-150 blur-2xl bg-red-500/10 rounded-full" />
            <div className="relative bg-red-50 dark:bg-red-950/30 p-4 rounded-full text-red-600">
              <IconShieldOff size={48} stroke={1.5} />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Access Restricted
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Your account is authenticated, but you haven't been assigned a specific role in the <span className="font-semibold text-slate-700 dark:text-slate-200">Records Hub</span>. 
          </p>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3 rounded-lg flex items-start gap-3 text-left">
            <IconLockAccess size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-400">
              In compliance with <strong>NAP ERMS Policy</strong>, access to government records is strictly limited to authorized personnel with designated roles.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Button 
            onClick={() => window.location.href = "mailto:dotrcs@tourism.gov.ph?subject=Access%20Request%20-%20Records%20Portal"}
            className="w-full h-11 flex gap-2 font-semibold"
          >
            <IconMail size={18} />
            Contact Administrator
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="h-11 flex gap-2 border-slate-200 dark:border-slate-800"
            >
              <IconArrowLeft size={18} />
              Go Back
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => signOut({ callbackUrl: "/" })}
              className="h-11 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400 dark:text-slate-600 uppercase tracking-widest pt-4 border-t border-slate-100 dark:border-slate-800">
          Internal Systems Security
        </p>
      </div>
    </div>
  );
}