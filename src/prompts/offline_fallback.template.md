[OFFLINE MODE ACTIVE]

LLM generation is currently unavailable.
Returning deterministic graph context:

{{#if selectedNode}}
Selected Node: {{selectedNode.label}} ({{selectedNode.type}})
Tags: {{selectedNode.tags}}
{{/if}}

{{#if activeDocument}}
Active Document: {{activeDocument.title}}
Aporia Markers: {{activeDocument.aporiaMarkers}}
{{/if}}

{{#if visibleNeighborhood}}
Neighborhood:
{{visibleNeighborhood}}
{{/if}}

*Note: Deep philosophical synthesis requires an active connection to the Gemini provider.*
