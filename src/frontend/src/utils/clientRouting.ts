/**
 * Client-side routing utilities for URL-synced navigation
 */

export type PageType = 'home' | 'join' | 'network' | 'dashboard' | 'admin' | 'calculator' | 'about';

const PAGE_PATHS: Record<PageType, string> = {
  home: '/',
  join: '/join',
  network: '/network',
  dashboard: '/dashboard',
  admin: '/admin',
  calculator: '/calculator',
  about: '/about',
};

const PATH_TO_PAGE: Record<string, PageType> = {
  '/': 'home',
  '/join': 'join',
  '/network': 'network',
  '/dashboard': 'dashboard',
  '/admin': 'admin',
  '/calculator': 'calculator',
  '/about': 'about',
};

/**
 * Get the page type from a URL pathname
 */
export function getPageFromPath(pathname: string): PageType {
  return PATH_TO_PAGE[pathname] || 'home';
}

/**
 * Get the URL path for a page type
 */
export function getPathFromPage(page: PageType): string {
  return PAGE_PATHS[page];
}

/**
 * Navigate to a page and update the browser URL
 */
export function navigateToPage(page: PageType, onNavigate: (page: PageType) => void): void {
  const path = getPathFromPage(page);
  
  // Update browser URL without reload
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  
  // Update app state
  onNavigate(page);
}

/**
 * Set up popstate listener for browser back/forward navigation
 */
export function setupPopstateListener(onNavigate: (page: PageType) => void): () => void {
  const handlePopstate = () => {
    const page = getPageFromPath(window.location.pathname);
    onNavigate(page);
  };

  window.addEventListener('popstate', handlePopstate);

  // Return cleanup function
  return () => {
    window.removeEventListener('popstate', handlePopstate);
  };
}
