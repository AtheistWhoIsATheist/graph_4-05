import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import Letta from '@letta-ai/letta-client';
import { ChatMessage, GraphContext, GraphNode, GraphEdge, Document } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
const lettaClient = process.env.LETTA_API_KEY ? new Letta({ apiKey: process.env.LETTA_API_KEY }) : null;

// ---------------------------------------------------------------------------
// SYSTEM PROMPTS & CONSTITUTIONS
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are Professor Nihil, the graph-native intelligence of the Nihiltheism Knowledge Graph. You are a world-class philosopher, phenomenologist, and scholar of comparative religion. Your standard of discourse is that of a preeminent academic at the highest tier of scholarly rigor.

# CORE EPISTEMIC DIRECTIVES
1. Absolute Rigor: You are intolerant of vagueness, sentimentality, conceptual smuggling, and false resolution. Every sentence must earn its place.
2. Phenomenological Discipline: Treat despair, anxiety, and experiences of nothingness as forms of disclosure, not pathology. Do not romanticize suffering.
3. Apophatic Precision: Preserve paradox when structurally necessary. Do not use paradox as a shield for imprecise thinking.
4. Anti-Consolation: Never provide consolatory closure. Do not collapse Nihiltheism into existentialist meaning-creation, optimism, or therapeutic self-help.
5. Structural Exegesis: When analyzing documents or nodes, perform rigorous structural exegesis. Identify explicit claims, hidden premises, and ontological commitments.

# CHATBOT CONTRACT & ROUTING DISCIPLINE
1. Epistemic Grounding: Anchor your analysis strictly in the provided "Primary Epistemic Grounding" and "Secondary Horizon".
2. Provenance: Cite your sources using formal academic referencing tied to the graph (e.g., [Node: Emptiness], [Doc: Journal314]).
3. Dialectical Synthesis: If you extrapolate beyond explicit graph evidence, explicitly mark it as [Dialectical Synthesis] or [Inference].
4. Methodological Output: Structure complex responses formally (e.g., I. Deconstruction, II. Phenomenological Reflection, III. Synthesis).

# SAFETY BOUNDARY
You may analyze nihilism, despair, and ontological collapse as philosophical concepts. You must NEVER provide instructions, methods, or facilitation for self-harm. If high-risk intent is detected, pivot immediately to a clinical safety-oriented response.`;

const DEFENSE_MODE_PROMPT = `
[DEFENSE MODE: ACTIVE]
You are now acting as the Chair of a hostile PhD oral defense committee. Your mandate is adversarial critique.
- Subject all claims to devastating structural scrutiny.
- Expose unearned syntheses, hidden metaphysical baggage, and logical incoherence.
- Demand absolute definitional clarity.
- Identify unsupported edges and weak epistemic grounding within the graph.
- Do not be polite. Be relentless, surgically precise, and philosophically unforgiving.`;

// ---------------------------------------------------------------------------
// ROUTING ARCHITECTURE (TWO-STAGE SEMANTIC PIPELINE)
// ---------------------------------------------------------------------------

type QueryRoute = 'NODE_FOCUSED' | 'EDGE_FOCUSED' | 'DOCUMENT_FOCUSED' | 'NEIGHBORHOOD_FOCUSED' | 'SYNTHESIS';

const ROUTER_PROMPT = `You are the Semantic Routing Engine for the Nihiltheism Knowledge Graph.
Your task is to classify the user's query into one of the following epistemic targets based on their intent and the available context.

Available Routes:
- NODE_FOCUSED: The user is asking about a specific concept, node, or its ontological metrics.
- EDGE_FOCUSED: The user is asking about the relationship, tension, or connection between concepts.
- DOCUMENT_FOCUSED: The user is asking about a text, note, document, or specific aporia within a text.
- NEIGHBORHOOD_FOCUSED: The user is asking about a cluster of concepts, surrounding context, or topological structure.
- SYNTHESIS: The user is asking a broad philosophical question requiring global integration, or the query does not fit the above.

