import { create } from "zustand";
import { persist } from "zustand/middleware";

// Uses Zustand with persist (so data survives page reloads)


type TreeNode = {
    id: string;
    title: string;
    content: string;
    child: TreeNode[];
}


type TreeState = {
    tree: TreeNode;
    setTree: (tree: TreeNode) => void
    addChild: (parentId: string, child: TreeNode) => void;
    updateNode: (id: string, data: Partial<TreeNode>) => void
    deleteNode: (id: string) => void
}


// main fucntions for the treenode ops
function generateNode(): TreeNode {
    return {
      id: crypto.randomUUID(),
      title: 'New Note',
      content: '',
      child: [],
    }
  }

// main fucntions for the treenode ops
  function updateNodeRecursive(tree: TreeNode, id: string, data: Partial<TreeNode>): TreeNode {
    if (tree.id === id) return { ...tree, ...data }
    return {
      ...tree,
      child: tree.child.map(child => updateNodeRecursive(child, id, data)),
    }
  }

  // main fucntions for the treenode ops
  function addChildRecursive(tree: TreeNode, parentId: string): TreeNode {
    if (tree.id === parentId) {
      return {
        ...tree,
        child: [...tree.child, generateNode()],
      }
    }
    return {
      ...tree,
      child: tree.child.map(child => addChildRecursive(child, parentId)),
    }
  }
// for deleting node 
  function deleteNodeRecursive(tree: TreeNode, idToDelete: string): TreeNode {
    return {
      ...tree,
      child: tree.child
        .filter((child) => child.id !== idToDelete)
        .map((child) => deleteNodeRecursive(child, idToDelete)),
    }
  }
  
// MAIN FUCNTION FOR THE TREE STORE
  export const useTreeStore = create<TreeState>()(
    persist(
      (set, get) => ({
        tree: {
          id: 'root',
          title: 'Root Note',
          content: '',
          child: [],
        },
        setTree: (tree) => set({ tree }),
        addChild: (parentId) => {
          const updated = addChildRecursive(get().tree, parentId)
          set({ tree: updated })
        },
        updateNode: (id, data) => {
          const updated = updateNodeRecursive(get().tree, id, data)
          set({ tree: updated })
        },
        deleteNode: (id) => {
            const current = get().tree
            if (id === 'root') return // prevent deleting root
            const updated = deleteNodeRecursive(current, id)
            set({ tree: updated })
          },
      }),
      { name: 'tree-note-data' }
    )
  )