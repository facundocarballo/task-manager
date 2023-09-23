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
        this.photoUrl = user.photoUrl;

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
            console.log("cargando (en user)...");
            const cat = await Category.CreateCategoryWithTasksToDo(
                docs[i].data(), docs[i].id, this.email, "",
                []
            );
            console.log("listo (en user)...");
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

    _SearchCategory(uid: string, categories: Category[]): number {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].uid === uid) return i;
        }
        return -1;
    }

    _DeleteFirstItemOfArray(arr: string[]): string[] {
        let newArr = [];

        for (let i = 1; i < arr.length; i++) {
            newArr.push(arr[i]);
        }

        return newArr;
    }

    _DeleteCategory(uid: string, categories: Category[], paths: string[]): Category[]|undefined {
        let newCategories = [];
        console.log("Me llega este path: ", paths);

        if (paths.length === 0) {
            for (const cat of categories) {
                if (cat.uid !== uid) {
                    newCategories.push(cat);
                }
            }

            return newCategories;
        }

        if (paths.length !== 0) {
            const catIdx = this._SearchCategory(paths[0], categories);
            if (catIdx === -1) {
                console.error(`CatIdx don't found at ${paths[0]}. Categories: ${categories}`);
                return undefined;
            }

            console.log("Encontramos un padre: ", categories[catIdx].name);

            const newCats = this._DeleteCategory(
                uid, 
                categories[catIdx].subCategories, 
                this._DeleteFirstItemOfArray(paths)
            );
            
            if (newCats === undefined) {
                console.error(`_DeleteCategoy returned undefined at ${categories[catIdx].name}.`);
                return undefined;
            }
            categories[catIdx].subCategories = newCats;
        }


    }

    DeleteCategory(uidToDelete: string, paths: string[]): undefined {
        // let newCategories = [];
        // for (const cat of this.categories) {
        //     if (cat.uid !== uidToDelete) {
        //             newCategories.push(cat);
        //     }
        // }
        // this.categories = newCategories;
    
        // console.log("Path: ", path)

        this._DeleteCategory(uidToDelete, this.categories, paths)

    }

    GetCategoryFromName(name: string): Category|undefined {
        for (const cat of this.categories) {
            if (cat.name === name) {
                return cat;
            }
        }
    }

    // Tasks
    GetAllTasksCompleted(): undefined {
        for (const cat of this.categories) {
            for (const task of cat.tasksCompleted) {
                this.tasksCompleted.push(task);
            }
        }
    }

    GetAllTasksDeleted(): undefined {
        for (const cat of this.categories) {
            for (const task of cat.tasksDeleted) {
                this.tasksDeleted.push(task);
            }
        }
    }

    DeleteTaskFromTasksToDoToCompleted(task: Task): undefined {
        const newTasks: Task[] = [];
        for (let i = 0; i < this.categories.length; i++) {
            const cat = this.categories[i];
            if (cat.uid === task.category) {
                for (let j = 0; j < cat.tasks.length; j++) {
                    const t = cat.tasks[j];
                    if (t.uid !== task.uid) {
                        newTasks.push(t);
                    }
                }
                this.categories[i].tasks = newTasks;
                this.categories[i].tasksCompleted.push(task);
            }
        }
    }

    DeleteTaskFromTasksToDoToDeleted(task: Task): undefined {
        const newTasks: Task[] = [];
        for (let i = 0; i < this.categories.length; i++) {
            const cat = this.categories[i];
            if (cat.uid === task.category) {
                for (let j = 0; j < cat.tasks.length; j++) {
                    const t = cat.tasks[j];
                    if (t.uid !== task.uid) {
                        newTasks.push(t);
                    }
                }
                this.categories[i].tasks = newTasks;
                this.categories[i].tasksDeleted.push(task);
            }
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

    static async CreateUserWithCredential(user: any): Promise<User> {
        const newUser = new User(user);
        await newUser.Save();
        await newUser.GetCategories();
        newUser.GetAllTasksCompleted();
        newUser.GetAllTasksDeleted();
        return newUser;
    }
}