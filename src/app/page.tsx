"use client";

// const { tree, focusedNodeId, setFocusedNode } = useTreeStore();

import { findNodeById } from "./libs/nodeFindId";

import NodeCard from "@/components/nodeCard";
import { useTreeStore } from "@/hooks/useTree";

export default function Home() {
  const { tree, focusedNodeId, setFocusedNode } = useTreeStore();

  const nodeToRender = focusedNodeId
    ? findNodeById(tree, focusedNodeId) ?? tree
    : tree;
  // const nodeToRender = focusedNodeId ? tree[focusedNodeId] : tree["root"];

  return (
    <main className="min-h-screen w-full overflow-auto bg-gray-50">
      <div className="p-8 min-w-[1000px] flex flex-col items-center">
        {focusedNodeId && (
          <button
            className="mb-4 text-blue-600 underline text-sm"
            onClick={() => setFocusedNode(null)}
          >
            ← Back to Root
          </button>
        )}
        <NodeCard nodeId={nodeToRender.id} node={nodeToRender} />
      </div>
    </main>
  );
}
