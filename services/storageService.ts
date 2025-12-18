
import { Bookmark } from "../types";

const STORAGE_KEY = 'markwise_bookmarks';

// Mock initial data
const MOCK_DATA: Bookmark[] = [
  {
    id: '1',
    url: 'https://react.dev',
    title: 'React - The Library for Web and Native User Interfaces',
    description: 'The official documentation for React.',
    ai_summary: 'React 是一個用於構建使用者介面的 JavaScript 庫。它允許開發者透過組件化的方式建立複雜的 UI，並提供了宣告式的語法，讓程式碼更易於理解和除錯。React 還支援跨平台開發，可用於 Web 和原生應用程式。',
    ai_key_points: ['組件化架構', '宣告式語法', '跨平台支援'],
    ai_category: 'Technology',
    // Added missing ai_tags property to satisfy Bookmark interface
    ai_tags: ['React', 'JavaScript', 'Frontend'],
    is_public: true,
    is_archived: false,
    is_favorite: true,
    created_at: new Date(Date.now() - 10000000).toISOString(),
    favicon: 'https://react.dev/favicon.ico'
  },
  {
    id: '2',
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML.',
    description: 'A utility-first CSS framework packed with classes.',
    ai_summary: 'Tailwind CSS 是一個功能優先的 CSS 框架，它提供了大量的 utility class，讓開發者可以直接在 HTML 中快速構建現代化的網站設計。它不需要離開 HTML 檔案即可完成樣式設定，極大地提高了開發效率。',
    ai_key_points: ['Utility-first', '高度可客製化', '響應式設計'],
    ai_category: 'Design',
    // Added missing ai_tags property to satisfy Bookmark interface
    ai_tags: ['CSS', 'Tailwind', 'Design'],
    is_public: true,
    is_archived: false,
    is_favorite: false,
    created_at: new Date(Date.now() - 5000000).toISOString(),
    favicon: 'https://tailwindcss.com/favicons/favicon.ico'
  }
];

export const getBookmarks = (): Bookmark[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Save mock data initially
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
  return JSON.parse(data);
};

export const saveBookmark = (bookmark: Bookmark): void => {
  const bookmarks = getBookmarks();
  const newBookmarks = [bookmark, ...bookmarks];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
};

export const updateBookmark = (updatedBookmark: Bookmark): void => {
  const bookmarks = getBookmarks();
  const newBookmarks = bookmarks.map(b => b.id === updatedBookmark.id ? updatedBookmark : b);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
};

export const deleteBookmark = (id: string): void => {
  const bookmarks = getBookmarks();
  const newBookmarks = bookmarks.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
};
