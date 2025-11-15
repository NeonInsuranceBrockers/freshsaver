// src/lib/utils/payloadResolver.ts

import { InventoryPayload, NodeData } from "@/types/flow";

/**
 * Safely retrieves a nested value from an object using a dot-notation path (e.g., "inventory_item.category").
 * This is crucial for evaluating conditions and resolving template variables.
 *
 * @param obj The InventoryPayload object.
 * @param path The dot-notation string (e.g., "related_data.recipe.title").
 * @returns The resolved value, or undefined if the path does not exist.
 */
export const resolvePath = (obj: InventoryPayload, path: string): unknown => {
  // Defensive check for non-string paths or non-objects
  if (typeof path !== "string" || !obj || typeof obj !== "object") {
    return undefined;
  }

  // Start the accumulator chain with the initial object.
  const result = path.split(".").reduce(
    (current: unknown, key: string) => {
      // If we've hit a dead end, stop.
      if (current === undefined || current === null) {
        return undefined;
      }

      // Assert current as an indexable object and retrieve the next key's value.
      const next = (current as Record<string, unknown>)[key];

      // Return the next value, or undefined if the key didn't exist
      return next !== undefined ? next : undefined;
    },
    obj as unknown // Start the accumulator chain with the payload object
  );

  return result;
};

/**
 * Scans a string for {{variable.path}} tokens, resolves them against the payload,
 * and substitutes the values.
 *
 * @param payload The InventoryPayload context.
 * @param templateString The string containing variables (e.g., messageBody or JSON template).
 * @returns The fully resolved string.
 */
export const applyTemplate = (
  payload: InventoryPayload,
  templateString: string
): string => {
  if (!templateString || !payload) return templateString;

  // Regex to find {{...}} variables
  const variableRegex = /\{\{(.*?)\}\}/g;

  return templateString.replace(variableRegex, (match, path) => {
    // path is the content inside {{...}}, trimmed
    const trimmedPath = path.trim();

    const resolvedValue = resolvePath(payload, trimmedPath);

    if (resolvedValue === undefined || resolvedValue === null) {
      // Return a visible placeholder if the variable is missing
      return `[MISSING:${trimmedPath}]`;
    }

    // Convert the resolved value to a string
    return String(resolvedValue);
  });
};

/**
 * Creates a new InventoryPayload by enriching the related_data section.
 * This simulates how action nodes add results (like a recipe) to the payload.
 *
 * @param originalPayload The current state of the payload.
 * @param key The property key to add to related_data.
 * @param data The data (string, object, array, etc.) to store under that key.
 * @returns A new, updated InventoryPayload object.
 */
export const enrichPayload = (
  originalPayload: InventoryPayload,
  key: string,
  data: unknown
): InventoryPayload => {
  return {
    ...originalPayload,
    related_data: {
      ...originalPayload.related_data,
      [key]: data,
    },
  };
};

/**
 * Evaluates the condition set in the ConditionalBranch node against the runtime payload.
 * NOTE: This is conceptually similar to the existing client-side logic, but we place
 * it here as it relies heavily on resolvePath.
 */
export const evaluateCondition = (
  nodeData: NodeData,
  payload: InventoryPayload
): boolean => {
  const fieldPath = nodeData.checkField as string;
  const operator = nodeData.operator as string;
  const expectedValue = nodeData.checkValue;

  // If the logic node is unconfigured, default to TRUE to keep the flow moving.
  if (!fieldPath || !operator || !expectedValue) {
    console.warn(
      `[Engine] Condition not fully configured. Defaulting to TRUE.`
    );
    return true;
  }

  // 1. Retrieve the actual runtime value dynamically
  const actualValue = resolvePath(payload, fieldPath);

  if (actualValue === undefined || actualValue === null) {
    console.warn(
      `[Engine] Field path '${fieldPath}' missing in payload. Condition FALSE.`
    );
    return false;
  }

  // 2. Prepare values for comparison (robust comparison for different types)
  const actualString = String(actualValue).toLowerCase().trim();
  const expectedString = String(expectedValue).toLowerCase().trim();
  let actualNumber = Number(actualValue);
  const expectedNumber = Number(expectedValue);

  // If the values are non-numeric strings, treat them as strings for comparison
  if (isNaN(actualNumber) || isNaN(expectedNumber)) {
    actualNumber = NaN; // Force NaN if conversion failed
  }

  // 3. Perform comparison based on operator
  switch (operator) {
    case "==":
      // If comparing numbers (e.g., remaining_days), use numeric comparison if possible.
      if (!isNaN(actualNumber) && !isNaN(expectedNumber)) {
        return actualNumber === expectedNumber;
      }
      // Otherwise, use case-insensitive string equality.
      return actualString === expectedString;

    case ">":
      // Numeric comparison
      return (
        !isNaN(actualNumber) &&
        !isNaN(expectedNumber) &&
        actualNumber > expectedNumber
      );
    case "<":
      // Numeric comparison
      return (
        !isNaN(actualNumber) &&
        !isNaN(expectedNumber) &&
        actualNumber < expectedNumber
      );

    case "includes":
      // String inclusion check
      return actualString.includes(expectedString);

    default:
      console.warn(
        `[Engine] Unsupported operator '${operator}'. Condition FALSE.`
      );
      return false;
  }
};
