import React, { useState, useEffect } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { X, ChevronRight, ChevronLeft, Presentation } from 'lucide-react';

interface DefenseModeProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onClose: () => void;
}

type Slide = 
  | { type: 'title'; title: string; subtitle: string; content: string }
  | { type: 'concept'; node: GraphNode }
  | { type: 'argument'; node: GraphNode };

export default function DefenseMode({ nodes, edges, onClose }: DefenseModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Generate slides dynamically from the graph data
  const coreConcepts = nodes
    .filter(n => n.type === 'Concept' && n.voidWeight !== undefined)
    .sort((a, b) => (b.voidWeight || 0) - (a.voidWeight || 0));
    
  const argumentsList = nodes.filter(n => n.type === 'Claim' && n.premises);

  const slides: Slide[] = [
    { type: 'title', title: 'NIHILTHEISM', subtitle: 'A Philosophical Defense', content: 'The void is the condition of all presence.' },
    ...coreConcepts.map(c => ({ type: 'concept' as const, node: c })),
    ...argumentsList.map(a => ({ type: 'argument' as const, node: a }))
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentSlide(s => Math.min(s + 1, slides.length - 1));
      if (e.key === 'ArrowLeft') setCurrentSlide(s => Math.max(s - 1, 0));
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-[#020202] text-zinc-100 flex flex-col animate-in fade-in duration-300">
      <div className="flex justify-between items-center p-6 border-b border-zinc-900 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 font-mono text-xs text-red-500 tracking-widest">
          <Presentation size={16} />
          ORAL DEFENSE MODE // ACTIVE
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
            SLIDE {currentSlide + 1} OF {slides.length}
          </span>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors bg-zinc-900 p-1.5 rounded border border-zinc-800">
            <X size={18}/>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
        
        <button 
          onClick={() => setCurrentSlide(s => Math.max(s - 1, 0))} 
          className="absolute left-8 p-4 text-zinc-800 hover:text-zinc-400 disabled:opacity-0 transition-colors z-10" 
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={64} strokeWidth={1} />
        </button>
        
        <button 
          onClick={() => setCurrentSlide(s => Math.min(s + 1, slides.length - 1))} 
          className="absolute right-8 p-4 text-zinc-800 hover:text-zinc-400 disabled:opacity-0 transition-colors z-10" 
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight size={64} strokeWidth={1} />
        </button>

        <div className="max-w-5xl w-full z-10">
          {slide.type === 'title' && (
            <div className="text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <h1 className="text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-600">
                {slide.title}
              </h1>
              <h2 className="text-3xl text-zinc-400 font-light tracking-widest uppercase letter-spacing-2">
                {slide.subtitle}
              </h2>
              <div className="w-24 h-px bg-zinc-800 mx-auto mt-12 mb-12" />
              <p className="text-zinc-500 font-mono text-lg tracking-widest uppercase">
                {slide.content}
              </p>
            </div>
          )}

          {slide.type === 'concept' && slide.node && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="text-sm font-mono text-cyan-500 tracking-widest uppercase flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                Core Concept
              </div>
              <h2 className="text-6xl font-bold tracking-tight">{slide.node.label}</h2>
              
              <div className="grid grid-cols-2 gap-12 mt-16">
                <div className="space-y-6">
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Ontological Metrics</div>
                  <div className="bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-xl space-y-6 font-mono text-base backdrop-blur-md">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Void Weight</span> 
                      <span className="text-cyan-400 font-bold text-xl">{slide.node.voidWeight?.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full" style={{ width: `${(slide.node.voidWeight || 0) * 100}%` }} />
                    </div>
                    
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-zinc-400">Resonance</span> 
                      <span className="text-purple-400 font-bold text-xl">{slide.node.resonanceWeight?.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: `${(slide.node.resonanceWeight || 0) * 100}%` }} />
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <span className="text-zinc-400">Volatility</span> 
                      <span className="text-red-400 font-bold text-xl">{slide.node.epistemicVolatility?.toFixed(2) || 'N/A'}</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: `${(slide.node.epistemicVolatility || 0) * 100}%` }} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Thematic Tags</div>
                  <div className="flex flex-wrap gap-3">
                    {slide.node.tags?.map(t => (
                      <span key={t} className="px-4 py-2 bg-zinc-900/80 border border-zinc-700/50 rounded-full text-sm font-mono text-zinc-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-12 text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Saturation Index</div>
                  <div className="flex items-end gap-4">
                    <span className="text-5xl font-light text-green-400">{((slide.node.saturationIndex || 0) * 100).toFixed(0)}%</span>
                    <span className="text-zinc-500 mb-2">Saturated</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {slide.type === 'argument' && slide.node && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="text-sm font-mono text-purple-500 tracking-widest uppercase flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                Formal Argument
              </div>
              <h2 className="text-5xl font-bold tracking-tight">{slide.node.label}</h2>
              
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-10 rounded-2xl mt-12 backdrop-blur-md shadow-2xl">
                <div className="space-y-6 mb-12 pl-8 border-l-4 border-zinc-800">
                  {slide.node.premises?.map((p, i) => (
                    <div key={i} className="font-mono text-2xl text-zinc-300 leading-relaxed">{p}</div>
                  ))}
                </div>
                
                <div className="text-3xl font-medium text-white bg-zinc-900/80 p-8 rounded-xl border border-zinc-700/50 shadow-inner">
                  <span className="text-purple-400 mr-6 font-bold">∴</span> 
                  <span className="leading-relaxed">{slide.node.conclusion}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
