import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Document } from '../types';
import { Save, Edit3, BookOpen, Tag, Sparkles, AlertTriangle, Plus, X } from 'lucide-react';
import { analyzeNoteWithGemini } from '../services/geminiService';

interface NoteEditorProps {
  document: Document;
  onSave: (doc: Document) => void;
}

export default function NoteEditor({ document, onSave }: NoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(document.content);
  const [title, setTitle] = useState(document.title);
  const [aporiaMarkers, setAporiaMarkers] = useState<string[]>(document.aporiaMarkers || []);
  const [newMarker, setNewMarker] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setContent(document.content);
    setTitle(document.title);
    setAporiaMarkers(document.aporiaMarkers || []);
    setIsEditing(false);
  }, [document]);

  const handleSave = () => {
    onSave({ ...document, title, content, aporiaMarkers });
    setIsEditing(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeNoteWithGemini(content);
      if (result.aporiaMarkers && result.aporiaMarkers.length > 0) {
        setAporiaMarkers(prev => {
          const uniqueMarkers = new Set([...prev, ...result.aporiaMarkers]);
          return Array.from(uniqueMarkers);
        });
      }
    } catch (error) {
      console.error("Failed to analyze note:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addMarker = () => {
    if (newMarker.trim() && !aporiaMarkers.includes(newMarker.trim())) {
      setAporiaMarkers([...aporiaMarkers, newMarker.trim()]);
      setNewMarker('');
    }
  };

  const removeMarker = (markerToRemove: string) => {
    setAporiaMarkers(aporiaMarkers.filter(m => m !== markerToRemove));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-zinc-100 font-sans">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#050505]">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-900 text-zinc-100 px-3 py-1.5 rounded border border-zinc-800 outline-none w-2/3 font-mono text-sm focus:border-zinc-600 transition-colors"
          />
        ) : (
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-zinc-500" />
            <h2 className="text-sm font-mono tracking-tight text-zinc-200">{title}</h2>
          </div>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <button onClick={handleSave} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors">
              <Save size={16} />
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors">
              <Edit3 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-[#0a0a0a] flex flex-col gap-6">
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[200px] bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-zinc-300"
              placeholder="Enter markdown content..."
            />
          ) : (
            <div className="markdown-body font-sans text-sm">
              <Markdown>{content}</Markdown>
            </div>
          )}
        </div>

        {/* Aporia Markers Section */}
        <div className="border border-red-900/30 bg-red-950/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono text-red-400 flex items-center gap-2">
              <AlertTriangle size={16} />
              Aporia Markers
            </h3>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-800 transition-colors disabled:opacity-50"
            >
              <Sparkles size={12} className={isAnalyzing ? "animate-pulse" : ""} />
              {isAnalyzing ? 'Analyzing...' : 'Extract with AI'}
            </button>
          </div>
          
          <div className="space-y-2">
            {aporiaMarkers.length === 0 && !isEditing && (
              <p className="text-xs text-zinc-500 italic">No aporia markers identified.</p>
            )}
            {aporiaMarkers.map((marker, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-zinc-300 bg-black/40 p-2 rounded border border-red-900/20">
                <span className="text-red-500 mt-0.5">•</span>
                <span className="flex-1">{marker}</span>
                {isEditing && (
                  <button onClick={() => removeMarker(marker)} className="text-zinc-500 hover:text-red-400 p-0.5">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            
            {isEditing && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-red-900/20">
                <input
                  type="text"
                  value={newMarker}
                  onChange={(e) => setNewMarker(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMarker()}
                  placeholder="Add new aporia marker..."
                  className="flex-1 bg-black/50 text-zinc-200 px-2 py-1.5 rounded border border-zinc-800 outline-none text-xs font-mono focus:border-red-900/50"
                />
                <button onClick={addMarker} className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-800">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800 bg-[#050505] flex gap-2 overflow-x-auto items-center">
        <Tag size={14} className="text-zinc-600 mr-1" />
        {document.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] rounded-full font-mono uppercase tracking-wider">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
