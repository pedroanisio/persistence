/**
 * Data Utilities Module
 * Single Responsibility: Extract and manipulate article data
 */

import { DifficultyLevel } from '../types/enums';
import {
  ArticleData,
  Section,
  ChapterSection,
  Reference,
  TOCEntry
} from '../types/interfaces';
import { isChapterSection, hasDifficulty } from '../guards/type-guards';

/**
 * Extract all references from a document
 * Only extracts from ContentSection and ChapterSection (not BibliographySection)
 */
export function extractAllReferences(article: ArticleData): readonly Reference[] {
  const references: Reference[] = [];
  article.sections.forEach(section => {
    // Only extract from sections with difficulty (ContentSection/ChapterSection)
    // This excludes BibliographySection which has BibliographyEntry[] instead
    if (hasDifficulty(section) && section.references) {
      references.push(...section.references);
    }
  });
  return references;
}

/**
 * Get sections by difficulty level
 */
export function getSectionsByDifficulty(
  article: ArticleData,
  level: DifficultyLevel
): readonly Section[] {
  return article.sections.filter(s => hasDifficulty(s) && s.difficulty === level);
}

/**
 * Get all chapters from the document
 */
export function getChapters(article: ArticleData): readonly ChapterSection[] {
  return article.sections.filter(isChapterSection);
}

/**
 * Calculate total reading time
 */
export function getTotalReadingTime(article: ArticleData): number {
  return article.sections.reduce((total, section) => {
    const time = section.metadata?.estimatedReadingTime || 0;
    return total + time;
  }, 0);
}

/**
 * Generate table of contents from sections
 */
export function generateTableOfContents(article: ArticleData): readonly TOCEntry[] {
  return article.sections.map(section => ({
    id: section.id,
    title: section.title,
    level: 1,
    difficulty: hasDifficulty(section) ? section.difficulty : undefined,
    children: 'subsections' in section && section.subsections ?
      section.subsections.map(sub => ({
        id: sub.id,
        title: sub.title,
        level: sub.level,
        children: []
      })) : []
  }));
}

/**
 * Find a section by ID
 */
export function findSectionById(
  article: ArticleData,
  id: string
): Section | undefined {
  return article.sections.find(s => s.id === id);
}
