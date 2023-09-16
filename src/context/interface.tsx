import { User } from "@/types/user";

export interface ITaskManagerContext {
    // React useState attributes
    user: User | null,

    // React useState methods
    setUser: (_user: User|null) => void,
}