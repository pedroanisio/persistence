/**
 * Block Type Guards Module
 * Single Responsibility: Type guard functions for v2 content blocks
 */

import {
  ContentBlock,
  TextBlock,
  ListBlock,
  TableBlock,
  MediaBlock,
  CodeBlock,
  MathBlock,
  ContainerBlock,
  GridBlock,
  SeparatorBlock,
  ReferenceBlock,
  InteractiveBlock
} from '../types/blocks';

export function isTextBlock(block: ContentBlock): block is TextBlock {
  return block.type === 'text';
}

export function isListBlock(block: ContentBlock): block is ListBlock {
  return block.type === 'list';
}

export function isTableBlock(block: ContentBlock): block is TableBlock {
  return block.type === 'table';
}

export function isMediaBlock(block: ContentBlock): block is MediaBlock {
  return block.type === 'media';
}

export function isCodeBlock(block: ContentBlock): block is CodeBlock {
  return block.type === 'code';
}

export function isMathBlock(block: ContentBlock): block is MathBlock {
  return block.type === 'math';
}

export function isContainerBlock(block: ContentBlock): block is ContainerBlock {
  return block.type === 'container';
}

export function isGridBlock(block: ContentBlock): block is GridBlock {
  return block.type === 'grid';
}

export function isSeparatorBlock(block: ContentBlock): block is SeparatorBlock {
  return block.type === 'separator';
}

export function isReferenceBlock(block: ContentBlock): block is ReferenceBlock {
  return block.type === 'reference';
}

export function isInteractiveBlock(block: ContentBlock): block is InteractiveBlock {
  return block.type === 'interactive';
}
