import { DocumentTree, BiblioMetadata, Section, Block, Footnote, RawReference, RawLink, BlockType } from './types';

export function parseMarkdown(sourceId: string, rawText: string): DocumentTree {
  // 1. ENCODING DETECTION
  // Note: Browser File API handles UTF-8 decoding automatically when reading as text.
  
  // 2. METADATA EXTRACTION (YAML Frontmatter)
  let textToParse = rawText;
  const metadata: BiblioMetadata = {};
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = rawText.match(frontmatterRegex);
  
  if (match) {
    textToParse = rawText.slice(match[0].length);
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) {
        const value = rest.join(':').trim();
        const cleanKey = key.trim();
        if (cleanKey === 'tags' || cleanKey === 'aliases') {
          metadata[cleanKey] = value.replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
        } else {
          metadata[cleanKey] = value.replace(/^["']|["']$/g, ''); // Remove quotes
        }
      }
    });
  }

  // 3. STRUCTURE PARSING & 4. BLOCKIFICATION
  // Split by double newlines to get basic blocks
  const rawBlocks = textToParse.split(/\n\s*\n/).filter(b => b.trim().length > 0);
  
  const sections: Section[] = [];
  const blocks: Block[] = [];
  const links: RawLink[] = [];
  const footnotes: Footnote[] = [];
  const references: RawReference[] = [];

  let currentSectionPath: Section[] = [];
  let sectionIndex = 0;
  let blockIndex = 0;
  let currentSection: Section | undefined = undefined;

  rawBlocks.forEach((rawBlock) => {
    const blockId = `${sourceId}-${sectionIndex}-${blockIndex}`;
    let type: BlockType = 'paragraph';
    
    // Detect block type
    if (rawBlock.startsWith('#')) {
      type = 'heading';
      const levelMatch = rawBlock.match(/^#+/);
      const level = levelMatch ? levelMatch[0].length : 1;
      const title = rawBlock.replace(/^#+\s*/, '').trim();
      
      const newSection: Section = {
        id: `sec-${sourceId}-${sectionIndex}`,
        level,
        title,
        children: [],
        blockIds: []
      };
      
      // Manage section hierarchy
      while (currentSectionPath.length > 0 && currentSectionPath[currentSectionPath.length - 1].level >= level) {
        currentSectionPath.pop();
      }
      
      if (currentSectionPath.length > 0) {
        currentSectionPath[currentSectionPath.length - 1].children.push(newSection);
      } else {
        sections.push(newSection);
      }
      
      currentSectionPath.push(newSection);
      currentSection = newSection;
      sectionIndex++;
      blockIndex = 0; // Reset block index for the new section
    } else if (rawBlock.startsWith('>')) {
      type = 'blockquote';
    } else if (rawBlock.match(/^[-*+]\s/) || rawBlock.match(/^\d+\.\s/)) {
      type = 'list_item';
    } else if (rawBlock.startsWith('```')) {
      type = 'code';
    } else if (rawBlock.includes('|') && rawBlock.includes('---')) {
      type = 'table';
    }

    const block: Block = {
      id: blockId,
      type,
      content: rawBlock,
      sectionId: currentSection?.id
    };
    
    if (currentSection) {
      currentSection.blockIds.push(blockId);
    }
    blocks.push(block);

    // 5. REFERENCE DETECTION (Links, Citations, Footnotes)
    
    // Wiki links [[...]]
    const wikiRegex = /\[\[(.*?)\]\]/g;
    let wikiMatch;
    while ((wikiMatch = wikiRegex.exec(rawBlock)) !== null) {
      links.push({
        sourceBlockId: blockId,
        target: wikiMatch[1],
        text: wikiMatch[1],
        type: 'wiki'
      });
    }

    // Standard links [...]({...})
    const stdRegex = /\[(.*?)\]\((.*?)\)/g;
    let stdMatch;
    while ((stdMatch = stdRegex.exec(rawBlock)) !== null) {
      links.push({
        sourceBlockId: blockId,
        target: stdMatch[2],
        text: stdMatch[1],
        type: 'standard'
      });
    }

    // Inline citations {{citekey}}
    const citeRegex = /\{\{(.*?)\}\}/g;
    let citeMatch;
    while ((citeMatch = citeRegex.exec(rawBlock)) !== null) {
      references.push({
        id: `ref-${sourceId}-${references.length}`,
        text: citeMatch[1]
      });
    }

    // Footnotes [^1]
    const fnRegex = /\[\^([^\]]+)\]/g;
    let fnMatch;
    while ((fnMatch = fnRegex.exec(rawBlock)) !== null) {
      // If it's a footnote definition block: `[^1]: content`
      if (rawBlock.trim().startsWith(`[^${fnMatch[1]}]:`)) {
        footnotes.push({
          id: `fn-${sourceId}-${fnMatch[1]}`,
          marker: fnMatch[1],
          content: rawBlock.replace(`[^${fnMatch[1]}]:`, '').trim()
        });
      }
    }

    blockIndex++;
  });

  return {
    sourceId,
    metadata,
    sections,
    blocks,
    footnotes,
    references,
    links
  };
}
