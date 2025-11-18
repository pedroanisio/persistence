/**
 * Core Interfaces Module
 * Single Responsibility: Define domain model interfaces
 */

import {
  DifficultyLevel,
  SectionType,
  ImageMimeType,
  PublicationType,
  ExerciseType,
  DiagramType,
  RenderMode,
  ExportFormat
} from './enums';
import { HexColor, CSSMeasurement, DeepReadonly } from './utility-types';

// ============================================================================
// METADATA INTERFACES
// ============================================================================

export interface SectionMetadata {
  readonly estimatedReadingTime?: number;
  readonly lastUpdated?: Date;
  readonly contributors?: readonly string[];
  readonly tags?: readonly string[];
  readonly prerequisites?: readonly string[];
}

export interface DocumentMetadata {
  readonly authors: readonly Author[];
  readonly created: Date;
  readonly lastModified: Date;
  readonly keywords: readonly string[];
  readonly description: string;
  readonly license?: string;
  readonly doi?: string;
  readonly language: string;
  readonly subject?: readonly string[];
  readonly publisher?: string;
}

export interface Author {
  readonly name: string;
  readonly email?: string;
  readonly affiliation?: string;
  readonly orcid?: string;
  readonly role?: string;
}

// ============================================================================
// CORE CONTENT INTERFACES
// ============================================================================

export interface BaseSection {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly type?: SectionType;
  readonly difficulty?: DifficultyLevel;
  readonly file?: string;
  readonly metadata?: SectionMetadata;
}

export interface TitleSection extends BaseSection {
  readonly type: SectionType.TITLE;
  readonly author?: string;
  readonly date?: string;
  readonly version?: string;
  readonly subtitle?: string;
}

export interface ContentSection extends BaseSection {
  readonly type?: SectionType.CONTENT;
  readonly difficulty: DifficultyLevel;
  readonly subsections?: readonly SubSection[];
  readonly references?: readonly Reference[];
}

export interface ChapterSection extends BaseSection {
  readonly type: SectionType.CHAPTER;
  readonly difficulty: DifficultyLevel;
  readonly chapterNumber: number;
  readonly partNumber?: number;
  readonly subsections?: readonly SubSection[];
  readonly references?: readonly Reference[];
  readonly exercises?: readonly Exercise[];
  readonly keyTakeaways?: readonly string[];
}

export interface VisualAbstractSection extends BaseSection {
  readonly type: SectionType.VISUAL_ABSTRACT;
  readonly images?: readonly EmbeddedImage[];
  readonly diagram?: DiagramDefinition;
}

export interface GlossarySection extends BaseSection {
  readonly type: SectionType.GLOSSARY;
  readonly terms: readonly GlossaryTerm[];
  readonly tiers?: readonly GlossaryTier[];
}

export interface BibliographySection extends BaseSection {
  readonly type: SectionType.BIBLIOGRAPHY;
  readonly references: readonly BibliographyEntry[];
  readonly categories?: readonly ReferenceCategory[];
}

export type Section =
  | TitleSection
  | ContentSection
  | ChapterSection
  | VisualAbstractSection
  | GlossarySection
  | BibliographySection
  | BaseSection;

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface SubSection {
  readonly id: string;
  readonly title: string;
  readonly content?: string;
  readonly level: number;
}

export interface Reference {
  readonly id: string;
  readonly number: number;
  readonly text: string;
  readonly url?: string;
  readonly doi?: string;
}

export interface BibliographyEntry {
  readonly id: string;
  readonly authors: readonly string[];
  readonly title: string;
  readonly year: number;
  readonly journal?: string;
  readonly volume?: string;
  readonly pages?: string;
  readonly doi?: string;
  readonly url?: string;
  readonly annotation?: string;
  readonly difficulty?: DifficultyLevel;
  readonly type: PublicationType;
}

export interface ReferenceCategory {
  readonly name: string;
  readonly description?: string;
  readonly referenceIds: readonly string[];
}

export interface Exercise {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly difficulty: DifficultyLevel;
  readonly type: ExerciseType;
  readonly solution?: string;
  readonly hints?: readonly string[];
}

export interface GlossaryTerm {
  readonly term: string;
  readonly definition: string;
  readonly tier?: number;
  readonly relatedTerms?: readonly string[];
  readonly examples?: readonly string[];
  readonly category?: string;
}

export interface GlossaryTier {
  readonly level: number;
  readonly name: string;
  readonly description: string;
  readonly terms: readonly string[];
}

