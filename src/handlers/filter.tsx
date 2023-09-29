import { User } from "@/types/user";

export const GetCategories = (user: User|null): string[] => {
    if (user == null) return [];
    const categoriesName: string[] = ["Default"];
    for (const cat of user.categories) {
      categoriesName.push(...cat.GetCategoriesName());
    }
    return categoriesName;
  };