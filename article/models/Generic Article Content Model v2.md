# Generic Article Content Model v2

A flexible, book-inspired content model for rich document rendering with typography control, highlights, and reusable blocks.

## Philosophy

This model is designed to be **generic and composable** rather than specialized. Instead of creating specific types for every use case, it provides:

- **Generic content blocks** that can be styled and composed
- **Book-style typography** controls (chapter fonts, drop caps, pull quotes)
- **Highlights and annotations** like marking up a physical book
- **Flexible styling** at global, section, and block levels
- **Extensibility** without modifying core types

## Key Improvements Over v1

| Aspect | v1 (Overfitted) | v2 (Generic) |
|--------|-----------------|--------------|
| **Approach** | Specialized types for each use case | Generic blocks with styling |
| **Flexibility** | Limited to predefined types | Infinite combinations |
| **Highlights** | ❌ Not supported | ✅ Built-in support |
| **Typography** | ❌ No control | ✅ Full control (fonts, spacing) |
| **Extensibility** | Requires new types | Use existing blocks with styles |
| **Complexity** | 10+ specialized types | 11 generic block types |

## Core Concepts

### 1. Content Blocks

Everything is a **block**. Blocks are generic and can be styled individually:

- `text` - Paragraphs, headings, quotes, captions
- `list` - Ordered, unordered, or definition lists
- `table` - Generic data tables
- `media` - Images, videos, diagrams
- `code` - Syntax-highlighted code
- `math` - LaTeX formulas
- `container` - Groups blocks (callouts, cards, accordions)
- `grid` - Layout blocks in columns
- `separator` - Visual breaks
- `reference` - Citations and footnotes
- `interactive` - Custom interactive elements

### 2. Styling System

Styles can be applied at **three levels**:

1. **Global** - Affects entire article
2. **Section** - Affects specific chapters/sections
3. **Block** - Affects individual blocks

Each style has three components:

- **Typography** - Font, size, weight, spacing, alignment
- **Visual** - Background, borders, shadows, dimensions
- **Layout** - Columns, gaps, alignment

### 3. Book-Style Features

#### Drop Caps
```typescript
{
  type: "text",
  variant: "paragraph",
  content: "First paragraph...",
  dropCap: true  // First letter will be large
}
```

#### Chapter Headings
```typescript
styles: {
  chapter: {
    typography: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "3rem",
      textTransform: "uppercase",
      letterSpacing: "0.1em"
    }
  }
}
```

#### Pull Quotes
```typescript
{
  type: "text",
  variant: "quote",
  content: "Important quote...",
  style: {
    typography: {
      fontSize: "1.5rem",
      fontStyle: "italic",
      textAlign: "center"
    },
    visual: {
      borderTop: "2px solid #333",
      borderBottom: "2px solid #333"
    }
  }
}
```

### 4. Highlights & Annotations

#### Highlights (Reader-Created)
```typescript
{
  type: "text",
  content: "Some important text",
  highlights: [
    {
      id: "h1",
      text: "important",
      color: "yellow",
      note: "Remember this!"
    }
  ]
}
```

#### Annotations (Margin Notes)
```typescript
annotations: [
  {
    id: "ann1",
    targetId: "block-id",
    content: "This needs clarification",
    position: "margin",
    author: "Reviewer"
  }
]
```

## Usage Examples

### Example 1: Simple Paragraph

```typescript
{
  type: "text",
  id: "p1",
  variant: "paragraph",
  content: "This is a paragraph with **bold** and *italic* text."
}
```

### Example 2: Styled Heading

```typescript
{
  type: "text",
  id: "h1",
  variant: "heading",
  level: 1,
  content: "Chapter One",
  style: {
    typography: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "3rem",
      textAlign: "center"
    }
  }
}
```

### Example 3: Definition List (Glossary)

```typescript
{
  type: "list",
  id: "glossary",
  variant: "definition",
  items: [
    {
      term: "Persistence",
      content: "The property of remaining stable over time"
    },
    {
      term: "Interference",
      content: "Wave interaction phenomenon"
    }
  ]
}
```

### Example 4: Comparison Table

```typescript
{
  type: "table",
  id: "comparison",
  headers: [
    { key: "concept", label: "Concept" },
    { key: "old", label: "Traditional View" },
    { key: "new", label: "New Framework" }
  ],
  rows: [
    {
      concept: "Origin",
      old: "Emerges from chaos",
      new: "Persists when stable"
    }
  ]
}
```

### Example 5: Card Layout (Using Grid + Containers)

```typescript
{
  type: "grid",
  id: "cards",
  columns: 3,
  gap: "2rem",
  blocks: [
    {
      type: "container",
      id: "card1",
      variant: "card",
      title: "For Policymakers",
      blocks: [
        {
          type: "text",
          id: "card1-text",
          variant: "paragraph",
          content: "Summary for policymakers..."
        }
      ],
      style: {
        visual: {
          background: "#f8f9fa",
          borderRadius: "8px",
          padding: "1.5rem"
        }
      }
    }
    // More cards...
  ]
}
```

### Example 6: Accordion (Collapsible Q&A)

```typescript
{
  type: "container",
  id: "qa1",
  variant: "accordion",
  title: "Question: What is persistence?",
  collapsible: true,
  defaultExpanded: false,
  blocks: [
    {
      type: "text",
      id: "answer1",
      variant: "paragraph",
      content: "Answer: Persistence is..."
    }
  ]
}
```

