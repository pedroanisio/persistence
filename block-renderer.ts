import DOMPurify from 'dompurify';
import { marked } from 'marked';
import {
  ContentBlock,
  TextBlock,
  ListBlock,
  TableBlock,
  MediaBlock,
  CodeBlock,
  MathBlock,
  ContainerBlock,
  GridBlock,
  SeparatorBlock,
  ReferenceBlock,
  InteractiveBlock,
  BlockStyle,
  isTextBlock,
  isListBlock,
  isTableBlock,
  isMediaBlock,
  isCodeBlock,
  isMathBlock,
  isContainerBlock,
  isGridBlock,
  isSeparatorBlock,
  isReferenceBlock,
  isInteractiveBlock
} from './article';

export class BlockRenderer {
  private applyBlockStyle(element: HTMLElement, style?: BlockStyle): void {
    if (!style) return;

    if (style.typography) {
      const t = style.typography;
      if (t.fontFamily) element.style.fontFamily = t.fontFamily;
      if (t.fontSize) element.style.fontSize = t.fontSize;
      if (t.fontWeight) element.style.fontWeight = String(t.fontWeight);
      if (t.lineHeight) element.style.lineHeight = String(t.lineHeight);
      if (t.letterSpacing) element.style.letterSpacing = t.letterSpacing;
      if (t.textTransform) element.style.textTransform = t.textTransform;
      if (t.color) element.style.color = t.color;
      if (t.textAlign) element.style.textAlign = t.textAlign;
      if (t.margin) element.style.margin = t.margin;
      if (t.padding) element.style.padding = t.padding;
    }

    if (style.visual) {
      const v = style.visual;
      if (v.background) element.style.background = v.background;
      if (v.border) element.style.border = v.border;
      if (v.borderRadius) element.style.borderRadius = v.borderRadius;
      if (v.boxShadow) element.style.boxShadow = v.boxShadow;
      if (v.width) element.style.width = v.width;
      if (v.maxWidth) element.style.maxWidth = v.maxWidth;
      if (v.className) element.className = v.className;
      if (v.borderTop) element.style.borderTop = v.borderTop;
      if (v.borderBottom) element.style.borderBottom = v.borderBottom;
      if (v.borderLeft) element.style.borderLeft = v.borderLeft;
      if (v.borderRight) element.style.borderRight = v.borderRight;
      if (v.customCSS) {
        Object.entries(v.customCSS).forEach(([key, value]) => {
          element.style.setProperty(key, value);
        });
      }
    }
  }

  private renderTextBlock(block: TextBlock): HTMLElement {
    let element: HTMLElement;

    if (block.variant === 'heading' && block.level) {
      element = document.createElement(`h${block.level}`);
    } else if (block.variant === 'quote') {
      element = document.createElement('blockquote');
    } else if (block.variant === 'caption') {
      element = document.createElement('figcaption');
    } else {
      element = document.createElement('p');
    }

    const html = marked.parse(block.content) as string;
    element.innerHTML = DOMPurify.sanitize(html);

    if (block.dropCap) {
      element.classList.add('drop-cap');
      element.style.cssText += `
        &::first-letter {
          float: left;
          font-size: 3.5em;
          line-height: 0.9;
          margin: 0.1em 0.1em 0 0;
          font-weight: bold;
        }
      `;
    }

    this.applyBlockStyle(element, block.style);
    return element;
  }

  private renderListBlock(block: ListBlock): HTMLElement {
    let element: HTMLElement;

    if (block.variant === 'definition') {
      element = document.createElement('dl');
      block.items.forEach(item => {
        const dt = document.createElement('dt');
        dt.textContent = item.term || '';
        element.appendChild(dt);

        const dd = document.createElement('dd');
        const html = marked.parse(item.content) as string;
        dd.innerHTML = DOMPurify.sanitize(html);
        if (item.style) this.applyBlockStyle(dd, item.style);
        element.appendChild(dd);
      });
    } else {
      element = document.createElement(block.variant === 'ordered' ? 'ol' : 'ul');
      if (block.startNumber) {
        (element as HTMLOListElement).start = block.startNumber;
      }
      block.items.forEach(item => {
        const li = document.createElement('li');
        const html = marked.parse(item.content) as string;
        li.innerHTML = DOMPurify.sanitize(html);
        if (item.style) this.applyBlockStyle(li, item.style);
        element.appendChild(li);
      });
    }

    this.applyBlockStyle(element, block.style);
    return element;
  }

