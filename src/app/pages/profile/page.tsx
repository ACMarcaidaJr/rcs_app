"use client"

import { Layout } from "@/components/custom/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Offices from "./components/offices"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useAuth } from "@/context/AuthProvider"

export default function Profile() {
    const { account, login, loading, logout } = useAuth();

    return (
        <Layout>
            <Layout.Header sticky>
                <h1>My Profile</h1>
            </Layout.Header>
            <Layout.Body>
                <div className="flex flex-col gap-5">
                    <div className="">
                        <div className="flex flex-row gap-5 items-center">
                            <Avatar className="h-50 w-50">
                                <AvatarImage className="rounded-full h-[100px] w-[100px]" src="https://github.com/shadcn.png" />
                                <AvatarFallback>DP</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-[24px] font-medium">{`${account?.idTokenClaims?.name && account?.idTokenClaims?.name} `}</p>
                                <p> {`${account?.idTokenClaims?.preferred_username && account?.idTokenClaims?.preferred_username} `}</p>
                            </div>
                        </div>
                    </div>
                    <Tabs defaultValue="account" className="  w-full rounded-sm">
                        <TabsList className="bg-ghost w-full flex flex-row justify-start">
                            <TabsTrigger className="w-fit" value="account">My Office</TabsTrigger>
                            <TabsTrigger className="w-fit" value="password">Achievements</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <Offices />
                        </TabsContent>
                        <TabsContent value="password">
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                            <p>My Achievements</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </Layout.Body>
        </Layout>
    )
}