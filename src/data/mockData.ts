import { GraphNode, GraphEdge, Document } from '../types';

export const initialNodes: GraphNode[] = [
  // Layer 0 - Core Concepts
  { id: 'absolute-nothingness', label: 'Absolute Nothingness', type: 'Concept', x: 400, y: 300, status: 'confirmed', projectId: 'p1', tags: ['ontology', 'apophatic', 'void'], voidWeight: 1.0, resonanceWeight: 0.1, structuralTension: 0.9, epistemicVolatility: 0.875, saturationIndex: 0.96 },
  { id: 'paradoxical-transcendence', label: 'Paradoxical Transcendence', type: 'Concept', x: 550, y: 250, status: 'confirmed', projectId: 'p1', tags: ['mysticism'], voidWeight: 0.6, resonanceWeight: 1.0, saturationIndex: 0.92 },
  { id: 'void-resonance-dialectic', label: 'Void-Resonance Dialectic', type: 'Concept', x: 475, y: 400, status: 'confirmed', projectId: 'p1', tags: ['methodology'], voidWeight: 0.8, resonanceWeight: 0.8, saturationIndex: 0.95 },
  { id: 'nihiltheistic-synthesis', label: 'Nihiltheistic Synthesis', type: 'Concept', x: 400, y: 500, status: 'confirmed', projectId: 'p1', tags: ['synthesis'], voidWeight: 0.5, resonanceWeight: 0.9, saturationIndex: 0.96 },
  { id: 'liminal-potentiality', label: 'Liminal Potentiality', type: 'Concept', x: 250, y: 250, status: 'confirmed', projectId: 'p1', tags: ['phenomenology'], voidWeight: 0.85, resonanceWeight: 1.0, saturationIndex: 0.90 },
  { id: 'horror-vacui', label: 'Horror Vacui', type: 'Concept', x: 200, y: 400, status: 'confirmed', projectId: 'p1', tags: ['phenomenology', 'dread'], voidWeight: 0.95, resonanceWeight: 0.2, epistemicVolatility: 0.95, saturationIndex: 0.88 },

  // Layer 1 - Historical Figures
  { id: 'heidegger', label: 'Martin Heidegger', type: 'Thinker', x: 100, y: 200, status: 'confirmed', projectId: 'p1', tags: ['existentialism', 'phenomenology'] },
  { id: 'nietzsche', label: 'Friedrich Nietzsche', type: 'Thinker', x: 100, y: 500, status: 'confirmed', projectId: 'p1', tags: ['nihilism'] },
  { id: 'meister-eckhart', label: 'Meister Eckhart', type: 'Thinker', x: 700, y: 200, status: 'confirmed', projectId: 'p1', tags: ['christian-mysticism'] },
  { id: 'nagarjuna', label: 'Nāgārjuna', type: 'Thinker', x: 700, y: 400, status: 'confirmed', projectId: 'p1', tags: ['madhyamaka', 'buddhism'] },

  // Layer 2 - Arguments (Claims)
  { 
    id: 'void-as-ground-argument', 
    label: 'Void-as-Ground Argument', 
    type: 'Claim', 
    x: 550, y: 150, 
    status: 'candidate', 
    projectId: 'p1', 
    tags: ['ontology', 'argument'],
    premises: [
      'P1: All conditioning structures presuppose an unconditioned ground',
      'P2: The unconditioned ground cannot itself be a determinate being',
      'P3: What is neither determinate nor being is, by classical definition, Nothing',
      'P4: This Nothing is nonetheless ontologically active (it grounds everything)'
    ],
    conclusion: 'The Ground of Being is identical to Absolute Nothingness; classical theism\'s "God" and nihilism\'s "void" are the same referent described from opposed epistemic positions.',
    saturationIndex: 0.85
  },
  { 
    id: 'experiential-meaninglessness-thesis', 
    label: 'Experiential Meaninglessness', 
    type: 'Claim', 
    x: 250, y: 550, 
    status: 'candidate', 
    projectId: 'p1', 
    tags: ['phenomenology'],
    premises: [
      'P1: Consciousness, when stripped of semiotic scaffolding, encounters radical blankness',
      'P2: This blankness is not mere cognitive deprivation but a positive phenomenal state',
      'P3: The positive phenomenal state of blankness has structural properties (timelessness, boundlessness)'
    ],
    conclusion: 'Experiential Meaninglessness is a distinct ontological encounter, not psychological pathology',
    saturationIndex: 0.92
  },

  // Layer 3 - Critiques & Rebuttals
  { 
    id: 'logical-inconsistency-objection', 
    label: 'Logical Inconsistency', 
    type: 'Objection', 
    x: 550, y: 600, 
    status: 'candidate', 
    projectId: 'p1', 
    tags: ['critique', 'logic'],
    conclusion: 'Nihiltheism attempts to simultaneously assert and deny the proposition that ultimate reality has intrinsic character. The framework is formally contradictory.'
  },
  { 
    id: 'therapeutic-reductionism-critique', 
    label: 'Therapeutic Reductionism', 
    type: 'Objection', 
    x: 100, y: 350, 
    status: 'candidate', 
    projectId: 'p1', 
    tags: ['critique', 'empirical'],
    conclusion: 'The encounter with the void is entirely explainable as DMT-mediated default-mode-network suppression. The phenomenology adds no ontological information.'
  },
  { 
    id: 'horror-vacui-pathology-critique', 
    label: 'Horror Vacui as Pathology', 
    type: 'Objection', 
    x: 50, y: 450, 
    status: 'candidate', 
    projectId: 'p1', 
    tags: ['critique', 'psychology'],
    conclusion: 'Horror Vacui is indistinguishable from clinical depression or anxiety disorders, and should be treated medically rather than philosophically.'
  },
  { 
    id: 'horror-vacui-ontological-rebuttal', 
    label: 'Ontological Disclosure Rebuttal', 
    type: 'Rebuttal', 
    x: 200, y: 480, 
    status: 'candidate', 
    projectId: 'p1', 
    tags: ['rebuttal', 'phenomenology'],
    conclusion: 'Anxiety (Angst) is not a psychological malfunction, but the fundamental mood that discloses the groundless nature of Being.'
  },
  
  // Orphan Test Node
  { id: 'orphan-node', label: 'Unintegrated Insight', type: 'Note', x: 700, y: 600, status: 'candidate', projectId: 'p1', isOrphan: true }
];

