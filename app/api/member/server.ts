'use server'

import { prisma } from "@/prisma/prisma";

export async function getTeams() {
    try {
        const teams = await prisma.teams.findMany({
            include: {
                members: true
            }
        });

        return { status: 200, message: "Fetching all teams successfully", data: teams};
    } catch(e) {
        return { status: 500, message: "Error while fetching teams", error: e };
    }
}

export async function createMember(username: string, password: string, firstname: string, lastname: string, number: string, teamId: number, status: string) {
    try {
        const response = await prisma.member.create({
            data: {
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                number: number,
                teamId: teamId,
                status: status
            }
        });

        return { status: 200, message: "Member Created", data: response };
    } catch(e) {
        return { status: 500, message: "Error while creating member" + e }
    }
}

export async function deleteMember(username: string, memberId: number) {
    try {
        await prisma.member.delete({
            where: {
                username: username
            }
        });

        return { status: 200, message: "Member Deleted" };
    } catch(e) {
        return { status: 500, message: "Error while deleting member" + e }
    }
}

export async function updateMember(username: string, password: string, firstname: string, lastname: string, teamId: number, memberId: number, status: string) {
    try {
        const response = await prisma.member.update({
            where: {
                id: memberId
            },
            data: {
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                teamId: teamId,
                status: status,
                updatedAt: new Date(Date.now())
            }
        });

        return { status: 200, message: "Member Updated", data: response };
    } catch(e) {
        return { status: 500, message: "Error while updating member" + e }
    }
}

export async function getMember(id: number) {
    try {
        const response = await prisma.member.findFirst({
            where: {
                id: id
            },
            select: {
                username: true,
                number: true,
                firstname: true,
                lastname: true,
                status: true,
                team: true,
                clients: true
            }
        });

        return { status: 200, message: "Member Updated", data: response };
    } catch(e) {
        return { status: 500, message: "Error while updating member" + e }
    }
}