"use client";

// import { useTreeStore } from "@/hooks/useTree";
// libs
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
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
  const { editingNodeId, setEditingNodeId } = useTreeStore();
  const { focusedNodeId, setFocusedNode } = useTreeStore();
  const { addChild, updateNode, deleteNode } = useTreeStore();
  const isEditingFullscreen = editingNodeId === nodeId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isPreviewMode, setIsPreviewMode] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditingNodeId(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setEditingNodeId]);

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
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl h-[80vh] relative border border-gray-100">
              {/* Header with mode toggle */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-800">
                  Editing: {node.title}
                </h2>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      !isPreviewMode 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setIsPreviewMode(false)}
                  >
                    Edit
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      isPreviewMode 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setIsPreviewMode(true)}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Title input */}
              <div className="mb-6">
                <input
                  className="w-full text-lg font-medium p-3 border border-gray-200 rounded-md outline-none focus:border-blue-400 transition-colors"
                  value={node.title}
                  onChange={(e) =>
                    updateNode(nodeId, { title: e.target.value })
                  }
                  placeholder="Title"
                />
              </div>

              {/* Content area with split view */}
              <div className="mb-6 flex-1 h-[calc(80vh-250px)] flex gap-4">
                {/* Editor */}
                <div className={`${isPreviewMode ? 'w-1/2' : 'w-full'} flex flex-col`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Markdown Content
                    </label>
                    <div className="text-xs text-gray-500">
                      Supports GitHub Flavored Markdown
                    </div>
                  </div>
                  <textarea
                    ref={textareaRef}
                    className="w-full h-full p-4 border border-gray-200 rounded-md resize-none outline-none focus:border-blue-400 transition-colors text-gray-700 font-mono text-sm leading-relaxed"
                    value={node.content}
                    onChange={(e) =>
                      updateNode(nodeId, { content: e.target.value })
                    }
                    placeholder="Write your markdown content here...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

> Quote block

`inline code`

```javascript
// Code block
console.log('Hello world');
```"
                    spellCheck={false}
                  />
                </div>

                {/* Preview */}
                {isPreviewMode && (
                  <div className="w-1/2 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Preview
                      </label>
                    </div>
                    <div className="flex-1 p-4 border border-gray-200 rounded-md bg-gray-50 overflow-auto">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {node.content || "*Empty content - start typing in the editor to see the preview*"}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> to close
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => setEditingNodeId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => setEditingNodeId(null)}
                  >
                    Done
                  </button>
                </div>
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
        className={`transition-all duration-300 flex flex-col items-start border-2 rounded-xl p-4 shadow-lg bg-white/95 backdrop-blur-sm hover:shadow-xl ${
          focusedNodeId === nodeId 
            ? "scale-110 z-10 border-blue-400 shadow-blue-200/50" 
            : "scale-100 border-gray-200 hover:border-gray-300"
        } max-w-sm w-fit cursor-move group`}
        whileHover={{ scale: 1.02 }}
        whileDrag={{ scale: 1.05, rotate: 2 }}
      >
        {/* TITLE with focus button */}
        <div className="flex items-center justify-between w-full mb-2">
          <input
            className="text-lg font-bold outline-none border-b border-transparent focus:border-blue-400 flex-1 min-w-0 truncate bg-transparent"
            value={node.title}
            onChange={(e) => updateNode(nodeId, { title: e.target.value })}
            placeholder="Untitled Note"
          />
          {node.child.length > 0 && (
            <button
              onClick={() => setFocusedNode(nodeId)}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800 p-1 rounded"
              title="Focus on this node"
            >
              🔍
            </button>
          )}
        </div>

        {/* CONTENT with better preview */}
        <div
          className="w-full max-w-[280px] min-h-[80px] p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg cursor-pointer hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border border-gray-100"
          onClick={() => setEditingNodeId(nodeId)}
        >
          <div className="prose prose-xs max-w-none text-gray-700">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Limit rendering for compact view
                h1: ({children}) => <div className="font-bold text-sm text-gray-900">{children}</div>,
                h2: ({children}) => <div className="font-semibold text-sm text-gray-800">{children}</div>,
                h3: ({children}) => <div className="font-medium text-sm text-gray-700">{children}</div>,
                p: ({children}) => <div className="text-xs text-gray-600 mb-1">{children}</div>,
                ul: ({children}) => <ul className="text-xs text-gray-600 ml-3 mb-1">{children}</ul>,
                ol: ({children}) => <ol className="text-xs text-gray-600 ml-3 mb-1">{children}</ol>,
                blockquote: ({children}) => <div className="border-l-2 border-gray-300 pl-2 text-xs italic text-gray-500">{children}</div>,
                code: ({children}) => <code className="bg-gray-200 px-1 rounded text-xs font-mono">{children}</code>,
                pre: ({children}) => <pre className="bg-gray-200 p-2 rounded text-xs overflow-hidden">{children}</pre>
              }}
            >
              {node.content?.slice(0, 200) + (node.content?.length > 200 ? "..." : "") || "*Click to add content...*"}
            </ReactMarkdown>
          </div>
          <div className="mt-2 text-right">
            <span className="text-xs text-blue-600 opacity-70">Click to edit</span>
          </div>
        </div>

        {/* ACTIONS with better styling */}
        <div className="mt-3 flex items-center justify-between w-full">
          <div className="flex gap-2">
            <button 
              className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
              onClick={() => addChild(nodeId)}
            >
              <span>+</span>
              <span>Child</span>
            </button>
            {nodeId !== "root" && (
              <button
                className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full hover:bg-red-200 transition-colors"
                onClick={() => {
                  if (confirm("Delete this node and its children?")) {
                    deleteNode(nodeId);
                  }
                }}
              >
                <span>🗑</span>
                <span>Delete</span>
              </button>
            )}
          </div>
          {node.child.length > 0 && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {node.child.length} child{node.child.length !== 1 ? 'ren' : ''}
            </div>
          )}
        </div>
      </motion.div>

      {/* CHILDREN */}
      {node.child.length > 0 && (
        <div className="flex flex-col items-center mt-12 relative">
          {/* Vertical line from parent to children */}
          <div className="w-0.5 h-12 bg-gradient-to-b from-blue-300 to-blue-500 mb-4" />

          {/* Children container with horizontal line */}
          <div className="flex flex-wrap gap-12 justify-center relative max-w-6xl">
            {/* Horizontal line behind children */}
            {node.child.length > 1 && (
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300" />
            )}

            {node.child.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center relative"
              >
                {/* Vertical line from horizontal bar to child */}
                <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-blue-300 mb-4" />
                <NodeCard nodeId={child.id} node={child} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
