import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAccountDoc } from "./database/account.model";
import { SignInSchema } from "./lib/validations";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { IUserDoc } from "./database/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        // 1. Validate schema of credentials using SignInSchema.
        const validationResult = SignInSchema.safeParse(credentials);

        // 2. If validation is successful, then check existingAccount and existingUser in the database, if any of them doesn't exist, we return null to indicate that the sign-in has failed, otherwise we return the user object to indicate that the sign-in has succeeded.
        if (validationResult.success) {
          const { email, password } = validationResult.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;

          if (!existingAccount) return null;

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IUserDoc>;

          if (!existingUser) return null;

          // 3. If the user and account both exist, we need to verify the password using bcrypt, if the password is correct, we return the user object to indicate that the sign-in has succeeded, otherwise we return null to indicate that the sign-in has failed.
          const isPasswordValid = await bcrypt.compare(
            password,
            existingAccount.password! // We can be sure that the password is not undefined here because if the account exists and it's a credentials account, it must have a password
          );

          if (isPasswordValid) {
            return {
              id: existingUser._id.toString(),
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
          return null; // If the password is invalid.
        }
        return null; // If validation fails
      },
    }),
  ],
  // What is need of callbacks ? - Callbacks are functions that can be used to control what happens when an action is performed, such as signing in or signing out. They allow you to customize the behavior of the authentication process and can be used to perform additional actions, such as logging or redirecting the user after a successful sign-in.
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") {
        return true;
      }

      if (!account || !user) return false; // If there is no account or user, we return false to prevent the sign-in from succeeding

      const userInfo = {
        name: user.name,
        email: user.email,
        image: user.image,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: {
          name: userInfo.name ?? "",
          email: userInfo.email ?? "",
          image: userInfo.image ?? "",
          username: userInfo.username,
        },
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false; // If the API call to sign in with OAuth fails, we return false to prevent the sign-in from succeeding

      return true; // If everything is successful, we return true to allow the sign-in to succeed
    },

    async session({ session, token }) {
      session.user.id = token.sub as string; // Add the user ID from the token to the session object, this allows us to have access to the user ID in the session, which can be useful for making authenticated API calls or for displaying user-specific information in the UI
      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<IAccountDoc>; // We can use the providerAccountId to find the account in our database and get the user ID, which we can then add to the token for use in the session callback

        if (!success || !existingAccount) {
          return token; // If we fail to find the account, we just return the token without adding the user ID, this will result in the session callback not having access to the user ID, but it will still allow the sign-in to succeed
        }

        const userId = existingAccount.userId;
        if (userId) {
          token.sub = userId.toString(); // Add the user ID to the token's sub property, which is a standard property for identifying the subject of the token (in this case, the user), this allows us to have access to the user ID in the session callback, which can be useful for making authenticated API calls or for displaying user-specific information in the UI
        }
      }

      return token;
    },
  },
});
