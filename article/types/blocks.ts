/**
 * Content Blocks Module - v2
 * Generic, composable content blocks with styling support
 */

import { HexColor, CSSMeasurement } from './utility-types';

export interface BaseBlock {
  readonly id: string;
  readonly style?: BlockStyle;
  readonly highlights?: readonly Highlight[];
}

export interface Typography {
  readonly fontFamily?: string;
  readonly fontSize?: string;
  readonly fontWeight?: number;
  readonly lineHeight?: number;
  readonly letterSpacing?: string;
  readonly textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  readonly color?: HexColor;
  readonly textAlign?: 'left' | 'center' | 'right' | 'justify';
  readonly margin?: CSSMeasurement;
  readonly padding?: CSSMeasurement;
}

export interface Visual {
  readonly background?: string;
  readonly border?: string;
  readonly borderRadius?: CSSMeasurement;
  readonly boxShadow?: string;
  readonly width?: CSSMeasurement;
  readonly maxWidth?: CSSMeasurement;
  readonly className?: string;
  readonly customCSS?: Record<string, string>;
  readonly borderTop?: string;
  readonly borderBottom?: string;
  readonly borderLeft?: string;
  readonly borderRight?: string;
}

export interface Layout {
  readonly columns?: number;
  readonly gap?: CSSMeasurement;
  readonly alignment?: 'left' | 'center' | 'right';
}

export interface BlockStyle {
  readonly typography?: Typography;
  readonly visual?: Visual;
  readonly layout?: Layout;
}

export interface Highlight {
  readonly id: string;
  readonly text: string;
  readonly color: string;
  readonly note?: string;
}

export interface Annotation {
  readonly id: string;
  readonly targetId: string;
  readonly content: string;
  readonly position: 'margin' | 'inline' | 'tooltip';
  readonly author?: string;
  readonly created?: Date;
}

export interface TextBlock extends BaseBlock {
  readonly type: 'text';
  readonly variant: 'paragraph' | 'heading' | 'quote' | 'caption';
  readonly content: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly dropCap?: boolean;
}

export interface ListItem {
  readonly content: string;
  readonly term?: string;
  readonly style?: BlockStyle;
}

export interface ListBlock extends BaseBlock {
  readonly type: 'list';
  readonly variant: 'ordered' | 'unordered' | 'definition';
  readonly items: readonly ListItem[];
  readonly startNumber?: number;
}

export interface TableHeader {
  readonly key: string;
  readonly label: string;
  readonly width?: CSSMeasurement;
  readonly align?: 'left' | 'center' | 'right';
}

export interface TableBlock extends BaseBlock {
  readonly type: 'table';
  readonly headers: readonly TableHeader[];
  readonly rows: readonly Record<string, string | number>[];
  readonly caption?: string;
  readonly striped?: boolean;
}

export interface MediaBlock extends BaseBlock {
  readonly type: 'media';
  readonly variant: 'image' | 'video' | 'diagram';
  readonly src: string;
  readonly alt?: string;
  readonly caption?: string;
  readonly width?: CSSMeasurement;
  readonly height?: CSSMeasurement;
}

export interface CodeBlock extends BaseBlock {
  readonly type: 'code';
  readonly content: string;
  readonly language?: string;
  readonly showLineNumbers?: boolean;
  readonly highlightLines?: readonly number[];
  readonly filename?: string;
}

export interface MathBlock extends BaseBlock {
  readonly type: 'math';
  readonly content: string;
  readonly displayMode?: boolean;
}

export interface ContainerBlock extends BaseBlock {
  readonly type: 'container';
  readonly variant: 'card' | 'callout' | 'accordion' | 'default';
  readonly title?: string;
  readonly icon?: string;
  readonly blocks: readonly ContentBlock[];
  readonly collapsible?: boolean;
  readonly defaultExpanded?: boolean;
}

export interface GridBlock extends BaseBlock {
  readonly type: 'grid';
  readonly columns: number;
  readonly gap?: CSSMeasurement;
  readonly blocks: readonly ContentBlock[];
}

export interface SeparatorBlock extends BaseBlock {
  readonly type: 'separator';
  readonly variant: 'line' | 'space' | 'dots';
  readonly thickness?: CSSMeasurement;
}

export interface ReferenceBlock extends BaseBlock {
  readonly type: 'reference';
  readonly variant: 'citation' | 'footnote' | 'link';
  readonly content: string;
  readonly target?: string;
  readonly number?: number;
}

export interface InteractiveBlock extends BaseBlock {
  readonly type: 'interactive';
  readonly variant: string;
  readonly data: unknown;
  readonly handler?: string;
}

export type ContentBlock =
  | TextBlock
  | ListBlock
  | TableBlock
  | MediaBlock
  | CodeBlock
  | MathBlock
  | ContainerBlock
  | GridBlock
  | SeparatorBlock
  | ReferenceBlock
  | InteractiveBlock;

export interface StyleSet {
  readonly global?: BlockStyle;
  readonly heading?: Record<1 | 2 | 3 | 4 | 5 | 6, BlockStyle>;
  readonly paragraph?: BlockStyle;
  readonly quote?: BlockStyle;
  readonly code?: BlockStyle;
  readonly list?: BlockStyle;
  readonly table?: BlockStyle;
  readonly callout?: BlockStyle;
  readonly card?: BlockStyle;
  readonly chapter?: BlockStyle;
}
