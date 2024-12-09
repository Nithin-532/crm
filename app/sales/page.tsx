"use client"

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export default async function() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.role === 1) {
            router.push("/sales/oveview")
        }
    }, [])

    return (
        <>
        </>
    )
}