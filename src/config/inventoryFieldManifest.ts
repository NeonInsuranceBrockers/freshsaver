export interface FieldOption {
  path: string; // The dot notation path to the data
  label: string;
  group:
    | "Item Details"
    | "Status & Location"
    | "Quantity Metrics"
    | "Execution Context"
    | "Related Data"
    | "Static Categories"
    | "Static Locations"
    | "Static Units";
  dataType: "string" | "number" | "date";
}

export const INVENTORY_FIELD_MANIFEST: FieldOption[] = [
  // --- Contextual Data ---
  {
    path: "user_id",
    label: "User ID",
    group: "Execution Context",
    dataType: "string",
  },
  {
    path: "timestamp",
    label: "Flow Timestamp",
    group: "Execution Context",
    dataType: "date",
  },

  // --- Item Details (inventory_item) ---
  {
    path: "inventory_item.name",
    label: "Item Name",
    group: "Item Details",
    dataType: "string",
  },
  {
    path: "inventory_item.category",
    label: "Item Category",
    group: "Item Details",
    dataType: "string",
  },

  // --- Status & Location ---
  {
    path: "inventory_item.location",
    label: "Storage Location",
    group: "Status & Location",
    dataType: "string",
  },
  {
    path: "inventory_item.status",
    label: "Freshness Status",
    group: "Status & Location",
    dataType: "string",
  },
  {
    path: "inventory_item.remaining_days",
    label: "Days Remaining",
    group: "Status & Location",
    dataType: "number",
  },

  // --- Quantity Metrics ---
  {
    path: "inventory_item.quantity",
    label: "Remaining Quantity",
    group: "Quantity Metrics",
    dataType: "number",
  },

  // --- Related Data (AI Output) ---
  {
    path: "related_data.recipe_suggestions.title",
    label: "Suggested Recipe Title",
    group: "Related Data",
    dataType: "string",
  },
  {
    path: "related_data.recipe_suggestions.link",
    label: "Suggested Recipe Link",
    group: "Related Data",
    dataType: "string",
  },
];

// --- Mock Options for Dropdowns (Static Data for Field Types) ---

export const CATEGORY_OPTIONS = [
  { value: "Dairy", label: "Dairy" },
  { value: "Produce", label: "Produce" },
  { value: "Meat", label: "Meat" },
  { value: "Grains", label: "Grains" },
];

export const LOCATION_OPTIONS = [
  { value: "Fridge", label: "Refrigerator" },
  { value: "Freezer", label: "Freezer" },
  { value: "Pantry", label: "Pantry" },
  { value: "Counter", label: "Counter" },
];

export const UNIT_OPTIONS = [
  { value: "g", label: "grams (g)" },
  { value: "ml", label: "milliliters (ml)" },
  { value: "unit", label: "Unit/Piece" },
  { value: "cup", label: "Cup" },
];
