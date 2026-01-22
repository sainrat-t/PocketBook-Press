import React, { useState } from 'react';
import { BookData, FontOption } from './types';
import FileUpload from './components/FileUpload';
import BookPreview from './components/BookPreview';
import { generateBodyPDF, generateCoverPDF } from './services/pdfService';
import { BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [selectedFont, setSelectedFont] = useState<FontOption>('times');

  const handleDataLoaded = (data: BookData) => {
    setBookData(data);
  };

  const handleReset = () => {
    setBookData(null);
    setSelectedFont('times');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BookOpen className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              PocketBook <span className="text-indigo-600">Press</span>
            </h1>
          </div>
          <div className="text-sm text-slate-500">
            Éditeur automatique de livres de poche
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!bookData ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                Transformez votre manuscrit en livre
              </h2>
              <p className="text-lg text-slate-600">
                Importez votre fichier JSON et nous générons instantanément les PDF 
                (Corps et Couverture) prêts pour l'imprimeur au format poche.
              </p>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="animate-slide-up">
             <BookPreview 
                data={bookData}
                selectedFont={selectedFont}
                onFontChange={setSelectedFont}
                onGenerateBody={() => generateBodyPDF(bookData, selectedFont)}
                onGenerateCover={() => generateCoverPDF(bookData, selectedFont)}
                onReset={handleReset}
             />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} PocketBook Press. Génération locale sécurisée.</p>
        </div>
      </footer>

    </div>
  );
};

export default App;
