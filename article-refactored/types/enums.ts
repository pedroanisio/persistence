/**
 * Enums Module - Type-safe constants
 * Single Responsibility: Define all enumeration types
 */

/**
 * Difficulty levels for content sections
 */
export enum DifficultyLevel {
  GREEN = 'green',      // Accessible - General audience
  ORANGE = 'orange',    // Intermediate - Some background needed
  RED = 'red'          // Advanced - Specialized knowledge required
}

/**
 * Section types to distinguish different content layouts
 */
export enum SectionType {
  TITLE = 'title',
  CONTENT = 'content',
  VISUAL_ABSTRACT = 'visual-abstract',
  EXECUTIVE_SUMMARY = 'executive-summary',
  READING_GUIDE = 'reading-guide',
  GLOSSARY = 'glossary',
  CHAPTER = 'chapter',
  APPENDIX = 'appendix',
  BIBLIOGRAPHY = 'bibliography'
}

/**
 * Image MIME types supported
 */
export enum ImageMimeType {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  GIF = 'image/gif',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp'
}

/**
 * Publication types for bibliography
 */
export enum PublicationType {
  JOURNAL = 'journal',
  BOOK = 'book',
  CONFERENCE = 'conference',
  THESIS = 'thesis',
  WEBSITE = 'website',
  REPORT = 'report'
}

/**
 * Types of exercises
 */
export enum ExerciseType {
  THOUGHT_EXPERIMENT = 'thought-experiment',
  CALCULATION = 'calculation',
  WORKSHEET = 'worksheet',
  DISCUSSION = 'discussion',
  PRACTICAL = 'practical'
}

/**
 * Types of diagrams supported
 */
export enum DiagramType {
  MERMAID = 'mermaid',
  FLOWCHART = 'flowchart',
  VENN = 'venn',
  GRAPH = 'graph',
  TREE = 'tree'
}

/**
 * Render modes for different output contexts
 */
export enum RenderMode {
  SCREEN = 'screen',
  PRINT = 'print',
  EXPORT = 'export'
}

/**
 * Target export formats
 */
export enum ExportFormat {
  HTML = 'html',
  PDF = 'pdf',
  MARKDOWN = 'markdown'
}
