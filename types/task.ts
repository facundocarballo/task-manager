import { db } from "@/firebase/config";
import { COLLECTION_Category, COLLECTION_Task, COLLECTION_TaskCompleted, COLLECTION_TaskDeleted, COLLECTION_USER } from "@/firebase/constants/collections";
import { DocumentData, Timestamp, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { Category } from "./category";

export interface TaskDates {
    created: Date,
    mustEnd?: Date,
    finished?: Date,
    deleted?: Date
}

export class Task {
    uid: string;
    name: string;
    description: string;
    category: string;
    categoryName: string;
    owner: string;
    dates: TaskDates;

    constructor(
        uid: string,
        name: string,
        description: string,
        category: string,
        categoryName: string,
        owner: string,
        dates: TaskDates
    ) {
        this.uid = uid;
        this.category = category;
        this.owner = owner;
        this.name = name;
        this.description = description;
        this.dates = dates;
        this.categoryName = categoryName;
    }

    static GetDatesFromData(data: DocumentData): TaskDates {
        let mustEnd = undefined;
        let finished = undefined;
        let deleted = undefined;
        const created = data.created.toDate();
        if (data.mustEnd !== undefined) 
            mustEnd = data.mustEnd.toDate(); 
        if (data.finished !== undefined)
            finished = data.finished.toDate();
        if (data.deleted !== undefined)
            deleted = data.deleted.toDate();

        return {
            created,
            mustEnd,
            finished,
            deleted
        }
    }

    // Delete permanetly from the database.
    private async _Delete(): Promise<undefined> {
        try {
            await deleteDoc(
                doc(
                    db,
                    COLLECTION_USER + "/" + this.owner + "/" + 
                    COLLECTION_Category + "/" + this.category + "/" + 
                    COLLECTION_Task,
                    this.uid
                )
            )
        }catch(err) {
            console.error("Error deleting task completed. ", err);
        }
    }

    async Complete(): Promise<undefined> {
        try {
            const ref = doc(
                collection(
                    db,
                    COLLECTION_USER + "/" + this.owner + "/" + 
                    COLLECTION_Category + "/" + this.category + "/" + 
                    COLLECTION_TaskCompleted
                )
            );
            if (this.dates.mustEnd !== undefined) {
                await setDoc(
                    ref,
                    {
                      name: this.name,
                      description: this.description,
                      finished: Timestamp.now(),
                      created: Timestamp.fromDate(this.dates.created),
                      mustEnd: Timestamp.fromDate(this.dates.mustEnd),
                      category: this.uid,
                      categoryName: this.categoryName,
                      owner: this.owner
                    }
                );
            } else {
                await setDoc(
                    ref,
                    {
                      name: this.name,
                      description: this.description,
                      finished: Timestamp.now(),
                      created: Timestamp.fromDate(this.dates.created),
                      category: this.uid,
                      categoryName: this.categoryName,
                      owner: this.owner
                    }
                );
            }
            await this._Delete();
        } catch(err) {
            console.error("Error completing task. ", err);
        }
    }

    // Send to tasks deleted.
    async Delete(): Promise<undefined> {
        try {
            const ref = doc(
                collection(
                    db,
                    COLLECTION_USER + "/" + this.owner + "/" + 
                    COLLECTION_Category + "/" + this.category + "/" + 
                    COLLECTION_TaskDeleted
                )
            );
            if (this.dates.mustEnd !== undefined) {
                await setDoc(ref, {
                    name: this.name,
                    description: this.description,
                    deleted: Timestamp.now(),
                    created: Timestamp.fromDate(this.dates.created),
                    mustEnd: Timestamp.fromDate(this.dates.mustEnd),
                    category: this.uid,
                    categoryName: this.categoryName,
                    owner: this.owner
                })
            } else {
                await setDoc(ref, {
                    name: this.name,
                    description: this.description,
                    deleted: Timestamp.now(),
                    created: Timestamp.fromDate(this.dates.created),
                    category: this.uid,
                    categoryName: this.categoryName,
                    owner: this.owner
                })
            }
        } catch(err) {
            console.error("Error completing task. ", err);
        }

        await this._Delete()
    }
}