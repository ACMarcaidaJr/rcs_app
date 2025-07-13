'use client';
import { useEffect } from 'react';

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

export const useFetchRole = (account: { idTokenClaims?: UserClaims } | null) => {
  useEffect(() => {
    const getRole = async () => {
      if (!account?.idTokenClaims?.preferred_username) return;

      try {
        const res = await fetch('/api/sign-in-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_name: account.idTokenClaims.preferred_username,
            given_name: account.idTokenClaims.given_name,
            family_name: account.idTokenClaims.family_name,
            user_email: account.idTokenClaims.email,
          }),
        });

        const result: RoleResponse = await res.json();
        console.log('getRole response', result);

        if (result.success && result.modules) {
          localStorage.setItem('user_modules', JSON.stringify(result.modules));
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    getRole();
  }, [account]);
};
