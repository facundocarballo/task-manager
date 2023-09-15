import { COLLECTION_Category, COLLECTION_USER } from "@/firebase/constants/collections";
import { db } from "@/firebase/config";
import { collection, doc, getDoc, query, getDocs, setDoc } from "firebase/firestore";
import { USER_TOKEN_KEY } from "@/firebase/constants/local.storage";
import { Category } from "./category";

export class User {
    uid: string|undefined;
    displayName: string;
    email: string;
    photoUrl: string;
    token: string|undefined;
    categories: Category[];

    constructor(
        user: any
    ) {
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.email = user.email;
        this.photoUrl = user.photoUrl;
        this.categories = [];

        this.Save()
        this.GetCategories()
    }

    async Save():Promise<undefined> {
        const docRef = doc(db, COLLECTION_USER, this.email);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            try {

                await setDoc(
                    doc(db, COLLECTION_USER, this.email),
                    {
                        displayName: this.displayName,
                        email: this.email
                    }
                )
             }catch (err) {
                console.error("Error saving the data of the user in Firebase Firestore. ", err);
             }
        }
         
    }

    // Categories
    async GetCategories(): Promise<undefined> {
        const q = query(
            collection(
                db, 
                COLLECTION_USER + "/" + this.email + "/" + COLLECTION_Category
            ));
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            this.categories.push(new Category(doc.data(), doc.id, this.email))
        })
    }

    async CreateCategory(name: string, description: string, color: string): Promise<undefined> {
        try {
            await setDoc(
                doc(
                  db,
                  COLLECTION_USER + "/" + this.email + "/" + COLLECTION_Category,
                  this.categories.length.toString()
                ),
                {
                  name: name,
                  description: description,
                  color: color,
                }
            );
        } catch(err) {
            console.error("Error creating category. ", err);
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