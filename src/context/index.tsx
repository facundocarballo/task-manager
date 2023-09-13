import React from "react";
import { ITaskManagerContext } from "./interface";
import { ICategory } from "../components/Category";
import { DATA_CATEGORIES } from "../data/categories";
import { ITask } from "../components/Task";

// Context Initialization
const TaskManagerContext = React.createContext<ITaskManagerContext>({
    // React useState attributes
    categories: null,
    tasksCompleted: [],
    tasksDeleted: [],

    // React useState methods
    setCategories: () => { },
    setTasksCompleted: () => { }, 
    setTasksDeleted: () => { }
});

// Context Creation
export const ContextProvider: React.FC<any> = (props: any) => {
    // React useState variables
    const [categories, setCategories] = React.useState<ICategory[] | null>(DATA_CATEGORIES);
    const [tasksCompleted, setTasksCompleted] = React.useState<ITask[]>([]);
    const [tasksDeleted, setTasksDeleted] = React.useState<ITask[]>([]);

    const values = {
        categories,
        tasksCompleted,
        tasksDeleted,

        setCategories,
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