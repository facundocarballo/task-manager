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
    
    IsAccomplishTime = (): boolean => {
        if (this.dates.finished === undefined) return false;
        if (this.dates.mustEnd === undefined) return true;
        if (
            this.dates.finished.getTime() < 
            this.dates.mustEnd.getTime()
        ) return true;
    
        return false;
    }

    FitInDates = (firstDate: Date, endDate: Date, finished: boolean): boolean => {
        if (finished) {
            if (this.dates.finished === undefined) return false;
            return (
                this.dates.finished.getTime() >= firstDate.getTime() && 
                this.dates.finished.getTime() <= endDate.getTime()
            );
        }

        if (this.dates.deleted === undefined) return false;
        return (
            this.dates.deleted.getTime() >= firstDate.getTime() && 
            this.dates.deleted.getTime() <= endDate.getTime()
        );
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

    // Static Methods
    static FilterTasksByAccomplishTime(tasks: Task[], accomplishTime: string): Task[] {
        let tasksFiltered: Task[] = [];

    switch (accomplishTime) {
        case '✅ YES':
            for (const task of tasks) {
                if (task.IsAccomplishTime()) {
                    tasksFiltered.push(task);
                }
            }
            return tasksFiltered;
        case '🚫 NO':
            for (const task of tasks) {
                if (!task.IsAccomplishTime()) {
                    tasksFiltered.push(task);
                }
            }
            return tasksFiltered;
        case 'Default':
            return tasks;
        default:
            return tasks;
    }
    }
    
    static FilterTasksByDates(tasks: Task[], firstDate: Date, endDate: Date, finished: boolean): Task[] {
        console.log("First Date: ", firstDate);
        console.log("End Date: ", endDate);
        let tasksFiltered: Task[] = [];
        for (const task of tasks) {
            if (task.FitInDates(firstDate, endDate, finished)) {
                console.log("entra.");
                tasksFiltered.push(task);
            }
        }
    
        return tasksFiltered;
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
}