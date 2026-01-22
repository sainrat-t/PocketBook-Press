import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { BookData } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: BookData) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    setError(null);
    if (!file) return;

    if (file.type !== "application/json" && !file.name.endsWith('.json')) {
      setError("Le fichier doit être au format JSON.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Basic validation
        if (!json.title || !json.chapters || !Array.isArray(json.chapters)) {
          throw new Error("Structure JSON invalide. Champs requis: title, chapters[]");
        }

        onDataLoaded(json as BookData);
      } catch (err) {
        setError("Erreur lors de la lecture du fichier JSON. Vérifiez la syntaxe.");
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
          isDragOver 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-indigo-100 rounded-full text-indigo-600">
            <Upload size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-700">Importez votre manuscrit</h3>
            <p className="text-slate-500 mt-1">Glissez un fichier .json ou cliquez pour parcourir</p>
          </div>
          <p className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Format supporté : .json
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <FileText size={16} />
            Structure JSON attendue
        </h4>
        <pre className="text-xs text-slate-600 font-mono bg-white p-4 rounded border border-slate-200 overflow-x-auto">
{`{
  "title": "Titre du livre",
  "subtitle": "Sous-titre (optionnel)",
  "chapters": [
    {
      "title": "Chapitre 1",
      "content": "Contenu du texte..."
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};

export default FileUpload;
