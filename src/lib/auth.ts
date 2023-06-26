import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { fetchRedis } from "@/helpers/redis";

function getGithubCredentials() {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error("Missing GITHUB_CLIENT_ID environment variable");
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing GITHUB_CLIENT_SECRET environment variable");
    }

    return {
        clientId,
        clientSecret,
    };
}

function getFacebookCredentials() {
    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error("Missing FACEBOOK_CLIENT_ID environment variable");
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing FACEBOOK_CLIENT_SECRET environment variable");
    }

    return {
        clientId,
        clientSecret,
    };
}

function getEmailProviderOption() {
    const server = process.env.EMAIL_SERVER;
    const from = process.env.EMAIL_FROM;

    if (!server) {
        throw new Error("Missing EMAIL_SERVER environment variable");
    }

    if (!from) {
        throw new Error("Missing EMAIL_FROM environment variable");
    }

    return {
        server,
        from,
    };
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        GithubProvider({
            clientId: getGithubCredentials().clientId,
            clientSecret: getGithubCredentials().clientSecret,
        }),
        FacebookProvider({
            clientId: getFacebookCredentials().clientId,
            clientSecret: getFacebookCredentials().clientSecret,
        }),
        EmailProvider(getEmailProviderOption()),
    ],
    callbacks: {
        jwt({ token, user, account, profile, trigger }) {
            console.log("token", token);
            console.log("user", user);
            console.log("account", account);
            console.log("profile", profile);
            console.log("trigger", trigger);
            return {
                id: token.id,
                email: token.email,
                picture: token.picture,
                name: token.name,
            };
        },

        session({ session, token }) {
            console.log("session", session);
            console.log("token", token);
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        },
    },
};
