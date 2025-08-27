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
// Project type
// ------------------
export type Project = {
  id: string;
  name: string;
  description: string;
  tree: TreeNode;
  createdAt: string;
  updatedAt: string;
};

// ------------------
// Store type
// ------------------
type TreeState = {
  projects: Project[];
  currentProjectId: string | null;
  
  // Project management
  createProject: (name: string, description?: string) => void;
  deleteProject: (id: string) => void;
  switchProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Pick<Project, 'name' | 'description'>>) => void;
  
  // Current project tree operations
  getCurrentProject: () => Project | null;
  focusedNodeId: string | null;
  setFocusedNode: (id: string | null) => void;

  editingNodeId: string | null;
  setEditingNodeId: (id: string | null) => void;

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

function createDefaultProject(name: string, description: string = ""): Project {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tree: {
      id: "root",
      title: `🚀 ${name}`,
      content: `# ${name}

${description ? description + '\n\n' : ''}Welcome to your project! This is the root node of your project tree.

## Getting Started

- Click **"+ Child"** to add new notes to this project
- Click on any note content to edit with full markdown support
- Use the focus button (🔍) to zoom into specific sections
- Organize your thoughts in a hierarchical tree structure

## Project Structure

Use this space to outline your project structure, goals, and key information.

> **Tip**: Create child notes for different aspects of your project like tasks, ideas, resources, etc.`,
      child: [],
    },
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
    (set, get) => {
      // Create default project if none exist
      const defaultProject = createDefaultProject(
        "Welcome to TreeNote",
        "A modern tree-based note-taking platform for organizing your thoughts and projects."
      );

      return {
        projects: [defaultProject],
        currentProjectId: defaultProject.id,
        focusedNodeId: null,
        editingNodeId: null,

        // Project management
        createProject: (name, description = "") => {
          const newProject = createDefaultProject(name, description);
          set(state => ({
            projects: [...state.projects, newProject],
            currentProjectId: newProject.id,
            focusedNodeId: null,
            editingNodeId: null,
          }));
        },

        deleteProject: (id) => {
          const state = get();
          if (state.projects.length <= 1) return; // Keep at least one project
          
          const updatedProjects = state.projects.filter(p => p.id !== id);
          const newCurrentId = state.currentProjectId === id 
            ? updatedProjects[0]?.id || null 
            : state.currentProjectId;
          
          set({
            projects: updatedProjects,
            currentProjectId: newCurrentId,
            focusedNodeId: null,
            editingNodeId: null,
          });
        },

        switchProject: (id) => {
          set({
            currentProjectId: id,
            focusedNodeId: null,
            editingNodeId: null,
          });
        },

        updateProject: (id, data) => {
          set(state => ({
            projects: state.projects.map(p => 
              p.id === id 
                ? { ...p, ...data, updatedAt: new Date().toISOString() }
                : p
            ),
          }));
        },

        getCurrentProject: () => {
          const state = get();
          return state.projects.find(p => p.id === state.currentProjectId) || null;
        },

        setFocusedNode: (id) => set({ focusedNodeId: id }),
        setEditingNodeId: (id) => set({ editingNodeId: id }),

        addChild: (parentId) => {
          const state = get();
          const currentProject = state.getCurrentProject();
          if (!currentProject) return;

          const updated = addChildRecursive(currentProject.tree, parentId);
          set({
            projects: state.projects.map(p => 
              p.id === currentProject.id 
                ? { ...p, tree: updated, updatedAt: new Date().toISOString() }
                : p
            ),
          });
        },

        updateNode: (id, data) => {
          const state = get();
          const currentProject = state.getCurrentProject();
          if (!currentProject) return;

          const updated = updateNodeRecursive(currentProject.tree, id, data);
          set({
            projects: state.projects.map(p => 
              p.id === currentProject.id 
                ? { ...p, tree: updated, updatedAt: new Date().toISOString() }
                : p
            ),
          });
        },

        deleteNode: (id) => {
          if (id === "root") return;
          const state = get();
          const currentProject = state.getCurrentProject();
          if (!currentProject) return;

          const updated = deleteNodeRecursive(currentProject.tree, id);
          set({
            projects: state.projects.map(p => 
              p.id === currentProject.id 
                ? { ...p, tree: updated, updatedAt: new Date().toISOString() }
                : p
            ),
          });
        },
      };
    },
    { name: "tree-note-data" }
  )
);
