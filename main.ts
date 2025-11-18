import type { ArticleData } from './article/index';
import { validateArticleData } from './article/index';
import { ArticleRenderer } from './renderer';
import { PDFExporter } from './pdf-exporter';

/**
 * Main application entry point
 */
class App {
  private article: ArticleData | null = null;

  async init(): Promise<void> {
    try {
      // Show loading state
      this.showLoading(true);

      // Load article data
      this.article = await this.loadArticle();

      // Validate article data
      validateArticleData(this.article);

      console.log('✅ Article loaded and validated successfully');
      console.log(`📚 ${this.article.sections.length} sections loaded`);
      console.log(`📖 Title: ${this.article.title}`);

      // Hide loading and show content
      this.showLoading(false);
      this.showContent(true);

      // Initialize renderer
      this.renderArticle();

      // Setup navigation toggle
      this.setupNavigation();

      // Setup PDF export
      this.setupPDFExport();

    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.showError(error);
    }
  }

  /**
   * Load article JSON data
   */
  private async loadArticle(): Promise<ArticleData> {
    try {
      const response = await fetch('/article-v2.json');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ArticleData;

    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Failed to fetch article-v2.json. Make sure the development server is running.');
      }
      throw new Error(`Failed to load article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Render the article using ArticleRenderer
   */
  private renderArticle(): void {
    if (!this.article) {
      throw new Error('Article data not loaded');
    }

    const mainContent = document.getElementById('article-sections');
    const tocContainer = document.getElementById('toc');
    const headerContainer = document.getElementById('article-header');

    if (!mainContent || !tocContainer || !headerContainer) {
      throw new Error('Required DOM elements not found');
    }

    const renderer = new ArticleRenderer(
      this.article,
      mainContent,
      tocContainer,
      headerContainer
    );

    renderer.render();
    console.log('✅ Article rendered successfully');
  }

  /**
   * Setup navigation toggle and interactions
   */
  private setupNavigation(): void {
    const toggleBtn = document.getElementById('toggle-nav');
    const nav = document.getElementById('navigation');

    if (toggleBtn && nav) {
      toggleBtn.addEventListener('click', () => {
        nav.classList.toggle('collapsed');

        // Store preference in localStorage
        const isCollapsed = nav.classList.contains('collapsed');
        localStorage.setItem('nav-collapsed', isCollapsed.toString());
      });

      // Restore previous state
      const wasCollapsed = localStorage.getItem('nav-collapsed') === 'true';
      if (wasCollapsed) {
        nav.classList.add('collapsed');
      }
    }

    // Close nav on mobile when clicking a link
    if (window.innerWidth <= 1024) {
      document.querySelectorAll('.toc-entry').forEach(entry => {
        entry.addEventListener('click', () => {
          nav?.classList.add('collapsed');
        });
      });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && nav) {
        nav.classList.remove('open');
      }
    });
  }

  /**
   * Show/hide loading state
   */
  private showLoading(show: boolean): void {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Show/hide content
   */
  private showContent(show: boolean): void {
    const navigation = document.getElementById('navigation');
    const mainContent = document.getElementById('main-content');
    const exportBtn = document.getElementById('export-pdf-btn');

    if (navigation) {
      navigation.style.display = show ? 'block' : 'none';
    }
    if (mainContent) {
      mainContent.style.display = show ? 'block' : 'none';
    }
    if (exportBtn) {
      exportBtn.style.display = show ? 'block' : 'none';
    }
  }

  /**
   * Show error state
   */
  private showError(error: unknown): void {
    this.showLoading(false);
    this.showContent(false);

    const errorContainer = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');

    if (errorContainer && errorMessage) {
      errorContainer.style.display = 'block';

      let message = 'An unknown error occurred';
      if (error instanceof Error) {
        message = error.message;
      }

      errorMessage.textContent = message;
    }
  }

  private setupPDFExport(): void {
    const exportBtn = document.getElementById('export-pdf-btn');

    if (exportBtn && this.article) {
      const pdfExporter = new PDFExporter(this.article);

      exportBtn.addEventListener('click', () => {
        pdfExporter.exportToPDF();
      });
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Article Renderer');
  const app = new App();
  app.init();
});
