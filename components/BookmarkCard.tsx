import React from 'react';
import { Bookmark, ViewMode } from '../types';
import { Calendar, Tag, MoreHorizontal } from 'lucide-react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  viewMode: ViewMode;
  onClick: (bookmark: Bookmark) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, viewMode, onClick }) => {
  const date = new Date(bookmark.created_at).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const faviconUrl = bookmark.favicon || `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`;

  if (viewMode === ViewMode.LIST) {
    return (
      <div 
        onClick={() => onClick(bookmark)}
        className="group flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer mb-3"
      >
        <div className="w-12 h-12 flex-shrink-0 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
           <img src={faviconUrl} alt="icon" className="w-6 h-6 object-contain" onError={(e) => e.currentTarget.src = 'https://placehold.co/24'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {bookmark.title}
            </h3>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{date}</span>
          </div>
          <p className="text-sm text-gray-500 truncate mt-1">{bookmark.url}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
              {bookmark.ai_category}
            </span>
            {(bookmark.ai_tags || []).slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(bookmark)}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer h-full"
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
            <img src={faviconUrl} alt="icon" className="w-5 h-5 object-contain" onError={(e) => e.currentTarget.src = 'https://placehold.co/20'} />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
             <MoreHorizontal size={20} className="text-gray-400" />
          </div>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {bookmark.title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
          {bookmark.ai_summary}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
           {(bookmark.ai_tags || []).slice(0, 3).map(tag => (
             <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-500 border border-gray-100">
               #{tag}
             </span>
           ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Tag size={12} className="text-blue-500" />
            <span className="font-semibold text-gray-600 uppercase tracking-tighter">{bookmark.ai_category}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;