import { ICategory } from "../components/Category";
import { ITask } from "../components/Task";

export const getNumberOfTasks = (tasks: ITask[]): number => {
    let amount = 0;

    for (const task of tasks) {
        amount++;
    }

    return amount;
}

export const copyTasks = (tasks: ITask[]): ITask[] => {
    let nTasks: ITask[] = [];
    for (const task of tasks) {
        nTasks.push(task)
    }
    return nTasks;
}

export const getAllTaskCompleted = (categories: ICategory[]): ITask[] => {
    let taskCompleted = [];

    for (const cat of categories) {
        for (const task of cat.tasksCompleted) {
            taskCompleted.push(task);
        }
    }

    return sortTaskByDate(taskCompleted);
}

export const getAllTaskDeleted = (categories: ICategory[]): ITask[] => {
    let tasksDeleted = [];

    for (const cat of categories) {
        for (const task of cat.tasksDeleted) {
            tasksDeleted.push(task);
        }
    }

    return sortTaskByDate(tasksDeleted);
}

export const sortTaskByDate = (tasks: ITask[]): ITask[] => {
    return tasks.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime());
}

export const deleteTask = (task: ITask, tasks: ITask[]): ITask[] => {
    const newTasks: ITask[] = [];

    for (const t of tasks) {
        if (t.id != task.id) {
            newTasks.push(t);
        }
    }

    return newTasks;
}

export const getTaskFilterByAccomplishTime = (tasks: ITask[], accomplishTime: string): ITask[] => {
    let tasksFiltered: ITask[] = [];

    switch (accomplishTime) {
        case '✅ YES':
            for (const task of tasks) {
                if (taskIsAccomplishTime(task)) {
                    tasksFiltered.push(task);
                }
            }
            return tasksFiltered;
        case '🚫 NO':
            for (const task of tasks) {
                if (!taskIsAccomplishTime(task)) {
                    tasksFiltered.push(task);
                }
            }
            return tasksFiltered;
        case 'Default':
            return tasks;
        default:
            return tasks;
    }
}

export const getTaskFilterByCategory = (tasks: ITask[], categoryId: number|null): ITask[] => {
    if (categoryId == null) return tasks;
    
    let tasksFiltered: ITask[] = [];

    for (const task of tasks) {
        if (task.category_id == categoryId) {
            tasksFiltered.push(task);
        }
    }

    return tasksFiltered;
} 

export const getTaskFilterByDate = (tasks: ITask[], firstDate: Date|null, endDate: Date|null): ITask[] => {
    if (firstDate == null || endDate == null) return tasks;

    let tasksFiltered: ITask[] = [];
    for (const task of tasks) {
        if (isTaskFitInDates(task, firstDate, endDate)) {
            tasksFiltered.push(task);
        }
    }

    return tasksFiltered;
} 

const isTaskFitInDates = (task: ITask, firstDate: Date, endDate: Date): boolean => {
    if (task.dateEnded == null) return false;
    return (
        task.dateEnded.getTime() >= firstDate.getTime() && 
        task.dateEnded.getTime() <= endDate.getTime()
    );
}

const taskIsAccomplishTime = (task: ITask): boolean => {
    if (task.dateEnded === null) return false;
    if (task.dateMustEnd == undefined) return true;
    if (task.dateEnded.getTime() < task.dateMustEnd.getTime()) return true;
    return false;
}