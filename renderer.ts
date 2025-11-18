import type {
  ArticleData,
  Section,
  ChapterSection,
  DifficultyLevel,
} from './article';

import {
  isChapterSection,
  DIFFICULTY_BADGES,
  getTotalReadingTime,
} from './article';

/**
 * Renderer class for the Article system
 */
export class ArticleRenderer {
  private article: ArticleData;
  private mainContent: HTMLElement;
  private tocContainer: HTMLElement;
  private headerContainer: HTMLElement;

  constructor(
    article: ArticleData,
    mainContent: HTMLElement,
    tocContainer: HTMLElement,
    headerContainer: HTMLElement
  ) {
    this.article = article;
    this.mainContent = mainContent;
    this.tocContainer = tocContainer;
    this.headerContainer = headerContainer;
  }

  /**
   * Render the complete article
   */
  public render(): void {
    this.renderHeader();
    this.renderTableOfContents();
    this.renderSections();
    this.setupScrollSpy();
    this.updateFooter();
  }

  /**
   * Render article header with metadata
   */
  private renderHeader(): void {
    const header = document.createElement('div');

    const title = document.createElement('h1');
    title.textContent = this.article.title;
    header.appendChild(title);

    if (this.article.metadata) {
      const meta = document.createElement('div');
      meta.className = 'article-meta';

      if (this.article.metadata?.authors && this.article.metadata.authors.length > 0) {
        const authors = document.createElement('p');
        authors.textContent = `By ${this.article.metadata.authors.map(a => a.name).join(', ')}`;
        meta.appendChild(authors);
      }

      if (this.article.metadata?.created) {
        const date = document.createElement('p');
        date.textContent = `Version ${this.article.version || '1.0'} • ${new Date(this.article.metadata.created).toLocaleDateString()}`;
        meta.appendChild(date);
      }

      if (this.article.metadata?.description) {
        const desc = document.createElement('p');
        desc.textContent = this.article.metadata.description;
        desc.style.marginTop = '1rem';
        meta.appendChild(desc);
      }

      header.appendChild(meta);
    }

    this.headerContainer.appendChild(header);
  }

  /**
   * Render table of contents
   */
  private renderTableOfContents(): void {
    this.tocContainer.innerHTML = '';

    this.article.sections.forEach((section) => {
      const entry = document.createElement('div');
      entry.className = 'toc-entry';
      entry.dataset.sectionId = section.id;

      const title = document.createElement('span');
      title.className = 'toc-entry-title';
      title.textContent = section.title;
      entry.appendChild(title);

      if ('difficulty' in section && section.difficulty) {
        const badge = this.createDifficultyBadge(section.difficulty);
        badge.style.fontSize = '0.7rem';
        badge.style.padding = '0.2rem 0.5rem';
        entry.appendChild(badge);
      }

      entry.addEventListener('click', () => {
        this.scrollToSection(section.id);
      });

      this.tocContainer.appendChild(entry);
    });
  }

  /**
   * Render all sections
   */
  private renderSections(): void {
    this.mainContent.innerHTML = '';

    this.article.sections.forEach((section) => {
      const sectionElement = this.renderSection(section);
      this.mainContent.appendChild(sectionElement);
    });
  }

  /**
   * Render a single section
   */
  private renderSection(section: Section): HTMLElement {
    const container = document.createElement('section');
    container.className = 'section';
    container.id = `section-${section.id}`;

    if (section.type) {
      container.classList.add(`section-type-${section.type}`);
    }

    // Section header
    const header = document.createElement('div');
    header.className = 'section-header';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = section.title;
    header.appendChild(title);

    // Meta information
    const meta = document.createElement('div');
    meta.className = 'section-meta';

    if ('difficulty' in section && section.difficulty) {
      const badge = this.createDifficultyBadge(section.difficulty);
      meta.appendChild(badge);
    }

    if (section.metadata?.estimatedReadingTime) {
      const readingTime = document.createElement('span');
      readingTime.className = 'reading-time';
      readingTime.textContent = `${section.metadata.estimatedReadingTime} min read`;
      meta.appendChild(readingTime);
    }

    if (meta.children.length > 0) {
      header.appendChild(meta);
    }

    container.appendChild(header);

    // Section content
    const content = document.createElement('div');
    content.className = 'section-content';
    content.innerHTML = this.renderMarkdown(section.content);
    container.appendChild(content);

    // Special rendering for chapter sections
    if (isChapterSection(section)) {
      this.renderChapterExtras(container, section);
    }

    return container;
  }

