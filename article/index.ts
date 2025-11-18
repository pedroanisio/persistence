/**
 * Article Type System
 *
 * Main entry point providing a clean public API
 *
 * @version 4.0.0
 * @strict
 *
 * Architecture:
 * - Modular architecture with focused, single-responsibility modules
 * - Open/Closed Principle compliance (extensible validation & queries)
 * - Factory functions for type guards
 * - Plugin architecture for DocumentModel
 */

// ============================================================================
// TYPES
// ============================================================================

// Enums
export {
  DifficultyLevel,
  SectionType,
  ImageMimeType,
  PublicationType,
  ExerciseType,
  DiagramType,
  RenderMode,
  ExportFormat
} from './types/enums';

// Utility Types
export type {
  MarkdownContent,
  HTMLContent,
  CSSClassName,
  ElementId,
  HexColor,
  CSSMeasurement,
  ISODateString,
  DeepReadonly
} from './types/utility-types';

// Content Blocks v2
export type {
  BaseBlock,
  Typography,
  Visual,
  Layout,
  BlockStyle,
  Highlight,
  Annotation,
  TextBlock,
  ListBlock,
  ListItem,
  TableBlock,
  TableHeader,
  MediaBlock,
  CodeBlock,
  MathBlock,
  ContainerBlock,
  GridBlock,
  SeparatorBlock,
  ReferenceBlock,
  InteractiveBlock,
  ContentBlock,
  StyleSet
} from './types/blocks';

// Interfaces
export type {
  // Metadata
  SectionMetadata,
  DocumentMetadata,
  Author,

  // Core Content
  BaseSection,
  TitleSection,
  ContentSection,
  ChapterSection,
  VisualAbstractSection,
  GlossarySection,
  BibliographySection,
  Section,

  // Supporting
  SubSection,
  Reference,
  BibliographyEntry,
  ReferenceCategory,
  Exercise,
  GlossaryTerm,
  GlossaryTier,
  EmbeddedImage,
  DiagramDefinition,

  // Navigation
  TOCEntry,
  NavigationLink,
  ReadingPath,
  ReadingPathSection,

  // Interactive
  Annotation,
  ReadingProgress,
  NavigationEvent,

  // Styling
  CSSCustomProperties,
  DifficultyBadge,
  PageFooter,

  // Configuration
  DocumentSettings,
  ParserConfig,
  RenderOptions,

  // Main Structure
  ArticleData
} from './types/interfaces';

// ============================================================================
// TYPE GUARDS
// ============================================================================

export {
  isDifficultyLevel,
  isSectionType,
  isChapterSection,
  isTitleSection,
  isGlossarySection,
  isBibliographySection,
  hasDifficulty,
  isValidSection,
  isValidArticleData
} from './guards/type-guards';

export {
  isTextBlock,
  isListBlock,
  isTableBlock,
  isMediaBlock,
  isCodeBlock,
  isMathBlock,
  isContainerBlock,
  isGridBlock,
  isSeparatorBlock,
  isReferenceBlock,
  isInteractiveBlock
} from './guards/block-guards';

// ============================================================================
// VALIDATION
// ============================================================================

export {
  // Validation Rules
  hasAtLeastOneSection,
  hasUniqueSectionIds,
  hasSequentialChapters,
  hasValidPrerequisites,

  // Validator Class
  ArticleValidator,
  createDefaultValidator,

  // Validation Functions
  validateArticleData,
  parseArticleData,

  // Types
  type ValidationRule
} from './validation/validators';

// ============================================================================
// UTILITIES
// ============================================================================

// Deep Freeze
export {
  deepFreeze,
  deepFreezeCopy,
  isFrozen
} from './utils/deep-freeze';

// Factory Functions
export {
  createChapterSection,
  createGlossaryTerm,
  createBibliographyEntry,
  createEmptyArticle
} from './utils/factories';

// Data Utilities
export {
  extractAllReferences,
  getSectionsByDifficulty,
  getChapters,
  getTotalReadingTime,
  generateTableOfContents,
  findSectionById
} from './utils/data-utils';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  DEFAULT_CSS_PROPERTIES,
  DIFFICULTY_BADGES,
  READING_PATHS,
  DEFAULT_PARSER_CONFIG,
  DEFAULT_RENDER_OPTIONS
} from './constants/defaults';

// ============================================================================
// MODELS
// ============================================================================

export {
  DocumentModel,
  getSectionsByTag,
  getSectionsByContributor,
  type QueryPlugin,
  type QueryPluginWithArgs
} from './models/DocumentModel';
