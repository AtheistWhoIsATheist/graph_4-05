/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import GraphView, { GraphViewType } from './components/GraphView';
import NoteEditor from './components/NoteEditor';
import ArgumentMap from './components/ArgumentMap';
import DefenseMode from './components/DefenseMode';
import { initialNodes, initialEdges, initialDocuments } from './data/mockData';
import { ntNodes, ntEdges } from './data/ntgraphData';
import { Document, GraphNode, GraphEdge } from './types';
import { Database, Network, BrainCircuit, Search, Settings, Mic, Send, Brain, Filter, Upload, Presentation, ListTree } from 'lucide-react';
import { parseMarkdown } from './lib/ingestion/markdownAdapter';

export default function App() {
  const [nodes, setNodes] = useState<GraphNode[]>([...initialNodes, ...ntNodes]);
  const [edges, setEdges] = useState<GraphEdge[]>([...initialEdges, ...ntEdges]);
  const [documents, setDocuments] = useState(initialDocuments);
  const [activeDocId, setActiveDocId] = useState<string>(initialDocuments[0].id);
  const [thinkingMode, setThinkingMode] = useState<'Auto' | 'Deep' | 'Fast'>('Auto');
  const [graphView, setGraphView] = useState<GraphViewType>('force-directed');
  const [mainView, setMainView] = useState<'graph' | 'arguments'>('graph');
  const [isDefenseModeActive, setIsDefenseModeActive] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('p1');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Phase 1 Knowledge Graph active. Ready for conceptual mapping and navigation.' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeDocument = documents.find(d => d.id === activeDocId) || documents[0];

  const handleNodeClick = (node: GraphNode) => {
    console.log('Node clicked:', node.label);
    // Future: filter documents by linked node
  };

  const handleEdgeClick = (edge: GraphEdge) => {
    console.log('Edge clicked:', edge.type, edge.explanation);
  };

  const handleSaveDocument = (updatedDoc: Document) => {
    setDocuments(docs => docs.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { role: 'user', content: chatInput }]);
    setChatInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: `[${thinkingMode} Path] Processing query through Void-as-Presence lens. Paradox detected. Apophatic guardrails engaged.` }]);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const sourceId = `doc-${Date.now()}`;
      
      // 1. Run through Text/Markdown Adapter
      const documentTree = parseMarkdown(sourceId, content);
      
      console.log('Ingestion Pipeline Output (DocumentTree):', documentTree);
      
      // 2. Add to UI state
      const newDoc: Document = {
        id: sourceId,
        title: documentTree.metadata.title || file.name,
        content: content,
        tags: documentTree.metadata.tags || [],
        linkedNodes: []
      };

      // Add a Source node to the graph
      const newNode: GraphNode = {
        id: sourceId,
        label: newDoc.title,
        type: 'Source',
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
        status: 'candidate',
        tags: newDoc.tags
      };

      setDocuments(prev => [...prev, newDoc]);
      setNodes(prev => [...prev, newNode]);
      setActiveDocId(sourceId);
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Ingested source: "${newDoc.title}". Parsed ${documentTree.blocks.length} blocks, ${documentTree.sections.length} sections, and ${documentTree.links.length} links.` 
      }]);
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      {isDefenseModeActive && (
        <DefenseMode nodes={nodes} edges={edges} onClose={() => setIsDefenseModeActive(false)} />
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        accept=".txt,.md" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />

      {/* Sidebar Navigation */}
      <div className="w-16 flex flex-col items-center py-6 bg-[#020202] border-r border-zinc-800 gap-8 z-10">
        <div className="w-10 h-10 rounded bg-zinc-100 text-black flex items-center justify-center font-bold font-mono text-sm tracking-tighter">
          NT
        </div>
        <nav className="flex flex-col gap-6 text-zinc-600 flex-1">
          <button 
            onClick={() => setMainView('graph')}
            className={`transition-colors p-2 rounded-lg ${mainView === 'graph' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'hover:text-zinc-100'}`} 
            title="Graph View"
          >
            <Network size={20} />
          </button>
          <button 
            onClick={() => setMainView('arguments')}
            className={`transition-colors p-2 rounded-lg ${mainView === 'arguments' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'hover:text-zinc-100'}`} 
            title="Argument Maps"
          >
            <ListTree size={20} />
          </button>
          <button className="hover:text-zinc-100 transition-colors p-2 rounded-lg" title="Knowledge Base"><Database size={20} /></button>
          <button className="hover:text-zinc-100 transition-colors p-2 rounded-lg" title="AI Philosopher"><BrainCircuit size={20} /></button>
          <button className="hover:text-zinc-100 transition-colors p-2 rounded-lg" title="Search"><Search size={20} /></button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="hover:text-zinc-100 transition-colors p-2 rounded-lg" 
            title="Ingest Source (.md, .txt)"
          >
            <Upload size={20} />
          </button>
        </nav>
        <div className="mt-auto">
          <button className="hover:text-zinc-100 transition-colors p-2 rounded-lg text-zinc-600"><Settings size={20} /></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <header className="flex justify-between items-center px-2 py-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium tracking-tight text-zinc-200">ANG: Phase 1 Knowledge Graph</h1>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-widest">
              Phase 1 Active
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDefenseModeActive(true)}
              className="flex items-center gap-2 bg-red-950/30 hover:bg-red-900/40 text-red-400 px-3 py-1.5 rounded-lg border border-red-900/50 transition-colors text-xs font-mono uppercase tracking-widest"
            >
              <Presentation size={14} />
              Defense Mode
            </button>
            <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <Filter size={14} className="text-zinc-400 ml-2" />
              <select 
                value={graphView}
                onChange={(e) => setGraphView(e.target.value as GraphViewType)}
                className="bg-transparent text-xs font-mono text-zinc-300 outline-none pr-2"
              >
                <option value="force-directed">Force-Directed Concept</option>
                <option value="project-scoped">Project-Scoped</option>
                <option value="thinker">Author/Thinker</option>
                <option value="orphan">Unread/Orphan</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <Brain size={14} className="text-zinc-400 ml-2" />
              <select 
                value={thinkingMode}
                onChange={(e) => setThinkingMode(e.target.value as any)}
                className="bg-transparent text-xs font-mono text-zinc-300 outline-none pr-2"
              >
                <option value="Auto">Auto Gate</option>
                <option value="Deep">Deep Path</option>
                <option value="Fast">Fast Path</option>
              </select>
            </div>
          </div>
        </header>

        <main className="flex-1 flex gap-4 min-h-0">
          {/* Graph Section */}
          <div className="flex-1 min-w-0 shadow-2xl flex flex-col gap-4">
            <div className="flex-1 rounded-lg overflow-hidden border border-zinc-800">
              {mainView === 'graph' ? (
                <GraphView 
                  nodes={nodes} 
                  edges={edges} 
                  viewType={graphView}
                  selectedProjectId={selectedProjectId}
                  onNodeClick={handleNodeClick} 
                  onEdgeClick={handleEdgeClick}
                />
              ) : (
                <ArgumentMap nodes={nodes} edges={edges} />
              )}
            </div>
            
            {/* Chat Interface */}
            <div className="h-64 rounded-lg border border-zinc-800 bg-[#0a0a0a] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 text-sm font-mono ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-zinc-800 bg-[#050505] flex gap-2">
                <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded bg-zinc-900 border border-zinc-800">
                  <Mic size={18} />
                </button>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Query the ANG..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 text-sm font-mono text-zinc-200 outline-none focus:border-zinc-600 transition-colors"
                />
                <button onClick={handleSendMessage} className="p-2 text-zinc-900 bg-zinc-200 hover:bg-white transition-colors rounded">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Document Section */}
          <div className="w-[450px] flex-shrink-0 rounded-lg overflow-hidden border border-zinc-800 shadow-2xl flex flex-col">
            <NoteEditor document={activeDocument} onSave={handleSaveDocument} />
          </div>
        </main>
      </div>
    </div>
  );
}