### Example 7: Side-by-Side Layout

```typescript
{
  type: "grid",
  id: "side-by-side",
  columns: 2,
  blocks: [
    {
      type: "text",
      id: "left",
      variant: "paragraph",
      content: "Left column content"
    },
    {
      type: "text",
      id: "right",
      variant: "paragraph",
      content: "Right column content"
    }
  ]
}
```

### Example 8: Callout Box

```typescript
{
  type: "container",
  id: "callout1",
  variant: "callout",
  title: "Important Note",
  icon: "⚠️",
  blocks: [
    {
      type: "text",
      id: "callout-text",
      variant: "paragraph",
      content: "This is important information..."
    }
  ],
  style: {
    visual: {
      background: "#fff3cd",
      border: "1px solid #ffc107",
      borderRadius: "4px",
      padding: "1rem"
    }
  }
}
```

## Styling Guide

### Typography Properties

```typescript
typography: {
  fontFamily: "'Merriweather', serif",
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: 1.8,
  letterSpacing: "0.02em",
  textTransform: "none",
  color: "#333",
  textAlign: "left",
  margin: "1rem 0",
  padding: "0"
}
```

### Visual Properties

```typescript
visual: {
  background: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "800px",
  className: "custom-class",
  customCSS: {
    "hover:background": "#f5f5f5"
  }
}
```

### Layout Properties

```typescript
layout: {
  columns: 2,
  gap: "2rem",
  alignment: "center"
}
```

## Recommended Font Combinations

### Classic Book Style
```typescript
styles: {
  global: {
    typography: {
      fontFamily: "'Merriweather', serif",  // Body
      fontSize: "18px",
      lineHeight: 1.8
    }
  },
  heading: {
    1: {
      typography: {
        fontFamily: "'Playfair Display', serif",  // Headings
        fontSize: "3rem"
      }
    }
  }
}
```

### Modern Technical
```typescript
styles: {
  global: {
    typography: {
      fontFamily: "'Inter', sans-serif",  // Body
      fontSize: "16px",
      lineHeight: 1.6
    }
  },
  code: {
    typography: {
      fontFamily: "'Fira Code', monospace"  // Code
    }
  }
}
```

### Academic
```typescript
styles: {
  global: {
    typography: {
      fontFamily: "'Crimson Text', serif",  // Body
      fontSize: "19px",
      lineHeight: 1.7
    }
  },
  heading: {
    1: {
      typography: {
        fontFamily: "'Libre Baskerville', serif"  // Headings
      }
    }
  }
}
```

## Migration from v1

### Before (v1 - Specialized)
```typescript
{
  type: "audience-cards",
  cards: [
    {
      audience: "Policymakers",
      summary: "...",
      keyPoints: ["A", "B", "C"]
    }
  ]
}
```

### After (v2 - Generic)
```typescript
{
  type: "grid",
  columns: 3,
  blocks: [
    {
      type: "container",
      variant: "card",
      title: "For Policymakers",
      blocks: [
        {
          type: "text",
          content: "Summary..."
        },
        {
          type: "list",
          variant: "unordered",
          items: [
            { content: "A" },
            { content: "B" },
            { content: "C" }
          ]
        }
      ]
    }
  ]
}
```

## Best Practices

### 1. Use Semantic Variants
```typescript
// Good
{ type: "text", variant: "quote", content: "..." }

// Avoid
{ type: "text", variant: "paragraph", style: { /* quote styles */ } }
```

### 2. Define Styles Globally
```typescript
// Good - Define once, reuse
styles: {
  quote: { /* quote styles */ }
}

// Avoid - Repeating styles
blocks: [
  { type: "text", variant: "quote", style: { /* styles */ } },
  { type: "text", variant: "quote", style: { /* same styles */ } }
]
```

### 3. Use Containers for Grouping
```typescript
// Good - Logical grouping
{
  type: "container",
  variant: "callout",
  blocks: [/* related blocks */]
}

// Avoid - Flat structure
blocks: [/* all blocks at same level */]
```

### 4. Leverage Grid for Layout
```typescript
// Good - Responsive layout
{
  type: "grid",
  columns: 3,
  blocks: [/* cards */]
}

// Avoid - Manual positioning
blocks: [/* trying to position with styles */]
```

## Extensibility

### Adding Custom Block Types

The model is extensible. To add a custom block:

1. **Extend the ContentBlock union:**
```typescript
export interface CustomBlock extends BaseBlock {
  type: "custom";
  customProp: string;
}

export type ContentBlock = 
  | TextBlock
  | ListBlock
  | CustomBlock;  // Add here
```

2. **Add type guard:**
```typescript
export function isCustomBlock(block: ContentBlock): block is CustomBlock {
  return block.type === "custom";
}
```

3. **Use in content:**
```typescript
{
  type: "custom",
  id: "custom1",
  customProp: "value"
}
```

## Summary

This v2 model provides:

✅ **Generic blocks** instead of specialized types  
✅ **Full typography control** (fonts, spacing, alignment)  
✅ **Highlights and annotations** for book-like interaction  
✅ **Flexible styling** at all levels  
✅ **Composability** through containers and grids  
✅ **Extensibility** without breaking changes  
✅ **Simplicity** with only 11 core block types  

It's designed to be a **foundation** that can handle any content structure through composition and styling, rather than requiring new types for each use case.
