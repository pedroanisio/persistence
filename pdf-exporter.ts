import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ArticleData } from './article/index';

export class PDFExporter {
  private article: ArticleData;

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
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.text(this.article.title, margin, margin + 10);

      if (this.article.metadata.subtitle) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(this.article.metadata.subtitle, margin, margin + 20);
      }

      const authors = this.article.metadata.authors
        .map(a => a.name)
        .join(', ');
      pdf.setFontSize(10);
      pdf.text(`By: ${authors}`, margin, margin + 30);
      pdf.text(`Version: ${this.article.metadata.version}`, margin, margin + 36);

      let currentY = margin + 50;

      const mainContent = document.getElementById('article-sections');
      if (!mainContent) {
        throw new Error('Article content not found');
      }

      const sections = mainContent.querySelectorAll('.section');

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;

        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: section.scrollWidth,
          height: section.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let remainingHeight = imgHeight;
        let sourceY = 0;

        while (remainingHeight > 0) {
          const availableHeight = pageHeight - currentY - margin;

          if (remainingHeight <= availableHeight) {
            pdf.addImage(
              imgData,
              'PNG',
              margin,
              currentY,
              imgWidth,
              remainingHeight,
              undefined,
              'FAST',
              0,
              -sourceY
            );
            currentY += remainingHeight;
            remainingHeight = 0;
          } else {
            pdf.addImage(
              imgData,
              'PNG',
              margin,
              currentY,
              imgWidth,
              availableHeight,
              undefined,
              'FAST',
              0,
              -sourceY
            );

            sourceY += availableHeight;
            remainingHeight -= availableHeight;
            pdf.addPage();
            currentY = margin;
          }
        }

        currentY += 10;
      }

      const fileName = `${this.article.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      pdf.save(fileName);

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
}
