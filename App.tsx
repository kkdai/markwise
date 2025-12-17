import React, { useState, useEffect } from 'react';
import { Bookmark, ViewMode } from './types';
import { getBookmarks, saveBookmark, deleteBookmark } from './services/storageService';
import BookmarkCard from './components/BookmarkCard';
import AddBookmarkModal from './components/AddBookmarkModal';
import BookmarkDetail from './components/BookmarkDetail';
import { Plus, Grid, List, Search, BookMarked, Github, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load bookmarks on mount
  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleSaveBookmark = (newBookmark: Bookmark) => {
    saveBookmark(newBookmark);
    setBookmarks(getBookmarks()); // Refresh list
  };

  const handleDeleteBookmark = (id: string) => {
    deleteBookmark(id);
    setBookmarks(getBookmarks()); // Refresh list
    setSelectedBookmark(null);
  };

  const filteredBookmarks = bookmarks.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.ai_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.ai_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BookMarked className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">
              Markwise
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search bookmarks, AI summaries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent border-2 focus:bg-white focus:border-blue-500 rounded-full outline-none transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Github size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
              <Settings size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-gray-900/20"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add URL</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
             <h2 className="text-2xl font-bold text-gray-900">Library</h2>
             <p className="text-gray-500 text-sm mt-1">{filteredBookmarks.length} bookmarks saved</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
            <button 
              onClick={() => setViewMode(ViewMode.GRID)}
              className={`p-2 rounded-md transition-all ${viewMode === ViewMode.GRID ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.LIST)}
              className={`p-2 rounded-md transition-all ${viewMode === ViewMode.LIST ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Search (visible only on small screens) */}
        <div className="mb-6 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
        </div>

        {/* Bookmark Grid/List */}
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-3xl">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <BookMarked className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No bookmarks found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first URL to summarize.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-blue-600 font-medium hover:underline"
            >
              Add a new bookmark
            </button>
          </div>
        ) : (
          <div className={
            viewMode === ViewMode.GRID 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col space-y-2"
          }>
            {filteredBookmarks.map(bookmark => (
              <BookmarkCard 
                key={bookmark.id} 
                bookmark={bookmark} 
                viewMode={viewMode}
                onClick={setSelectedBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddBookmarkModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveBookmark}
      />
      
      {selectedBookmark && (
        <BookmarkDetail 
          bookmark={selectedBookmark} 
          onClose={() => setSelectedBookmark(null)}
          onDelete={handleDeleteBookmark}
        />
      )}

    </div>
  );
};

export default App;