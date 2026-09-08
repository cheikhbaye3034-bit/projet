import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Menu, 
  DownloadCloud, 
  Upload, 
  Maximize2, 
  Minimize2, 
  Moon, 
  Sun, 
  ZoomIn, 
  ZoomOut, 
  FileText, 
  X,
  Layers,
  Sparkles,
  Printer,
  RotateCw,
  BookOpen,
  Columns,
  Bookmark,
  Smartphone,
  Monitor,
  Eye,
  Check,
  Search
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import kagguSampleImg from '../../../assets/images/kaggu_sample_page.jpg';

export const KhassidaDetailFullView = ({ khassida, onClose }) => {
  const { updateKhassida, showToast } = useApp();
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRefs = useRef({});
  const thumbnailRefs = useRef({});

  // Detect screen size on load: default to Acrobat on desktop, Immersive on mobile
  const [isDesktopScreen, setIsDesktopScreen] = useState(() => window.innerWidth >= 1024);

  // Reader Mode: 'acrobat' (Adobe Acrobat Pro style) or 'mobile' (Ultra clean immersive)
  const [readerMode, setReaderMode] = useState(() => {
    return window.innerWidth >= 1024 ? 'acrobat' : 'mobile';
  });

  // Prompt banner for desktop Acrobat mode
  const [showDesktopAcrobatBanner, setShowDesktopAcrobatBanner] = useState(() => {
    return window.innerWidth >= 1024 && localStorage.getItem('ht_reader_mode_dismissed') !== 'true';
  });

  // Acrobat View Layout: 'continuous' (vertical scroll) | 'single' (one page) | 'double' (book spread)
  const [layoutMode, setLayoutMode] = useState('continuous');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Thumbnails sidebar

  // Visual Themes: 'paper' (warm parchment) | 'sepia' | 'dark' | 'acrobat-grey' | 'white'
  const [colorTheme, setColorTheme] = useState('paper');

  // Zoom & Rotation
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [fitMode, setFitMode] = useState('width'); // 'width' | 'page' | 'free'

  // Fullscreen & UI controls toggle
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(true);
  const [showMobileOptions, setShowMobileOptions] = useState(false);
  const [showMobileIndex, setShowMobileIndex] = useState(false);
  const [savedBookmark, setSavedBookmark] = useState(() => {
    try {
      return parseInt(localStorage.getItem(`ht_bookmark_${khassida?.id}`)) || 1;
    } catch (e) {
      return 1;
    }
  });

  // PDF Rendering state
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputVal, setPageInputVal] = useState('1');
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfRenderError, setPdfRenderError] = useState(null);
  const [useSampleDemo, setUseSampleDemo] = useState(false);

  const fileUrl = khassida?.file_data_url || khassida?.file_url;
  const isImageFile = !!fileUrl && (khassida?.file_type?.startsWith('image') || fileUrl.startsWith('data:image') || /\.(jpe?g|png|webp|gif)$/i.test(fileUrl));
  const hasUploadedFile = !!fileUrl;
  const hasTextContent = !!khassida?.text_content;

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsDesktopScreen(isDesktop);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Synchronize page input with current page
  useEffect(() => {
    setPageInputVal(currentPage.toString());
  }, [currentPage]);

  // Load and render PDF with PDF.js
  useEffect(() => {
    let isMounted = true;

    const renderPdf = async () => {
      if (!fileUrl) return;

      const pdfjs = window.pdfjsLib;
      if (!pdfjs) {
        const timer = setTimeout(() => {
          if (isMounted && window.pdfjsLib) renderPdf();
        }, 600);
        return () => clearTimeout(timer);
      }

      try {
        setIsLoadingPdf(true);
        setPdfRenderError(null);

        const loadingTask = pdfjs.getDocument(fileUrl);
        const pdfDoc = await loadingTask.promise;

        if (!isMounted) return;

        setNumPages(pdfDoc.numPages);
        setIsLoadingPdf(false);

        // Render each page into its canvas
        for (let pNum = 1; pNum <= pdfDoc.numPages; pNum++) {
          if (!isMounted) break;

          const page = await pdfDoc.getPage(pNum);
          const canvas = canvasRefs.current[pNum];
          if (!canvas) continue;

          const context = canvas.getContext('2d');
          const viewport = page.getViewport({ scale: 2.0 }); // 2x for ultra sharp text

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;

          // Render thumbnail if sidebar is open or prepared
          const thumbCanvas = thumbnailRefs.current[pNum];
          if (thumbCanvas) {
            const thumbContext = thumbCanvas.getContext('2d');
            const thumbViewport = page.getViewport({ scale: 0.35 });
            thumbCanvas.height = thumbViewport.height;
            thumbCanvas.width = thumbViewport.width;
            await page.render({
              canvasContext: thumbContext,
              viewport: thumbViewport
            }).promise;
          }
        }
      } catch (err) {
        console.error('PDF.js render error:', err);
        if (isMounted) {
          setIsLoadingPdf(false);
          setPdfRenderError(err.message || 'Erreur de rendu PDF');
        }
      }
    };

    renderPdf();

    return () => {
      isMounted = false;
    };
  }, [fileUrl, sidebarOpen]);

  // Scroll tracking to update current visible page
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (layoutMode !== 'continuous' || numPages === 0) return;
      const scrollPos = container.scrollTop + container.clientHeight / 3;

      for (let p = 1; p <= numPages; p++) {
        const el = document.getElementById(`doc-page-${p}`);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.clientHeight;
          if (scrollPos >= top && scrollPos <= bottom) {
            setCurrentPage(p);
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [layoutMode, numPages]);

  // Navigation handlers
  const goToPage = (p) => {
    const target = Math.max(1, Math.min(p, numPages || (useSampleDemo ? 2 : 1)));
    setCurrentPage(target);

    if (layoutMode === 'continuous') {
      const el = document.getElementById(`doc-page-${target}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handlePageInputSubmit = (e) => {
    if (e.key === 'Enter') {
      const p = parseInt(pageInputVal);
      if (!isNaN(p)) {
        goToPage(p);
      }
    }
  };

  // Bookmark save
  const handleSaveBookmark = () => {
    try {
      localStorage.setItem(`ht_bookmark_${khassida?.id}`, currentPage.toString());
      setSavedBookmark(currentPage);
      showToast(`Signet enregistré à la page ${currentPage}`);
    } catch (e) {}
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Handle PDF Upload / Replacement
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

      setUseSampleDemo(false);
      showToast && showToast(`Document « ${file.name} » importé avec succès !`);
    };

    reader.readAsDataURL(file);
  };

  // Download PDF
  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = khassida.file_name || `${khassida.titre}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast && showToast(`Document téléchargé avec succès.`);
    }
  };

  // Print document
  const handlePrint = () => {
    window.print();
  };

  // Theme color styling definitions
  const themeStyles = {
    paper: {
      bg: 'bg-[#F4EFE6]',
      pageBg: 'bg-[#FCFAF5]',
      border: 'border-[#D9CFBE]',
      text: 'text-[#2B2317]',
      toolbar: 'bg-[#EAE2D3] border-[#D6CBB7] text-[#332A1F]',
      shadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
    },
    sepia: {
      bg: 'bg-[#EDE4D0]',
      pageBg: 'bg-[#F6EEDF]',
      border: 'border-[#D4C3A3]',
      text: 'text-[#3E2713]',
      toolbar: 'bg-[#E2D4BD] border-[#CDBC9E] text-[#3E2713]',
      shadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.15)]'
    },
    dark: {
      bg: 'bg-[#0E1117]',
      pageBg: 'bg-[#181D26]',
      border: 'border-[#262F3E]',
      text: 'text-[#E2E8F0]',
      toolbar: 'bg-[#161B22] border-[#30363D] text-slate-200',
      shadow: 'shadow-[0_8px_30px_rgb(0,0,0,0.6)]'
    },
    'acrobat-grey': {
      bg: 'bg-[#404348]',
      pageBg: 'bg-white',
      border: 'border-[#55585F]',
      text: 'text-slate-900',
      toolbar: 'bg-[#2E3136] border-[#44474D] text-slate-100',
      shadow: 'shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
    },
    white: {
      bg: 'bg-slate-100',
      pageBg: 'bg-white',
      border: 'border-slate-300',
      text: 'text-slate-900',
      toolbar: 'bg-white border-slate-200 text-slate-800',
      shadow: 'shadow-[0_4px_25px_rgba(0,0,0,0.08)]'
    }
  };

  const currentTheme = themeStyles[colorTheme] || themeStyles.paper;

  // Active pages count
  const effectivePagesCount = numPages > 0 ? numPages : (useSampleDemo ? 2 : 1);

  return (
    <div className={`fixed inset-0 z-[9999] w-screen h-screen flex flex-col select-none overflow-hidden ${currentTheme.bg} transition-colors duration-200`}>
      
      {/* Hidden File Input for uploading or replacing document */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadDocument}
        accept=".pdf,application/pdf,image/*"
        className="hidden"
      />

      {/* ── DESKTOP ACROBAT PROMPT BANNER (If user is on PC and banner not dismissed) ── */}
      {showDesktopAcrobatBanner && isDesktopScreen && (
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-emerald-500/30 z-50 shadow-md">
          <div className="flex items-center gap-2.5">
            <Monitor className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Expérience Bureau Détectée</strong> : Souhaitez-vous utiliser le <strong>Mode Adobe Acrobat Pro</strong> (outils professionnels, double page, vignettes et zoom complet) ?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setReaderMode('acrobat');
                setShowDesktopAcrobatBanner(false);
                try { localStorage.setItem('ht_reader_mode_dismissed', 'true'); } catch (e) {}
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Activer Adobe Acrobat Pro
            </button>
            <button
              onClick={() => {
                setShowDesktopAcrobatBanner(false);
                try { localStorage.setItem('ht_reader_mode_dismissed', 'true'); } catch (e) {}
              }}
              className="p-1 hover:bg-white/10 rounded-md text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 1 : ADOBE ACROBAT PRO DESKTOP TOOLBAR (Style Adobe Acrobat DC / Reader)
      ========================================================================= */}
      {readerMode === 'acrobat' && (
        <header className={`h-14 w-full px-3 sm:px-4 border-b flex items-center justify-between gap-2 z-40 shadow-xs flex-shrink-0 ${currentTheme.toolbar}`}>
          
          {/* Left section: Close, Thumbnails toggle & Document Info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
              title="Fermer le lecteur"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Fermer</span>
            </button>

            <div className="h-5 w-[1px] bg-black/15 dark:bg-white/15" />

            {/* Sidebar Toggle (Thumbnails) */}
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                sidebarOpen ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-black/10 dark:hover:bg-white/10'
              }`}
              title="Afficher le panneau des vignettes (Miniatures des pages)"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">Vignettes</span>
            </button>

            {/* Title & Badge */}
            <div className="min-w-0 hidden sm:block max-w-[200px] xl:max-w-xs">
              <h2 className="font-bold text-xs truncate leading-tight">
                {khassida.titre}
              </h2>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{effectivePagesCount} pages • Document PDF</span>
              </span>
            </div>
          </div>

          {/* Center section: Acrobat Page Navigation & View Layout Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Page navigation: Prev / Input / Next */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 p-0.5 rounded-lg text-xs font-medium">
              <button
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                className="w-7 h-7 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 flex items-center justify-center cursor-pointer transition-colors"
                title="Page précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-1.5 font-mono text-xs">
                <input
                  type="text"
                  value={pageInputVal}
                  onChange={(e) => setPageInputVal(e.target.value)}
                  onKeyDown={handlePageInputSubmit}
                  className="w-8 text-center bg-white dark:bg-slate-800 border border-black/20 dark:border-white/20 rounded py-0.5 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="opacity-60">/ {effectivePagesCount}</span>
              </div>

              <button
                disabled={currentPage >= effectivePagesCount}
                onClick={() => goToPage(currentPage + 1)}
                className="w-7 h-7 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 flex items-center justify-center cursor-pointer transition-colors"
                title="Page suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Layout selector: Continuous, Single Page, Double Page Spread */}
            <div className="hidden lg:flex items-center bg-black/10 dark:bg-white/10 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setLayoutMode('continuous')}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  layoutMode === 'continuous' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold text-emerald-600 dark:text-emerald-400' : 'hover:opacity-80'
                }`}
                title="Défilement continu de haut en bas"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Continu</span>
              </button>

              <button
                onClick={() => setLayoutMode('single')}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  layoutMode === 'single' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold text-emerald-600 dark:text-emerald-400' : 'hover:opacity-80'
                }`}
                title="Page simple centrée"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Simple</span>
              </button>

              <button
                onClick={() => setLayoutMode('double')}
                className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  layoutMode === 'double' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold text-emerald-600 dark:text-emerald-400' : 'hover:opacity-80'
                }`}
                title="Double page / Mode livre & Mushaf"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Double</span>
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-black/10 dark:bg-white/10 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
                className="w-7 h-7 rounded-md hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer"
                title="Zoom arrière"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs px-1 min-w-[40px] text-center font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(2.2, prev + 0.15))}
                className="w-7 h-7 rounded-md hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center cursor-pointer"
                title="Zoom avant"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right section: Tools, Themes, Switch to Mobile Mode */}
          <div className="flex items-center gap-1.5">
            
            {/* Theme selector dropdown / toggles */}
            <div className="hidden md:flex items-center gap-1 bg-black/10 dark:bg-white/10 p-1 rounded-lg">
              <button
                onClick={() => setColorTheme('paper')}
                className={`w-6 h-6 rounded-md bg-[#F4EFE6] border border-[#D9CFBE] transition-transform ${colorTheme === 'paper' ? 'ring-2 ring-emerald-500 scale-110' : 'hover:scale-105'}`}
                title="Thème Papier Ancien"
              />
              <button
                onClick={() => setColorTheme('sepia')}
                className={`w-6 h-6 rounded-md bg-[#EDE4D0] border border-[#D4C3A3] transition-transform ${colorTheme === 'sepia' ? 'ring-2 ring-emerald-500 scale-110' : 'hover:scale-105'}`}
                title="Thème Sépia"
              />
              <button
                onClick={() => setColorTheme('acrobat-grey')}
                className={`w-6 h-6 rounded-md bg-[#404348] border border-[#55585F] transition-transform ${colorTheme === 'acrobat-grey' ? 'ring-2 ring-emerald-500 scale-110' : 'hover:scale-105'}`}
                title="Thème Acrobat Classique"
              />
              <button
                onClick={() => setColorTheme('dark')}
                className={`w-6 h-6 rounded-md bg-[#161B22] border border-[#30363D] transition-transform ${colorTheme === 'dark' ? 'ring-2 ring-emerald-500 scale-110' : 'hover:scale-105'}`}
                title="Thème Nuit / Sombre"
              />
            </div>

            {/* Rotation */}
            <button
              onClick={() => setRotation(prev => (prev + 90) % 360)}
              className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors"
              title="Pivoter la page de 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
              onClick={handleSaveBookmark}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                savedBookmark === currentPage ? 'text-amber-500 font-bold' : 'hover:bg-black/10 dark:hover:bg-white/10'
              }`}
              title="Poser un signet sur cette page"
            >
              <Bookmark className="w-4 h-4" fill={savedBookmark === currentPage ? 'currentColor' : 'none'} />
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors hidden sm:block"
              title="Imprimer le document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download */}
            {hasUploadedFile && (
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-colors"
                title="Télécharger le PDF original"
              >
                <DownloadCloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            )}

            {/* Replace / Upload PDF */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Téléverser ou remplacer le document PDF"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Importer PDF</span>
            </button>

            {/* Switch to Mobile Immersive Mode */}
            <button
              onClick={() => setReaderMode('mobile')}
              className="px-2.5 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Basculer en mode lecture épurée"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode Épuré</span>
            </button>
          </div>
        </header>
      )}

      {/* =========================================================================
          MODE 2 : MOBILE & TABLET ULTRA IMMERSIVE BAR (Style Kaggu + Modern UX)
      ========================================================================= */}
      {readerMode === 'mobile' && (
        <>
          {/* Top Floating App Bar (Slides out smoothly or taps to toggle) */}
          <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-5 py-3 flex items-center justify-between ${
            showMobileControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
          }`}>
            {/* Back button */}
            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer"
              title="Fermer la lecture"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Document Title Capsule */}
            <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/15 shadow-xl max-w-[200px] sm:max-w-md text-center truncate">
              <p className="font-display font-bold text-xs truncate">{khassida.titre}</p>
              <p className="text-[10px] text-emerald-400 font-mono">Page {currentPage} sur {effectivePagesCount}</p>
            </div>

            {/* Action Buttons: Acrobat switch & More menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReaderMode('acrobat')}
                className="w-11 h-11 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer"
                title="Passer en mode Adobe Acrobat Pro"
              >
                <Monitor className="w-5 h-5 text-emerald-400" />
              </button>

              <button
                onClick={() => setShowMobileOptions(prev => !prev)}
                className="w-11 h-11 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-transform active:scale-95 cursor-pointer"
                title="Options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Floating Control Bar (With Page Scrubber Slider & Quick Actions) */}
          <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 p-3 sm:p-5 flex flex-col items-center gap-2 ${
            showMobileControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}>
            <div className="w-full max-w-md bg-black/85 backdrop-blur-xl border border-white/15 rounded-3xl p-3 sm:p-4 text-white shadow-2xl flex flex-col gap-3">
              {/* Page Scrubber Slider */}
              <div className="flex items-center gap-3 w-full">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center cursor-pointer flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="range"
                    min="1"
                    max={effectivePagesCount}
                    value={currentPage}
                    onChange={(e) => goToPage(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Page 1</span>
                    <span className="font-bold text-emerald-400">Page {currentPage} / {effectivePagesCount}</span>
                    <span>Page {effectivePagesCount}</span>
                  </div>
                </div>

                <button
                  disabled={currentPage >= effectivePagesCount}
                  onClick={() => goToPage(currentPage + 1)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center cursor-pointer flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Action Toolbar: Zoom, Index, Bookmark, Fullscreen */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-semibold text-slate-300">
                <button
                  onClick={() => setShowMobileIndex(prev => !prev)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Index</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs px-1">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.15))}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleSaveBookmark}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    savedBookmark === currentPage ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={savedBookmark === currentPage ? 'currentColor' : 'none'} />
                  <span>Signet</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                  title="Plein écran"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Options Popup */}
          {showMobileOptions && (
            <div className="fixed top-16 right-4 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-3xl p-3 text-white shadow-2xl space-y-1.5 text-xs font-semibold animate-scale-up">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="font-display font-bold text-sm text-emerald-300">{khassida.titre}</p>
                <p className="text-[10px] text-slate-400">Options de lecture</p>
              </div>

              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowMobileOptions(false);
                }}
                className="w-full px-3 py-2 hover:bg-white/10 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Importer / Remplacer PDF</span>
              </button>

              {hasUploadedFile && (
                <button
                  onClick={() => {
                    handleDownload();
                    setShowMobileOptions(false);
                  }}
                  className="w-full px-3 py-2 hover:bg-white/10 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                >
                  <DownloadCloud className="w-4 h-4 text-emerald-400" />
                  <span>Télécharger le PDF</span>
                </button>
              )}

              <button
                onClick={() => {
                  setReaderMode('acrobat');
                  setShowMobileOptions(false);
                }}
                className="w-full px-3 py-2 hover:bg-white/10 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-left text-amber-300"
              >
                <Monitor className="w-4 h-4" />
                <span>Activer Vue Adobe Acrobat Pro</span>
              </button>

              {/* Theme choices */}
              <div className="pt-2 border-t border-white/10 px-3 py-1 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Thème de lecture</span>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <button onClick={() => setColorTheme('paper')} className={`p-1.5 rounded-lg text-center font-bold text-[10px] bg-[#F4EFE6] text-[#2B2317] ${colorTheme === 'paper' ? 'ring-2 ring-emerald-500' : ''}`}>Papier</button>
                  <button onClick={() => setColorTheme('sepia')} className={`p-1.5 rounded-lg text-center font-bold text-[10px] bg-[#EDE4D0] text-[#3E2713] ${colorTheme === 'sepia' ? 'ring-2 ring-emerald-500' : ''}`}>Sépia</button>
                  <button onClick={() => setColorTheme('dark')} className={`p-1.5 rounded-lg text-center font-bold text-[10px] bg-[#181D26] text-white ${colorTheme === 'dark' ? 'ring-2 ring-emerald-500' : ''}`}>Nuit</button>
                  <button onClick={() => setColorTheme('white')} className={`p-1.5 rounded-lg text-center font-bold text-[10px] bg-white text-slate-900 ${colorTheme === 'white' ? 'ring-2 ring-emerald-500' : ''}`}>Blanc</button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Page Index Drawer */}
          {showMobileIndex && (
            <div className="fixed bottom-24 left-4 right-4 z-50 max-h-72 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-3xl p-4 text-white shadow-2xl flex flex-col animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-display font-bold text-xs">Aller directement à la page</h4>
                </div>
                <button onClick={() => setShowMobileIndex(false)} className="p-1 hover:bg-white/10 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-2">
                {Array.from({ length: effectivePagesCount }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => {
                      goToPage(pNum);
                      setShowMobileIndex(false);
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pNum ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    p. {pNum}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* =========================================================================
          MAIN WORKSPACE : SIDEBAR (THUMBNAILS) + DOCUMENT VIEWING CANVAS
      ========================================================================= */}
      <div className="flex-1 min-h-0 flex relative overflow-hidden">
        
        {/* ── Collapsible Thumbnails Sidebar (Acrobat style) ── */}
        {sidebarOpen && readerMode === 'acrobat' && (
          <aside className={`w-56 sm:w-64 border-r flex flex-col flex-shrink-0 z-30 transition-all duration-200 ${currentTheme.toolbar}`}>
            <div className="p-3 border-b flex items-center justify-between border-black/10 dark:border-white/10">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Vignettes des pages</span>
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Thumbnails list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {Array.from({ length: effectivePagesCount }, (_, i) => i + 1).map((pNum) => (
                <div
                  key={pNum}
                  onClick={() => goToPage(pNum)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer text-center flex flex-col items-center gap-1.5 ${
                    currentPage === pNum 
                      ? 'border-emerald-600 ring-2 ring-emerald-500/40 bg-emerald-50/20 shadow-md' 
                      : 'border-black/15 dark:border-white/15 hover:border-emerald-400 bg-black/5 dark:bg-white/5'
                  }`}
                >
                  <div className="w-full aspect-[1/1.414] bg-white rounded-md overflow-hidden shadow-xs relative flex items-center justify-center">
                    {useSampleDemo ? (
                      <img src={kagguSampleImg} alt={`Vignette ${pNum}`} className="w-full h-full object-cover" />
                    ) : (
                      <canvas
                        ref={(el) => {
                          if (el) thumbnailRefs.current[pNum] = el;
                        }}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <span className={`text-[11px] font-bold ${currentPage === pNum ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-70'}`}>
                    Page {pNum}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* ── Main Document Canvas Viewport ── */}
        <main
          ref={containerRef}
          onClick={() => {
            if (readerMode === 'mobile') {
              setShowMobileControls(prev => !prev);
              setShowMobileOptions(false);
              setShowMobileIndex(false);
            }
          }}
          className={`flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-6 md:p-8 flex flex-col items-center overscroll-contain transition-colors duration-200 ${
            layoutMode === 'double' && readerMode === 'acrobat' ? 'justify-start' : 'justify-start'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Loading Indicator */}
          {isLoadingPdf && (
            <div className="py-24 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Rendu haute fidélité du document...</p>
            </div>
          )}

          {/* Error Message */}
          {pdfRenderError && (
            <div className="max-w-md p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center text-red-500 my-8">
              <p className="font-bold text-sm">Impossible d'afficher le document</p>
              <p className="text-xs mt-1">{pdfRenderError}</p>
              <iframe src={fileUrl} className="w-full h-96 mt-4 border rounded-xl" title={khassida.titre} />
            </div>
          )}

          {/* ── 1. DEMO SAMPLE MODE (Using user's Kaggu PDF image) ── */}
          {useSampleDemo && (
            <div 
              className={`transition-all duration-200 origin-top flex ${
                layoutMode === 'double' && readerMode === 'acrobat' 
                  ? 'flex-row gap-4 max-w-6xl justify-center' 
                  : 'flex-col items-center gap-4 w-full max-w-[850px]'
              }`}
              style={{ 
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                width: readerMode === 'mobile' ? '100%' : undefined
              }}
            >
              <div 
                id="doc-page-1"
                className={`w-full rounded-2xl overflow-hidden ${currentTheme.pageBg} ${currentTheme.border} ${currentTheme.shadow} border`}
              >
                <img src={kagguSampleImg} alt="Page 1" className="w-full h-auto block select-none" />
              </div>

              {(layoutMode !== 'single' || currentPage === 2) && (
                <div 
                  id="doc-page-2"
                  className={`w-full rounded-2xl overflow-hidden ${currentTheme.pageBg} ${currentTheme.border} ${currentTheme.shadow} border`}
                >
                  <img src={kagguSampleImg} alt="Page 2" className="w-full h-auto block select-none" />
                </div>
              )}
            </div>
          )}

          {/* ── 2. IMAGE FILE DISPLAY ── */}
          {!useSampleDemo && isImageFile && (
            <div 
              className="w-full max-w-[850px] transition-transform duration-150 origin-top flex flex-col items-center"
              style={{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }}
            >
              <div id="doc-page-1" className={`w-full rounded-2xl overflow-hidden ${currentTheme.pageBg} ${currentTheme.border} ${currentTheme.shadow} border`}>
                <img src={fileUrl} alt={khassida.titre} className="w-full h-auto block select-none" />
              </div>
            </div>
          )}

          {/* ── 3. NATIVE PDF.JS CANVAS STACKING (CONTINUOUS, SINGLE OR DOUBLE SPREAD) ── */}
          {!useSampleDemo && !isImageFile && hasUploadedFile && !pdfRenderError && (
            <div 
              className={`transition-transform duration-150 origin-top flex ${
                layoutMode === 'double' && readerMode === 'acrobat'
                  ? 'flex-wrap flex-row gap-4 max-w-6xl justify-center'
                  : 'flex-col items-center gap-4 w-full max-w-[900px]'
              }`}
              style={{ 
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                width: readerMode === 'mobile' ? '100%' : undefined
              }}
            >
              {Array.from({ length: numPages || 0 }, (_, i) => i + 1).map((pageNum) => {
                // If single page layout mode, only show current page
                if (layoutMode === 'single' && readerMode === 'acrobat' && pageNum !== currentPage) {
                  return null;
                }

                return (
                  <div
                    key={pageNum}
                    id={`doc-page-${pageNum}`}
                    className={`rounded-2xl overflow-hidden transition-all duration-150 relative ${
                      layoutMode === 'double' && readerMode === 'acrobat' ? 'w-[calc(50%-10px)] max-w-[480px]' : 'w-full'
                    } ${currentTheme.pageBg} ${currentTheme.border} ${currentTheme.shadow} border`}
                  >
                    <canvas
                      ref={(el) => {
                        if (el) canvasRefs.current[pageNum] = el;
                      }}
                      className="w-full h-auto block select-none"
                    />
                    
                    {/* Discret page index bottom badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[9px] font-mono text-white/90">
                      p. {pageNum}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── 4. TEXT CONTENT WITH ILLUMINATED CALLIGRAPHY PAGES ── */}
          {!useSampleDemo && !hasUploadedFile && hasTextContent && (
            <div 
              className="w-full max-w-3xl transition-transform duration-150 origin-top p-4"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <div className={`rounded-3xl p-6 sm:p-12 border-4 border-[#C8A951]/40 ${currentTheme.pageBg} ${currentTheme.shadow} space-y-6 text-slate-900`}>
                <div className="text-center pb-6 border-b-2 border-[#C8A951]/30 space-y-2">
                  <span className="text-2xl sm:text-4xl text-emerald-950 font-bold font-['Amiri',serif] block">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </span>
                  <h1 className="font-display font-black text-xl sm:text-2xl text-emerald-900 mt-2">
                    {khassida.titre}
                  </h1>
                  {khassida.titre_arabe && (
                    <p className="font-serif text-2xl text-[#C8A951] font-bold font-['Amiri',serif]">
                      {khassida.titre_arabe}
                    </p>
                  )}
                </div>

                <div className="text-right font-serif text-2xl sm:text-3xl leading-[2.6] text-slate-900 whitespace-pre-wrap font-['Amiri',serif] py-4" dir="rtl">
                  {khassida.text_content}
                </div>
              </div>
            </div>
          )}

          {/* ── 5. EMPTY STATE : Upload prompt & Demo trigger ── */}
          {!useSampleDemo && !hasUploadedFile && !hasTextContent && (
            <div className="w-full flex items-center justify-center min-h-[60vh] p-4">
              <div className="max-w-md w-full p-8 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 rounded-3xl text-center shadow-2xl space-y-5 animate-scale-up">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
                  <FileText className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                    Aucun document PDF associé
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                    Importez le document PDF pour profiter de la lecture plein écran et des fonctionnalités Adobe Acrobat Pro.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Sélectionner le document PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUseSampleDemo(true);
                      setNumPages(2);
                      showToast && showToast('Mode Démonstration Kaggu PDF activé !');
                    }}
                    className="w-full py-2.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-emerald-500/20"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Ouvrir le document d'exemple (Kaggu PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
