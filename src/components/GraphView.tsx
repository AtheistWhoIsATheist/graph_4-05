import React, { useState } from 'react';
import { GraphNode, GraphEdge, NodeType } from '../types';

export type GraphViewType = 'force-directed' | 'project-scoped' | 'thinker' | 'orphan';

interface GraphViewProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  viewType: GraphViewType;
  selectedProjectId?: string;
  onNodeClick: (node: GraphNode) => void;
  onEdgeClick?: (edge: GraphEdge) => void;
}

const getNodeColor = (type: NodeType) => {
  switch (type) {
    case 'Thinker': return '#18181b';
    case 'Concept': return '#09090b';
    case 'Source': return '#172554';
    case 'Note': return '#450a0a';
    case 'Quote': return '#3f6212';
    case 'Project': return '#4c1d95';
    case 'Claim': return '#064e3b';
    default: return '#09090b';
  }
};

const getNodeStroke = (type: NodeType) => {
  switch (type) {
    case 'Thinker': return '#52525b';
    case 'Concept': return '#3f3f46';
    case 'Source': return '#60a5fa';
    case 'Note': return '#f87171';
    case 'Quote': return '#a3e635';
    case 'Project': return '#a78bfa';
    case 'Claim': return '#34d399';
    default: return '#52525b';
  }
};

export default function GraphView({ nodes, edges, viewType, selectedProjectId, onNodeClick, onEdgeClick }: GraphViewProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Filter nodes and edges based on viewType
  let visibleNodes = nodes;
  let visibleEdges = edges;

  if (viewType === 'project-scoped' && selectedProjectId) {
    visibleNodes = nodes.filter(n => n.projectId === selectedProjectId);
    visibleEdges = edges.filter(e => 
      visibleNodes.some(n => n.id === e.source) && visibleNodes.some(n => n.id === e.target)
    );
  } else if (viewType === 'thinker') {
    visibleNodes = nodes.filter(n => n.type === 'Thinker' || edges.some(e => (e.source === n.id || e.target === n.id) && nodes.find(sn => sn.id === (e.source === n.id ? e.target : e.source))?.type === 'Thinker'));
    visibleEdges = edges.filter(e => 
      visibleNodes.some(n => n.id === e.source) && visibleNodes.some(n => n.id === e.target)
    );
  } else if (viewType === 'orphan') {
    const connectedNodeIds = new Set(edges.flatMap(e => [e.source, e.target]));
    visibleNodes = nodes.filter(n => n.isOrphan || !connectedNodeIds.has(n.id));
    visibleEdges = [];
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({ ...prev, scale: Math.max(0.1, Math.min(prev.scale * scaleChange, 5)) }));
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] rounded-lg overflow-hidden relative border border-zinc-800" onWheel={handleWheel}>
      <svg className="w-full h-full">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#52525b" />
          </marker>
          <marker id="arrowhead-candidate" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#a1a1aa" />
          </marker>
        </defs>
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {visibleEdges.map(edge => {
            const sourceNode = visibleNodes.find(n => n.id === edge.source);
            const targetNode = visibleNodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode || sourceNode.x === undefined || sourceNode.y === undefined || targetNode.x === undefined || targetNode.y === undefined) return null;

            const isCandidate = edge.user_confirmed === false;

            return (
              <g key={edge.id} onClick={() => onEdgeClick && onEdgeClick(edge)} className="cursor-pointer hover:opacity-100 transition-opacity">
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isCandidate ? "#a1a1aa" : "#52525b"}
                  strokeWidth={edge.weight ? edge.weight * 3 : 1.5}
                  strokeDasharray={isCandidate ? "4 4" : "none"}
                  markerEnd={`url(#${isCandidate ? 'arrowhead-candidate' : 'arrowhead'})`}
                  className={isCandidate ? "opacity-40" : "opacity-60"}
                />
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2 - 8}
                  fill={isCandidate ? "#a1a1aa" : "#71717a"}
                  fontSize="10"
                  textAnchor="middle"
                  className="font-mono uppercase tracking-widest"
                >
                  {edge.type}
                </text>
              </g>
            );
          })}
          {visibleNodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            const isCandidate = node.status === 'candidate';
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.x || 0}, ${node.y || 0})`}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  onNodeClick(node);
                }}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                {isSelected && (
                  <circle r="28" fill="none" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                )}
                <title>
                  {node.label} ({node.type})
                  {node.status ? `\nStatus: ${node.status}` : ''}
                  {node.voidWeight !== undefined ? `\nVoid Weight: ${node.voidWeight}` : ''}
                  {node.resonanceWeight !== undefined ? `\nResonance Weight: ${node.resonanceWeight}` : ''}
                  {node.epistemicVolatility !== undefined ? `\nVolatility: ${node.epistemicVolatility}` : ''}
                  {node.saturationIndex !== undefined ? `\nSaturation: ${(node.saturationIndex * 100).toFixed(0)}%` : ''}
                </title>
                <circle
                  r="24"
                  fill={getNodeColor(node.type)}
                  stroke={getNodeStroke(node.type)}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  strokeDasharray={isCandidate ? "4 4" : "none"}
                  className={isCandidate ? "opacity-80" : "opacity-100"}
                />
                <text
                  fill={isCandidate ? "#a1a1aa" : "#e4e4e7"}
                  fontSize="11"
                  textAnchor="middle"
                  dy=".3em"
                  className="pointer-events-none font-mono tracking-tight"
                >
                  {node.label}
                </text>
                {isCandidate && (
                  <circle cx="16" cy="-16" r="4" fill="#fbbf24" />
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="absolute bottom-4 left-4 text-zinc-600 font-mono text-[10px] uppercase tracking-widest flex flex-col gap-1">
        <span>PHASE 1 KNOWLEDGE GRAPH // {viewType.toUpperCase()}</span>
        <span className="text-zinc-700">Scroll to zoom • Click nodes/edges to inspect</span>
      </div>
    </div>
  );
}
