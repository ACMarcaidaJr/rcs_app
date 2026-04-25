"use client";
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/custom/button";
import Image from "next/image";
import {
  IconBrandAzure,
  IconShieldLock,
  IconLogout,
  IconDatabase
} from '@tabler/icons-react';
import React from "react";

export default function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Left Side: Illustration & Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-600 dark:bg-blue-900 p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <IconDatabase size={400} className="absolute -bottom-20 -left-20 rotate-12 text-white" />
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <Image
            src="/landing-illustration.png"
            alt="Records Management Illustration"
            width={500}
            height={500}
            className="w-full h-auto drop-shadow-2xl mb-8"
            priority
          />
          <h2 className="text-3xl font-bold text-white mb-4">
            Securing Agency Information
          </h2>
          <p className="text-blue-100 text-lg">
            A centralized hub for the efficient management, archiving, and protection of official communications.
          </p>
        </div>
      </div>

      {/* Right Side: Login Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-20">
        <div className="w-full max-w-[440px] space-y-8">

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <IconShieldLock size={14} />
              Secure Access
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Records & Communication Portal
            </h1>

            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
              Access is restricted to authorized personnel. Please sign in using your organization credentials.
            </p>
          </div>

          <div className="pt-4">
            {session ? (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Signed in as</p>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{session.user?.email}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    // link="/dashboard" // Assuming your dashboard path
                    size="lg"
                    className="flex-1 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => signOut()}
                    size="lg"
                    variant="outline"
                    className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-slate-200"
                  >
                    <IconLogout size={18} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => signIn("azure-ad", undefined, { prompt: "select_account" })}
                size="lg"
                className="w-full h-14 rounded-xl flex gap-3 text-lg font-semibold bg-[#0067b8] hover:bg-[#005da6] text-white shadow-xl shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                <IconBrandAzure size={22} />
                Sign in with Microsoft
              </Button>
            )}
          </div>

          <footer className="pt-12 text-center lg:text-left">
            <p className="text-xs text-slate-400 dark:text-slate-600">
              Department of Tourism — Records and Communication Section <br />
              &copy; {new Date().getFullYear()} All Rights Reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}