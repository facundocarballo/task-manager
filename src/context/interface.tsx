import { User } from "@/types/user";
import { ICategory } from "../components/Category";
import { ITask } from "../components/Task";

export interface ITaskManagerContext {
    // React useState attributes
    user: User | null,
    categories: ICategory[] | null,
    tasksCompleted: ITask[],
    tasksDeleted: ITask[],

    // React useState methods
    setUser: (_user: User|null) => void,
    setCategories: (_categories: ICategory[]|null) => void,
    setTasksCompleted: (_tasks: ITask[]) => void,
    setTasksDeleted: (_tasks: ITask[]) => void,
}