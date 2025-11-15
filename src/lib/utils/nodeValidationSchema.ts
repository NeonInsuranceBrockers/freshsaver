import { z, ZodRawShape, ZodTypeAny } from "zod"; // Import ZodTypeAny for explicit typing
import {
  FlowNodeDefinition,
  NodeConfigField,
} from "@/config/flowNodeDefinitions";

/**
 * Zod Schema definition for a valid URL pattern.
 */
const URL_SCHEMA = z
  .string()
  .url("Must be a valid URL starting with http:// or https://")
  .min(5, "URL is too short.");

/**
 * Creates a Zod schema object for a single configuration field based on its NodeConfigField definition.
 */
const createFieldSchema = (field: NodeConfigField): ZodTypeAny => {
  // Use ZodTypeAny
  let schema: ZodTypeAny;

  switch (field.type) {
    case "number":
      // Use z.preprocess to handle string inputs from forms and convert to numbers
      schema = z.preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z.number().min(0, "Value cannot be negative.")
      );
      break;
    case "dropdown":
    case "text":
    case "variable-picker":
    case "textarea":
      schema = z.string().min(1, "Field cannot be empty.");
      if (field.key === "targetUrl") {
        schema = URL_SCHEMA;
      }
      break;
    case "boolean":
      schema = z.boolean();
      break;
    default:
      schema = z.any();
  }

  // Apply required flag (making the field optional in the object if not required)
  return field.required ? schema : schema.optional().nullable();
};

/**
 * Dynamically constructs the Zod schema for a specific node type.
 *
 * @param definition The configuration definition for the selected node.
 * @returns The Zod object schema for the NodeData config fields.
 */
export const getNodeValidationSchema = (
  definition: FlowNodeDefinition
): z.ZodObject<ZodRawShape> => {
  // FIX 1: Initialize the shape as a mutable object and cast it as ZodRawShape.
  // We use ZodTypeAny for the values to handle the dynamic creation.
  const shape = {} as Record<string, ZodTypeAny>;

  // 1. Always include required NodeData properties, even if they aren't explicitly configured in the Inspector
  // These properties (label, type) are static and mandatory for every node's data field.
  shape.label = z.string();
  shape.type = z.string();

  // 2. Add validation rules for all custom config fields
  definition.configFields.forEach((field) => {
    // We can directly use the field key string for assignment
    shape[field.key as string] = createFieldSchema(field);
  });

  // 3. Define the final schema based on the dynamically created shape
  // We explicitly tell Zod to create the object from the mutable shape.
  // The complex generic return type error is resolved by letting z.object infer the schema
  // and returning the resulting ZodObject<ZodRawShape>.
  return z.object(shape) as z.ZodObject<ZodRawShape>;
};
