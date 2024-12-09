"use server"

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function signInAuth(username: string, password: string, userType: string) {
    try {
        await signIn('credentials', {
            username,
            password,
            userType,
            redirect: false
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                success: false,
                error: 'Invalid credentials'
            };
        }
        return {
            success: false,
            error: 'An unexpected error occurred',
            err: error
        };
    }
}

export async function signOutAuth() {
    return await signOut({ redirectTo: '/signin' });
}

