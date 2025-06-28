// app/redirect/page.tsx
"use client";
// import { useEffect } from "react";
// import { msalInstance } from "@/lib/msalInstance"; // we'll define this below
// import { useRouter } from "next/navigation";
export default function RedirectPage() {
  // const router = useRouter();
  // useEffect(() => {
  //   const handleRedirect = async () => {
  //     try {
  //       await msalInstance.initialize(); 

  //       const response = await msalInstance.handleRedirectPromise();
  //       if (response?.account) {
  //         msalInstance.setActiveAccount(response.account);
  //       }

  //       // router.push("/dashboard");
  //     } catch (error) {
  //       console.error("Redirect error", error);
  //     }
  //   };

  //   handleRedirect();
  // }, [router]);


  return <p>Landing Page</p>;
}
