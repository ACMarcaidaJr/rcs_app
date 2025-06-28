"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AccountInfo } from "@azure/msal-browser";
import { msalInstance } from "@/lib/msalInstance";
import { loginRequest } from "@/lib/authConfig";
import { useRouter } from "next/navigation";

interface AuthContextType {
  account: AccountInfo | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  account: null,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);

  // useEffect(() => {
  //   const checkAccount = async () => {
  //     try {
  //       await msalInstance.initialize(); // ✅ await initialization

  //       const response = await msalInstance.handleRedirectPromise();
  //       const accounts = msalInstance.getAllAccounts();

  //       if (response?.account) {
  //         msalInstance.setActiveAccount(response.account);
  //         setAccount(response.account);
  //       } else if (accounts.length > 0) {
  //         msalInstance.setActiveAccount(accounts[0]);
  //         setAccount(accounts[0]);
  //       }
  //     } catch (error) {
  //       console.error("Auth redirect error", error);
  //     }
  //   };

  //   checkAccount();
  // }, []);
  useEffect(() => {
    const checkAccount = async () => {
      try {
        await msalInstance.initialize();

        const response = await msalInstance.handleRedirectPromise();
        const accounts = msalInstance.getAllAccounts();

        if (response?.account) {
          msalInstance.setActiveAccount(response.account);
          setAccount(response.account);
        } else if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0]);
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Auth redirect error", error);
      }
    };

    checkAccount();
  }, []);


  const login = async () => {
    try {
      await msalInstance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login failed", error);
    }
  };



  // Inside your AuthProvider component
  const router = useRouter();

  const logout = () => {
    msalInstance.logoutRedirect().finally(() => {
      // Redirect to the homepage after logout is completed
      router.push('/');
    });
  };



  return (
    <AuthContext.Provider value={{ account, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
