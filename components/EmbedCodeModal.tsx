import React, { useState } from 'react';
import { X, Copy, Check, Code2 } from 'lucide-react';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmbedCodeModal: React.FC<EmbedCodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Construct the embed URL based on current location
  const embedUrl = `${window.location.origin}${window.location.pathname}?embed=true`;
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border: 1px solid #e5e7eb; border-radius: 12px;"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
               <Code2 size={18} />
            </span>
            Embed Bookmarks
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm">
            Copy the code below to embed your bookmark collection on another website, blog, or notion page.
          </p>
          
          <div className="relative group">
            <textarea 
              readOnly
              value={embedCode}
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
            <button 
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all text-gray-600"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedCodeModal;