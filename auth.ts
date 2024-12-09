import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { SignInSchema } from "./schema/signInSchema";
import { prisma } from "./prisma/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
                userType: {}
            },
            authorize: async (credentials): Promise<any> => {
                const { username, password, userType } = await SignInSchema.parseAsync(credentials);

                let user;
                if (userType === 'admin') {
                    user = await prisma.admin.findUnique({
                        where: {
                            username: username,
                            password: password
                        },
                        select: {
                            id: true,
                            username: true,
                            teamId: true,
                            name: true
                        }
                    });
                } else {
                    user = await prisma.member.findUnique({
                        where: {
                            username: username,
                            password: password
                        },
                        select: {
                            id: true,
                            username: true,
                            teamId: true,
                            firstname: true,
                            lastname: true,
                            number: true
                        }
                    });
                }

                if (!user) {
                    throw new Error("Invalid credentials.")
                }

                return user;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                if (user.teamId === 0) {
                    token.username = user.username;
                    token.role = user.teamId;
                    token.userId = user.id;
                    token.name = user.name;
                } else {
                    token.username = user.username;
                    token.role = user.teamId;
                    token.userId = user.id;
                    token.firstname = user.firstname;
                    token.lastname = user.lastname;
                }
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            session.user = {
                ...session.user,
                username: token.username,
                role: token.role,
                id: token.userId,
            };

            if (token.role === 0) {
                session.user.name = token.name;
            } else {
                session.user.firstname = token.firstname;
                session.user.lastname = token.lastname;
            }

            return session;
        }
    }
})