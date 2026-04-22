import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, LogOut, LayoutDashboard, User } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface HeaderProps {
  isAdmin: boolean;
  user: any;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin, user }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ur';

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ur' : 'en');
  };

  return (
    <header className="py-6 border-b border-neutral-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1"></div>
          <div className="text-center flex-[2]">
            <p className="text-amber-400 text-xl font-medium mb-1 font-urdu" dir="rtl">{t('bismillah')}</p>
            <h1 className="text-3xl md:text-5xl font-bold gold-gradient uppercase tracking-widest font-urdu">{t('jamia_name')}</h1>
            <p className="text-neutral-500 text-sm mt-1">{t('jamia_address')}</p>
          </div>
          <div className="flex-1 flex justify-end gap-2">
            <button
              onClick={toggleLanguage}
              className="bg-neutral-800 border border-amber-600/30 px-4 py-1.5 rounded text-xs text-amber-200 hover:bg-amber-900/20 transition-colors uppercase font-medium flex items-center gap-2"
            >
              <Globe className="w-3 h-3" />
              <span>{isRtl ? 'English' : 'اردو'}</span>
            </button>
          </div>
        </div>

        {user && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <LayoutDashboard className="w-4 h-4 text-amber-400" />
                ) : (
                  <User className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs text-neutral-300 font-bold uppercase tracking-wider">
                  {user.email?.split('@')[0]}
                </span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <button
                onClick={() => signOut(auth)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase font-bold"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
