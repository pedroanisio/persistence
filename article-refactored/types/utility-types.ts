/**
 * Utility Types Module
 * Single Responsibility: Advanced TypeScript type utilities
 */

/**
 * Markdown content type
 */
export type MarkdownContent = string;

/**
 * HTML content type
 */
export type HTMLContent = string;

/**
 * CSS class name type
 */
export type CSSClassName = string;

/**
 * DOM element ID type
 */
export type ElementId = string;

/**
 * Color hex code type with template literal validation
 */
export type HexColor = `#${string}`;

/**
 * CSS measurement unit type with template literal validation
 */
export type CSSMeasurement = `${number}${'mm' | 'pt' | 'px' | 'em' | 'rem' | '%'}`;

/**
 * ISO 8601 date string
 */
export type ISODateString = string;

/**
 * Deep readonly utility type
 * Properly handles arrays, functions, and objects
 */
export type DeepReadonly<T> =
  T extends (infer R)[] ? ReadonlyArray<DeepReadonly<R>> :
  T extends Function ? T :
  T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } :
  T;
