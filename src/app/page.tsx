"use client";

import { findNodeById } from "./libs/nodeFindId";
import NodeCard from "@/components/nodeCard";
import SearchNavigator from "@/components/SearchNavigator";
import ProjectManager from "@/components/ProjectManager";
import { useTreeStore } from "@/hooks/useTree";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { getCurrentProject, focusedNodeId, setFocusedNode } = useTreeStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Handle zoom with mouse wheel - moved before early return
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        setZoom(prev => Math.min(Math.max(0.1, prev + delta), 3));
      }
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, []);

  // Center the content initially - moved before early return
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.scrollTo({
        left: (canvas.scrollWidth - canvas.clientWidth) / 2,
        top: (canvas.scrollHeight - canvas.clientHeight) / 2,
        behavior: 'smooth'
      });
    }
  }, []);

  const currentProject = getCurrentProject();
  const tree = currentProject?.tree;
  
  const nodeToRender = focusedNodeId && tree
    ? findNodeById(tree, focusedNodeId) ?? tree
    : tree;

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+Left click
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  if (!currentProject || !tree) {
    return (
      <main className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <div className="text-xl text-gray-600 mb-2">No project selected</div>
          <div className="text-gray-500">Create or select a project to get started</div>
        </div>
        <ProjectManager />
      </main>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 relative">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}
          className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In (Ctrl/Cmd + Scroll)"
        >
          +
        </button>
        <div className="text-xs text-center text-gray-600 py-1 min-w-12">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.1))}
          className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out (Ctrl/Cmd + Scroll)"
        >
          −
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors"
          title="Reset View"
        >
          ⌂
        </button>
      </div>

      {/* Project Manager */}
      <ProjectManager />

      {/* Navigation Controls */}
      {focusedNodeId && (
        <div className="absolute top-4 left-96 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            onClick={() => setFocusedNode(null)}
          >
            <span className="text-lg">←</span>
            <span>Back to Root</span>
          </button>
        </div>
      )}

      {/* Search Navigator */}
      <SearchNavigator />

      {/* Project Title */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
        <div className="text-sm font-medium text-gray-800">{currentProject.name}</div>
        {currentProject.description && (
          <div className="text-xs text-gray-600 mt-1 max-w-xs">{currentProject.description}</div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border text-sm text-gray-600">
        <div>• Hold <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Alt</kbd> + drag to pan</div>
        <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl/Cmd</kbd> + scroll to zoom</div>
        <div>• <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl/Cmd + K</kbd> to search</div>
      </div>

      {/* Infinite Canvas */}
      <div
        ref={canvasRef}
        className="h-full w-full overflow-auto cursor-grab"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="min-h-[5000px] min-w-[5000px] relative flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center'
          }}
        >
          <div className="p-20">
            {nodeToRender && (
              <NodeCard nodeId={nodeToRender.id} node={nodeToRender} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
