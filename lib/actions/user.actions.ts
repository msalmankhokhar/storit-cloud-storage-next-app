"use server"

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const handleError = (error: unknown, msg: string) => {
    console.log(msg);
    throw error;
}

// const getUserByEmail = async (email: string)=> {
//     const {databases} = await createAdminClient();
//     const result = await databases.listDocuments(
//         appwriteConfig.databaseId,
//         appwriteConfig.usersCollectionId,
//         [Query.equal('email', email)]
//     );
//     return result.total > 0 ? result.documents[0] : null
// }

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])],
    );

    return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
}

export const createAccount = async ({ fullName, email }: { fullName: string, email: string }) => {
    const existingUser = await getUserByEmail(email);
    const accountId = await sendEmailOTP({ email });
    if (!accountId) throw new Error("Failed to send an OTP");
    if (!existingUser) {
        const { databases } = await createAdminClient();
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                avatar: avatarPlaceholderUrl,
                email,
                accountId,
            },
        );
    }
    return parseStringify({ accountId });
}

export const verifySecret = async ({ accountId, password }: { accountId: string, password: string }) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);
        (await cookies()).set("appwrite-session", session.secret, {
            path: '/',
            httpOnly: false,
            sameSite: 'strict',
            secure: true
        })
        return parseStringify({ sessionId: session.$id });
    } catch (error) {
        console.log(error, 'Failed to verify OTp');
    }
}

export const getCurrentUser = async () => {
    const { databases, account } = await createSessionClient();
    const result = await account.get();
    const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [
            Query.equal('accountId', result.$id)
        ]
    );
    if (user.total <= 0) return null;
    return parseStringify(user.documents[0]);
}

export const logout = async () => {
    const { account } = await createSessionClient();
    try {
        // Delete the current session
        await account.deleteSession('current');
        (await cookies()).delete("appwrite-session");

    } catch (error) {
        handleError(error, "Failed to logout user");
    } finally {
        redirect('/login');
    }
}

export const loginUser = async ({ email }: { email: string }) => {
    console.log("Logging in user");
    try {
        const existing = await getUserByEmail(email);
        // If user exists send him OTP
        if (existing) {
            await sendEmailOTP({ email });
            return parseStringify({ accountId: existing.accountId })
        }
        return parseStringify({ accountId: null, error: "User not found" })
    } catch (error) {
        handleError(error, "Failed to login user")
    }
}