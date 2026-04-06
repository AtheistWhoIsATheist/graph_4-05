export type NodeType = 
  | 'Source' | 'Thinker' | 'Concept' | 'Note' | 'Quote' | 'Project' | 'Folder'
  | 'Claim' | 'Objection' | 'Rebuttal';

export type EdgeType = 
  | 'influences' | 'contrasts_with' | 'extends' | 'critiques' | 'depends_on'
  | 'presupposes' | 'implies' | 'contradicts' | 'resonates_with' | 'defines'
  | 'appears_in' | 'quoted_in' | 'supports' | 'belongs_to_project' | 'tagged_as'
  | 'derived_from' | 'related_to' | 'historically_precedes' | 'phenomenologically_correlates_with';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x?: number;
  y?: number;
  confidence?: number; // 0-1
  provenance?: string[];
  status?: 'candidate' | 'confirmed';
  projectId?: string;
  tags?: string[];
  isOrphan?: boolean;
  
  // Ontological Metrics (Phase 1 Densification)
  voidWeight?: number; // 0.0 - 1.0
  resonanceWeight?: number; // 0.0 - 1.0
  structuralTension?: number; // 0.0 - 1.0
  epistemicVolatility?: number; // 0.0 - 1.0
  saturationIndex?: number; // 0.0 - 1.0

  // Argument Mapping
  premises?: string[];
  conclusion?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  directionality?: 'directed' | 'undirected' | 'bidirectional';
  weight?: number;
  confidence?: number;
  explanation?: string;
  provenance?: string[];
  user_confirmed?: boolean;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedNodes: string[];
  aporiaMarkers?: string[];
}
