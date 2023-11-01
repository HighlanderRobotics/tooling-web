import 'dotenv/config';
import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "$lib/server/util/prisma";

export const handle = SvelteKitAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            }
        }),
    ],
    pages: {
        signIn: '/',
    },
    trustHost: true,
    callbacks: {
        async session({ session, user }) {
            // Send properties to the client, like an access_token from a provider.
            if (session.user) {
                session.user.image = `/api/people/${user.id}/picture`
            }

            return session
        }
    }
});