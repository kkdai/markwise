import React from 'react';
import { Bookmark } from '../types';
import { X, Calendar, Globe, Tag, CheckCircle2, Trash2, Archive, Share2, ExternalLink } from 'lucide-react';

interface BookmarkDetailProps {
  bookmark: Bookmark | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const BookmarkDetail: React.FC<BookmarkDetailProps> = ({ bookmark, onClose, onDelete }) => {
  if (!bookmark) return null;

  const date = new Date(bookmark.created_at).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Slide-in Panel */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur">
          <div className="flex items-center gap-3">
             <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
               <X size={20} />
             </button>
             <span className="text-sm font-medium text-gray-500">Bookmark Details</span>
          </div>
          <div className="flex items-center gap-1">
             <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Share">
               <Share2 size={18} />
             </button>
             <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors" title="Archive">
               <Archive size={18} />
             </button>
             <button 
                onClick={() => {
                  if(confirm('Are you sure you want to delete this bookmark?')) {
                    onDelete(bookmark.id);
                    onClose();
                  }
                }} 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Delete"
              >
               <Trash2 size={18} />
             </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
           <div className="mb-6">
             <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-3">
               {bookmark.ai_category}
             </span>
             <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
               {bookmark.title}
             </h1>
             <a 
               href={bookmark.url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm break-all"
             >
               <Globe size={14} />
               {bookmark.url}
               <ExternalLink size={12} />
             </a>
           </div>

           <div className="prose prose-blue max-w-none">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
               <p className="text-gray-600 text-sm italic">
                 {bookmark.description}
               </p>
             </div>

             <div className="mb-8">
               <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                 <span className="text-2xl">✨</span> AI Summary
               </h3>
               <p className="text-gray-700 leading-relaxed text-base">
                 {bookmark.ai_summary}
               </p>
             </div>

             {bookmark.ai_key_points && bookmark.ai_key_points.length > 0 && (
               <div className="mb-8">
                 <h3 className="text-lg font-bold text-gray-900 mb-3">Key Takeaways</h3>
                 <ul className="space-y-3">
                   {bookmark.ai_key_points.map((point, idx) => (
                     <li key={idx} className="flex items-start gap-3 text-gray-700">
                       <CheckCircle2 size={18} className="text-green-500 mt-1 flex-shrink-0" />
                       <span className="text-sm">{point}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}
           </div>

           <div className="pt-8 mt-8 border-t border-gray-100 text-xs text-gray-400 flex flex-col gap-2">
             <div className="flex items-center gap-2">
               <Calendar size={12} />
               Added on {date}
             </div>
             <div className="flex items-center gap-2">
               <Tag size={12} />
               ID: {bookmark.id}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkDetail;