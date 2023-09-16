import { Task } from "@/types/task";
import { User } from "@/types/user";

export interface ITaskManagerContext {
    // React useState attributes
    user: User | null,
    tasksCompleted: Task[],
    tasksDeleted: Task[],

    // React useState methods
    setUser: (_user: User|null) => void,
    setTasksCompleted: (_tasks: Task[]) => void,
    setTasksDeleted: (_tasks: Task[]) => void,
}