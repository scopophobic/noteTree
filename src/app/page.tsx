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
    <main className="h-screen w-screen overflow-auto bg-neutral-100">
      <div className="min-h-[3000px] min-w-[3000px] p-40 relative">
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