  /**
   * Create a difficulty badge
   */
  private createDifficultyBadge(difficulty: DifficultyLevel): HTMLElement {
    const badge = document.createElement('span');
    const config = DIFFICULTY_BADGES[difficulty];

    badge.className = `difficulty-badge ${config.className}`;
    badge.textContent = config.label;

    return badge;
  }

  /**
   * Process markdown tables
   */
  private processTables(text: string): string {
    const lines = text.split('\n');
    const result: string[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      if (!currentLine) continue;

      const line = currentLine.trim();

      // Check if this is a table row (contains pipes)
      if (line.includes('|')) {
        const nextLineRaw = i + 1 < lines.length ? lines[i + 1] : null;
        const nextLine = nextLineRaw ? nextLineRaw.trim() : '';
        const isHeaderSeparator = /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(nextLine);

        if (!inTable) {
          inTable = true;
          tableRows = [];
        }

        // Skip separator rows
        if (/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(line)) {
          continue;
        }

        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        const nextLineToCheck = i + 1 < lines.length ? lines[i + 1] : null;
        const isHeader = isHeaderSeparator || (nextLineToCheck && /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(nextLineToCheck.trim()));

        if (isHeader) {
          const headerCells = cells.map(cell => `<th>${cell}</th>`).join('');
          tableRows.push(`<tr>${headerCells}</tr>`);
        } else {
          const dataCells = cells.map(cell => `<td>${cell}</td>`).join('');
          tableRows.push(`<tr>${dataCells}</tr>`);
        }
      } else {
        if (inTable) {
          // End of table
          result.push('<table>' + tableRows.join('') + '</table>');
          tableRows = [];
          inTable = false;
        }
        result.push(line);
      }
    }

    if (inTable && tableRows.length > 0) {
      result.push('<table>' + tableRows.join('') + '</table>');
    }

    return result.join('\n');
  }

