import { describe, it, expect } from 'vitest';
import { parseMarkdown } from './markdownAdapter';

describe('markdownAdapter', () => {
  it('should parse basic markdown', () => {
    const markdown = `
# Title
This is a test.
    `;
    const result = parseMarkdown('doc-1', markdown);
    expect(result.metadata.title).toBe('Title');
    expect(result.blocks.length).toBeGreaterThan(0);
  });

  it('should extract frontmatter', () => {
    const markdown = `---
title: Frontmatter Title
tags: [test, nihilism]
---
# Content
`;
    const result = parseMarkdown('doc-2', markdown);
    expect(result.metadata.title).toBe('Frontmatter Title');
    expect(result.metadata.tags).toEqual(['test', 'nihilism']);
  });
});
