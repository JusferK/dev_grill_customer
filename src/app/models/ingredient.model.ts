import { IMenuIngredientList } from "./menu-ingredient-list.model";

export interface IIngredient {
    idIngredient: number;
    name: string;
    stock: number;
    menuIngredientList: IMenuIngredientList[];
}