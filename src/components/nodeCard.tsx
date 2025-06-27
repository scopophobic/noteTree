'use client'


import { useTreeStore } from "@/hooks/useTree";


type Props = {
    nodeId : string;
    node : any;
}


export default function NodeCard({ node, nodeId }: Props) {
    const { addChild, updateNode } = useTreeStore()
  
    return (
      <div className="border rounded p-2 m-2 bg-white">
        <input
          className="text-xl font-bold mb-1 w-full outline-none"
          value={node.title}
          onChange={(e) => updateNode(nodeId, { title: e.target.value })}
        />
        <textarea
          className="w-full h-20 outline-none text-sm bg-gray-50 p-1 rounded"
          value={node.content}
          onChange={(e) => updateNode(nodeId, { content: e.target.value })}
        />
  
        <button
          onClick={() => addChild(nodeId, node)}
          className="text-xs text-blue-500 mt-1"
        >
          + Add Child
        </button>
  
        <div className="ml-4 border-l pl-2">
          {node.child.map((child: any) => (
            <NodeCard key={child.id} nodeId={child.id} node={child} />
          ))}
        </div>
      </div>
    )
  }