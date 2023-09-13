import { ICategory } from "../components/Category";
import { ITask } from "../components/Task";

export interface ITaskManagerContext {
    // React useState attributes
    categories: ICategory[] | null,
    tasksCompleted: ITask[],
    tasksDeleted: ITask[],

    // React useState methods
    setCategories: (_categories: ICategory[]|null) => void,
    setTasksCompleted: (_tasks: ITask[]) => void,
    setTasksDeleted: (_tasks: ITask[]) => void,
}