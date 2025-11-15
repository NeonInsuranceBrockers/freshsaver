import { useCallback, DragEvent } from "react";
import { useReactFlow, Node, XYPosition } from "reactflow";
import { NodeData, NodeType } from "@/types/flow";

interface DragAndDropHandlers {
  onDragOver: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void;
}

/**
 * Custom hook to manage the visual drag-and-drop interaction for adding new nodes
 * from an external source (like the FlowSidePanel) onto the React Flow canvas.
 *
 * NOTE: This hook MUST be used within a component wrapped by ReactFlowProvider.
 *
 * @param setNodes Setter function for the global nodes state.
 * @param setHasUnsavedChanges Setter function to mark the flow as dirty upon adding a node.
 * @returns Object containing onDragOver and onDrop handlers.
 */
export const useNodeDragAndDrop = (
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>,
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>
): DragAndDropHandlers => {
  // Access the React Flow instance for coordinate projection
  const reactFlowInstance = useReactFlow();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    // Indicate that the element can be dropped
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      // Retrieve the node type identifier stored during dragStart in FlowSidePanel
      const type = event.dataTransfer.getData("application/reactflow");

      // 1. Basic Validation
      if (typeof type === "undefined" || !type || !reactFlowInstance) {
        return;
      }

      const nodeType = type as NodeType;

      // 2. Determine Drop Position
      const reactFlowBounds = (
        event.currentTarget as HTMLElement
      ).getBoundingClientRect();

      // Calculate position relative to the canvas viewport, then project to internal flow coordinates
      const position: XYPosition = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // 3. Create New Node Structure
      const newNode: Node<NodeData> = {
        id: Date.now().toString(), // Unique ID generation
        type: type,
        position,
        data: {
          // Default label. We rely on the Inspector to fill in specific configs.
          label: `${type.replace(/([A-Z])/g, " $1").trim()}`,
          // Important: Pass the type down to the data object for internal rendering/logic checks
          type: nodeType,
        },
      };

      // 4. Update Global State
      setNodes((nds) => nds.concat(newNode));
      setHasUnsavedChanges(true);

      console.log(`[Flow] Added new node: ${type}`);
    },
    [reactFlowInstance, setNodes, setHasUnsavedChanges]
  );

  return {
    onDragOver,
    onDrop,
  };
};
