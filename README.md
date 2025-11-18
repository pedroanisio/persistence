# Article Renderer

A modern, type-safe article rendering application built with TypeScript and Vite.

## Features

- **Type-Safe**: Built with TypeScript and strict type checking
- **Modular Architecture**: Clean separation of concerns with focused modules
- **Responsive Design**: Mobile-friendly with collapsible navigation
- **Table of Contents**: Auto-generated with scroll spy for active section tracking
- **Difficulty Badges**: Visual indicators for content difficulty levels
- **Reading Time**: Estimated reading times for each section
- **Markdown Support**: Simple markdown rendering for content
- **Persistent State**: Remembers navigation preferences in localStorage

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
persistence/
├── article/                 # Type system and utilities
│   ├── types/              # Enums, interfaces, utility types
│   ├── guards/             # Type guards
│   ├── validation/         # Validation rules
│   ├── utils/              # Utilities and factories
│   ├── constants/          # Default configurations
│   ├── models/             # DocumentModel class
│   └── index.ts            # Public API
├── article.json            # Article content data
├── index.html              # HTML entry point
├── main.ts                 # Application initialization
├── renderer.ts             # Article rendering logic
├── styles.css              # Styling
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies
```

## Features in Detail

### Navigation
- Fixed sidebar with table of contents
- Collapsible navigation (remembers state)
- Scroll spy highlights active section
- Click to jump to sections

### Section Rendering
- Supports multiple section types (title, content, chapter, glossary, etc.)
- Difficulty badges (Accessible, Intermediate, Advanced)
- Reading time estimates
- Chapter-specific features (key takeaways)

### Responsive Design
- Desktop: Fixed sidebar navigation
- Mobile: Collapsible navigation with toggle
- Smooth scrolling
- Print-friendly styles

## Type System

The application uses a modular type system with:
- Composable validation rules
- Runtime type checking
- Plugin architecture for extensibility
- Immutable data structures

### Validation
Article data is validated on load:
- Runtime type checking
- Business rule validation
- Unique section IDs
- Sequential chapter numbering
- Valid prerequisite references

## Data Format

The app loads and validates `article.json` which must conform to the `ArticleData` interface:

```typescript
interface ArticleData {
  readonly title: string;
  readonly version: string;
  readonly metadata: DocumentMetadata;
  readonly sections: readonly Section[];
}
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ required
- CSS Grid and Flexbox support required
