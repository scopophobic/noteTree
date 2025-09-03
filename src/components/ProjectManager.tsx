"use client";

import { useState } from "react";
import { useTreeStore } from "@/hooks/useTree";
import { Project } from "@/hooks/useTree";

export default function ProjectManager() {
  const { 
    projects, 
    currentProjectId, 
    createProject, 
    deleteProject, 
    switchProject, 
    updateProject,
    getCurrentProject 
  } = useTreeStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const currentProject = getCurrentProject();

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim(), newProjectDescription.trim());
      setNewProjectName("");
      setNewProjectDescription("");
      setIsCreating(false);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length > 1 && confirm("Are you sure you want to delete this project? All notes will be lost.")) {
      deleteProject(id);
    }
  };

  const handleUpdateProject = (id: string, name: string, description: string) => {
    updateProject(id, { name: name.trim(), description: description.trim() });
    setEditingProject(null);
  };

  if (!isOpen) {
    return (
      <div className="fixed top-4 left-4 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-2"
        >
          <span>📁</span>
          <span>{currentProject?.name || "No Project"}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">({projects.length})</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-30 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-h-96 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Projects</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-auto p-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-3 rounded-lg mb-2 border transition-colors ${
              project.id === currentProjectId
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {editingProject === project.id ? (
              <EditProjectForm
                project={project}
                onSave={(name, description) => handleUpdateProject(project.id, name, description)}
                onCancel={() => setEditingProject(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => switchProject(project.id)}
                      className="w-full text-left"
                    >
                      <div className="font-medium text-gray-900 truncate">
                        {project.name}
                      </div>
                      {project.description && (
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {project.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </div>
                    </button>
                  </div>
                  
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => setEditingProject(project.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit project"
                    >
                      ✏️
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete project"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Create New Project */}
      <div className="p-4 border-t">
        {isCreating ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-400"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-400 resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewProjectName("");
                  setNewProjectDescription("");
                }}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>New Project</span>
          </button>
        )}
      </div>
    </div>
  );
}

function EditProjectForm({ 
  project, 
  onSave, 
  onCancel 
}: { 
  project: Project; 
  onSave: (name: string, description: string) => void; 
  onCancel: () => void; 
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-400"
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-400 resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(name, description)}
          disabled={!name.trim()}
          className="flex-1 py-1 px-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-2 py-1 text-gray-600 hover:text-gray-800 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
