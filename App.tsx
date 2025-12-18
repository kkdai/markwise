import React, { useState, useEffect, useMemo } from 'react';
import { Bookmark, ViewMode } from './types';
import { getBookmarks, saveBookmark, deleteBookmark } from './services/storageService';
import BookmarkCard from './components/BookmarkCard';
import AddBookmarkModal from './components/AddBookmarkModal';
import BookmarkDetail from './components/BookmarkDetail';
import EmbedCodeModal from './components/EmbedCodeModal';
import { 
  Plus, Grid, List, Search, BookMarked, Github, Settings, 
  Share2, Clock, Layers, Hash, ChevronRight, Bookmark as BookmarkIcon,
  Filter, X
} from 'lucide-react';

const App: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  const [activeTab, setActiveTab] = useState<'all' | 'today'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isEmbedMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';

  useEffect(() => {
    setBookmarks(getBookmarks());
    if (isEmbedMode) setViewMode(ViewMode.LIST);
  }, [isEmbedMode]);

  const handleSaveBookmark = (newBookmark: Bookmark) => {
    saveBookmark(newBookmark);
    setBookmarks(getBookmarks());
  };

  const handleDeleteBookmark = (id: string) => {
    deleteBookmark(id);
    setBookmarks(getBookmarks());
    setSelectedBookmark(null);
  };

  // Extract all unique categories and tags for sidebar
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    bookmarks.forEach(b => {
      if (b.ai_category) counts[b.ai_category] = (counts[b.ai_category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [bookmarks]);

  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    bookmarks.forEach(b => {
      (b.ai_tags || []).forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;

    if (activeTab === 'today') {
      const todayStr = new Date().toDateString();
      filtered = filtered.filter(b => new Date(b.created_at).toDateString() === todayStr);
    }

    if (selectedCategory) {
      filtered = filtered.filter(b => b.ai_category === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter(b => (b.ai_tags || []).includes(selectedTag));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.ai_summary.toLowerCase().includes(q) ||
        (b.ai_tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [bookmarks, activeTab, selectedCategory, selectedTag, searchQuery]);

  const clearFilters = () => {
    setSelectedTag(null);
    setSelectedCategory(null);
    setActiveTab('all');
  };

  if (isEmbedMode) {
    return (
      <div className="min-h-screen bg-transparent p-4 font-sans">
        <div className="flex items-center justify-between mb-4 bg-white/80 backdrop-blur rounded-lg p-3 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded-md">
              <BookMarked className="text-white w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold text-gray-800">Markwise Collection</h1>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
           {filteredBookmarks.map(bookmark => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} viewMode={ViewMode.LIST} onClick={() => {}} />
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* Navigation */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={clearFilters}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BookMarked className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight hidden sm:block">Markwise</h1>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search your knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsEmbedModalOpen(true)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Embed">
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Add URL</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="w-64 hidden lg:flex flex-col p-6 space-y-8 border-r border-gray-100 bg-white/50">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Layers size={14} /> Views
            </h3>
            <nav className="space-y-1">
              <button 
                onClick={() => {setActiveTab('all'); setSelectedCategory(null); setSelectedTag(null);}}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'all' && !selectedCategory && !selectedTag ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-2">
                  <BookmarkIcon size={16} /> All Bookmarks
                </div>
                <span className="text-xs opacity-50">{bookmarks.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('today')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'today' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Clock size={16} /> New Today
              </button>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
               <div className="flex items-center gap-2"><Filter size={14} /> Categories</div>
            </h3>
            <div className="space-y-1">
              {categories.map(([cat, count]) => (
                <button 
                  key={cat}
                  onClick={() => {setSelectedCategory(cat); setSelectedTag(null); setActiveTab('all');}}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="truncate">{cat}</span>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-full">{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Hash size={14} /> Trending Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count]) => (
                <button 
                  key={tag}
                  onClick={() => {setSelectedTag(tag); setSelectedCategory(null); setActiveTab('all');}}
                  className={`px-2 py-1 rounded-md text-xs transition-colors ${selectedTag === tag ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 p-6 sm:p-8">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory || selectedTag || (activeTab === 'today' ? "New Today" : "All Collection")}
              </h2>
              {(selectedCategory || selectedTag) && (
                <button onClick={clearFilters} className="p-1 hover:bg-gray-200 rounded-full text-gray-400" title="Clear filter">
                   <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              <button 
                onClick={() => setViewMode(ViewMode.GRID)}
                className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.GRID ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.LIST)}
                className={`p-1.5 rounded-md transition-all ${viewMode === ViewMode.LIST ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
              <BookMarked className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-500">No matching bookmarks found.</p>
            </div>
          ) : (
            <div className={viewMode === ViewMode.GRID ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-3"}>
              {filteredBookmarks.map(b => (
                <BookmarkCard key={b.id} bookmark={b} viewMode={viewMode} onClick={setSelectedBookmark} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddBookmarkModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveBookmark} />
      <EmbedCodeModal isOpen={isEmbedModalOpen} onClose={() => setIsEmbedModalOpen(false)} />
      {selectedBookmark && (
        <BookmarkDetail bookmark={selectedBookmark} onClose={() => setSelectedBookmark(null)} onDelete={handleDeleteBookmark} />
      )}
    </div>
  );
};

export default App;