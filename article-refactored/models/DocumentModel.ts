/**
 * Document Model Module
 * Single Responsibility: Provide OOP interface for article data
 *
 * Follows Open/Closed Principle with plugin architecture
 */

import { DifficultyLevel } from '../types/enums';
import { ArticleData, Section, ChapterSection, Reference, TOCEntry, ReadingPath } from '../types/interfaces';
import { validateArticleData } from '../validation/validators';
import {
  findSectionById,
  getSectionsByDifficulty,
  getChapters,
  getTotalReadingTime,
  generateTableOfContents,
  extractAllReferences
} from '../utils/data-utils';
import { deepFreeze } from '../utils/deep-freeze';

// ============================================================================
// PLUGIN ARCHITECTURE (Open/Closed Principle)
// ============================================================================

export type QueryPlugin<T> = (article: ArticleData) => T;
export type QueryPluginWithArgs<TArgs, TResult> = (article: ArticleData, ...args: TArgs[]) => TResult;

/**
 * Document model class with plugin architecture
 * Provides a convenient OOP interface while maintaining immutability
 *
 * Follows Open/Closed Principle: New queries can be added without modification
 */
export class DocumentModel {
  private readonly article: ArticleData;
  private plugins = new Map<string, QueryPlugin<any> | QueryPluginWithArgs<any, any>>();

  /**
   * Create a new document model
   * @throws {Error} if article data is invalid
   */
  constructor(article: ArticleData) {
    validateArticleData(article);
    this.article = deepFreeze(article);
    this.registerDefaultPlugins();
  }

  /**
   * Register default query plugins
   */
  private registerDefaultPlugins(): void {
    // Simple queries
    this.registerPlugin('allReferences', extractAllReferences);
    this.registerPlugin('chapters', getChapters);
    this.registerPlugin('totalReadingTime', getTotalReadingTime);
    this.registerPlugin('tableOfContents', generateTableOfContents);

    // Queries with arguments
    this.registerPlugin('sectionById', findSectionById);
    this.registerPlugin('sectionsByDifficulty', getSectionsByDifficulty);
  }

  /**
   * Register a query plugin (Open/Closed Principle)
   */
  registerPlugin<T>(name: string, plugin: QueryPlugin<T> | QueryPluginWithArgs<any, T>): this {
    this.plugins.set(name, plugin);
    return this;
  }

  /**
   * Execute a query plugin
   */
  query<T>(pluginName: string, ...args: any[]): T {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }
    return plugin(this.article, ...args);
  }

  // ============================================================================
  // CONVENIENCE METHODS (Delegate to plugins)
  // ============================================================================

  /**
   * Get the underlying article data (immutable)
   */
  getArticle(): ArticleData {
    return this.article;
  }

  /**
   * Find a section by ID
   */
  getSection(id: string): Section | undefined {
    return this.query<Section | undefined>('sectionById', id);
  }

  /**
   * Get all sections with a specific difficulty level
   */
  getSectionsByDifficulty(level: DifficultyLevel): readonly Section[] {
    return this.query<readonly Section[]>('sectionsByDifficulty', level);
  }

  /**
   * Get all chapters
   */
  getChapters(): readonly ChapterSection[] {
    return this.query<readonly ChapterSection[]>('chapters');
  }

  /**
   * Calculate total reading time in minutes
   */
  getTotalReadingTime(): number {
    return this.query<number>('totalReadingTime');
  }

  /**
   * Generate table of contents
   */
  generateTableOfContents(): readonly TOCEntry[] {
    return this.query<readonly TOCEntry[]>('tableOfContents');
  }

  /**
   * Extract all references
   */
  getAllReferences(): readonly Reference[] {
    return this.query<readonly Reference[]>('allReferences');
  }

  /**
   * Get reading path by name
   */
  getReadingPath(name: string): ReadingPath | undefined {
    return this.article.readingPaths?.find(path => path.name === name);
  }

  /**
   * Get sections for a specific reading path
   */
  getSectionsForPath(pathName: string): readonly Section[] {
    const path = this.getReadingPath(pathName);
    if (!path) return [];

    return path.sections
      .map(ps => this.getSection(ps.sectionId))
      .filter((s): s is Section => s !== undefined);
  }
}

// ============================================================================
// EXAMPLE: EXTENDING WITH CUSTOM PLUGINS
// ============================================================================

/**
 * Example custom plugin: Get sections by tag
 */
export const getSectionsByTag: QueryPluginWithArgs<string, readonly Section[]> = (
  article,
  tag
) => {
  return article.sections.filter(section =>
    section.metadata?.tags?.includes(tag)
  );
};

/**
 * Example custom plugin: Get sections by author
 */
export const getSectionsByContributor: QueryPluginWithArgs<string, readonly Section[]> = (
  article,
  contributor
) => {
  return article.sections.filter(section =>
    section.metadata?.contributors?.includes(contributor)
  );
};

// Usage example:
// const model = new DocumentModel(data);
// model.registerPlugin('byTag', getSectionsByTag);
// const tagged = model.query('byTag', 'advanced-topics');
