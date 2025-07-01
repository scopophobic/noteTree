import { TreeNode } from "@/hooks/useTree";

export function findNodeById(node: TreeNode, id: string): TreeNode | null {
    if (node.id === id) return node;
  
    for (const child of node.child) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  
    return null;
  }