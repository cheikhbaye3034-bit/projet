import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  DownloadCloud, 
  Check, 
  Printer, 
  Upload, 
  FileText, 
  ExternalLink, 
  X, 
  Maximize2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const KhassidaDetailFullView = ({ khassida, onClose }) => {
  const { updateKhassida, showToast } = useApp();
  const fileInputRef = useRef(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const fileUrl = khassida.file_data_url || khassida.file_url;
  const hasUploadedFile = !!fileUrl;
  const hasTextContent = !!khassida.text_content;

  // Auto-open in new window/tab if requested or directly available
  const handleOpenInNewPage = () => {
    if (fileUrl) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${khassida.titre} - Document PDF</title>
              <style>
                body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #11141B; }
                iframe { width: 100%; height: 100%; border: none; }
              </style>
            </head>
            <body>
              <iframe src="${fileUrl}"></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        window.open(fileUrl, '_blank');
      }
    }
  };

  const handleUploadDocument = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFileUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const updated = {
        ...khassida,
        file_url: newFileUrl,
        file_data_url: dataUrl,
        file_name: file.name,
        file_type: file.type || 'application/pdf',
        file_size: (file.size / (1024 * 1024)).toFixed(1) + ' Mo'
      };

      if (updateKhassida) {
        updateKhassida(khassida.id, updated);
      } else {
        Object.assign(khassida, updated);
      }

      showToast && showToast(`✅ Document "${file.name}" chargé avec succès !`);
    };

    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const textReader = new FileReader();
      textReader.onload = (tEvent) => {
        const text = tEvent.target?.result;
        const updated = {
          ...khassida,
          file_url: newFileUrl,
          file_name: file.name,
          text_content: text,
          file_type: 'text/plain',
          file_size: (file.size / (1024 * 1024)).toFixed(1) + ' Mo'
        };
        if (updateKhassida) updateKhassida(khassida.id, updated);
        else Object.assign(khassida, updated);
        showToast && showToast(`✅ Texte "${file.name}" chargé avec succès !`);
      };
      textReader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = khassida.file_name || `${khassida.titre}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloaded(true);
      showToast && showToast(`"${khassida.titre}" téléchargé.`);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] w-screen h-screen bg-[#11141B] text-white flex flex-col overflow-hidden animate-fade-in select-none">
      
      {/* Hidden File Input for uploading / replacing document */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadDocument}
        accept=".pdf,.doc,.docx,.txt,application/pdf"
        className="hidden"
      />

      {/* ── Top Navigation Bar ── */}
      <header className="h-16 w-full bg-[#161B24] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-3 flex-shrink-0 z-20 shadow-md">
        
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 flex-shrink-0"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-sm sm:text-base text-white tracking-wide truncate">
              {khassida.titre}
            </h1>
            <p className="text-[11px] text-emerald-400 font-medium truncate">
              {khassida.file_name ? `Fichier : ${khassida.file_name}` : (khassida.auteur || 'Cheikh Ahmadou Bamba')}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Téléverser un nouveau document PDF"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasUploadedFile || hasTextContent ? 'Remplacer PDF' : 'Ajouter PDF'}</span>
          </button>

          {(hasUploadedFile || hasTextContent) && (
            <>
              {/* Open in New Window Button */}
              <button
                onClick={handleOpenInNewPage}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Ouvrir dans une nouvelle page dédiée"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden md:inline">Ouvrir dans un nouvel onglet</span>
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="Télécharger le document"
              >
                {isDownloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <DownloadCloud className="w-4 h-4" />}
              </button>
            </>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer ml-1"
            title="Fermer la vue"
          >
            <X className="w-5 h-5" />
          </button>

        </div>
      </header>

      {/* ── Fullscreen Dedicated Document Body (100% Height & Width) ── */}
      <main className="w-full flex-1 min-h-0 bg-[#0F1218] flex flex-col relative overflow-hidden">
        {hasUploadedFile ? (
          <iframe
            src={fileUrl}
            className="w-full h-full border-0 bg-white"
            title={khassida.titre}
            style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 64px)' }}
          />
        ) : hasTextContent ? (
          /* Text Document Mode */
          <div className="w-full h-full overflow-y-auto p-6 sm:p-12 bg-white text-slate-900 shadow-2xl">
            <div className="max-w-4xl mx-auto space-y-4 leading-relaxed font-serif text-base sm:text-lg whitespace-pre-wrap">
              {khassida.text_content}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-lg w-full p-8 sm:p-12 text-center bg-[#1B212D] rounded-3xl border border-white/10 shadow-2xl space-y-5 animate-scale-up">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
                <FileText className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                  Aucun document PDF joint
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                  Le document PDF de la Khassida <strong className="text-emerald-300">« {khassida.titre} »</strong> n'a pas encore été importé.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg inline-flex items-center gap-2.5 cursor-pointer transition-all border border-emerald-400/30"
              >
                <Upload className="w-4 h-4 text-emerald-200" />
                <span>Sélectionner le document PDF depuis votre appareil</span>
              </button>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};
