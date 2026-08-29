import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-ht-emerald" />,
    error: <AlertCircle className="w-5 h-5 text-ht-clay" />,
    info: <Info className="w-5 h-5 text-ht-amber" />
  };

  const borderColors = {
    success: 'border-ht-mint',
    error: 'border-red-200',
    info: 'border-amber-200'
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-[9999] animate-bounce-short">
      <div className={`flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-2xl border ${borderColors[toast.type] || 'border-ht-line'}`}>
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium text-ht-ink">{toast.message}</span>
      </div>
    </div>
  );
};
