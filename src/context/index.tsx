import React from "react";
import { ITaskManagerContext } from "./interface";
import { User } from "@/types/user";
import { Task } from "@/types/task";

// Context Initialization
const TaskManagerContext = React.createContext<ITaskManagerContext>({
    // React useState attributes
    user: null,
    tasksCompleted: [],
    tasksDeleted: [],

    // React useState methods
    setUser: () => { },
    setTasksCompleted: () => { },
    setTasksDeleted: () => { }
});

// Context Creation
export const ContextProvider: React.FC<any> = (props: any) => {
    // React useState variables
    const [user, setUser] = React.useState<User|null>(null);
    const [tasksCompleted, setTasksCompleted] = React.useState<Task[]>([]);
    const [tasksDeleted, setTasksDeleted] = React.useState<Task[]>([]); 

    const values = {
        user,
        tasksCompleted,
        tasksDeleted,
        
        setUser,
        setTasksCompleted,
        setTasksDeleted
    };

    return <TaskManagerContext.Provider value={values}>{props.children}</TaskManagerContext.Provider>
}

export const useProvider = () => {
    const context = React.useContext(TaskManagerContext);
    if (!context) throw new Error('useProvider have to be inside of the PhotoSyncContext');
    return context;
};