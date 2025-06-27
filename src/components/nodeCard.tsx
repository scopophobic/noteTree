"use client";


// libs 
import { useState } from "react";
import { useTreeStore } from "@/hooks/useTree";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";



type Props = {
  nodeId: string;
  node: {
    id: string;
    title: string;
    content: string;
    child: any[];
  };
};

export default function NodeCard({ node, nodeId }: Props) {
  const { addChild, updateNode, deleteNode } = useTreeStore();

  const [isEditing, setIsEditing] = useState(false);

  return (
    // <div className="border rounded p-4 m-2 bg-white shadow-md min-w-[300px]">
    <div className="flex flex-col items-start">
      <div className="border rounded p-4 bg-white shadow-md w-fit min-w-[250px]">
        {/* Node Title */}
        <input
          className="text-xl font-semibold mb-2 w-full outline-none border-b"
          value={node.title}
          onChange={(e) => updateNode(nodeId, { title: e.target.value })}
        />

        {/* Markdown Content Area */}
        {isEditing ? (
          <>
            <textarea
              className="w-full h-32 p-2 bg-gray-50 border mt-2 text-sm rounded"
              value={node.content}
              onChange={(e) => updateNode(nodeId, { content: e.target.value })}
              onBlur={() => setIsEditing(false)} // ✅ auto-save and switch back
              autoFocus
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
          <>
            <div
              className="prose prose-sm max-w-none p-2 bg-gray-50 rounded cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {node.content || "*Click to add content...*"}
              </ReactMarkdown>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="mt-3 flex gap-3">
          <button
            className="text-xs text-blue-600"
            onClick={() => addChild(nodeId, node)}
          >
            + Add Child
          </button>
          {nodeId !== "root" && (
            <button
              className="text-xs text-red-600"
              onClick={() => {
                if (confirm("Delete this node and its children?")) {
                  deleteNode(nodeId);
                }
              }}
            >
              🗑 Delete
            </button>
          )}
          {/* Sibling add and delete will come next */}
        </div>

        {/* Render child recursively */}
        {/* <div className="ml-4 border-l pl-4 mt-2">
        {node.child.map((child) => (
          <NodeCard key={child.id} nodeId={child.id} node={child} />
        ))}
      </div> */}
        {/* Render children in a horizontal row */}
        {node.child.length > 0 && (
          <div className="mt-4 flex gap-4 flex-wrap justify-start pl-2 border-l-2 border-gray-300">
            {node.child.map((child) => (
              <NodeCard key={child.id} nodeId={child.id} node={child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
