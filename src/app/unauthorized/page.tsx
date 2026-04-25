"use client";

import React from "react";
import { Button } from "@/components/custom/button";
import { 
  IconAlertOctagon, 
  IconUserShield, 
  IconArrowLeft, 
  IconGavel 
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0a0a0b] px-4">
      <div className="max-w-xl w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl rounded-sm overflow-hidden">
        
        {/* Security Header Bar */}
        <div className="bg-red-600 h-1.5 w-full" />
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* Warning Icon */}
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-full text-red-600 shrink-0">
              <IconAlertOctagon size={40} stroke={2} />
            </div>

            <div className="space-y-4 text-center md:text-left">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  403: Forbidden
                </h1>
                <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mt-1">
                  Unauthorized Access Attempt Detected
                </h2>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                You do not have the required security clearance to view this directory or record. 
                All access attempts to the <span className="font-mono font-bold">Records & Communication Portal</span> are logged and monitored for auditing purposes.
              </p>

              {/* Legal Note */}
              <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
                <IconGavel size={20} className="text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Pursuant to **RA 9470 (National Archives of the Philippines Act)**, unauthorized 
                  access, modification, or disposal of government records may be subject to 
                  administrative and criminal penalties.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => router.push("/login")}
                  className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
                >
                  Return to Login
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 h-12 border-slate-300 dark:border-slate-700"
                >
                  <IconArrowLeft size={18} className="mr-2" />
                  Previous Page
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Audit Info */}
        <div className="bg-slate-50 dark:bg-slate-800/30 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-bold">
            <IconUserShield size={14} />
            Secure Session Active
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            REF_ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}