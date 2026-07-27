'use strict';

(function() {
  // Get comic ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const comicId = urlParams.get('id') || 'metalic';
  
  const comicTitleMap = {
    metalic: 'ميتاليك #1'
  };

  // DOM Elements
  const reader = document.getElementById('comic-reader');
  const readerStatus = document.getElementById('reader-status');
  const comicTitle = document.getElementById('comic-title');
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const modalClose = document.getElementById('modal-close');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  // State
  let loadedPages = new Set();
  let totalPages = 0;
  let loadedCount = 0;
  let isLoading = false;

  // Set page title
  const title = comicTitleMap[comicId] || comicId;
  comicTitle.textContent = title;
  document.title = `Magic-Comics | ${title}`;

  // Get last page from localStorage
  const lastPage = parseInt(localStorage.getItem(`magic-comics-${comicId}-last-page`) || '0', 10);

  /**
   * Open image modal
   */
  function openModal(src, alt) {
    modalImage.src = src;
    modalImage.alt = alt;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close image modal
   */
  function closeModal() {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modalImage.src = '';
    document.body.style.overflow = '';
  }

  /**
   * Create comic page element
   */
  function createPage(pageNumber) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'comic-page';
    pageDiv.dataset.page = String(pageNumber);

    // Skeleton loader
    const skeleton = document.createElement('div');
    skeleton.className = 'page-skeleton';

    // Image element
    const img = document.createElement('img');
    img.loading = pageNumber === 0 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.alt = pageNumber === 0 ? `${title} - الغلاف` : `${title} - صفحة ${pageNumber}`;
    img.src = `comics/${comicId}/${pageNumber}.jpg`;
    
    // Use higher quality image as source hint
    img.srcset = `comics/${comicId}/${pageNumber}.jpg 1x`;

    // Handle image load
    img.addEventListener('load', () => {
      pageDiv.classList.add('is-loaded');
      loadedCount++;
      loadedPages.add(pageNumber);
      updateStatus();
      saveProgress(pageNumber);
    });

    // Handle image error
    img.addEventListener('error', () => {
      if (pageNumber === 0) {
        readerStatus.textContent = '⚠️ تعذر تحميل الغلاف';
        readerStatus.style.color = '#ff6b6b';
      } else {
        pageDiv.remove();
      }
    });

    // Handle image click to zoom
    img.addEventListener('click', () => openModal(img.src, img.alt));

    pageDiv.appendChild(skeleton);
    pageDiv.appendChild(img);

    return pageDiv;
  }

  /**
   * Add page to reader
   */
  function addPage(pageNumber) {
    if (loadedPages.has(pageNumber) || document.querySelector(`[data-page="${pageNumber}"]`)) {
      return;
    }

    const pageEl = createPage(pageNumber);
    reader.appendChild(pageEl);
    loadedPages.add(pageNumber);
  }

  /**
   * Update status message
   */
  function updateStatus() {
    if (totalPages === 0) {
      readerStatus.textContent = `جارِ تحميل... ${loadedCount} صفحة`;
    } else if (loadedCount === totalPages) {
      readerStatus.textContent = `✅ اكتمل تحميل جميع الصفحات (${totalPages})`;
      readerStatus.style.color = '#51cf66';
    } else {
      readerStatus.textContent = `جارِ التحميل... ${loadedCount} من ${totalPages} صفحة`;
    }
  }

  /**
   * Save progress to localStorage
   */
  function saveProgress(pageNumber) {
    localStorage.setItem(`magic-comics-${comicId}-last-page`, String(pageNumber));
  }

  /**
   * Initialize comic reader - Fast loading
   */
  function initReader() {
    readerStatus.textContent = 'جارِ تجهيز الصفحات...';
    
    // Load first page immediately for fast initial display
    addPage(0);

    // Fast preload next 8 pages in parallel
    const preloadBatch = [1, 2, 3, 4, 5, 6, 7, 8];
    preloadBatch.forEach(pageNum => {
      setTimeout(() => {
        addPage(pageNum);
      }, pageNum * 20); // Stagger slightly to avoid overwhelming the browser
    });

    // Use setTimeout to detect when pages stop loading (no more images found)
    setTimeout(() => {
      detectTotalPages();
    }, 500);

    // Load more pages as user scrolls
    setupInfiniteScroll();
  }

  /**
   * Detect total number of pages
   */
  function detectTotalPages() {
    const pages = Array.from(document.querySelectorAll('.comic-page'));
    let foundEnd = false;

    for (let i = 0; i < pages.length; i++) {
      const img = pages[i].querySelector('img');
      if (img && img.complete && img.naturalWidth === 0) {
        totalPages = i;
        foundEnd = true;
        break;
      }
    }

    if (!foundEnd && pages.length > 0) {
      totalPages = pages.length + 10; // Estimate
    }

    updateStatus();
  }

  /**
   * Setup infinite scroll for loading more pages
   */
  function setupInfiniteScroll() {
    let lastLoadedPage = 8;
    const scrollThreshold = 1500; // Load 2 pages before reaching bottom

    window.addEventListener('scroll', () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.body.offsetHeight;

      if (scrollPosition >= pageHeight - scrollThreshold) {
        // Load next batch
        for (let i = 0; i < 3; i++) {
          const nextPage = lastLoadedPage + i + 1;
          addPage(nextPage);
          lastLoadedPage = nextPage;
        }
      }
    }, { passive: true });
  }

  /**
   * Scroll to top button
   */
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  /**
   * Modal controls
   */
  modalClose.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  /**
   * Mobile menu toggle
   */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('show');
    });

    // Close menu when link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /**
   * Scroll to last read page
   */
  function scrollToLastPage() {
    if (lastPage > 0) {
      setTimeout(() => {
        const pageEl = document.querySelector(`[data-page="${lastPage}"]`);
        if (pageEl) {
          pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
    }
  }

  // Start the reader
  initReader();
  scrollToLastPage();

})();
