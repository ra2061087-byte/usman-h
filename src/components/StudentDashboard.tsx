import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Student, AcademicRecord, Attendance } from '../types';
import { Calendar, BookOpen, Heart, Activity, User, BookMarked } from 'lucide-react';
import { format } from 'date-fns';

interface StudentDashboardProps {
  user: any;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const { t } = useTranslation();
  const [student, setStudent] = React.useState<Student | null>(null);
  const [records, setRecords] = React.useState<AcademicRecord[]>([]);
  const [attendance, setAttendance] = React.useState<Attendance[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const studentSnap = await getDoc(doc(db, 'students', user.uid));
        if (studentSnap.exists()) {
          setStudent({ id: studentSnap.id, ...studentSnap.data() } as Student);
        }

        const recordsQuery = query(
          collection(db, 'academic_records'),
          where('studentId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const recordsSnap = await getDocs(recordsQuery);
        setRecords(recordsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as AcademicRecord));

        const attendanceQuery = query(
          collection(db, 'attendance'),
          where('studentId', '==', user.uid),
          orderBy('date', 'desc')
        );
        const attendanceSnap = await getDocs(attendanceQuery);
        setAttendance(attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Attendance));
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.uid]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!student) return <div className="text-center py-20 text-slate-500">Student profile not found. Please contact admin.</div>;

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="glass-panel rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
          <User className="w-12 h-12" />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
            <h2 className="text-3xl font-bold text-[#E5E5E5] font-urdu tracking-tight">{student.name}</h2>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest h-fit">
              {t('student_id')}: {student.studentId}
            </span>
          </div>
          <p className="text-neutral-500 font-urdu">{t('father_name')}: {student.fatherName}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 border-t border-white/5 pt-6">
            <div className="text-sm">
              <span className="text-neutral-600 block uppercase text-[10px] font-bold tracking-widest mb-1">{t('admission_date')}</span>
              <span className="font-bold text-neutral-300 tracking-tighter">{student.admissionDate}</span>
            </div>
            <div className="text-sm">
              <span className="text-neutral-600 block uppercase text-[10px] font-bold tracking-widest mb-1">{t('caste')}</span>
              <span className="font-bold text-neutral-300 font-urdu">{student.caste}</span>
            </div>
            <div className="text-sm">
              <span className="text-neutral-600 block uppercase text-[10px] font-bold tracking-widest mb-1">{t('age')}</span>
              <span className="font-bold text-neutral-300">{student.age}</span>
            </div>
            <div className="text-sm">
              <span className="text-neutral-600 block uppercase text-[10px] font-bold tracking-widest mb-1">{t('reference_number')}</span>
              <span className="font-bold text-neutral-300 font-mono text-[10px]">{student.referenceNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Navigation */}
      <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl w-fit glass-panel border-white/5">
        {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${
              activeTab === tab 
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' 
              : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {t(tab)}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Academic Record */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-[#E5E5E5] uppercase tracking-widest text-xs">{t('academic_report')}</h3>
              </div>
              
              {records.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                      <span className="text-amber-500 text-[10px] font-bold uppercase block mb-1 tracking-widest">{t('sabaqi')}</span>
                      <p className="text-neutral-300 font-urdu">{records[0].sabaqi || '---'}</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                      <span className="text-amber-500 text-[10px] font-bold uppercase block mb-1 tracking-widest">{t('sabqi')}</span>
                      <p className="text-neutral-300 font-urdu">{records[0].sabqi || '---'}</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                      <span className="text-amber-500 text-[10px] font-bold uppercase block mb-1 tracking-widest">{t('manzil')}</span>
                      <p className="text-neutral-300 font-urdu">{records[0].manzil || '---'}</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                      <span className="text-amber-500 text-[10px] font-bold uppercase block mb-1 tracking-widest">{t('duas')}</span>
                      <p className="text-neutral-300 font-urdu">{records[0].duas || '---'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-600 italic text-center py-12 text-sm uppercase tracking-widest font-bold">No academic record found for today</p>
              )}
            </div>

            {/* Namaz Record */}
            <div className="glass-panel rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-[#E5E5E5] uppercase tracking-widest text-xs">{t('namaz')}</h3>
                </div>
                {records.length > 0 && records[0].namaz ? (
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(records[0].namaz).map(([prayer, done]) => (
                      <div key={prayer} className={`text-center p-4 rounded-2xl border transition-all ${done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5'}`}>
                        <span className={`text-[10px] font-bold uppercase block mb-2 tracking-widest ${done ? 'text-emerald-400' : 'text-neutral-600'}`}>{prayer}</span>
                        <div className={`w-2.5 h-2.5 mx-auto rounded-full ${done ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-neutral-800'}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-600 italic text-center py-8 text-sm uppercase tracking-widest font-bold">Namaz record not available</p>
                )}
            </div>
          </div>

          {/* Sidebar: Attendance & Recent */}
          <div className="space-y-8">
            <div className="bg-[#0D0D0D] text-white rounded-3xl p-8 shadow-2xl border border-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="flex items-center justify-between mb-8 relative">
                <h3 className="font-bold uppercase tracking-widest text-xs text-neutral-400">{t('attendance')}</h3>
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex items-end gap-3 mb-4 relative">
                <span className="text-5xl font-bold font-serif text-[#E5E5E5]">
                  {attendance.filter(a => a.status === 'present').length}
                </span>
                <span className="text-neutral-600 mb-2 font-bold uppercase tracking-widest text-xs">/ {attendance.length}</span>
              </div>
              <p className="text-neutral-500 text-[10px] uppercase tracking-widest font-bold mb-8">Attendance rate for current session</p>
              
              <div className="space-y-1 relative">
                {attendance.slice(0, 5).map(att => (
                  <div key={att.id} className="flex items-center justify-between text-[10px] py-3 border-b border-white/5 group">
                    <span className="text-neutral-500 font-bold group-hover:text-neutral-300 transition-colors uppercase tracking-widest">{att.date}</span>
                    <span className={`font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                      att.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {t(att.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'daily' && (
        <div className="glass-panel rounded-3xl p-12 shadow-2xl text-center">
          <Activity className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-[#E5E5E5] mb-2 font-urdu">{t(activeTab)} Report</h3>
          <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-bold">Historical data analysis is being processed.</p>
        </div>
      )}
    </div>
  );
};