export const initialEdges: GraphEdge[] = [
  // Core Relations
  { id: 'e1', source: 'absolute-nothingness', target: 'paradoxical-transcendence', type: 'implies', directionality: 'directed', weight: 0.9, confidence: 0.95, user_confirmed: true },
  { id: 'e2', source: 'absolute-nothingness', target: 'void-resonance-dialectic', type: 'depends_on', directionality: 'directed', weight: 0.8, user_confirmed: true },
  { id: 'e3', source: 'void-resonance-dialectic', target: 'nihiltheistic-synthesis', type: 'supports', directionality: 'directed', weight: 0.85, user_confirmed: true },
  
  // Historical Grounds
  { id: 'e4', source: 'heidegger', target: 'horror-vacui', type: 'influences', directionality: 'directed', weight: 0.9, explanation: 'Das Nichts nichtet -> experiential void is ontologically disclosive', user_confirmed: true },
  { id: 'e5', source: 'nietzsche', target: 'horror-vacui', type: 'influences', directionality: 'directed', weight: 0.85, user_confirmed: true },
  { id: 'e6', source: 'meister-eckhart', target: 'absolute-nothingness', type: 'historically_precedes', directionality: 'directed', weight: 0.7, user_confirmed: true },
  { id: 'e7', source: 'nagarjuna', target: 'absolute-nothingness', type: 'resonates_with', directionality: 'undirected', weight: 0.87, explanation: 'Śūnyatā as universal emptiness = Nihil as generative void', user_confirmed: true },
  { id: 'e8', source: 'heidegger', target: 'liminal-potentiality', type: 'resonates_with', directionality: 'undirected', weight: 0.75, user_confirmed: true },

  // Arguments
  { id: 'e9', source: 'void-as-ground-argument', target: 'absolute-nothingness', type: 'defines', directionality: 'directed', weight: 0.9, user_confirmed: true },
  { id: 'e10', source: 'horror-vacui', target: 'experiential-meaninglessness-thesis', type: 'implies', directionality: 'directed', weight: 1.0, user_confirmed: true },

  // Critiques & Rebuttals
  { id: 'e11', source: 'logical-inconsistency-objection', target: 'nihiltheistic-synthesis', type: 'critiques', directionality: 'directed', weight: 0.8, user_confirmed: false },
  { id: 'e12', source: 'horror-vacui-pathology-critique', target: 'horror-vacui', type: 'critiques', directionality: 'directed', weight: 0.8, user_confirmed: false },
  { id: 'e13', source: 'horror-vacui-ontological-rebuttal', target: 'horror-vacui-pathology-critique', type: 'contradicts', directionality: 'directed', weight: 0.9, user_confirmed: false },
  { id: 'e14', source: 'horror-vacui-ontological-rebuttal', target: 'horror-vacui', type: 'supports', directionality: 'directed', weight: 0.9, user_confirmed: false },
];

export const initialDocuments: Document[] = [
  {
    id: 'd1',
    title: 'Journal314: The Dialectical Cut',
    content: `# The Dialectical Cut

Extracting shared structures beneath doctrinal differences. When we pair Eckhart and Ligotti, what survives the subtraction?

## Kenotic Constraints Applied
Applying K-2 (Zero-Predicate Constraint): The apophatic fullness of Eckhart and the cosmic void of Ligotti both resist positive predication. 

> "To truncate is to destroy." - The Architect

### Phenomenological Markers
- **RN-1**: The initial encounter with the void.
- **RN-4**: The stabilization of the consecrated void.

We must ensure that no hope is smuggled as evidence (Axiom A-4).`,
    tags: ['RN-1', 'K-2', 'A-4'],
    linkedNodes: ['n1', 'n2', 'n5']
  }
];
