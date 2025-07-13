"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AccountInfo } from "@azure/msal-browser";
import { msalInstance } from "@/lib/msalInstance";
import { loginRequest } from "@/lib/authConfig";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useFetchRole } from "@/hooks/useFetchRole";

interface AuthContextType {
  account: AccountInfo | null;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  account: null,
  login: () => { },
  logout: () => { },
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccount = async () => {
      try {
        await msalInstance.initialize();

        const response = await msalInstance.handleRedirectPromise();
        const accounts = msalInstance.getAllAccounts();

        const activeAccount = response?.account || accounts[0];
        if (activeAccount) {
          msalInstance.setActiveAccount(activeAccount);
          setAccount(activeAccount);

          // Get access token
          const tokenResponse = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: activeAccount,
          });

          // Store token in cookie
          Cookies.set("rcs_access_token", tokenResponse.accessToken, {
            secure: true,
            sameSite: "strict",
            path: "/",
          });
          console.log('activeAccountactiveAccount', activeAccount)


        }
      } catch (error) {
        console.error("Auth redirect error", error);
      } finally {
        setLoading(false);
      }
    };

    checkAccount();
  }, []);

// get user-modules and store it on the local storage
  useFetchRole(account)

  const login = async () => {
    try {
      await msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      alert("Login Failed, please restart your browser.");
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    Cookies.remove("rcs_access_token");
    Cookies.remove("user_modules");
    window.localStorage.removeItem("user_modules")
    msalInstance.logoutRedirect().finally(() => {
      router.push("/");
    });
  };

  return (
    <AuthContext.Provider value={{ account, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
