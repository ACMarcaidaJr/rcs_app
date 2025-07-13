"use client"
// import { useLocation } from 'react-router-dom'
"use client";
import { usePathname } from "next/navigation";

export default function useCheckActiveNav() {
  const pathname = usePathname();

  const checkActiveNav = (nav: string) => {
    const pathWithoutPage = pathname.replace(/^\/page/, "") || "/";
    const normalizedNav = nav.startsWith("/page") ? nav.replace(/^\/page/, "") : nav;

    return pathWithoutPage === normalizedNav;
  };

  return { checkActiveNav };
}

// 'use client'

// import { usePathname } from 'next/navigation'

// export default function useCheckActiveNav() {
//   const pathname = usePathname()

//   const checkActiveNav = (nav: string) => {
//     const pathArray = pathname.split('/').filter((item) => item !== '')

//     if (nav === '/' && pathArray.length < 1) return true

//     return pathArray.includes(nav.replace(/^\//, ''))
//   }

//   return { checkActiveNav }
// }
