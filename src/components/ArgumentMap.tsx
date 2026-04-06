import React from 'react';
import { GraphNode, GraphEdge } from '../types';
import { ArrowDown, ShieldAlert } from 'lucide-react';

interface ArgumentMapProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function ArgumentMap({ nodes, edges }: ArgumentMapProps) {
  const argumentsList = nodes.filter(n => n.type === 'Claim' && n.premises);

  return (
    <div className="w-full h-full overflow-y-auto p-8 bg-[#0a0a0a] text-zinc-200 rounded-lg border border-zinc-800">
      <h2 className="text-2xl font-mono mb-8 uppercase tracking-widest border-b border-zinc-800 pb-4 text-purple-400">Formal Argument Structures</h2>
      <div className="flex flex-col gap-12 max-w-4xl mx-auto">
        {argumentsList.map(arg => {
          const critiques = edges
            .filter(e => e.target === arg.id && e.type === 'critiques')
            .map(e => nodes.find(n => n.id === e.source))
            .filter(Boolean) as GraphNode[];
          
          return (
            <div key={arg.id} className="border border-zinc-800 rounded-lg p-8 bg-[#050505] shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-medium text-purple-400">{arg.label}</h3>
                <span className="text-xs font-mono bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800 text-zinc-400">
                  SATURATION: {((arg.saturationIndex || 0) * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="space-y-4 mb-8 pl-6 border-l-2 border-zinc-800">
                {arg.premises?.map((p, i) => (
                  <div key={i} className="font-mono text-base text-zinc-300 leading-relaxed">{p}</div>
                ))}
              </div>
              
              <div className="flex justify-center mb-8">
                <ArrowDown className="text-zinc-600" size={32} />
              </div>
              
              <div className="bg-zinc-900 p-6 rounded border border-zinc-800 font-medium text-zinc-100 text-lg shadow-inner">
                <span className="text-purple-500 mr-3 font-bold">∴</span> {arg.conclusion}
              </div>

              {critiques.length > 0 && (
                <div className="mt-10 pt-8 border-t border-zinc-800">
                  <h4 className="text-sm font-mono text-red-400 mb-6 flex items-center gap-2">
                    <ShieldAlert size={18}/> Known Critiques & Objections
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {critiques.map(critique => (
                      <div key={critique.id} className="bg-red-950/10 border border-red-900/30 p-4 rounded-lg text-sm">
                        <span className="font-bold text-red-400 block mb-2">{critique.label}</span> 
                        <span className="text-zinc-300 leading-relaxed">{critique.conclusion || 'Pending formalization'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