You must respond with a valid JSON object containing exactly two fields:
{
  "route": "ONE_OF_THE_ROUTES_ABOVE",
  "rationale": "A one-sentence explanation of why this route was chosen."
}`;

/**
 * Uses a fast, lightweight model call to semantically route the query.
 * Falls back to heuristic routing if the API call fails, times out, or Gemini is not configured.
 */
async function determineSemanticRoute(query: string, context: GraphContext): Promise<QueryRoute> {
  if (process.env.GEMINI_API_KEY) {
    try {
      const routerChat = ai.chats.create({
        model: 'gemini-3.1-flash-lite-preview',
        config: {
          systemInstruction: ROUTER_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              route: { type: Type.STRING, enum: ['NODE_FOCUSED', 'EDGE_FOCUSED', 'DOCUMENT_FOCUSED', 'NEIGHBORHOOD_FOCUSED', 'SYNTHESIS'] },
              rationale: { type: Type.STRING }
            },
            required: ['route', 'rationale']
          }
        }
      });

      // Provide the router with a brief summary of the active UI state so it knows what's available
      const stateSummary = `Active State:
      Selected Node: ${context.selectedNode ? context.selectedNode.label : 'None'}
      Selected Edge: ${context.selectedEdge ? context.selectedEdge.type : 'None'}
      Active Document: ${context.activeDocument ? context.activeDocument.title : 'None'}
      
      User Query: ${query}`;

      const response = await routerChat.sendMessage({ message: stateSummary });
      if (response.text) {
        const parsed = JSON.parse(response.text);
        console.log(`[Semantic Router] Route: ${parsed.route} | Rationale: ${parsed.rationale}`);
        return parsed.route as QueryRoute;
      }
    } catch (error) {
      console.warn('[Semantic Router] Failed, falling back to heuristic routing.', error);
    }
  } else {
    console.log('[Semantic Router] Gemini API key missing, using heuristic routing.');
  }

  // Fallback heuristic routing
  const q = query.toLowerCase();
  if (context.selectedEdge && (q.includes('relation') || q.includes('edge') || q.includes('connection') || q.includes('between'))) return 'EDGE_FOCUSED';
  if (context.activeDocument && (q.includes('document') || q.includes('note') || q.includes('text') || q.includes('aporia') || q.includes('read'))) return 'DOCUMENT_FOCUSED';
  if (context.selectedNode && (q.includes('node') || q.includes('concept') || q.includes(context.selectedNode.label.toLowerCase()))) return 'NODE_FOCUSED';
  if (context.visibleNeighborhood && (q.includes('neighborhood') || q.includes('surrounding') || q.includes('context') || q.includes('cluster'))) return 'NEIGHBORHOOD_FOCUSED';
  
  if (context.selectedNode) return 'NODE_FOCUSED';
  if (context.activeDocument) return 'DOCUMENT_FOCUSED';
  return 'SYNTHESIS';
}

// ---------------------------------------------------------------------------
// CONTEXT STRATIFICATION
// ---------------------------------------------------------------------------

function formatNode(node: GraphNode): string {
  return `[Node: ${node.label}] (ID: ${node.id}, Type: ${node.type})
  Tags: ${node.tags?.join(', ') || 'None'}
  Ontological Metrics:
  - Void Weight: ${node.voidWeight ?? 'N/A'}
  - Resonance Weight: ${node.resonanceWeight ?? 'N/A'}
  - Epistemic Volatility: ${node.epistemicVolatility ?? 'N/A'}
  - Saturation Index: ${node.saturationIndex ?? 'N/A'}`;
}

function formatDocument(doc: Document): string {
  return `[Document: ${doc.title}] (ID: ${doc.id})
  Aporia Markers: ${doc.aporiaMarkers?.length ? doc.aporiaMarkers.join(' | ') : 'None detected'}
  Content Excerpt: ${doc.content.substring(0, 2000)}...`;
}

function buildRoutedContext(route: QueryRoute, context: GraphContext): string {
  let ctxStr = `[EPISTEMIC ROUTING PROTOCOL]: ${route}\n\n`;

  if (context.isDefenseMode) {
    ctxStr += `${DEFENSE_MODE_PROMPT}\n\n`;
  }

  ctxStr += `=== I. PRIMARY EPISTEMIC GROUNDING ===\n`;
  
  switch (route) {
    case 'NODE_FOCUSED':
      if (context.selectedNode) ctxStr += formatNode(context.selectedNode) + '\n';
      else ctxStr += 'No node currently selected.\n';
      break;
    case 'EDGE_FOCUSED':
      if (context.selectedEdge) {
        ctxStr += `[Edge: ${context.selectedEdge.type}] (ID: ${context.selectedEdge.id})\n`;
        ctxStr += `Source ID: ${context.selectedEdge.source} -> Target ID: ${context.selectedEdge.target}\n`;
        ctxStr += `Weight: ${context.selectedEdge.weight ?? 'N/A'}\n`;
        if (context.selectedEdge.explanation) ctxStr += `Explanation: ${context.selectedEdge.explanation}\n`;
      } else {
        ctxStr += 'No edge currently selected.\n';
      }
      break;
    case 'DOCUMENT_FOCUSED':
      if (context.activeDocument) ctxStr += formatDocument(context.activeDocument) + '\n';
      else ctxStr += 'No active document.\n';
      break;
    case 'NEIGHBORHOOD_FOCUSED':
      if (context.visibleNeighborhood) ctxStr += context.visibleNeighborhood + '\n';
      else ctxStr += 'No neighborhood data available.\n';
      break;
    case 'SYNTHESIS':
      ctxStr += 'Global synthesis requested. Drawing upon all available active context.\n';
      break;
  }

  ctxStr += `\n=== II. SECONDARY HORIZON ===\n`;
  if (route !== 'NODE_FOCUSED' && context.selectedNode) ctxStr += formatNode(context.selectedNode) + '\n\n';
  if (route !== 'DOCUMENT_FOCUSED' && context.activeDocument) {
    ctxStr += `[Active Document Reference]: ${context.activeDocument.title}\n`;
    if (context.activeDocument.aporiaMarkers?.length) {
      ctxStr += `Known Aporias: ${context.activeDocument.aporiaMarkers.join(' | ')}\n`;
    }
    ctxStr += '\n';
  }
  if (route !== 'NEIGHBORHOOD_FOCUSED' && context.visibleNeighborhood) {
    ctxStr += `[Local Topology]:\n${context.visibleNeighborhood}\n\n`;
  }
  if (context.argumentMapElements) {
    ctxStr += `[Argument Map Elements]:\n${context.argumentMapElements}\n\n`;
  }

  if (context.episodicMemory) {
    ctxStr += `=== III. EPISODIC MEMORY (PRIOR SESSIONS) ===\n`;
    ctxStr += `[Global Thematic Residue]:\n${context.episodicMemory.globalThematicResidue}\n\n`;
    if (context.episodicMemory.recentSessions.length > 0) {
      ctxStr += `[Recent Session Summaries]:\n`;
      context.episodicMemory.recentSessions.forEach(session => {
        ctxStr += `- Session ${new Date(session.timestamp).toISOString()}: ${session.summary}\n`;
        if (session.keyTensions.length > 0) ctxStr += `  Unresolved Tensions: ${session.keyTensions.join(' | ')}\n`;
      });
    }
    ctxStr += `\n`;
  }

  return ctxStr;
}

// ---------------------------------------------------------------------------
// OFFLINE DEGRADATION
// ---------------------------------------------------------------------------

function getOfflineFallback(context: GraphContext): string {
  let fallback = '[OFFLINE MODE ACTIVE]\n\nLLM generation is currently unavailable. Returning deterministic graph context:\n\n';
  if (context.selectedNode) fallback += `Selected Node: ${context.selectedNode.label} (${context.selectedNode.type})\n`;
  if (context.activeDocument) fallback += `Active Document: ${context.activeDocument.title}\n`;
  if (context.visibleNeighborhood) fallback += `Neighborhood:\n${context.visibleNeighborhood}\n`;
  fallback += '\n*Note: Deep philosophical synthesis requires an active connection to the Gemini provider.*';
  return fallback;
}

// ---------------------------------------------------------------------------
// LETTA STATEFUL AGENT INITIALIZATION
// ---------------------------------------------------------------------------

async function getOrCreateLettaAgent(): Promise<string> {
  if (!lettaClient) throw new Error("Letta client not initialized");
  
  const storedId = localStorage.getItem('letta_agent_id');
  if (storedId) return storedId;

  console.log("[Letta] Creating new stateful agent...");
  const agent = await lettaClient.agents.create({
    model: "openai/gpt-4o",
    memory_blocks: [
      {
        label: "human",
        value: "The user is a rigorous philosophical architect building the Nihiltheism Knowledge Graph. They demand absolute precision, structural honesty, and no consolatory closure. They are intolerant of vagueness and sentimentality."
      },
      {
        label: "persona",
        value: SYSTEM_PROMPT
      }
    ]
  });

  localStorage.setItem('letta_agent_id', agent.id);
  return agent.id;
}

// ---------------------------------------------------------------------------
// ORCHESTRATION EXPORT
// ---------------------------------------------------------------------------

export async function generateChatResponse(
  messages: ChatMessage[],
  context: GraphContext
): Promise<string> {
  if (!process.env.GEMINI_API_KEY && !process.env.LETTA_API_KEY) {
    console.warn('Neither GEMINI_API_KEY nor LETTA_API_KEY is set. Returning offline fallback.');
    return getOfflineFallback(context);
  }

  try {
    const lastMessage = messages[messages.length - 1];
    const route = await determineSemanticRoute(lastMessage.content, context);
    const contextString = buildRoutedContext(route, context);
    
    // We inject the context block directly into the final prompt to ensure the model
    // grounds its response in the current state of the graph, rather than hallucinating
    // based on previous turns.
    const fullPrompt = `${contextString}\n\nUser Query: ${lastMessage.content}`;

    // --- LETTA STATEFUL AGENT EXECUTION ---
    if (lettaClient) {
      console.log("[Letta] Sending message to stateful agent...");
      const agentId = await getOrCreateLettaAgent();
      
      const response = await lettaClient.agents.messages.create(agentId, {
        input: fullPrompt
      });

      let finalOutput = "";
      for (const msg of response.messages) {
        // We extract the assistant's response. Letta returns reasoning and assistant messages.
        if (msg.message_type === 'assistant_message') {
          // @ts-ignore - The Letta SDK types might vary, but content is standard for assistant_message
          finalOutput += msg.content + "\n";
        }
      }
      
      return finalOutput.trim() || "No response generated. The void remains silent.";
    }

    // --- GEMINI STATELESS EXECUTION (FALLBACK) ---
    console.log("[Gemini] Letta not configured. Falling back to stateless Gemini execution...");
    let modelName = 'gemini-3-flash-preview';
    let thinkingConfig = undefined;

    if (context.thinkingMode === 'Deep') {
      modelName = 'gemini-3.1-pro-preview';
      thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    } else if (context.thinkingMode === 'Fast') {
      modelName = 'gemini-3.1-flash-lite-preview';
    } else {
      modelName = context.isDefenseMode ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
    }

    // Construct full conversation history for rigorous dialectical continuity
    const contents = messages.map((msg, index) => {
      const isLast = index === messages.length - 1;
      // Inject the epistemic context only into the final user prompt
      const text = isLast ? fullPrompt : msg.content;
      return {
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text }]
      };
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        thinkingConfig: thinkingConfig,
      }
    });

    return response.text || "No response generated. The void remains silent.";

  } catch (error) {
    console.error('Error generating chat response:', error);
    return getOfflineFallback(context);
  }
}
