import { create } from "zustand";
import { persist } from "zustand/middleware";

// ------------------
// TreeNode type
// ------------------
export type TreeNode = {
  id: string;
  title: string;
  content: string;
  child: TreeNode[];
};

// ------------------
// Store type
// ------------------
type TreeState = {
  tree: TreeNode; // ✅ Root node (not map)
  setTree: (tree: TreeNode) => void;

  focusedNodeId: string | null;
  setFocusedNode: (id: string | null) => void;

  addChild: (parentId: string) => void;
  updateNode: (id: string, data: Partial<TreeNode>) => void;
  deleteNode: (id: string) => void;
};

// ------------------
// Helpers
// ------------------
function generateNode(): TreeNode {
  return {
    id: crypto.randomUUID(),
    title: "New Note",
    content: "",
    child: [],
  };
}



function updateNodeRecursive(tree: TreeNode, id: string, data: Partial<TreeNode>): TreeNode {
  if (tree.id === id) return { ...tree, ...data };
  return {
    ...tree,
    child: tree.child.map((c) => updateNodeRecursive(c, id, data)),
  };
}

function addChildRecursive(tree: TreeNode, parentId: string): TreeNode {
  if (tree.id === parentId) {
    return {
      ...tree,
      child: [...tree.child, generateNode()],
    };
  }
  return {
    ...tree,
    child: tree.child.map((c) => addChildRecursive(c, parentId)),
  };
}

function deleteNodeRecursive(tree: TreeNode, idToDelete: string): TreeNode {
  return {
    ...tree,
    child: tree.child
      .filter((c) => c.id !== idToDelete)
      .map((c) => deleteNodeRecursive(c, idToDelete)),
  };
}

// ------------------
// Zustand Store
// ------------------
export const useTreeStore = create<TreeState>()(
  persist(
    (set, get) => ({
      tree: {
        id: "root",
        title: "Root Note",
        content: "",
        child: [],
      },
      focusedNodeId: null,

      setTree: (tree) => set({ tree }),
      setFocusedNode: (id) => set({ focusedNodeId: id }),

      addChild: (parentId) => {
        const updated = addChildRecursive(get().tree, parentId);
        set({ tree: updated });
      },

      updateNode: (id, data) => {
        const updated = updateNodeRecursive(get().tree, id, data);
        set({ tree: updated });
      },

      deleteNode: (id) => {
        if (id === "root") return;
        const updated = deleteNodeRecursive(get().tree, id);
        set({ tree: updated });
      },
    }),
    { name: "tree-note-data" }
  )
);
