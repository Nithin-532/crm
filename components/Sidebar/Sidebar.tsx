"use client"

import { usePathname, useRouter } from "next/navigation";
import React, { act, MouseEventHandler, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Home, Phone, PieChart, Users, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ sidebarOpen, toggleSidebar }: {sidebarOpen: boolean, toggleSidebar: any}) {
    const [activeTab, setActiveTab] = useState("overview")
    const router = useRouter()
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes('overview')) {
            setActiveTab('overview')
        }
        if (pathname.includes('leads')) {
            setActiveTab('leads')
        }
        if (pathname.includes('calls')) {
            setActiveTab('calls')
        }
        if (pathname.includes('calender')) {
            setActiveTab('calender')
        }
    }, [])

    return (
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 p-4 transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <PieChart className="h-6 w-6 mr-2 text-blue-500" />
                    <span className="text-lg font-bold">CRM Dashboard</span>
                </div>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
                    <X className="h-6 w-6" />
                </Button>
            </div>
            <nav className="space-y-2">
                <Button variant="ghost" className={`w-full justify-start ${activeTab === 'overview' && 'bg-slate-100 border'}`} onClick={() => { setActiveTab("overview"); toggleSidebar(); router.push("/sales/overview"); }}>
                    <Home className="mr-2 h-4 w-4" />
                    Overview
                </Button>
                <Button variant="ghost" className={`w-full justify-start ${activeTab === 'leads' && 'bg-slate-100 border'}`} onClick={() => { setActiveTab("leads"); toggleSidebar(); router.push("/sales/leads"); }}>
                    <Users className="mr-2 h-4 w-4" />
                    Leads
                </Button>
                {/* <Button variant="ghost" className={`w-full justify-start ${activeTab === 'calls' && 'bg-slate-100 border'}`} onClick={() => { setActiveTab("calls"); toggleSidebar(); router.push("/sales/calls"); }}>
                    <Phone className="mr-2 h-4 w-4" />
                    Calls
                </Button>
                <Button variant="ghost" className={`w-full justify-start ${activeTab === 'calender' && 'bg-slate-100 border'}`} onClick={() => { setActiveTab("calendar"); toggleSidebar(); router.push("/sales/calender"); }}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                </Button> */}
            </nav>
        </aside>
    )
}

export function RouteFunc({ path, children, name, value }: { path: string, children: React.ReactNode, name: String, value?: string }) {
    const router = useRouter();
    const pathname = usePathname()
    const selected = pathname === path;

    console.log(selected);

    return (
        <div onClick={() => router.push(path)} className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent ${selected && 'border-indigo-500 text-gray-800'} hover:border-indigo-500 pr-6 cursor-pointer`}>
            <span className="inline-flex justify-center items-center ml-4">
                {children}
            </span>
            <span className="ml-2 text-sm tracking-wide truncate">{name}</span>
            {value && <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-indigo-50 rounded-full">{value}</span>}
        </div>
    )
}