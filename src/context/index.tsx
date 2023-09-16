import React from "react";
import { ITaskManagerContext } from "./interface";
import { User } from "@/types/user";

// Context Initialization
const TaskManagerContext = React.createContext<ITaskManagerContext>({
    // React useState attributes
    user: null,

    // React useState methods
    setUser: () => { },
});

// Context Creation
export const ContextProvider: React.FC<any> = (props: any) => {
    // React useState variables
    const [user, setUser] = React.useState<User|null>(null);

    const values = {
        user,
        
        setUser,
    };

    return <TaskManagerContext.Provider value={values}>{props.children}</TaskManagerContext.Provider>
}

export const useProvider = () => {
    const context = React.useContext(TaskManagerContext);
    if (!context) throw new Error('useProvider have to be inside of the PhotoSyncContext');
    return context;
};