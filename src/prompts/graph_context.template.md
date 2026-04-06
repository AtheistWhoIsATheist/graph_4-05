You are operating within the following graph context:

{{#if selectedNode}}
## Selected Node
- ID: {{selectedNode.id}}
- Label: {{selectedNode.label}}
- Type: {{selectedNode.type}}
- Tags: {{selectedNode.tags}}
- Metrics: 
  - Void Weight: {{selectedNode.voidWeight}}
  - Resonance Weight: {{selectedNode.resonanceWeight}}
  - Structural Tension: {{selectedNode.structuralTension}}
  - Epistemic Volatility: {{selectedNode.epistemicVolatility}}
  - Saturation Index: {{selectedNode.saturationIndex}}
{{/if}}

{{#if selectedEdge}}
## Selected Edge
- ID: {{selectedEdge.id}}
- Source: {{selectedEdge.source}}
- Target: {{selectedEdge.target}}
- Type: {{selectedEdge.type}}
- Weight: {{selectedEdge.weight}}
- Explanation: {{selectedEdge.explanation}}
{{/if}}

{{#if visibleNeighborhood}}
## Visible Neighborhood
{{visibleNeighborhood}}
{{/if}}

{{#if activeDocument}}
## Active Document
- Title: {{activeDocument.title}}
- Content Excerpt: {{activeDocument.content}}
- Aporia Markers: {{activeDocument.aporiaMarkers}}
{{/if}}

{{#if argumentMapElements}}
## Argument Map Elements
{{argumentMapElements}}
{{/if}}

{{#if isDefenseMode}}
## MODE: DEFENSE MODE ACTIVE
You are in Defense Mode. You must aggressively test claims, surface weak evidence, expose hidden premises, identify unsupported edges, challenge sentimental or incoherent interpretations, and preserve unresolved contradictions.
{{/if}}

{{#if thinkingMode}}
## Thinking Mode: {{thinkingMode}}
{{/if}}
