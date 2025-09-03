"use client";

import { findNodeById } from "./libs/nodeFindId";
import NodeCard from "@/components/nodeCard";
import SearchNavigator from "@/components/SearchNavigator";
import ProjectManager from "@/components/ProjectManager";
import SettingsMenu from "@/components/SettingsMenu";
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
      <main className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <div className="text-xl text-gray-600 dark:text-gray-300 mb-2">No project selected</div>
          <div className="text-gray-500 dark:text-gray-400">Create or select a project to get started</div>
        </div>
        <ProjectManager />
        <div className="absolute top-4 right-4">
          <SettingsMenu />
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-dark-bg dark:via-dark-bg-secondary dark:to-dark-surface relative">
      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        {/* Compact Zoom Controls */}
        <div className="flex items-center gap-0.5 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm rounded-lg px-2 py-1.5 shadow-lg border border-gray-200 dark:border-dark-border">
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.1))}
            className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-hover hover:text-blue-600 dark:hover:text-dark-accent rounded transition-all"
            title="Zoom Out"
          >
            −
          </button>
          <div className="text-xs text-gray-600 dark:text-dark-text-secondary px-1.5 min-w-10 text-center font-mono font-medium">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.1, 3))}
            className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-hover hover:text-blue-600 dark:hover:text-dark-accent rounded transition-all"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="w-5 h-5 flex items-center justify-center text-xs text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface-hover hover:text-blue-600 dark:hover:text-dark-accent rounded transition-all ml-1"
            title="Reset"
          >
            ↺
          </button>
        </div>
        
        {/* Settings Menu */}
        <SettingsMenu />
      </div>

      {/* Project Manager */}
      <ProjectManager />

            {/* Navigation Controls */}
      {focusedNodeId && (
        <div className="absolute top-4 left-96 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
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
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 dark:border-dark-border">
        <div className="text-sm font-semibold text-gray-800 dark:text-dark-text">{currentProject.name}</div>
        {currentProject.description && (
          <div className="text-xs text-gray-600 dark:text-dark-text-muted mt-1.5 max-w-xs leading-relaxed">{currentProject.description}</div>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 dark:border-dark-border text-sm text-gray-600 dark:text-dark-text-secondary">
        <div className="flex items-center gap-2">• Hold <kbd className="px-2 py-1 bg-gray-200 dark:bg-dark-surface-active dark:text-dark-text rounded font-mono text-xs font-medium">Alt</kbd> + drag to pan</div>
        <div className="flex items-center gap-2 mt-1">• <kbd className="px-2 py-1 bg-gray-200 dark:bg-dark-surface-active dark:text-dark-text rounded font-mono text-xs font-medium">Ctrl/Cmd</kbd> + scroll to zoom</div>
        <div className="flex items-center gap-2 mt-1">• <kbd className="px-2 py-1 bg-gray-200 dark:bg-dark-surface-active dark:text-dark-text rounded font-mono text-xs font-medium">Ctrl/Cmd + K</kbd> to search</div>
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
