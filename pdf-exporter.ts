import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { ArticleData } from './article/index';

export class PDFExporter {
  private article: ArticleData;
  private pdf!: jsPDF;
  private pageWidth!: number;
  private pageHeight!: number;
  private margin = 20;
  private currentY = 20;

  constructor(article: ArticleData) {
    this.article = article;
  }

  async exportToPDF(): Promise<void> {
    const exportButton = document.getElementById('export-pdf-btn');

    if (exportButton) {
      exportButton.textContent = 'Generating PDF...';
      (exportButton as HTMLButtonElement).disabled = true;
    }

    try {
      this.pdf = new jsPDF('p', 'mm', 'a4');
      this.pageWidth = this.pdf.internal.pageSize.getWidth();
      this.pageHeight = this.pdf.internal.pageSize.getHeight();

      // Title page
      this.addTitle();
      this.addMetadata();

      this.pdf.addPage();
      this.currentY = this.margin;

      // Render sections
      const mainContent = document.getElementById('article-sections');
      if (!mainContent) {
        throw new Error('Article content not found');
      }

      const sections = mainContent.querySelectorAll('.section');
      for (let i = 0; i < sections.length; i++) {
        await this.addSection(sections[i] as HTMLElement);
      }

      const fileName = `${this.article.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      this.pdf.save(fileName);

      console.log('✅ PDF generated successfully');

    } catch (error) {
      console.error('❌ Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      if (exportButton) {
        exportButton.textContent = 'Export as PDF';
        (exportButton as HTMLButtonElement).disabled = false;
      }
    }
  }

  private addTitle(): void {
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(24);
    this.pdf.text(this.article.title, this.margin, 30, { maxWidth: this.pageWidth - (this.margin * 2) });
  }

  private addMetadata(): void {
    let y = 50;

    if (this.article.metadata.subtitle) {
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'italic');
      this.pdf.text(this.article.metadata.subtitle, this.margin, y, { maxWidth: this.pageWidth - (this.margin * 2) });
      y += 15;
    }

    const authors = this.article.metadata.authors.map(a => a.name).join(', ');
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`By: ${authors}`, this.margin, y);
    y += 7;
    this.pdf.text(`Version: ${this.article.metadata.version || '1.0'}`, this.margin, y);
  }

  private async addSection(section: HTMLElement): Promise<void> {
    // Section title
    const titleEl = section.querySelector('.section-title');
    if (titleEl) {
      this.checkPageBreak(20);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(16);
      this.pdf.text(titleEl.textContent || '', this.margin, this.currentY);
      this.currentY += 10;
    }

    // Section content
    const contentEl = section.querySelector('.section-content');
    if (contentEl) {
      await this.addContent(contentEl as HTMLElement);
    }

    this.currentY += 10;
  }

  private async addContent(element: HTMLElement): Promise<void> {
    const children = Array.from(element.children);

    for (const child of children) {
      const tagName = child.tagName.toLowerCase();

      if (tagName === 'p') {
        this.addParagraph(child.textContent || '');
      } else if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
        this.addHeading(child.textContent || '', tagName);
      } else if (tagName === 'ul' || tagName === 'ol') {
        this.addList(child as HTMLElement, tagName === 'ol');
      } else if (tagName === 'blockquote') {
        this.addBlockquote(child.textContent || '');
      } else if (tagName === 'pre' || tagName === 'code') {
        this.addCode(child.textContent || '');
      } else if (tagName === 'table') {
        this.addTable(child as HTMLTableElement);
      } else if (child.children.length > 0) {
        await this.addContent(child as HTMLElement);
      }
    }
  }

  private addParagraph(text: string): void {
    if (!text.trim()) return;

    this.checkPageBreak(15);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(11);

    const lines = this.pdf.splitTextToSize(text, this.pageWidth - (this.margin * 2));
    this.pdf.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 5 + 3;
  }

  private addHeading(text: string, level: string): void {
    this.checkPageBreak(15);
    this.pdf.setFont('helvetica', 'bold');

    const fontSize = level === 'h1' ? 16 : level === 'h2' ? 14 : 12;
    this.pdf.setFontSize(fontSize);

    this.pdf.text(text, this.margin, this.currentY);
    this.currentY += fontSize * 0.5 + 5;
  }

  private addList(listEl: HTMLElement, ordered: boolean): void {
    const items = listEl.querySelectorAll('li');
    items.forEach((item, index) => {
      this.checkPageBreak(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(11);

      const bullet = ordered ? `${index + 1}.` : '•';
      const text = `${bullet} ${item.textContent || ''}`;
      const lines = this.pdf.splitTextToSize(text, this.pageWidth - (this.margin * 2) - 5);

      this.pdf.text(lines, this.margin + 5, this.currentY);
      this.currentY += lines.length * 5;
    });
    this.currentY += 3;
  }

  private addBlockquote(text: string): void {
    this.checkPageBreak(15);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(100, 100, 100);

    const lines = this.pdf.splitTextToSize(text, this.pageWidth - (this.margin * 2) - 10);
    this.pdf.text(lines, this.margin + 10, this.currentY);
    this.currentY += lines.length * 5 + 5;

    this.pdf.setTextColor(0, 0, 0);
  }

  private addCode(text: string): void {
    this.checkPageBreak(20);
    this.pdf.setFont('courier', 'normal');
    this.pdf.setFontSize(9);
    this.pdf.setFillColor(245, 245, 245);

    const lines = text.split('\n');
    const boxHeight = lines.length * 4 + 4;

    this.pdf.rect(this.margin, this.currentY - 2, this.pageWidth - (this.margin * 2), boxHeight, 'F');
    this.pdf.text(text, this.margin + 2, this.currentY + 2);
    this.currentY += boxHeight + 3;
  }

  private addTable(table: HTMLTableElement): void {
    const headers: string[] = [];
    const rows: string[][] = [];

    // Extract headers
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(cell => headers.push(cell.textContent || ''));

    // Extract rows
    const bodyRows = table.querySelectorAll('tr');
    bodyRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        const rowData: string[] = [];
        cells.forEach(cell => rowData.push(cell.textContent || ''));
        rows.push(rowData);
      }
    });

    this.checkPageBreak(20);

    // Use autoTable if available (requires jspdf-autotable)
    (this.pdf as any).autoTable({
      head: headers.length > 0 ? [headers] : undefined,
      body: rows,
      startY: this.currentY,
      margin: { left: this.margin, right: this.margin },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] }
    });

    this.currentY = (this.pdf as any).lastAutoTable.finalY + 5;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }
}
