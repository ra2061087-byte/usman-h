import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Mail, Lock, ShieldCheck, User } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginProps {
  type: 'student' | 'admin';
}

export const Login: React.FC<LoginProps> = ({ type }) => {
  const { t } = useTranslation();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      if (type === 'admin') {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (!adminDoc.exists()) {
          await auth.signOut();
          throw new Error('Unauthorized: Admin access required');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (type === 'admin') {
        const adminDoc = await getDoc(doc(db, 'admins', result.user.uid));
        if (!adminDoc.exists()) {
          await auth.signOut();
          throw new Error('Unauthorized: Admin access required');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${type === 'admin' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
          {type === 'admin' ? (
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          ) : (
            <User className="w-8 h-8 text-amber-500" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-[#E5E5E5] font-urdu">{t(type === 'admin' ? 'admin_login' : 'student_login')}</h2>
        <p className="text-neutral-500 mt-2 text-xs uppercase tracking-widest">Secure Institutional Access</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-950/30 text-red-400 text-xs rounded-lg border border-red-900/50 mb-4 uppercase tracking-tighter">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">{t('gmail')}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600" />
            <input
              {...register('email')}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none transition-all text-sm"
              placeholder="email@gmail.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600" />
            <input
              {...register('password')}
              type="password"
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-red-500 text-[10px] mt-1 uppercase font-bold">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-bold py-3 rounded-xl transition-all shadow-lg uppercase text-xs tracking-widest disabled:opacity-50 mt-4 ${
            type === 'admin' 
            ? 'bg-neutral-100 text-black hover:bg-white' 
            : 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-900/20'
          }`}
        >
          {loading ? 'Processing...' : t('login')}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-[#0A0A0A] px-2 text-neutral-600">Verification</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-white/5 bg-white/5 py-3 rounded-xl hover:bg-white/10 transition-colors font-bold text-xs uppercase tracking-widest text-[#E5E5E5]"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" referrerPolicy="no-referrer" />
          Google Sign In
        </button>
      </form>
    </div>
  );
};
