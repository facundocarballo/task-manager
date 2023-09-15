import { db } from "@/firebase/config";
import { COLLECTION_Category, COLLECTION_Task, COLLECTION_TaskCompleted, COLLECTION_TaskDeleted, COLLECTION_USER } from "@/firebase/constants/collections";
import { DocumentData, doc, setDoc, Timestamp, query, collection, getDocs } from "firebase/firestore";
import { Task } from "./task";

export class Category {
    uid: string;
    name: string;
    description: string;
    color: string;
    tasks: Task[];
    tasksCompleted: Task[];
    tasksDeleted: Task[];
    subCategories: Category[];
    owner: string;

    constructor(
        data: DocumentData,
        uid: string,
        owner: string
    ) {
        this.uid = uid;
        this.name = data.name;
        this.description = data.description;
        this.color = data.color;
        this.tasks = [];
        this.tasksCompleted = [];
        this.tasksDeleted = [];
        this.subCategories = [];
        this.owner = owner;

        this.GetTasksToDo()
    }

    // Tasks
    async CreateTask(name: string, description: string, mustEnd: Date): Promise<undefined> {
        try {
            await setDoc(
                doc(
                  db,
                  COLLECTION_USER + "/" + this.owner + "/" + 
                  COLLECTION_Category + "/" + this.uid + "/" + 
                  COLLECTION_Task,
                  this.tasks.length.toString()
                ),
                {
                  name: name,
                  description: description,
                  created: Timestamp.now(),
                  mustEnd: Timestamp.fromDate(mustEnd),
                  category: this.uid,
                  owner: this.owner
                }
            );
        } catch(err) {
            console.error("Error creating task. ", err);
        }
    }

    async GetTasksToDo(): Promise<undefined> {
        const q = query(
            collection(
                db,
                COLLECTION_USER + "/" + this.owner + "/" +
                COLLECTION_Category + "/" + this.uid + "/" +
                COLLECTION_Task
            )
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            this.tasks.push(new Task(doc.data(), doc.id, this.uid, this.owner));
        })
    }

    async GetTasksCompleted(): Promise<undefined> {
        const q = query(
            collection(
                db,
                COLLECTION_USER + "/" + this.owner + "/" +
                COLLECTION_Category + "/" + this.uid + "/" +
                COLLECTION_TaskCompleted
            )
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            this.tasksCompleted.push(new Task(doc.data(), doc.id, this.uid, this.owner));
        })
    }

    async GetTasksDeleted(): Promise<undefined> {
        const q = query(
            collection(
                db,
                COLLECTION_USER + "/" + this.owner + "/" +
                COLLECTION_Category + "/" + this.uid + "/" +
                COLLECTION_TaskDeleted
            )
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            this.tasksDeleted.push(new Task(doc.data(), doc.id, this.uid, this.owner));
        })
    }
}