  private renderTableBlock(block: TableBlock): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    block.headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header.label;
      if (header.width) th.style.width = header.width;
      if (header.align) th.style.textAlign = header.align;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    block.rows.forEach((row, index) => {
      const tr = document.createElement('tr');
      if (block.striped && index % 2 === 1) {
        tr.style.backgroundColor = 'var(--gray-50)';
      }
      block.headers.forEach(header => {
        const td = document.createElement('td');
        const value = row[header.key];
        td.textContent = String(value);
        if (header.align) td.style.textAlign = header.align;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    wrapper.appendChild(table);

    if (block.caption) {
      const caption = document.createElement('caption');
      caption.textContent = block.caption;
      table.insertBefore(caption, table.firstChild);
    }

    this.applyBlockStyle(wrapper, block.style);
    return wrapper;
  }

  private renderMediaBlock(block: MediaBlock): HTMLElement {
    const figure = document.createElement('figure');

    let mediaElement: HTMLElement;
    if (block.variant === 'video') {
      const video = document.createElement('video');
      video.src = block.src;
      video.controls = true;
      if (block.width) video.style.width = block.width;
      if (block.height) video.style.height = block.height;
      mediaElement = video;
    } else {
      const img = document.createElement('img');
      img.src = block.src;
      img.alt = block.alt || '';
      if (block.width) img.style.width = block.width;
      if (block.height) img.style.height = block.height;
      mediaElement = img;
    }

    figure.appendChild(mediaElement);

    if (block.caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = block.caption;
      figure.appendChild(figcaption);
    }

    this.applyBlockStyle(figure, block.style);
    return figure;
  }

  private renderCodeBlock(block: CodeBlock): HTMLElement {
    const pre = document.createElement('pre');
    const code = document.createElement('code');

    if (block.language) {
      code.className = `language-${block.language}`;
    }

    code.textContent = block.content;
    pre.appendChild(code);

    if (block.filename) {
      const filename = document.createElement('div');
      filename.className = 'code-filename';
      filename.textContent = block.filename;
      filename.style.cssText = 'padding: 0.5rem 1rem; background: var(--gray-700); color: white; font-size: 0.875rem;';

      const wrapper = document.createElement('div');
      wrapper.appendChild(filename);
      wrapper.appendChild(pre);
      this.applyBlockStyle(wrapper, block.style);
      return wrapper;
    }

    this.applyBlockStyle(pre, block.style);
    return pre;
  }

  private renderMathBlock(block: MathBlock): HTMLElement {
    const element = document.createElement('div');
    element.className = 'math-block';
    element.textContent = block.content;
    element.setAttribute('data-math', block.displayMode ? 'display' : 'inline');

    this.applyBlockStyle(element, block.style);
    return element;
  }

  private renderContainerBlock(block: ContainerBlock): HTMLElement {
    const container = document.createElement('div');
    container.className = `container-${block.variant}`;

    if (block.title) {
      const title = document.createElement('div');
      title.className = 'container-title';
      if (block.icon) {
        title.textContent = `${block.icon} ${block.title}`;
      } else {
        title.textContent = block.title;
      }
      container.appendChild(title);
    }

    const content = document.createElement('div');
    content.className = 'container-content';

    if (block.collapsible && !block.defaultExpanded) {
      content.style.display = 'none';
    }

    block.blocks.forEach(childBlock => {
      const rendered = this.renderBlock(childBlock);
      content.appendChild(rendered);
    });

    container.appendChild(content);

    if (block.collapsible && block.title) {
      const titleElement = container.querySelector('.container-title');
      if (titleElement) {
        titleElement.classList.add('collapsible');
        (titleElement as HTMLElement).style.cursor = 'pointer';
        titleElement.addEventListener('click', () => {
          content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
      }
    }

    this.applyBlockStyle(container, block.style);
    return container;
  }

  private renderGridBlock(block: GridBlock): HTMLElement {
    const grid = document.createElement('div');
    grid.className = 'grid-block';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = `repeat(${block.columns}, 1fr)`;
    if (block.gap) grid.style.gap = block.gap;

    block.blocks.forEach(childBlock => {
      const rendered = this.renderBlock(childBlock);
      grid.appendChild(rendered);
    });

    this.applyBlockStyle(grid, block.style);
    return grid;
  }

  private renderSeparatorBlock(block: SeparatorBlock): HTMLElement {
    const separator = document.createElement('div');
    separator.className = `separator-${block.variant}`;

    if (block.variant === 'line') {
      separator.style.borderTop = block.thickness || '1px solid var(--border-color)';
      separator.style.margin = '2rem 0';
    } else if (block.variant === 'space') {
      separator.style.height = block.thickness || '2rem';
    } else if (block.variant === 'dots') {
      separator.textContent = '• • •';
      separator.style.textAlign = 'center';
      separator.style.margin = '2rem 0';
      separator.style.color = 'var(--gray-400)';
    }

    this.applyBlockStyle(separator, block.style);
    return separator;
  }

  private renderReferenceBlock(block: ReferenceBlock): HTMLElement {
    const element = document.createElement('span');
    element.className = `reference-${block.variant}`;

    if (block.variant === 'citation' || block.variant === 'footnote') {
      element.textContent = `[${block.number || '?'}]`;
      if (block.target) {
        const link = document.createElement('a');
        link.href = `#${block.target}`;
        link.textContent = element.textContent;
        element.textContent = '';
        element.appendChild(link);
      }
    } else if (block.variant === 'link') {
      const link = document.createElement('a');
      link.href = block.target || '#';
      link.textContent = block.content;
      element.appendChild(link);
    }

    this.applyBlockStyle(element, block.style);
    return element;
  }

  private renderInteractiveBlock(block: InteractiveBlock): HTMLElement {
    const element = document.createElement('div');
    element.className = `interactive-${block.variant}`;
    element.textContent = `[Interactive: ${block.variant}]`;
    element.setAttribute('data-interactive', JSON.stringify(block.data));

    this.applyBlockStyle(element, block.style);
    return element;
  }

  public renderBlock(block: ContentBlock): HTMLElement {
    if (isTextBlock(block)) return this.renderTextBlock(block);
    if (isListBlock(block)) return this.renderListBlock(block);
    if (isTableBlock(block)) return this.renderTableBlock(block);
    if (isMediaBlock(block)) return this.renderMediaBlock(block);
    if (isCodeBlock(block)) return this.renderCodeBlock(block);
    if (isMathBlock(block)) return this.renderMathBlock(block);
    if (isContainerBlock(block)) return this.renderContainerBlock(block);
    if (isGridBlock(block)) return this.renderGridBlock(block);
    if (isSeparatorBlock(block)) return this.renderSeparatorBlock(block);
    if (isReferenceBlock(block)) return this.renderReferenceBlock(block);
    if (isInteractiveBlock(block)) return this.renderInteractiveBlock(block);

    const fallback = document.createElement('div');
    fallback.textContent = '[Unknown block type]';
    return fallback;
  }

  public renderBlocks(blocks: readonly ContentBlock[]): DocumentFragment {
    const fragment = document.createDocumentFragment();
    blocks.forEach(block => {
      const element = this.renderBlock(block);
      fragment.appendChild(element);
    });
    return fragment;
  }
}
