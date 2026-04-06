# Nihiltheism Knowledge Graph (ANG)

This repository contains the Adaptive Nexus Graph (ANG), a production-ready, graph-native chatbot system designed to explore the philosophical framework of **Nihiltheism**.

## What is the Nihiltheism Knowledge Graph?

Nihiltheism is a novel philosophical framework bridging classical theism and atheism, emphasizing the lived experience of Nihilism's meaninglessness (the "Void-as-Presence"). This application serves as a research memory, conceptual map, and discovery engine for these ideas.

## Features

### Graph-Native Chat (Professor Nihil)
The chatbot is not a generic assistant; it is the interpretive voice of the graph itself. It reasons through:
- Selected nodes and edges
- Local graph neighborhoods
- Ingested documents and notes
- Argument map structures
- Aporia markers

### Defense Mode
An adversarial, critical mode where the system aggressively tests claims, surfaces weak evidence, and challenges sentimental interpretations.

### Ingestion & Aporia Detection
Upload Markdown or text files to ingest them into the graph. The system can automatically extract "aporia markers" (points of irresolvable contradiction or profound doubt) using Gemini.

### Node Synthesis
The graph supports ontological metrics (`voidWeight`, `resonanceWeight`, `structuralTension`, `epistemicVolatility`, `saturationIndex`) that shape the UI and chatbot behavior.

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Offline Mode
If the Gemini API key is not provided or the service is unavailable, the application gracefully degrades. The graph, node inspection, ingestion, and search will still function. The chatbot will return deterministic graph context instead of deep philosophical synthesis.

## Repository Structure
- `/src/components`: UI components (GraphView, NoteEditor, ArgumentMap, DefenseMode).
- `/src/data`: Raw graph data and mock data.
- `/src/lib/ingestion`: Markdown parsing and ingestion logic.
- `/src/services`: Gemini API integration (`chatService.ts`, `geminiService.ts`).
- `/src/prompts`: System prompts for the chatbot.
- `/src/types.ts`: Core domain ontology and type definitions.
