import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { fetchRedis } from "@/helpers/redis";

function getGithubCredentials() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GITHUB_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GITHUB_CLIENT_SECRET");
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
    throw new Error("Missing FACEBOOK_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing FACEBOOK_CLIENT_SECRET");
  }

  return {
    clientId,
    clientSecret,
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
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUserResult = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null;

      if (!dbUserResult) {
        token.id = user!.id;
        return token;
      }

      const dbUser = JSON.parse(dbUserResult) as User;

      return {
        id: dbUser.id,
        email: dbUser.email,
        picture: dbUser.image,
        name: dbUser.name,
      };
    },

    async session({ session, token }) {
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
