"use client";

import { useState, useEffect } from "react";
import { useTreeStore } from "@/hooks/useTree";
import { findNodeById } from "@/app/libs/nodeFindId";
import { TreeNode } from "@/hooks/useTree";

function getAllNodes(node: TreeNode): TreeNode[] {
  const nodes = [node];
  for (const child of node.child) {
    nodes.push(...getAllNodes(child));
  }
  return nodes;
}

export default function SearchNavigator() {
  const { getCurrentProject, setFocusedNode } = useTreeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNodes, setFilteredNodes] = useState<TreeNode[]>([]);

  const currentProject = getCurrentProject();
  const tree = currentProject?.tree;

  useEffect(() => {
    if (searchTerm.length > 0 && tree) {
      const allNodes = getAllNodes(tree);
      const filtered = allNodes.filter(
        (node) =>
          node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNodes(filtered);
    } else {
      setFilteredNodes([]);
    }
  }, [searchTerm, tree]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "k") {
          e.preventDefault();
          setIsOpen(true);
        }
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNodeSelect = (nodeId: string) => {
    setFocusedNode(nodeId);
    setIsOpen(false);
    setSearchTerm("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
      >
        <span>🔍</span>
        <span>Search notes</span>
        <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl border w-full max-w-2xl mx-4">
        {/* Search Input */}
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-lg p-3 border border-gray-200 rounded-md outline-none focus:border-blue-400 transition-colors"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-auto">
          {searchTerm.length > 0 ? (
            filteredNodes.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleNodeSelect(node.id)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">
                      {node.title || "Untitled"}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {node.content?.slice(0, 150) + 
                        (node.content?.length > 150 ? "..." : "") || 
                        "No content"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {node.child.length} child{node.child.length !== 1 ? "ren" : ""}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <div>No notes found matching "{searchTerm}"</div>
              </div>
            )
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">💭</div>
              <div>Start typing to search your notes...</div>
              <div className="text-sm mt-2">
                Search by title or content
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
          <div>Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> to close</div>
          <div>{filteredNodes.length} result{filteredNodes.length !== 1 ? "s" : ""}</div>
        </div>
      </div>
    </div>
  );
}

