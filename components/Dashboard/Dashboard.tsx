"use client"

import { Calendar, ChevronLeft, ChevronRight, Phone, PieChart, Users, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { useState } from 'react'

const weeklyPerformanceData = [
    { day: "Mon", calls: 20, visits: 5, deals: 2 },
    { day: "Tue", calls: 30, visits: 8, deals: 3 },
    { day: "Wed", calls: 25, visits: 6, deals: 1 },
    { day: "Thu", calls: 35, visits: 9, deals: 4 },
    { day: "Fri", calls: 28, visits: 7, deals: 2 },
    { day: "Sat", calls: 15, visits: 3, deals: 1 },
    { day: "Sun", calls: 10, visits: 2, deals: 0 },
]

const monthlyOverviewData = [
    { month: "Jan", leads: 150, calls: 500, visits: 100, deals: 20 },
    { month: "Feb", leads: 180, calls: 550, visits: 120, deals: 25 },
    { month: "Mar", leads: 200, calls: 600, visits: 130, deals: 30 },
    { month: "Apr", leads: 220, calls: 650, visits: 140, deals: 35 },
]

export default function Dashboard() {
    const [currentWeek, setCurrentWeek] = useState("May 1 - May 7, 2023")

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads (This Month)</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Calls Made (This Month)</CardTitle>
                        <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,567</div>
                        <p className="text-xs text-muted-foreground">+10.5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Field Visits (This Month)</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">389</div>
                        <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Deals Closed (This Month)</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">52</div>
                        <p className="text-xs text-muted-foreground">+8 from last month</p>
                    </CardContent>
                </Card>
            </div>
            <Card className='mb-4'>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Weekly Performance Overview</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="icon">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium">{currentWeek}</span>
                            <Button variant="outline" size="icon">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={weeklyPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="calls" stackId="1" stroke="#8884d8" fill="#8884d8" name="Calls" />
                            <Area type="monotone" dataKey="visits" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Visits" />
                            <Area type="monotone" dataKey="deals" stackId="1" stroke="#ffc658" fill="#ffc658" name="Deals" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Overview (Last 4 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={monthlyOverviewData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                            <Bar dataKey="calls" fill="#82ca9d" name="Calls" />
                            <Bar dataKey="visits" fill="#ffc658" name="Visits" />
                            <Bar dataKey="deals" fill="#ff7300" name="Deals" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    )
}