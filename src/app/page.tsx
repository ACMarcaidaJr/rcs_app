
"use client";

import { Button } from "@/components/custom/button";
import Image from "next/image";
import { IconArrowRight, IconBrandAzure } from '@tabler/icons-react';
import { useAuth } from "@/context/MsalProvider";
import { toast } from "@/components/ui/use-toast"
import { useFetchRole } from "@/hooks/useFetchRole";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
// import { ArrowRightIcon } from "@radix-ui/react-icons";
export default function LandingPage() {
  const { account, login, loading, logout } = useAuth();

  const [hasShownToast, setHasShownToast] = useState(false)
  // client:✅ login 
  // client:✅ if there is new account, tooltip message: sucessfully logged-in, you will be redirect if you are authorized 
  // server: if account, sent to server to check authorization/link and if this user is already signed-in
  // server: log the user sign-in/log-in
  // client: if user is authorized, the user will be redirected to the secured route




  useEffect(() => {
    if (account && !hasShownToast) {
      toast({
        title: "Logged in",
        description: "We are currently checking your account for authorization",
        variant: "default",
      })
      setHasShownToast(true)
    }
  }, [account, hasShownToast])
  console.log('account', account)


  // useFetchRole(account)

  const getRole = async () => {
    window.location.reload()
  };
  
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

          {/* Show button only when loading is false */}
          {!loading && (
            account ? (
              <div className="flex flex-row gap-3">

                <Button onClick={logout} variant='destructive' size="lg" className="w-fit flex gap-[7px]">
                  <IconBrandAzure size={18} />
                  Logout account
                </Button>
                <Button onClick={getRole} size='lg' variant='outline' className="w-fit flex gap-[7px]">
                  <IconArrowRight size={18} />
                  Go to app
                </Button>
              </div>
            ) : (
              <Button onClick={login} size="lg" className="w-fit flex gap-[7px]">
                <IconBrandAzure size={18} />
                Sign  in with my Microsoft account
              </Button >

            )
          )}
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

