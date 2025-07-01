"use client";

// import { useTreeStore } from "@/hooks/useTree";
// libs
import { useState } from "react";
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
  const { setFocusedNode } = useTreeStore();
  const { focusedNodeId } = useTreeStore();
  const { addChild, updateNode, deleteNode } = useTreeStore();

  const [isEditing, setIsEditing] = useState(false);

  return (
    // <div className="border rounded p-4 m-2 bg-white shadow-md min-w-[300px]">
    <div className="flex flex-col items-center">
      {/* Actual Node Box */}
      <div
        className={`transition-all duration-300 flex flex-col items-start border border-gray-300 rounded-xl p-4 shadow-md bg-white ${
          focusedNodeId === nodeId ? "scale-105 z-10" : "scale-100"
        } max-w-sm w-fit`}
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
            onClick={() => setIsEditing(true)}
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
      </div>

      {/* CHILDREN */}
      {node.child.length > 0 && (
        <div className="flex flex-col items-center mt-12">
          {/* Connector line from parent to children */}
          <div className="w-1 h-6 bg-gray-400" />

          {/* Row of children */}
          <div className="flex gap-12 mt-4">
            {node.child.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <NodeCard nodeId={child.id} node={child} />
                {/* Optional: connector to grandchildren */}
                {child.child.length > 0 && (
                  <div className="w-1 h-6 bg-gray-300 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