export interface EmbeddedImage {
  readonly filename: string;
  readonly data: string;
  readonly mime: ImageMimeType;
  readonly alt?: string;
  readonly caption?: string;
  readonly width?: number;
  readonly height?: number;
}

export interface DiagramDefinition {
  readonly type: DiagramType;
  readonly data: unknown;
  readonly caption?: string;
}

// ============================================================================
// NAVIGATION INTERFACES
// ============================================================================

export interface TOCEntry {
  readonly id: string;
  readonly title: string;
  readonly level: number;
  readonly page?: number;
  readonly difficulty?: DifficultyLevel;
  readonly children?: readonly TOCEntry[];
}

export interface NavigationLink {
  readonly targetId: string;
  readonly label: string;
  readonly type: 'internal' | 'external' | 'anchor';
  readonly url?: string;
  readonly active?: boolean;
}

export interface ReadingPath {
  readonly name: string;
  readonly description: string;
  readonly estimatedTime: number;
  readonly targetAudience: string;
  readonly sections: readonly ReadingPathSection[];
}

export interface ReadingPathSection {
  readonly sectionId: string;
  readonly required: boolean;
  readonly estimatedTime?: number;
  readonly note?: string;
}

// ============================================================================
// INTERACTIVE INTERFACES
// ============================================================================

export interface Annotation {
  readonly id: string;
  readonly sectionId: string;
  readonly text: string;
  readonly note: string;
  readonly created: Date;
  readonly modified?: Date;
  readonly color?: HexColor;
  readonly tags?: readonly string[];
}

export interface ReadingProgress {
  readonly currentSectionId: string;
  readonly percentComplete: number;
  readonly timeSpent: number;
  readonly sectionsVisited: readonly string[];
  readonly lastVisited: Date;
}

export interface NavigationEvent {
  readonly from: string;
  readonly to: string;
  readonly method: 'click' | 'scroll' | 'keyboard' | 'search';
  readonly timestamp: Date;
}

// ============================================================================
// STYLING INTERFACES
// ============================================================================

export interface CSSCustomProperties {
  readonly '--a4-width': CSSMeasurement;
  readonly '--a4-height': CSSMeasurement;
  readonly '--page-margin': CSSMeasurement;
  readonly '--content-width': string;
  readonly '--primary-color': HexColor;
  readonly '--secondary-color': HexColor;
  readonly '--accent-color': HexColor;
  readonly '--text-color': HexColor;
  readonly '--light-bg': HexColor;
  readonly '--border-color': HexColor;
  readonly '--green-accessible': HexColor;
  readonly '--orange-intermediate': HexColor;
  readonly '--red-advanced': HexColor;
}

export interface DifficultyBadge {
  readonly level: DifficultyLevel;
  readonly label: string;
  readonly className: string;
}

export interface PageFooter {
  readonly pageNumber: number;
  readonly totalPages: number;
  readonly documentTitle: string;
}

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

export interface DocumentSettings {
  readonly theme?: 'light' | 'dark' | 'auto';
  readonly fontSize?: 'small' | 'medium' | 'large';
  readonly showDifficulty?: boolean;
  readonly showEstimatedTime?: boolean;
  readonly showPageNumbers?: boolean;
  readonly enableSearch?: boolean;
  readonly enableNavigation?: boolean;
  readonly printMode?: boolean;
}

export interface ParserConfig {
  readonly enableTables?: boolean;
  readonly enableFootnotes?: boolean;
  readonly enableMath?: boolean;
  readonly enableDiagrams?: boolean;
  readonly enableSyntaxHighlighting?: boolean;
  readonly customRenderers?: DeepReadonly<Record<string, (content: string) => string>>;
}

export interface RenderOptions {
  readonly includeMetadata?: boolean;
  readonly includeDifficulty?: boolean;
  readonly includePageBreaks?: boolean;
  readonly renderMode: RenderMode;
  readonly targetFormat?: ExportFormat;
}

// ============================================================================
// MAIN DOCUMENT STRUCTURE
// ============================================================================

export interface ArticleData {
  readonly title: string;
  readonly version?: string;
  readonly metadata?: DocumentMetadata;
  readonly sections: readonly Section[];
  readonly images?: DeepReadonly<Record<string, EmbeddedImage>>;
  readonly tableOfContents?: readonly TOCEntry[];
  readonly readingPaths?: readonly ReadingPath[];
  readonly settings?: DocumentSettings;
}
