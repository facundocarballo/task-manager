import { db } from "@/firebase/config";
import { COLLECTION_Category, COLLECTION_Task, COLLECTION_TaskCompleted, COLLECTION_TaskDeleted, COLLECTION_USER } from "@/firebase/constants/collections";
import { DocumentData, doc, setDoc, Timestamp, query, collection, getDocs, deleteDoc } from "firebase/firestore";
import { Task, TaskDates } from "./task";

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
    path: string;
    parentsUids: string[];

    constructor(
        uid: string,
        name: string,
        description: string,
        color: string,
        tasks: Task[],
        tasksCompleted: Task[],
        tasksDeleted: Task[],
        subCategories: Category[],
        owner: string,
        path: string,
        parentUids: string[]
    ) {
        this.uid = uid;
        this.name = name;
        this.description = description;
        this.color = color;
        this.tasks = tasks;
        this.tasksCompleted = tasksCompleted;
        this.tasksDeleted = tasksDeleted;
        this.subCategories = subCategories;
        this.owner = owner;
        this.path = path;
        this.parentsUids = parentUids;
    }

    // Constructor 2
    static async CreateCategoryWithTasksToDo(        
        data: DocumentData,
        uid: string,
        owner: string,
        path: string,
        parentsUids: string[]
    ): Promise<Category> {

        const newCategory = new Category(
            uid,
            data.name,
            data.description,
            data.color,
            [],
            [],
            [],
            [],
            owner,
            path,
            parentsUids
        );
        console.log(`Creando ${data.name} con ParentUIDs[${parentsUids}]`)
        await newCategory.GetTasksToDo();
        await newCategory.GetTasksCompleted();
        await newCategory.GetTasksDeleted();
        await newCategory.GetSubCategories();
        return newCategory;
    }

    async Edit(name: string, description: string, color: string): Promise<undefined> {
        try {
            const ref = doc(
                db,
                COLLECTION_USER + "/" + this.owner + "/" +
                COLLECTION_Category,
                this.uid
            );

            await setDoc(ref, {
                name: name,
                description: description,
                color: color,
            });
            
        } catch (err) {
            console.error("Error editing the category. ", err);
        }
    }

    async Delete(): Promise<undefined> {
        try {
            await deleteDoc(
                doc(
                    db,
                    COLLECTION_USER + "/" + this.owner + "/" +
                    COLLECTION_Category + this.path,
                    this.uid
                )
            );
            
        }catch (err) {
            console.error("Error deleting the Category. ", err);
        }
    }

    // Tasks
    async CreateTask(name: string, description: string, mustEnd?: Date): Promise<undefined> {
        try {
            const ref = doc(
                collection(
                    db,
                    COLLECTION_USER + "/" + this.owner + "/" + 
                    COLLECTION_Category + "/" + this.uid + "/" + 
                    COLLECTION_Task
                )
            );
            if (mustEnd !== undefined) {
                await setDoc(ref, {
                    name: name,
                    description: description,
                    created: Timestamp.now(),
                    mustEnd: Timestamp.fromDate(mustEnd),
                    category: this.uid,
                    owner: this.owner
                });
            } else {
                await setDoc(ref, {
                    name: name,
                    description: description,
                    created: Timestamp.now(),
                    category: this.uid,
                    owner: this.owner
                });
            }


            const taskDates: TaskDates = {
                created: new Date(Date.now()),
                mustEnd: mustEnd
            };

            this.tasks.push(new Task(
                ref.id,
                name,
                description,
                this.uid,
                this.name,
                this.owner,
                taskDates
            ));
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
        const docs = querySnapshot.docs;
        for (let i = 0; i < docs.length; i++) {
            const data = docs[i].data();
            const taskDates: TaskDates = Task.GetDatesFromData(data);
            this.tasks.push(new Task(
                docs[i].id,
                data.name,
                data.description,
                this.uid,
                this.name,
                this.owner,
                taskDates
            ));
        }
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
        const docs = querySnapshot.docs;
        for (let i = 0; i < docs.length; i++) {
            const data = docs[i].data();
            const taskDates: TaskDates = Task.GetDatesFromData(data);
            this.tasksCompleted.push(new Task(
                docs[i].id,
                data.name,
                data.description,
                this.uid,
                this.name,
                this.owner,
                taskDates
            ));
        }
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
        const docs = querySnapshot.docs;
        for (let i = 0; i < docs.length; i++) {
            const data = docs[i].data();
            const taskDates: TaskDates = Task.GetDatesFromData(data);
            this.tasksDeleted.push(new Task(
                docs[i].id,
                data.name,
                data.description,
                this.uid,
                this.name,
                this.owner,
                taskDates
            ));
        }
    }

    // Subcategories
    async CreateSubCategory(name: string, description: string, color: string): Promise<undefined> {
        try {
            const ref = doc(
                collection(
                    db,
                    COLLECTION_USER + "/" + this.owner + "/" +
                    COLLECTION_Category + this.path + "/" +
                    this.uid + "/" + COLLECTION_Category
                )
            );

            await setDoc(ref, {
                name: name,
                description: description,
                color: color
            });

            const parentsUids = this.parentsUids;
            parentsUids.push(this.uid);

            this.subCategories.push(new Category(
                ref.id,
                name,
                description,
                color,
                [],
                [],
                [],
                [],
                this.owner,
                `${this.path}/${this.uid}/${COLLECTION_Category}`,
                parentsUids
            ));
        }catch(err) {
            console.error("Error creating sub category. ", err);
        }
    }

    async GetSubCategories(): Promise<undefined> {
        console.log(`Obteniendo las subcategorias de ${this.name} (${this.uid})`);
        this.subCategories = [];
        try {
            const q = query(
                collection(
                    db, 
                    COLLECTION_USER + "/" + this.owner + "/" + 
                    COLLECTION_Category + this.path + "/" +
                    this.uid + "/" + COLLECTION_Category
                ));
            
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs;

            // Hay un error que me mete mas de una sub categoria a la vez
            // Estamos queriendo eliminar las categorias y que vea reflejado en el momento de hacer la eliminacion.
            // El eliminado y creado de subcategorias ya funciona, solo falta hacer que se vea reflejado en el momento.
            const parentsUids = this.parentsUids;
            parentsUids.push(this.uid);

            for (let i = 0; i < docs.length; i++) {
                console.log("Cargando (en category)")
                const cat = await Category.CreateCategoryWithTasksToDo(
                    docs[i].data(), 
                    docs[i].id, 
                    this.owner, 
                    this.path + "/" + this.uid + "/" + COLLECTION_Category,
                    parentsUids
                );
                console.log("Listo (en category)")
                this.subCategories.push(cat);
            }
        } catch(err) {
            console.error(`Error getting subcategories of ${this.name}. ERROR: ${err}`)
        }
    }


}