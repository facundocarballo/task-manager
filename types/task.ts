import { db } from "@/firebase/config";
import { COLLECTION_Category, COLLECTION_Task, COLLECTION_TaskCompleted, COLLECTION_TaskDeleted, COLLECTION_USER } from "@/firebase/constants/collections";
import { DocumentData, Timestamp, deleteDoc, doc, setDoc } from "firebase/firestore";

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
    owner: string;
    dates: TaskDates;

    constructor(
        data: DocumentData,
        uid: string,
        category: string,
        owner: string,
    ) {
        this.uid = uid;
        this.category = category;
        this.owner = owner;
        this.name = data.name;
        this.description = data.description;
        this.dates = this._GetDatesFromData(data);
    }

    private _GetDatesFromData(data: DocumentData): TaskDates {
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
            await setDoc(
                doc(
                  db,
                  COLLECTION_USER + "/" + this.owner + "/" + 
                  COLLECTION_Category + "/" + this.category + "/" + 
                  COLLECTION_TaskCompleted,
                  this.uid
                ),
                {
                  name: this.name,
                  description: this.description,
                  finished: Timestamp.now(),
                  created: Timestamp.fromDate(this.dates.created),
                  mustEnd: this.dates.mustEnd === undefined ? null : Timestamp.fromDate(this.dates.mustEnd),
                  category: this.uid,
                  owner: this.owner
                }
            );
        } catch(err) {
            console.error("Error completing task. ", err);
        }

        await this._Delete()
    }

    async Delete(): Promise<undefined> {
        try {
            await setDoc(
                doc(
                  db,
                  COLLECTION_USER + "/" + this.owner + "/" + 
                  COLLECTION_Category + "/" + this.category + "/" + 
                  COLLECTION_TaskDeleted,
                  this.uid
                ),
                {
                  name: this.name,
                  description: this.description,
                  deleted: Timestamp.now(),
                  created: Timestamp.fromDate(this.dates.created),
                  mustEnd: this.dates.mustEnd === undefined ? null : Timestamp.fromDate(this.dates.mustEnd),
                  category: this.uid,
                  owner: this.owner
                }
            );
        } catch(err) {
            console.error("Error completing task. ", err);
        }

        await this._Delete()
    }
}