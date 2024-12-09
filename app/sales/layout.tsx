"use client"

import Sidebar from "@/components/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react";
import { signOutAuth } from "../api/auth/server";
import { useSession } from "next-auth/react";
import { toCapitalise } from "@/lib/utils";

export default function ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { data: session } = useSession();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
            <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={toggleSidebar}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl lg:text-2xl font-bold">{`Welcome back, ${session?.user ? toCapitalise(session?.user?.firstname) + " " + toCapitalise(session?.user?.lastname) : "John Doe"}`}</h1>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-4">
                    <Button variant="outline" size="icon">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                    <AvatarFallback>{session?.user ? toCapitalise(session?.user?.firstname)[0] + toCapitalise(session?.user?.lastname)[0] : "JD"}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{session?.user ? toCapitalise(session?.user?.firstname) + " " + toCapitalise(session?.user?.lastname) : "John Doe"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{session?.user ? toCapitalise(session?.user?.username) : "John23"}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem onClick={async() => await signOutAuth()}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {children}
            </main>
        </div>
    )
}