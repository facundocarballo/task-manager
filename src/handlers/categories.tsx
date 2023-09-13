import { ICategory } from "../components/Category"; 

export const copyCategories = (categories: ICategory[]): ICategory[] => {
    let cats: ICategory[] = [];
    for (let c of categories) {
        cats.push(c)
    }
    return cats;
}

export const getCategoryIdFromName = (categoryName: string, categories: ICategory[]): number|null => {
    for (const cat of categories) {
        if (cat.title == categoryName) {
            return cat.id;
        }
    }
    return null;
} 