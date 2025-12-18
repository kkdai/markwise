
import React, { useState } from 'react';
import { X, Sparkles, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { analyzeUrlWithGemini } from '../services/geminiService';
import { Bookmark, BookmarkFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookmark: Bookmark) => void;
}

const AddBookmarkModal: React.FC<AddBookmarkModalProps> = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState<'INPUT' | 'ANALYZING' | 'EDIT'>('INPUT');
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState<BookmarkFormData>({
    url: '',
    title: '',
    description: '',
    ai_summary: '',
    ai_key_points: [],
    ai_category: '',
    // Initialize ai_tags to empty array
    ai_tags: [],
    is_public: true
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!url) return;
    try {
      setStep('ANALYZING');
      setError(null);
      
      const result = await analyzeUrlWithGemini(url);
      
      setFormData({
        url: url,
        title: result.title || '',
        description: result.description || '',
        ai_summary: result.ai_summary || '',
        ai_key_points: result.ai_key_points || [],
        ai_category: result.ai_category || 'Uncategorized',
        // Pass ai_tags from analysis result
        ai_tags: result.ai_tags || [],
        is_public: true
      });
      setStep('EDIT');
    } catch (err) {
      setError("Failed to analyze URL. Please try again or enter manually.");
      setStep('INPUT');
    }
  };

  const handleSave = () => {
    const newBookmark: Bookmark = {
      id: uuidv4(),
      ...formData,
      is_archived: false,
      is_favorite: false,
      created_at: new Date().toISOString(),
      favicon: `https://www.google.com/s2/favicons?domain=${formData.url}&sz=64`
    };
    onSave(newBookmark);
    handleClose();
  };

  const handleClose = () => {
    setStep('INPUT');
    setUrl('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
               <LinkIcon size={18} />
            </span>
            Add New Bookmark
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'INPUT' && (
            <div className="space-y-6 py-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://example.com/article"
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-lg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <LinkIcon size={20} />
                  </div>
                </div>
                {error && (
                  <div className="mt-3 text-red-500 text-sm flex items-center gap-2">
                    <AlertCircle size={14} />
                    {error}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleAnalyze}
                  disabled={!url}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all disabled:opacity-50 disabled:hover:bg-gray-900 flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  Analyze with Gemini
                </button>
              </div>
            </div>
          )}

          {step === 'ANALYZING' && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <Sparkles size={24} className="animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reading content...</h3>
                <p className="text-gray-500">Gemini is summarizing the webpage for you.</p>
              </div>
            </div>
          )}

          {step === 'EDIT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                    <input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                 </div>
                 
                 <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600 h-20 resize-none"
                    />
                 </div>

                 <div className="col-span-1 md:col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-blue-600" />
                        <label className="text-xs font-bold text-blue-800 uppercase tracking-wider">AI Summary</label>
                    </div>
                    <textarea
                      value={formData.ai_summary}
                      onChange={(e) => setFormData({...formData, ai_summary: e.target.value})}
                      className="w-full p-3 bg-white border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed text-gray-700 h-32"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                    <input
                      value={formData.ai_category}
                      onChange={(e) => setFormData({...formData, ai_category: e.target.value})}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Visibility</label>
                    <select
                      value={formData.is_public ? 'public' : 'private'}
                      onChange={(e) => setFormData({...formData, is_public: e.target.value === 'public'})}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                 </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                <button onClick={() => setStep('INPUT')} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                  Back
                </button>
                <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                  Save Bookmark
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBookmarkModal;
