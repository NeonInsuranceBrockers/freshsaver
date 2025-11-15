// src/config/node-actions.ts

import { FlowNodeDefinition } from "./node-interfaces"; // Import FlowNodeDefinition

export const ActionNodeDefinitions: FlowNodeDefinition[] = [
  // --- 2. LOGIC & CONTROL NODES ---
  {
    type: "ConditionalBranch",
    label: "Conditional Branch (IF/THEN)",
    category: "Logic & Control",
    description: "Checks a condition to split the flow into True/False paths.",
    color: "bg-yellow-100 border-yellow-400",
    isTrigger: false,
    configFields: [
      {
        key: "checkField",
        label: "Check Data Field",
        type: "variable-picker",
        required: true,
        placeholder: "Select: inventory_item.category",
      },
      {
        key: "operator",
        label: "Operator",
        type: "dropdown",
        required: true,
        options: [
          { value: "==", label: "Equals" },
          { value: ">", label: "Greater Than" },
          { value: "includes", label: "Includes" },
        ],
      },
      {
        key: "checkValue",
        label: "Value to Compare Against",
        type: "text",
        required: true,
        placeholder: 'e.g., "Dairy" or "10 days"',
      },
    ],
  },

  // --- 3. AI PROCESSING NODES ---
  {
    type: "GenerateRecipe",
    label: "AI Recipe Suggestion",
    category: "AI Processing",
    description:
      "Generates a recipe using expiring items based on a custom prompt.",
    color: "bg-blue-100 border-blue-400",
    isTrigger: false,
    configFields: [
      {
        key: "prompt",
        label: "Custom Prompt (AI Goal)",
        type: "textarea",
        required: true,
        placeholder:
          'e.g., "Suggest a low-carb dinner using the expiring item."',
      },
      {
        key: "minUsage",
        label: "Min. % of Item to Use",
        type: "number",
        required: true,
        defaultValue: 50,
        placeholder: "Percentage (0-100)",
      },
    ],
  },

  // --- 4. RESULT DELIVERY NODES ---
  {
    type: "SendNotification",
    label: "Send Notification",
    category: "Result Delivery",
    description: "Delivers the result payload via Email or Push Notification.",
    color: "bg-red-100 border-red-400",
    isTrigger: false,
    configFields: [
      {
        key: "channel",
        label: "Delivery Channel",
        type: "dropdown",
        required: true,
        options: [
          { value: "push", label: "App Push Notification" },
          { value: "sms", label: "SMS Text Message" },
          { value: "email", label: "Email Message" },
        ],
      },
      {
        key: "messageBody",
        label: "Message Body",
        type: "textarea",
        required: true,
        placeholder: "Use {{variables}} here.",
      },
    ],
  },

  // --- 5. INTEGRATION NODES ---
  {
    type: "WebhookDelivery",
    label: "Deliver via Webhook",
    category: "Integration",
    description:
      "Sends the final data payload to an external API (e.g., Smart Fridge).",
    color: "bg-purple-100 border-purple-400",
    isTrigger: false,
    configFields: [
      {
        key: "targetUrl",
        label: "Target URL",
        type: "text",
        required: true,
        placeholder: "https://api.smartfridge.com/hook",
      },
      {
        key: "httpMethod",
        label: "HTTP Method",
        type: "dropdown",
        required: true,
        options: [
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
        ],
      },
      {
        key: "payloadTemplate",
        label: "Custom JSON Payload",
        type: "textarea",
        required: false,
        placeholder: '{ "item": "{{inventory_item.name}}" }',
      },
    ],
  },
  // <-- NEW PARTNER INTEGRATION NODE -->
  {
    type: "PartnerIntegration",
    label: "Partner API Action",
    category: "Integration",
    description:
      "Automates premium actions like grocery ordering or smart appliance updates.",
    color: "bg-orange-100 border-orange-400",
    isTrigger: false,
    configFields: [
      {
        key: "integrationType",
        label: "Integration Type",
        type: "dropdown",
        required: true,
        options: [
          { value: "grocery-order", label: "Grocery Order (Premium)" },
          { value: "smart-fridge-update", label: "Smart Fridge Status" },
        ],
      },
      {
        key: "actionDetail",
        label: "Specific Action",
        type: "text",
        required: true,
        placeholder: "e.g., Place Order / Set Light Red",
      },
      {
        key: "credentialId",
        label: "Credential Source",
        type: "variable-picker",
        required: true,
        placeholder: "Link to stored API key",
      },
    ],
  },
];
