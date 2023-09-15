import { DocumentData } from "firebase/firestore";

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
}