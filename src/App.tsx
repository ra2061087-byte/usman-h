import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const isRtl = i18n.language === 'ur';

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const adminRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminRef);
        setIsAdmin(adminSnap.exists());
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full shadow-[0_0_20px_rgba(217,119,6,0.3)]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      <Header isAdmin={isAdmin} user={user} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!user ? (
            <HomePage key="home" />
          ) : isAdmin ? (
            <AdminDashboard key="admin" />
          ) : (
            <StudentDashboard key="student" user={user} />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
