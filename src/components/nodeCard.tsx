"use client";

// import { useTreeStore } from "@/hooks/useTree";
// libs
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
// const { tree, focusedNodeId, setFocusedNode } = useTreeStore();
import { useTreeStore } from "@/hooks/useTree";
import { TreeNode } from "@/hooks/useTree";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  nodeId: string;
  node: {
    id: string;
    title: string;
    content: string;
    child: TreeNode[];
  };
};

export default function NodeCard({ node, nodeId }: Props) {
  // const { setFocusedNode } = useTreeStore();
  const { editingNodeId, setEditingNodeId } = useTreeStore();
  const { focusedNodeId } = useTreeStore();
  const { addChild, updateNode, deleteNode } = useTreeStore();
  const isEditingFullscreen = editingNodeId === nodeId;

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingNodeId(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    // <div className="border rounded p-4 m-2 bg-white shadow-md min-w-[300px]">

    <div className="flex flex-col items-center">
      {/* Fullscreen Editing Mode */}
      <AnimatePresence>
        {isEditingFullscreen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-[95%] h-[90%] max-w-none relative border border-gray-100">
              {/* Simple header */}
              <div className="mb-6">
                <h2 className="text-xl font-medium text-gray-800">
                  Editing: {node.title}
                </h2>
              </div>

              {/* Title input */}
              <div className="mb-6">
                <input
                  className="w-full text-lg font-medium p-3 border border-gray-200 rounded-md outline-none focus:border-gray-400 transition-colors"
                  value={node.title}
                  onChange={(e) =>
                    updateNode(nodeId, { title: e.target.value })
                  }
                  placeholder="Title"
                />
              </div>

              {/* Content textarea */}
              <div className="mb-6 flex-1 h-[calc(100%-180px)]">
                <textarea
                  className="w-full  h-full p-4 border border-gray-200 rounded-md resize-none outline-none focus:border-gray-400 transition-colors text-gray-700"
                  value={node.content}
                  onChange={(e) =>
                    updateNode(nodeId, { content: e.target.value })
                  }
                  placeholder="Write your content..."
                />
              </div>

              {/* Simple action button */}
              <div className="flex justify-end">
                <button
                  className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                  onClick={() => setEditingNodeId(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Node Box */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        className={`transition-all duration-300 flex flex-col items-start border border-gray-300 rounded-xl p-4 shadow-md bg-white ${
          focusedNodeId === nodeId ? "scale-105 z-10" : "scale-100"
        } max-w-sm w-fit cursor-move`}
      >
        {/* TITLE */}
        <input
          className="text-lg font-bold mb-2 outline-none border-b w-full max-w-[250px] truncate"
          value={node.title}
          onChange={(e) => updateNode(nodeId, { title: e.target.value })}
        />

        {/* CONTENT */}
        {isEditing ? (
          <>
            <textarea
              className="w-full h-28 p-2 bg-gray-50 border mt-2 text-sm rounded"
              value={node.content}
              autoFocus
              onChange={(e) => updateNode(nodeId, { content: e.target.value })}
              onBlur={() => setIsEditing(false)} // ✅ auto-save on blur
            />
            {/* <div className="flex justify-end mt-2">
          <button
            className="text-xs bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => setIsEditing(false)}
          >
            Save
          </button>
        </div> */}
          </>
        ) : (
          <div
            className="prose prose-sm max-w-none p-2 bg-gray-50 rounded cursor-pointer"
            onClick={() => setEditingNodeId(nodeId)}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {node.content || "*Click to add content...*"}
            </ReactMarkdown>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-3 flex gap-3 text-xs">
          <button className="text-blue-600" onClick={() => addChild(nodeId)}>
            + Add Child
          </button>
          {nodeId !== "root" && (
            <button
              className="text-red-600"
              onClick={() => {
                if (confirm("Delete this node and its children?")) {
                  deleteNode(nodeId);
                }
              }}
            >
              🗑 Delete
            </button>
          )}
        </div>
      </motion.div>

      {/* CHILDREN */}
      {node.child.length > 0 && (
        <div className="flex flex-col items-center mt-8 relative">
          {/* Vertical line from parent to children */}
          <div className="w-1 h-8 bg-gray-400 mb-2" />

          {/* Children container with horizontal line */}
          <div className="flex gap-8 relative">
            {/* Horizontal line behind children */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-400" />

            {node.child.map((child, index) => (
              <div
                key={child.id}
                className="flex flex-col items-center relative"
              >
                {/* Vertical line from horizontal bar to child */}
                <div className="w-1 h-6 bg-gray-400 mb-2" />
                <NodeCard nodeId={child.id} node={child} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
