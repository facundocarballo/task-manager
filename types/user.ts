import { COLLECTION_USER } from "@/firebase/constants/collections";
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { USER_TOKEN_KEY } from "@/firebase/constants/local.storage";
import { AbsoluteString } from "next/dist/lib/metadata/types/metadata-types";

export class User {
    uid: string|undefined;
    displayName: string;
    email: string;
    photoUrl: string;
    token: string|undefined;

    constructor(
        user: any
    ) {
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.email = user.email;
        this.photoUrl = user.photoUrl;
    }

    async Save():Promise<undefined> {
         try {
            const docRef = await addDoc(
                collection(db, COLLECTION_USER), 
                {
                    displayName: this.displayName,
                    email: this.email
                }
            );
         }catch (err) {
            console.error("Error saving the data of the user in Firebase Firestore. ", err);
         }
    }

    async SaveToken(accessToken: string): Promise<undefined> {
        try {
            localStorage.setItem(USER_TOKEN_KEY, accessToken);
            this.token = accessToken;
        }catch (err) {
            console.error("Error saving the token in storage ", err);
         }
    }

    static async GetToken(): Promise<string|null> {
        return localStorage.getItem(USER_TOKEN_KEY);
    }
}