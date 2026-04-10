
"use client";
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/custom/button";
import Image from "next/image";
import { IconArrowRight, IconBrandAzure, IconFileCheck } from '@tabler/icons-react';

// import { ArrowRightIcon } from "@radix-ui/react-icons";
export default function LandingPage() {
  const { data: session, status } = useSession()
  console.log("moduleLinks", session?.moduleLinks)
  console.log("SESSSION", session)
  return (
    <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
      <div className="flex flex-col-reverse md:flex-row justify-center items-center px-4 md:px-8 max-w-[1366px] w-full gap-5">
        <div className="flex-1 items-center md:items-start flex flex-col h-full gap-4 py-[10px]">
          <h1 className="text-center md:text-start text-[clamp(2rem,6vw,3rem)] font-bold text-gray-800 dark:text-white">
            Welcome to Records and Communication Section&apos;s Portal
          </h1>
          <p className="text-center md:text-start text-gray-600 dark:text-gray-300">
            You are accessing a website application that is limited to authorized users.
          </p>

          {
            session ? <Button onClick={() => signOut()} size="lg" className="w-fit flex gap-[7px]" variant="destructive">
              <IconBrandAzure size={18} />
              Sign out
            </Button > : <Button onClick={() => signIn("azure-ad")} size="lg" className="w-fit flex gap-[7px]">
              <IconBrandAzure size={18} />
              Sign in with my Microsoft account
            </Button >
          }
        </div>

        <div className="flex items-center md:items-start flex-1 h-[300px] justify-center text-gray-500">
          <div className="w-full max-w-md mb-8 lg:mb-0">
            <Image
              src="/landing-illustration.png"
              alt="Records and Communication"
              width={600}
              height={400}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

