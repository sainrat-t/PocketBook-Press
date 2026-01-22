import React from 'react';
import { BookData, FontOption } from '../types';
import { Book, FileText, Download, Printer, Type } from 'lucide-react';

interface BookPreviewProps {
  data: BookData;
  selectedFont: FontOption;
  onFontChange: (font: FontOption) => void;
  onGenerateBody: () => void;
  onGenerateCover: () => void;
  onReset: () => void;
}

const BookPreview: React.FC<BookPreviewProps> = ({ 
  data, 
  selectedFont,
  onFontChange,
  onGenerateBody, 
  onGenerateCover,
  onReset 
}) => {
  // Calculate stats
  const charCount = data.chapters.reduce((acc, ch) => acc + ch.content.length, 0);
  const wordCount = data.chapters.reduce((acc, ch) => acc + ch.content.split(' ').length, 0);
  const estimatedPages = Math.ceil(charCount / 1200); // Rough estimate for pocket format

  const getFontPreviewStyle = (font: FontOption) => {
    switch (font) {
      case 'times': return { fontFamily: '"Times New Roman", Times, serif' };
      case 'helvetica': return { fontFamily: 'Helvetica, Arial, sans-serif' };
      case 'courier': return { fontFamily: '"Courier New", Courier, monospace' };
      default: return {};
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
      
      {/* Left Column: Book Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white">
            <h2 className="text-3xl font-bold" style={getFontPreviewStyle(selectedFont)}>{data.title}</h2>
            {data.subtitle && <p className="text-indigo-100 text-lg mt-2 italic" style={getFontPreviewStyle(selectedFont)}>{data.subtitle}</p>}
          </div>
          <div className="p-6">
            <h3 className="text-slate-800 font-semibold mb-4 flex items-center gap-2">
              <Book size={20} />
              Table des matières
            </h3>
            <div className="space-y-3">
              {data.chapters.map((chapter, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 group">
                  <span className="text-indigo-500 font-mono text-sm mt-0.5 opacity-50 group-hover:opacity-100">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="font-medium text-slate-700" style={getFontPreviewStyle(selectedFont)}>
                      {idx + 1}. {chapter.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1" style={getFontPreviewStyle(selectedFont)}>
                      {chapter.content.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Actions & Stats */}
      <div className="space-y-6">
        
        {/* Configuration Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Type size={16} />
                Police d'écriture
              </label>
              <div className="grid grid-cols-1 gap-2">
                 <button 
                  onClick={() => onFontChange('times')}
                  className={`p-3 text-left rounded-lg border transition-all ${selectedFont === 'times' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'}`}
                 >
                   <span className="font-serif font-bold block">Times / Serif</span>
                   <span className="text-xs opacity-70">Classique, idéal pour les romans</span>
                 </button>
                 <button 
                  onClick={() => onFontChange('helvetica')}
                  className={`p-3 text-left rounded-lg border transition-all ${selectedFont === 'helvetica' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'}`}
                 >
                   <span className="font-sans font-bold block">Helvetica / Sans</span>
                   <span className="text-xs opacity-70">Moderne et épuré</span>
                 </button>
                 <button 
                  onClick={() => onFontChange('courier')}
                  className={`p-3 text-left rounded-lg border transition-all ${selectedFont === 'courier' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300'}`}
                 >
                   <span className="font-mono font-bold block">Courier / Mono</span>
                   <span className="text-xs opacity-70">Style machine à écrire</span>
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Exportation</h3>
          <p className="text-sm text-slate-600 mb-6">
            Générez les fichiers prêts pour l'impression au format poche (11x18cm).
          </p>

          <div className="space-y-3">
            <button 
              onClick={onGenerateBody}
              className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 rounded-lg transition-all group text-slate-700"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-slate-400 group-hover:text-indigo-600" />
                <span className="font-medium">Corps du texte</span>
              </div>
              <Download size={18} />
            </button>

            <button 
              onClick={onGenerateCover}
              className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 rounded-lg transition-all group text-slate-700"
            >
              <div className="flex items-center gap-3">
                <Book className="text-slate-400 group-hover:text-indigo-600" />
                <span className="font-medium">Couverture</span>
              </div>
              <Download size={18} />
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
             <button 
              onClick={onReset}
              className="w-full py-2 text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              Réinitialiser / Nouveau projet
            </button>
          </div>
        </div>
        
        {/* Stats (simplified for space) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
           <div className="flex justify-between items-center text-sm text-slate-600">
              <span>{data.chapters.length} Chapitres</span>
              <span>~{estimatedPages} Pages</span>
           </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-800 text-sm flex gap-3">
           <Printer className="shrink-0" size={20} />
           <p>Format configuré pour une impression 110mm x 180mm avec marges en miroir.</p>
        </div>

      </div>
    </div>
  );
};

export default BookPreview;
