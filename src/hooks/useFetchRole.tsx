'use client';
import { useEffect } from 'react';
import Cookies from "js-cookie";
import { useAuth } from '@/context/MsalProvider';

interface UserClaims {
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
}

interface RoleResponse {
  success: boolean;
  message: string;
  modules: any[];
}

export const useFetchRole = (account: { idTokenClaims?: UserClaims } | null, loading: boolean) => {
  // console.log('RUNNNNNNNNNNNNNNNNINGGGGGGG')
  useEffect(() => {
    if (!account?.idTokenClaims?.preferred_username && !loading) {
      Cookies.remove("user_and_modules");
      window.localStorage.removeItem("user_modules")
      return;
    }

    const fetchRole = async () => {
      try {
        const res = await fetch('/api/sign-in-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_name: account?.idTokenClaims?.preferred_username,
            given_name: account?.idTokenClaims?.given_name,
            family_name: account?.idTokenClaims?.family_name,
            user_email: account?.idTokenClaims?.email,
          }),
        });

        const result = await res.json();
        console.log('user_modules>>>', result.user_modules)
        if (result.success) {
          localStorage.setItem('user_modules', JSON.stringify(result.modules));
        } else {
          Cookies.remove("user_and_modules");
          window.localStorage.removeItem("user_modules")
        }
      } catch (err) {
        console.error('Error:', err);
        Cookies.remove("user_and_modules");
        window.localStorage.removeItem("user_modules")
      }
    };

    fetchRole();
  }, [account]);

};
