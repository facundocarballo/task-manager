import { COLLECTION_Category, COLLECTION_USER } from "@/firebase/constants/collections";
import { db } from "@/firebase/config";
import { collection, doc, getDoc, query, getDocs, setDoc } from "firebase/firestore";
import { USER_TOKEN_KEY } from "@/firebase/constants/local.storage";
import { Category } from "./category";
import { Task } from "./task";

export class User {
    uid: string|undefined;
    displayName: string;
    email: string;
    photoUrl: string;
    token: string|undefined;
    categories: Category[];
    tasksCompleted: Task[];
    tasksDeleted: Task[];

    constructor(
        user: any
    ) {
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.email = user.email;
        this.photoUrl = user.photoURL;

        if (user.categories === undefined)
            this.categories = [];
        else 
            this.categories = user.categories;

        if (user.tasksCompleted === undefined)
            this.tasksCompleted = [];
        else
            this.tasksCompleted = user.tasksCompleted;

        if (user.tasksDeleted === undefined)
            this.tasksDeleted = [];
        else
            this.tasksDeleted = user.tasksDeleted;
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
        this.categories = [];

        const q = query(
            collection(
                db, 
                COLLECTION_USER + "/" + this.email + "/" + COLLECTION_Category
            ));
        
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs;
        for (let i = 0; i < docs.length; i++) {
            const cat = await Category.CreateCategoryWithTasksToDo(
                docs[i].data(), docs[i].id, this.email, "",
                []
            );
            this.categories.push(cat);
        }
    }

    async CreateCategory(name: string, description: string, color: string): Promise<undefined> {
        try {

            const ref = doc(
                collection(
                    db,
                    COLLECTION_USER + "/" + this.email + "/" + 
                    COLLECTION_Category
                )
            );

            await setDoc(ref, {
                name: name,
                description: description,
                color: color,
            });

            this.categories.push(new Category(
                ref.id,
                name,
                description,
                color,
                [],
                [],
                [],
                [],
                this.email,
                "",
                []
            ));

        } catch(err) {
            console.error("Error creating category. ", err);
        }
    }

    EditCategory(
        name: string, 
        description: string, 
        color: string, 
        catId: string
    ): undefined {
        for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].uid === catId) {
                this.categories[i].name = name;
                this.categories[i].description = description;
                this.categories[i].color = color;
                break;
            }
        }
    }

    GetCategoryFromName(name: string): Category|undefined {
        for (const cat of this.categories) {
           const theCat = cat.FindCategoryByName(name);
           if (theCat !== undefined) 
            return theCat;
        }
    }

    // Tasks
    async GetTasksDeletedFirebase(): Promise<undefined> {
        for (const cat of this.categories) {
            await cat.GetTasksDeletedFromFirebase();
        }
        this.GetAllTasksDeleted();
    }

    async GetTasksCompletedFirebase(): Promise<undefined> {
        for (const cat of this.categories) {
            await cat.GetTasksCompletedFromFirebase();
        }
        this.GetAllTasksCompleted();
    }

    GetAllTasksCompleted(): undefined {
        this.tasksCompleted = [];
        for (const cat of this.categories) {
            this.tasksCompleted.push(...cat.GetTasksCompleted());
        }
    }

    GetAllTasksDeleted(): undefined {
        this.tasksDeleted = [];
        for (const cat of this.categories) {
            this.tasksDeleted.push(...cat.GetTasksDeleted());
        }
    }

    DeleteTaskFromTasksToDoToCompleted(task: Task): undefined {
        for (const cat of this.categories) {
            cat.CompleteTask(task);
        }
    }

    DeleteTaskFromTasksToDoToDeleted(task: Task): undefined {
        for (const cat of this.categories) {
            cat.DeleteTask(task);
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

    // Static Methods
    static async GetToken(): Promise<string|null> {
        return localStorage.getItem(USER_TOKEN_KEY);
    }

    static async CreateUserWithCredential(
        user: any
    ): Promise<User> {
        const newUser = new User(user);
        await newUser.Save();
        await newUser.GetCategories();
        return newUser;
    }
}