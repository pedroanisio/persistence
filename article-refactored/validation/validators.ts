/**
 * Validation Module
 * Single Responsibility: Validate article data with composable rules
 *
 * Follows Open/Closed Principle: Easy to add new rules without modification
 */

import { ArticleData } from '../types/interfaces';
import { isValidArticleData, isChapterSection } from '../guards/type-guards';

// ============================================================================
// VALIDATION RULE TYPE
// ============================================================================

export type ValidationRule<T> = (data: T) => void;

// ============================================================================
// COMPOSABLE VALIDATION RULES
// ============================================================================

/**
 * Rule: Article must contain at least one section
 */
export const hasAtLeastOneSection: ValidationRule<ArticleData> = (data) => {
  if (data.sections.length === 0) {
    throw new Error('Article must contain at least one section');
  }
};

/**
 * Rule: All section IDs must be unique
 */
export const hasUniqueSectionIds: ValidationRule<ArticleData> = (data) => {
  const ids = new Set<string>();
  for (const section of data.sections) {
    if (ids.has(section.id)) {
      throw new Error(`Duplicate section ID found: ${section.id}`);
    }
    ids.add(section.id);
  }
};

/**
 * Rule: Chapter numbers must be sequential
 */
export const hasSequentialChapters: ValidationRule<ArticleData> = (data) => {
  const chapters = data.sections.filter(isChapterSection);
  const chapterNumbers = chapters.map(ch => ch.chapterNumber).sort((a, b) => a - b);

  for (let i = 0; i < chapterNumbers.length; i++) {
    if (chapterNumbers[i] !== i + 1) {
      throw new Error(
        `Chapter numbers must be sequential. Expected ${i + 1}, found ${chapterNumbers[i]}`
      );
    }
  }
};

/**
 * Rule: Prerequisites must reference existing sections
 */
export const hasValidPrerequisites: ValidationRule<ArticleData> = (data) => {
  const ids = new Set(data.sections.map(s => s.id));

  for (const section of data.sections) {
    if (section.metadata?.prerequisites) {
      for (const prereqId of section.metadata.prerequisites) {
        if (!ids.has(prereqId)) {
          throw new Error(
            `Section ${section.id} references non-existent prerequisite: ${prereqId}`
          );
        }
      }
    }
  }
};

// ============================================================================
// ARTICLE VALIDATOR (Open/Closed Principle)
// ============================================================================

/**
 * Composable validator that follows the Open/Closed Principle
 * New rules can be added without modifying this class
 */
export class ArticleValidator {
  private rules: ValidationRule<ArticleData>[] = [];

  /**
   * Add a validation rule
   */
  addRule(rule: ValidationRule<ArticleData>): this {
    this.rules.push(rule);
    return this; // Fluent interface
  }

  /**
   * Add multiple validation rules
   */
  addRules(...rules: ValidationRule<ArticleData>[]): this {
    this.rules.push(...rules);
    return this;
  }

  /**
   * Validate article data with all registered rules
   */
  validate(data: unknown): asserts data is ArticleData {
    // Type structure validation
    if (!isValidArticleData(data)) {
      throw new Error('Invalid article data structure');
    }

    // Business rules validation
    for (const rule of this.rules) {
      rule(data);
    }
  }

  /**
   * Safely validate without throwing
   */
  isValid(data: unknown): data is ArticleData {
    try {
      this.validate(data);
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// DEFAULT VALIDATOR
// ============================================================================

/**
 * Creates a validator with all standard rules
 */
export function createDefaultValidator(): ArticleValidator {
  return new ArticleValidator()
    .addRule(hasAtLeastOneSection)
    .addRule(hasUniqueSectionIds)
    .addRule(hasSequentialChapters)
    .addRule(hasValidPrerequisites);
}

/**
 * Validates article data with default rules
 * @throws {Error} if validation fails
 */
export function validateArticleData(data: unknown): asserts data is ArticleData {
  const validator: ArticleValidator = createDefaultValidator();
  validator.validate(data);
}

/**
 * Safely parses article data from unknown source
 */
export function parseArticleData(data: unknown): ArticleData | null {
  try {
    validateArticleData(data);
    return data;
  } catch (error) {
    console.error('Failed to parse article data:', error);
    return null;
  }
}
