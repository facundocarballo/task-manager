import { ICategory } from "../components/Category";
import { ITask } from "../components/Task";

export const DATA_TASKS: ITask[] = [
    {
        title: 'Task 1',
        id: 0,
        category_id: 0,
        dateCreated: new Date("2023-08-11"),
        dateMustEnd: new Date("2023-07-30"),
        dateEnded: null,
        description: "Description of the task...."
        
    },
    {
        title: 'Task 2',
        id: 1,
        category_id: 0,
        dateCreated: new Date(),
        dateMustEnd: new Date("2023-08-30"),
        dateEnded: null,
        description: "Description of the task...."
    },

    {
        title: 'Task 3',
        id: 2,
        category_id: 0,
        dateCreated: new Date(),
        dateMustEnd: new Date("2023-09-30"),
        dateEnded: null,
        description: "Description of the task...."
    },

    {
        title: 'Task 4',
        id: 3,
        category_id: 0,
        dateCreated: new Date(),
        dateMustEnd: new Date("2023-10-30"),
        dateEnded: null,
        description: "Description of the task...."
    }

];

export const DATA_CATEGORIES: ICategory[] = [
    {
        color: '#FC8181',
        title: 'Home',
        description: 'Task of home',
        tasks: DATA_TASKS,
        tasksCompleted: [],
        tasksDeleted: [],
        id: 0,
    },
    {
        color: '#F6AD55',
        title: 'Work',
        description: 'Task of Work',
        tasks: DATA_TASKS,
        tasksCompleted: [],
        tasksDeleted: [],
        id: 1,
    },
    {
        color: '#F6E05E',
        title: 'YouTube',
        description: 'Task of YouTube',
        tasks: DATA_TASKS,
        tasksCompleted: [],
        tasksDeleted: [],
        id: 2,
    },
    {
        color: '#68D391',
        title: 'Personal Projects',
        description: 'Task of Personal Projects',
        tasksCompleted: [],
        tasksDeleted: [],
        tasks: DATA_TASKS,
        id: 3,
    },
    {
        color: '#4FD1C5',
        title: 'University',
        description: 'Task of University',
        tasksCompleted: [],
        tasksDeleted: [],
        tasks: DATA_TASKS,
        id: 4,
    },
    {
        color: '#63B3ED',
        title: 'Gym',
        description: 'Task of Gym',
        tasksCompleted: [],
        tasksDeleted: [],
        tasks: DATA_TASKS,
        id: 5,
    }
]