"use server";

import { Account, Avatars, Client, Databases, Storage } from "node-appwrite"
import { appwriteConfig } from "./config"
import { cookies } from "next/headers";

export const createSessionClient = async () => {

    const { endpointUrl, projectId } = appwriteConfig;

    const client = new Client()
        .setEndpoint(endpointUrl)
        .setProject(projectId);

    const session = (await cookies()).get('appwrite-session');
    if (!session || !session.value) throw new Error("No session");

    client.setSession(session.value);


    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        }

    }

}

export const createAdminClient = async () => {

const { endpointUrl, projectId  , secretKey} = appwriteConfig;

 const client = new Client()
        .setEndpoint(endpointUrl)
        .setProject(projectId)
        .setKey(secretKey)



    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        },
        get storage() {
             return new Storage(client);
        },
        get avatar() {
             return new Avatars(client);
        },

    }


}