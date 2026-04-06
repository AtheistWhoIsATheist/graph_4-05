export interface BiblioMetadata {
  title?: string;
  author?: string;
  date?: string;
  tags?: string[];
  aliases?: string[];
  type?: string;
  [key: string]: any;
}

export interface Section {
  id: string;
  level: number;
  title: string;
  children: Section[];
  blockIds: string[];
}

export type BlockType = 'paragraph' | 'heading' | 'list_item' | 'blockquote' | 'code' | 'table';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  sectionId?: string;
}

export interface Footnote {
  id: string;
  marker: string;
  content: string;
}

export interface RawReference {
  id: string;
  text: string;
}

export interface RawLink {
  sourceBlockId: string;
  target: string;
  text: string;
  type: 'wiki' | 'standard';
}

export interface DocumentTree {
  sourceId: string;
  metadata: BiblioMetadata;
  sections: Section[];
  blocks: Block[];
  footnotes: Footnote[];
  references: RawReference[];
  links: RawLink[];
}
