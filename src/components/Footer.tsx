import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="border-t border-neutral-800 py-8 bg-[#070707]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-sans">Powered By</span>
          <span className="text-xs text-amber-500 font-medium">{t('taqawun')}</span>
        </div>
        <a
          href="https://share.google/YhQGYyA6qsLBTY0m6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline flex items-center gap-2"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Taqawun Farmayen</span>
        </a>
      </div>
    </footer>
  );
};
