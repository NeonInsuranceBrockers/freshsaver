// /src/types/meal-planner.ts

import type {
  Recipe as PrismaRecipe,
  Ingredient as PrismaIngredient,
  ScheduledMeal as PrismaScheduledMeal,
  InventoryItem,
} from "@prisma/client";

// --- BASE TYPES (Extending Prisma types for client-side use) ---

// An Ingredient is a simple object.
export type Ingredient = PrismaIngredient;

// A Recipe includes its array of ingredients.
export type Recipe = PrismaRecipe & {
  ingredients: Ingredient[];
};

// A ScheduledMeal includes the full Recipe object it refers to.
export type ScheduledMeal = PrismaScheduledMeal & {
  recipe: Recipe;
};

// --- KANBAN-SPECIFIC TYPES ---

// The status of a recipe card on our Kanban board.
export type RecipeCardStatus =
  | "BACKLOG"
  | "IN_PLANNING"
  | "NEEDS_INGREDIENTS"
  | "READY_TO_PREP";

// This is the data for a single card on the Recipe Kanban board.
// It includes the recipe itself, plus its calculated status and missing ingredients.
export type RecipeCardData = {
  id: string; // The recipe's ID
  recipe: Recipe;
  status: RecipeCardStatus;
  missingIngredients: { name: string; quantity: number; unit: string }[];
};

// Represents a single column on the Recipe Kanban board.
export type RecipeKanbanColumn = {
  id: RecipeCardStatus;
  title: string;
  cardIds: string[]; // An array of RecipeCardData IDs
};

// The complete client-side state for the Recipe Kanban board.
export type RecipeKanbanState = {
  cards: Record<string, RecipeCardData>; // Map of all recipe cards
  columns: Record<string, RecipeKanbanColumn>;
  columnOrder: RecipeCardStatus[];
};
