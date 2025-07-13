

// not been using because, this one is already in serverside where uses credintial types: application user/service
'use client'
import { useEffect, useState } from "react";
import { useAuth } from "@/context/MsalProvider";
import { msalInstance } from "@/lib/msalInstance";
import { loginRequest } from "@/lib/authConfig";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export function useAccessToken() {
  const { account } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      if (!account) return;

      try {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account,
        });
        setToken(response.accessToken);
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          await msalInstance.acquireTokenRedirect({
            ...loginRequest,
            account,
          });
        } else {
          console.error("Token error", error);
        }
      }
    };

    getToken();
  }, [account]);

  return token;
}
