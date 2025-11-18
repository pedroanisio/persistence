/**
 * Factory Functions Module
 * Single Responsibility: Create immutable domain objects
 *
 * Uses deepFreeze utility to eliminate Object.freeze() duplication
 */

import { DifficultyLevel, SectionType, PublicationType } from '../types/enums';
import {
  ChapterSection,
  GlossaryTerm,
  BibliographyEntry,
  ArticleData
} from '../types/interfaces';
import { deepFreeze } from './deep-freeze';

/**
 * Create a new chapter section (returns deeply frozen object)
 */
export function createChapterSection(
  id: string,
  title: string,
  content: string,
  chapterNumber: number,
  difficulty: DifficultyLevel = DifficultyLevel.GREEN
): ChapterSection {
  return deepFreeze({
    id,
    title,
    content,
    type: SectionType.CHAPTER,
    difficulty,
    chapterNumber,
    subsections: [],
    references: [],
    exercises: [],
    keyTakeaways: []
  });
}

/**
 * Create a new glossary term (returns deeply frozen object)
 */
export function createGlossaryTerm(
  term: string,
  definition: string,
  tier: number = 1
): GlossaryTerm {
  return deepFreeze({
    term,
    definition,
    tier,
    relatedTerms: [],
    examples: []
  });
}

/**
 * Create a new bibliography entry (returns deeply frozen object)
 */
export function createBibliographyEntry(
  id: string,
  authors: readonly string[],
  title: string,
  year: number,
  type: PublicationType
): BibliographyEntry {
  return deepFreeze({
    id,
    authors: [...authors],
    title,
    year,
    type
  });
}

/**
 * Create empty article data (returns deeply frozen object)
 */
export function createEmptyArticle(title: string): ArticleData {
  return deepFreeze({
    title,
    version: '1.0.0',
    metadata: {
      authors: [],
      created: new Date(),
      lastModified: new Date(),
      keywords: [],
      description: '',
      language: 'en'
    },
    sections: [],
    images: {},
    tableOfContents: [],
    readingPaths: [],
    settings: {
      theme: 'light' as const,
      fontSize: 'medium' as const,
      showDifficulty: true,
      showEstimatedTime: true,
      enableSearch: true,
      enableNavigation: true
    }
  });
}
