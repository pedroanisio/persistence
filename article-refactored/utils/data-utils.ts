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
 */
export function extractAllReferences(article: ArticleData): readonly Reference[] {
  const references: Reference[] = [];
  article.sections.forEach(section => {
    if ('references' in section && section.references && Array.isArray(section.references)) {
      section.references.forEach(ref => {
        if ('number' in ref && 'text' in ref) {
          references.push(ref as Reference);
        }
      });
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
