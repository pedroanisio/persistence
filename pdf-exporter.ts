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

        if (currentY > pageHeight - margin - 20) {
          pdf.addPage();
          currentY = margin;
        }

        const canvas = await html2canvas(section, {
          scale: 1,
          useCORS: true,
          logging: false,
          width: section.scrollWidth,
          height: section.scrollHeight,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.85);
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (currentY + imgHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        if (imgHeight > pageHeight - (margin * 2)) {
          const numPages = Math.ceil(imgHeight / (pageHeight - (margin * 2)));
          const sliceHeight = canvas.height / numPages;

          for (let j = 0; j < numPages; j++) {
            if (j > 0) {
              pdf.addPage();
              currentY = margin;
            }

            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = sliceHeight;
            const ctx = sliceCanvas.getContext('2d');

            if (ctx) {
              ctx.drawImage(
                canvas,
                0, j * sliceHeight,
                canvas.width, sliceHeight,
                0, 0,
                canvas.width, sliceHeight
              );

              const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.85);
              const sliceImgHeight = (sliceHeight * imgWidth) / canvas.width;

              pdf.addImage(
                sliceData,
                'JPEG',
                margin,
                currentY,
                imgWidth,
                sliceImgHeight,
                undefined,
                'FAST'
              );

              currentY = margin;
            }
          }
        } else {
          pdf.addImage(
            imgData,
            'JPEG',
            margin,
            currentY,
            imgWidth,
            imgHeight,
            undefined,
            'FAST'
          );
          currentY += imgHeight + 10;
        }
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
