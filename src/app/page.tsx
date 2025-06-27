'use client'

import { useTreeStore } from '@/hooks/useTree'
import NodeCard from '@/components/nodeCard'

export default function Home() {
  const { tree } = useTreeStore()

  return (
    <main className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">NoteTREE 🌳</h1>
      <NodeCard node={tree} nodeId={tree.id} />
    </main>
  )
}
