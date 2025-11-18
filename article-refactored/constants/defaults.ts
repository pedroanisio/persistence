/**
 * Constants Module
 * Single Responsibility: Define default configuration values
 */

import { DifficultyLevel, RenderMode, ExportFormat } from '../types/enums';
import {
  CSSCustomProperties,
  DifficultyBadge,
  ParserConfig,
  RenderOptions,
  ReadingPath
} from '../types/interfaces';
import { DeepReadonly } from '../types/utility-types';
import { deepFreeze } from '../utils/deep-freeze';

/**
 * Default CSS custom properties configuration
 */
export const DEFAULT_CSS_PROPERTIES: CSSCustomProperties = deepFreeze({
  '--a4-width': '210mm',
  '--a4-height': '297mm',
  '--page-margin': '25mm',
  '--content-width': 'calc(var(--a4-width) - 2 * var(--page-margin))',
  '--primary-color': '#1a365d',
  '--secondary-color': '#2c5282',
  '--accent-color': '#3182ce',
  '--text-color': '#1a202c',
  '--light-bg': '#f7fafc',
  '--border-color': '#e2e8f0',
  '--green-accessible': '#48bb78',
  '--orange-intermediate': '#ed8936',
  '--red-advanced': '#e53e3e',
});

/**
 * Difficulty badge configurations
 */
export const DIFFICULTY_BADGES: DeepReadonly<Record<DifficultyLevel, DifficultyBadge>> = deepFreeze({
  [DifficultyLevel.GREEN]: {
    level: DifficultyLevel.GREEN,
    label: 'Accessible',
    className: 'difficulty-green',
  },
  [DifficultyLevel.ORANGE]: {
    level: DifficultyLevel.ORANGE,
    label: 'Intermediate',
    className: 'difficulty-orange',
  },
  [DifficultyLevel.RED]: {
    level: DifficultyLevel.RED,
    label: 'Advanced',
    className: 'difficulty-red',
  },
});

/**
 * Reading paths configuration
 */
export const READING_PATHS: readonly ReadingPath[] = deepFreeze([
  {
    name: 'Curious Explorer',
    description: 'Perfect for the general reader who wants to understand the core ideas without getting into the technical weeds.',
    estimatedTime: 105,
    targetAudience: 'General readers',
    sections: [
      { sectionId: 'executive-summaries', required: true, estimatedTime: 5 },
      { sectionId: 'chapter-1', required: true, estimatedTime: 20 },
      { sectionId: 'chapter-3', required: true, estimatedTime: 15 },
      { sectionId: 'chapter-4', required: true, estimatedTime: 25 },
      { sectionId: 'chapter-6', required: true, estimatedTime: 20 },
      { sectionId: 'chapter-7', required: true, estimatedTime: 25 },
      { sectionId: 'conclusion', required: true, estimatedTime: 5 },
    ],
  },
  {
    name: 'Student/Educator',
    description: 'Designed for those who want to build a solid, foundational understanding of the persistence framework and its applications.',
    estimatedTime: 210,
    targetAudience: 'Students and educators',
    sections: [
      { sectionId: 'executive-summaries', required: true, estimatedTime: 5 },
      { sectionId: 'glossary', required: true, estimatedTime: 10 },
      { sectionId: 'chapter-2', required: true, estimatedTime: 30 },
      { sectionId: 'chapter-3', required: true, estimatedTime: 35 },
      { sectionId: 'chapter-8', required: true, estimatedTime: 30 },
      { sectionId: 'chapter-10', required: true, estimatedTime: 25 },
      { sectionId: 'chapter-11', required: true, estimatedTime: 20 },
    ],
  },
  {
    name: 'Expert/Researcher',
    description: 'A deep dive for specialists who want to engage with the technical and mathematical details and understand the full scope of the argument.',
    estimatedTime: 360,
    targetAudience: 'Researchers and domain experts',
    sections: [
      { sectionId: 'chapter-5', required: true, estimatedTime: 35 },
      { sectionId: 'chapter-9', required: true, estimatedTime: 40 },
      { sectionId: 'technical-appendices', required: true, estimatedTime: 30 },
    ],
  },
]);

/**
 * Default parser configuration
 */
export const DEFAULT_PARSER_CONFIG: ParserConfig = deepFreeze({
  enableTables: true,
  enableFootnotes: true,
  enableMath: true,
  enableDiagrams: true,
  enableSyntaxHighlighting: true,
});

/**
 * Default render options
 */
export const DEFAULT_RENDER_OPTIONS: RenderOptions = deepFreeze({
  includeMetadata: true,
  includeDifficulty: true,
  includePageBreaks: true,
  renderMode: RenderMode.SCREEN,
  targetFormat: ExportFormat.HTML,
});
