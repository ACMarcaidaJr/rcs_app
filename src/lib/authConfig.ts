// src/authConfig.js


// export const msalConfig = {
//   auth: {
//     clientId: "8a587953-b881-43db-ace1-f637c66fa52e",
//     authority: "https://login.microsoftonline.com/94b75d64-7f8d-4469-8b2a-e5d632dc947b",
//     redirectUri: "http://localhost:3000",
//   },
//   cache: {
//     cacheLocation: "sessionStorage",
//     storeAuthStateInCookie: false,
//   },
// };

// export const loginRequest = {
//   scopes: ["https://orgb2a75cb3.crm5.dynamics.com/.default"],
// };


'use client'

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
    authority: process.env.NEXT_PUBLIC_AUTHORITY!,
    redirectUri: process.env.NEXT_PUBLIC_BASE_URL!,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [process.env.NEXT_PUBLIC_SCOPES!],
};
// lib/msalConfig.ts

// import { PublicClientApplication, Configuration } from "@azure/msal-browser";

// const msalConfig: Configuration = {
//   auth: {
//     clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
//     authority: process.env.NEXT_PUBLIC_AUTHORITY!,
//     redirectUri: process.env.NEXT_PUBLIC_BASE_URL!,
//   },
//   cache: {
//     cacheLocation: "sessionStorage",
//     storeAuthStateInCookie: false,
//   },
// };

// export const msalInstance = new PublicClientApplication(msalConfig);
