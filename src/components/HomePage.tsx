import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Login } from './Login';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = React.useState<'student' | 'admin' | null>(null);
  const [showTeacherProfile, setShowTeacherProfile] = React.useState(false);

  // Fallback images since generation failed
  const images = {
    faisan: "https://picsum.photos/seed/scholar1/600/800",
    zair: "https://picsum.photos/seed/scholar2/600/800",
    muallim: "https://picsum.photos/seed/teacher/600/800"
  };

  if (showLogin) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <button 
          onClick={() => setShowLogin(null)}
          className="mb-8 text-amber-500 hover:underline flex items-center gap-2 uppercase text-xs font-bold tracking-widest"
        >
          ← {t('home')}
        </button>
        <Login type={showLogin} />
      </motion.div>
    );
  }

  if (showTeacherProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto glass-panel rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative h-64 bg-neutral-900">
           <img 
            src={images.muallim} 
            alt="Muallim" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={() => setShowTeacherProfile(false)}
            className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-8 text-center -mt-16 relative">
          <div className="w-32 h-32 mx-auto profile-arched border-2 border-amber-600/50 overflow-hidden shadow-lg bg-neutral-800 mb-4">
             <img 
              src={images.muallim} 
              alt="Muallim" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-3xl font-bold text-amber-400 mb-2 font-urdu">معلم کا نام</h2>
          <p className="text-neutral-400 font-medium mb-6 uppercase tracking-widest text-xs">Head of Islamic Studies</p>
          <div className="text-neutral-300 leading-relaxed space-y-4 max-w-lg mx-auto">
            <p>Dedicated to providing quality Islamic education and spiritual guidance. Over 15 years of experience in Hifz and Islamic sciences.</p>
            <div className="grid grid-cols-2 gap-4 text-sm mt-8 border-t border-white/5 pt-8">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="block font-bold text-amber-500">1000+</span>
                <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Students</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="block font-bold text-amber-500">15 Years</span>
                <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Experience</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section: 3 Figures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center max-w-5xl mx-auto px-6">
        {/* Zair-e-Nigrani (Left) */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="text-center group"
        >
          <div className="relative aspect-[3/4] profile-arched overflow-hidden shadow-lg mb-4 border border-amber-900/30 group-hover:border-amber-600/50 transition-colors bg-neutral-900">
             <img 
              src={images.zair} 
              alt={t('zair_e_nigrani')} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-amber-200 text-lg font-medium font-urdu leading-tight">{t('zair_e_nigrani')}</h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Nigrani</p>
            </div>
          </div>
        </motion.div>

        {/* Faisan-e-Nazar (Center - Larger) */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="text-center group scale-110 z-10"
        >
          <div className="relative aspect-[3/4] profile-arched overflow-hidden shadow-2xl mb-4 border-2 border-amber-600/50 group-hover:border-amber-400 transition-colors bg-neutral-900">
             <img 
              src={images.faisan} 
              alt={t('faisan_e_nazar')} 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-amber-400 text-2xl font-bold font-urdu leading-tight">{t('faisan_e_nazar')}</h3>
              <p className="text-[10px] text-amber-600 uppercase tracking-widest mt-1">Spiritual Guide</p>
            </div>
          </div>
        </motion.div>

        {/* Muallim (Right) */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="text-center group cursor-pointer"
          onClick={() => setShowTeacherProfile(true)}
        >
          <div className="relative aspect-[3/4] profile-arched overflow-hidden shadow-lg mb-4 border border-emerald-900/30 group-hover:border-emerald-600/50 transition-colors bg-neutral-900 font-urdu">
             <img 
              src={images.muallim} 
              alt={t('muallim')} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-amber-200 text-lg font-medium">{t('muallim')}</h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Teacher</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Login Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-10">
        <button
          onClick={() => setShowLogin('student')}
          className="group relative overflow-hidden p-8 rounded-2xl glass-panel hover:bg-white/10 transition-all duration-300 text-center flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-[#E5E5E5] font-urdu">{t('student_login')}</h2>
          <p className="text-neutral-500 text-xs mb-6 text-center">Access reports, daily sabaq, and attendance records.</p>
          <div className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded transition-all shadow-lg shadow-amber-900/40 uppercase text-xs tracking-widest">
            Sign In as Student
          </div>
        </button>

        <button
          onClick={() => setShowLogin('admin')}
          className="group relative overflow-hidden p-8 rounded-2xl glass-panel hover:bg-white/10 transition-all duration-300 text-center flex flex-col items-center"
        >
          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-[#E5E5E5] font-urdu">{t('admin_login')}</h2>
          <p className="text-neutral-500 text-xs mb-6 text-center">Manage finance, attendance, and student profiles.</p>
          <div className="w-full bg-neutral-100 hover:bg-white text-black font-bold py-2.5 rounded transition-all uppercase text-xs tracking-widest">
            Access Control Panel
          </div>
        </button>
      </div>
    </div>
  );
};
