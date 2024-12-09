"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ClientDetails } from "@/components/ClientDetails"
import { getMember } from "@/app/api/member/server"

type MemberDetails = {
    number: string,
    username: string,
    status: string,
    firstname: string,
    lastname: string,
    team: {
        id: number,
        name: string,
    };
    clients: {
        id: number;
        createdAt: Date;
        status: number;
        updatedAt: Date;
        name: string;
        behaviour: string;
        company: string;
        dealStatus: string;
        dealValue: number;
        description: string;
        remarks: string;
        memberId: number | null;
        fieldVisits: number;
        detailedRemarks: string | null;
}[];
} | null | undefined


export default function MemberDetailsPage() {
    const { id } = useParams()
    const [member, setMember] = useState<MemberDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const response = await getMember(Number(id));
                const data = response.data;
                setMember(data)
            } catch (error) {
                console.error("Failed to fetch member details:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMemberDetails()
    }, [id])

    if (isLoading) {
        return <MemberDetailsSkeleton />
    }

    if (!member) {
        return <div>Member not found</div>
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Member Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Name</Label>
                            <p className="text-lg">{`${member.firstname} ${member.lastname}`}</p>
                        </div>
                        <div>
                            <Label>Username</Label>
                            <p className="text-lg">{member.username}</p>
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <p className="text-lg">{member.number}</p>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <p className="text-lg">{member.status}</p>
                        </div>
                        <div>
                            <Label>Team</Label>
                            <p className="text-lg">{member.team.name}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Client List</CardTitle>
                </CardHeader>
                <CardContent>
                    {member.clients.length > 0 ? (
                        <div className="space-y-4">
                            {member.clients.map((client) => (
                                <ClientDetails key={client.id} client={client} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No clients assigned to this member.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function MemberDetailsSkeleton() {
    return (
        <div className="container mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="h-4 w-1/4 mb-2" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

