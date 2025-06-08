"use client";
import { useAuth } from "@/context/MsalProvider";
import { useEffect } from "react";
import { msalInstance } from "@/lib/msalInstance"; // we'll define this below
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    useEffect(() => {
        const handleRedirect = async () => {
            try {
                await msalInstance.initialize(); // ✅ must await

                const response = await msalInstance.handleRedirectPromise();
                if (response?.account) {
                    msalInstance.setActiveAccount(response.account);
                }

                router.push("/dashboard");
            } catch (error) {
                console.error("Redirect error", error);
            }
        };

        handleRedirect();
    }, [router]);
    return (
        <div className="p-4">
            <h1 className="text-xl mb-4">Login Page</h1>
            <button
                onClick={login}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Login with Microsoft
            </button>
        </div>
    );
}