  /**
   * Render markdown content to HTML
   */
  private renderMarkdown(markdown: string): string {
    let html = markdown;

    // Code blocks first (to protect content from other processing)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Process blockquotes with multi-line support (including nested blockquotes)
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inBlockquote = false;
    let blockquoteContent: string[] = [];
    let isFirstLineInBlockquote = false;

    for (const line of lines) {
      // Check for blockquote markers (single or multiple levels)
      const blockquoteMatch = line.match(/^((?:&gt;|>)\s*)+/);

      if (blockquoteMatch) {
        const markers = blockquoteMatch[0];
        const content = line.substring(markers.length);

        // Skip the first H1 in a blockquote (it duplicates the section title)
        if (!inBlockquote) {
          isFirstLineInBlockquote = true;
          inBlockquote = true;
        }

        if (isFirstLineInBlockquote && content.trim().startsWith('# ')) {
          isFirstLineInBlockquote = false;
          continue; // Skip this line
        }

        isFirstLineInBlockquote = false;

        // Count nesting level and add appropriate markers
        const nestingLevel = (markers.match(/(&gt;|>)/g) || []).length;
        if (nestingLevel > 1) {
          // For nested blockquotes, preserve the inner markers
          blockquoteContent.push('> '.repeat(nestingLevel - 1) + content);
        } else {
          blockquoteContent.push(content);
        }
      } else {
        if (inBlockquote) {
          // Recursively process nested blockquotes
          let processedContent = blockquoteContent.join('\n');

          // Process nested blockquotes
          if (processedContent.includes('> ')) {
            const nestedLines = processedContent.split('\n');
            const nestedProcessed: string[] = [];
            let inNested = false;
            let nestedContent: string[] = [];

            for (const nestedLine of nestedLines) {
              if (nestedLine.startsWith('> ')) {
                nestedContent.push(nestedLine.substring(2));
                inNested = true;
              } else {
                if (inNested) {
                  nestedProcessed.push('<blockquote>' + nestedContent.join('\n') + '</blockquote>');
                  nestedContent = [];
                  inNested = false;
                }
                nestedProcessed.push(nestedLine);
              }
            }

            if (inNested) {
              nestedProcessed.push('<blockquote>' + nestedContent.join('\n') + '</blockquote>');
            }

            processedContent = nestedProcessed.join('\n');
          }

          processedLines.push('<blockquote>' + processedContent + '</blockquote>');
          blockquoteContent = [];
          inBlockquote = false;
          isFirstLineInBlockquote = false;
        }
        processedLines.push(line);
      }
    }

    if (inBlockquote) {
      let processedContent = blockquoteContent.join('\n');

      // Process nested blockquotes
      if (processedContent.includes('> ')) {
        const nestedLines = processedContent.split('\n');
        const nestedProcessed: string[] = [];
        let inNested = false;
        let nestedContent: string[] = [];

        for (const nestedLine of nestedLines) {
          if (nestedLine.startsWith('> ')) {
            nestedContent.push(nestedLine.substring(2));
            inNested = true;
          } else {
            if (inNested) {
              nestedProcessed.push('<blockquote>' + nestedContent.join('\n') + '</blockquote>');
              nestedContent = [];
              inNested = false;
            }
            nestedProcessed.push(nestedLine);
          }
        }

        if (inNested) {
          nestedProcessed.push('<blockquote>' + nestedContent.join('\n') + '</blockquote>');
        }

        processedContent = nestedProcessed.join('\n');
      }

      processedLines.push('<blockquote>' + processedContent + '</blockquote>');
    }

    html = processedLines.join('\n');

    // Process tables
    html = this.processTables(html);

    // Headers (from h5 to h1 to avoid conflicts)
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold (before italic to handle **)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Images with alt text and width
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\s+"([^"]+)"\)/g, '<img src="$2" alt="$1" title="$3">');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gim, '<li>$2</li>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>.*?<\/li>\n?)+/gs, '<ul>$&</ul>');

    // Line breaks and paragraphs
    html = html.replace(/\n\n+/g, '</p><p>');

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
      html = `<p>${html}</p>`;
    }

    // Clean up
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<table>)/g, '$1');
    html = html.replace(/(<\/table>)<\/p>/g, '$1');

    return html;
  }

  /**
   * Render chapter-specific extras
   */
  private renderChapterExtras(container: HTMLElement, chapter: ChapterSection): void {
    if (chapter.keyTakeaways && chapter.keyTakeaways.length > 0) {
      const takeaways = document.createElement('div');
      takeaways.className = 'key-takeaways';
      takeaways.style.cssText = `
        background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 2rem;
        border-left: 4px solid var(--green-accessible);
      `;

      const title = document.createElement('h3');
      title.textContent = '🎯 Key Takeaways';
      title.style.marginTop = '0';
      title.style.color = 'var(--green-accessible)';
      takeaways.appendChild(title);

      const list = document.createElement('ul');
      list.style.marginTop = '1rem';
      chapter.keyTakeaways.forEach(takeaway => {
        const item = document.createElement('li');
        item.textContent = takeaway;
        item.style.marginBottom = '0.5rem';
        list.appendChild(item);
      });
      takeaways.appendChild(list);

      container.appendChild(takeaways);
    }
  }

  /**
   * Scroll to a specific section
   */
  private scrollToSection(sectionId: string): void {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Setup scroll spy for active TOC highlighting
   */
  private setupScrollSpy(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace('section-', '');
            this.updateActiveTOC(sectionId);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1,
      }
    );

    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Update active TOC entry
   */
  private updateActiveTOC(sectionId: string): void {
    document.querySelectorAll('.toc-entry').forEach(entry => {
      entry.classList.remove('active');
    });

    const activeEntry = document.querySelector(`.toc-entry[data-section-id="${sectionId}"]`);
    if (activeEntry) {
      activeEntry.classList.add('active');

      // Scroll TOC to show active entry
      activeEntry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Update footer with reading time
   */
  private updateFooter(): void {
    const totalTime = getTotalReadingTime(this.article);
    const timeElement = document.getElementById('total-time');

    if (timeElement && totalTime > 0) {
      const hours = Math.floor(totalTime / 60);
      const minutes = totalTime % 60;

      let timeStr = '';
      if (hours > 0) {
        timeStr = `${hours}h ${minutes}min total reading time`;
      } else {
        timeStr = `${minutes}min total reading time`;
      }

      timeElement.textContent = timeStr;
    }
  }
}
