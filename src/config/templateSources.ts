import {
  FieldOption,
  INVENTORY_FIELD_MANIFEST,
  CATEGORY_OPTIONS,
  LOCATION_OPTIONS,
  UNIT_OPTIONS,
} from "./inventoryFieldManifest";

export interface TemplateDictionary {
  label: string;
  key: string;
  variables: FieldOption[];
}

// 1. Define the specific union type that FieldOption['group'] now includes for static data.
// We must extract this from FieldOption or rely on the caller passing the correct literal strings.
// Since we know the groups we added, let's define them precisely:
type StaticGroup = "Static Categories" | "Static Locations" | "Static Units";

const transformStaticOptions = (
  options: { value: string; label: string }[],
  // 2. IMPORTANT: Constrain the type of dictionaryKey to the specific union type.
  dictionaryKey: StaticGroup,
  dataType: "string" | "number" = "string"
): FieldOption[] => {
  return options.map((opt) => ({
    path: opt.value,
    label: opt.label,
    // 3. This is now valid because dictionaryKey is guaranteed to be one of the literal strings
    group: dictionaryKey,
    dataType: dataType,
    // Note: If you need 'date', you must explicitly pass it in the function call below.
    // For now, these static options are generally strings.
  }));
};

/**
 * Consolidated and structured sources for insertion into text areas/templates.
 */
export const TEMPLATE_VARIABLE_DICTIONARIES: TemplateDictionary[] = [
  // ... (Flow Data, which uses INVENTORY_FIELD_MANIFEST which is already FieldOption[])
  {
    label: "Flow Data & Inventory Variables",
    key: "dynamic_inventory",
    variables: INVENTORY_FIELD_MANIFEST,
  },

  // 2. STATIC CATEGORY OPTIONS
  {
    label: "Static Categories",
    key: "static_categories",
    // 4. Caller passes the exact literal string.
    variables: transformStaticOptions(CATEGORY_OPTIONS, "Static Categories"),
  },

  // 3. STATIC LOCATION OPTIONS
  {
    label: "Static Locations",
    key: "static_locations",
    variables: transformStaticOptions(LOCATION_OPTIONS, "Static Locations"),
  },

  // 4. STATIC UNIT OPTIONS
  {
    label: "Static Units",
    key: "static_units",
    variables: transformStaticOptions(UNIT_OPTIONS, "Static Units"),
  },
];
