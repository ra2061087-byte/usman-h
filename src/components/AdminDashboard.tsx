import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../lib/firebase';
import { 
  collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc, 
  addDoc, serverTimestamp, orderBy, where, limit 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Handle student accounts
import { Student, AcademicRecord, Attendance, Income, Expense } from '../types';
import { 
  Users, Calendar, BookCheck, Wallet, Plus, Search, 
  Edit, Trash2, Check, X, FileText, TrendingUp, TrendingDown,
  BarChart3
} from 'lucide-react';

type AdminTab = 'students' | 'attendance' | 'academic' | 'finance' | 'reports';

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<AdminTab>('students');
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Stats
  const [totalIncome, setTotalIncome] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'students'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setStudents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Student));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinance = async () => {
    const incomeSnap = await getDocs(collection(db, 'income'));
    const expenseSnap = await getDocs(collection(db, 'expenses'));
    
    setTotalIncome(incomeSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0));
    setTotalExpense(expenseSnap.docs.reduce((acc, doc) => acc + (doc.data().amount || 0), 0));
  };

  React.useEffect(() => {
    fetchStudents();
    fetchFinance();
  }, []);

  const navItems = [
    { id: 'students', label: 'students', icon: Users },
    { id: 'attendance', label: 'attendance', icon: Calendar },
    { id: 'academic', label: 'academic_report', icon: BookCheck },
    { id: 'finance', label: 'finance', icon: Wallet },
    { id: 'reports', label: 'reports', icon: FileText },
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId.includes(searchTerm)
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Nav */}
      <aside className="w-full lg:w-64 space-y-3">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as AdminTab)}
            className={`w-full flex items-center gap-3 px-6 py-3.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
              activeTab === item.id 
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' 
              : 'text-neutral-500 hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-urdu">{t(item.label)}</span>
          </button>
        ))}
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'students' && (
            <StudentManager 
              key="students" 
              students={filteredStudents} 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              refresh={fetchStudents} 
            />
          )}
          {activeTab === 'attendance' && <AttendanceManager key="attendance" students={students} />}
          {activeTab === 'academic' && <AcademicManager key="academic" students={students} />}
          {activeTab === 'finance' && <FinanceManager key="finance" income={totalIncome} expense={totalExpense} refresh={fetchFinance} />}
          {activeTab === 'reports' && <ReportsView key="reports" students={students} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- Sub Components ---

const StudentManager = ({ students, searchTerm, setSearchTerm, refresh }: any) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteDoc(doc(db, 'students', id));
      refresh();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-1 focus:ring-amber-500 text-sm"
            placeholder="Search database..."
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto bg-amber-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-amber-900/20"
        >
          <Plus className="w-4 h-4" />
          {t('add_student')}
        </button>
      </div>

      {isAdding ? (
        <StudentForm onCancel={() => setIsAdding(false)} onSuccess={() => { setIsAdding(false); refresh(); }} />
      ) : (
        <div className="glass-panel rounded-3xl shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t('name')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t('student_id')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t('phone')}</th>
                <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((s: Student) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#E5E5E5] font-urdu group-hover:text-amber-400 transition-colors">{s.name}</p>
                    <p className="text-[10px] text-neutral-600 font-urdu">{s.fatherName}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-neutral-400">{s.studentId}</td>
                  <td className="px-6 py-4 text-xs text-neutral-500">{s.phone}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <div className="py-20 text-center text-neutral-600 italic text-sm font-bold uppercase tracking-widest">No matching records found</div>}
        </div>
      )}
    </motion.div>
  );
};

const StudentForm = ({ onCancel, onSuccess }: any) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '', fatherName: '', caste: '', age: '', address: '',
    phone: '', whatsapp: '', gmail: '', admissionDate: new Date().toISOString().split('T')[0],
    referenceNumber: '', studentId: `JN-${Math.floor(1000 + Math.random() * 9000)}`
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.gmail, formData.studentId);
      
      await setDoc(doc(db, 'students', userCred.user.uid), {
        ...formData,
        age: Number(formData.age),
        createdAt: serverTimestamp()
      });
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-8 font-urdu text-[#E5E5E5]">{t('add_student')}</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input placeholder={t('name')} required className="p-3 bg-white/5 border border-white/10 rounded-xl font-urdu outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <input placeholder={t('father_name')} required className="p-3 bg-white/5 border border-white/10 rounded-xl font-urdu outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
        <input placeholder={t('caste')} className="p-3 bg-white/5 border border-white/10 rounded-xl font-urdu outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.caste} onChange={e => setFormData({...formData, caste: e.target.value})} />
        <input placeholder={t('age')} type="number" className="p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
        <input placeholder={t('phone')} className="p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        <input placeholder={t('whatsapp')} className="p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
        <input placeholder={t('gmail')} type="email" required className="p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.gmail} onChange={e => setFormData({...formData, gmail: e.target.value})} />
        <input placeholder={t('reference_number')} className="p-3 bg-white/5 border border-white/10 rounded-xl font-urdu outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.referenceNumber} onChange={e => setFormData({...formData, referenceNumber: e.target.value})} />
        <input placeholder={t('address')} className="p-3 bg-white/5 border border-white/10 rounded-xl md:col-span-2 font-urdu outline-none focus:ring-1 focus:ring-amber-500 transition-all" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
        <div className="flex justify-end gap-3 md:col-span-2 mt-4">
          <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-white/5 font-bold text-neutral-500 uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">{t('cancel')}</button>
          <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-xl bg-amber-600 text-white font-bold disabled:opacity-50 uppercase text-[10px] tracking-widest shadow-lg shadow-amber-900/20 transition-all">{loading ? 'Saving...' : t('save')}</button>
        </div>
      </form>
    </div>
  );
};

const AttendanceManager = ({ students, key }: { students: Student[], key?: string }) => {
  const { t } = useTranslation();
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = React.useState<Record<string, 'present' | 'absent' | 'leave'>>({});

  const markAll = (status: 'present' | 'absent') => {
    const newAtt: any = {};
    students.forEach(s => newAtt[s.id] = status);
    setAttendance(newAtt);
  };

  const saveAttendance = async () => {
    try {
      const promises = Object.entries(attendance).map(([studentId, status]) => {
        const id = `${studentId}_${date}`;
        return setDoc(doc(db, 'attendance', id), {
          studentId, date, status, updatedAt: serverTimestamp()
        });
      });
      await Promise.all(promises);
      alert('Attendance saved successfully!');
    } catch (err) {
      alert('Error saving attendance');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-panel p-6 rounded-3xl">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-1 focus:ring-amber-500 text-sm text-neutral-300" />
        <div className="flex gap-4">
          <button onClick={() => markAll('present')} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Mark All Present</button>
          <button onClick={saveAttendance} className="bg-amber-600 text-white px-8 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-amber-900/20 transition-all">Save All</button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t('name')}</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-bold text-[#E5E5E5] font-urdu group-hover:text-amber-400 transition-colors">{s.name}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {(['present', 'absent', 'leave'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setAttendance({...attendance, [s.id]: st})}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                          attendance[s.id] === st 
                          ? (st === 'present' ? 'bg-emerald-500 text-white' : st === 'absent' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white')
                          : 'bg-white/5 text-neutral-600 hover:bg-white/10'
                        }`}
                      >
                        {t(st)}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const AcademicManager = ({ students, key }: { students: Student[], key?: string }) => {
  const { t } = useTranslation();
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [record, setRecord] = React.useState({ sabaqi: '', sabqi: '', manzil: '', duas: '', namaz: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false } });

  const saveRecord = async () => {
    if (!selectedStudent) return;
    try {
      const id = `${selectedStudent.id}_${date}`;
      await setDoc(doc(db, 'academic_records', id), {
        studentId: selectedStudent.id,
        date,
        ...record,
        updatedAt: serverTimestamp()
      });
      alert('Record saved!');
      setSelectedStudent(null);
    } catch (err) {
      alert('Error saving record');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {!selectedStudent ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(s => (
            <button 
              key={s.id} 
              onClick={() => setSelectedStudent(s)}
              className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 hover:border-amber-500/30 text-left transition-all group shadow-xl"
            >
              <h4 className="font-bold text-[#E5E5E5] font-urdu group-hover:text-amber-400 text-lg transition-colors">{s.name}</h4>
              <p className="text-[10px] text-neutral-600 font-urdu mt-1 uppercase tracking-widest font-bold">{s.fatherName}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-10 rounded-3xl shadow-2xl max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-6">
            <div>
              <h3 className="text-3xl font-bold font-urdu text-[#E5E5E5]">{selectedStudent.name}</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mt-2">Daily Progress Record</p>
            </div>
            <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-500"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2">Record Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" />
              </div>
              <input placeholder={t('sabaqi')} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl font-urdu text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" value={record.sabaqi} onChange={e => setRecord({...record, sabaqi: e.target.value})} />
              <input placeholder={t('sabqi')} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl font-urdu text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" value={record.sabqi} onChange={e => setRecord({...record, sabqi: e.target.value})} />
              <input placeholder={t('manzil')} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl font-urdu text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" value={record.manzil} onChange={e => setRecord({...record, manzil: e.target.value})} />
              <input placeholder={t('duas')} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl font-urdu text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" value={record.duas} onChange={e => setRecord({...record, duas: e.target.value})} />
            </div>
            
            <div className="pt-8 border-t border-white/5">
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-6">{t('namaz')}</p>
              <div className="grid grid-cols-5 gap-3">
                {Object.keys(record.namaz).map(p => (
                  <button 
                    key={p} 
                    onClick={() => setRecord({...record, namaz: {...record.namaz, [p]: !record.namaz[p as keyof typeof record.namaz]}})}
                    className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${record.namaz[p as keyof typeof record.namaz] ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'bg-white/5 text-neutral-600 hover:bg-white/10'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={saveRecord} className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl mt-8 uppercase text-xs tracking-widest shadow-lg shadow-amber-900/40 hover:bg-amber-700 transition-all">{t('save_record')}</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const FinanceManager = ({ income, expense, refresh, key }: any) => {
  const { t } = useTranslation();
  const [type, setType] = React.useState<'income' | 'expense'>('income');
  const [data, setData] = React.useState({ name: '', amount: '', purpose: '', details: '' });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const collectionName = type === 'income' ? 'income' : 'expenses';
      const payload = type === 'income' 
        ? { donorName: data.name, amount: Number(data.amount), purpose: data.purpose, date: new Date().toISOString() }
        : { details: data.details, amount: Number(data.amount), purpose: data.purpose, date: new Date().toISOString() };
      
      await addDoc(collectionName === 'income' ? collection(db, 'income') : collection(db, 'expenses'), payload);
      alert('Finance record added!');
      setData({ name: '', amount: '', purpose: '', details: '' });
      refresh();
    } catch (err) {
      alert('Error saving record');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-500/5 p-10 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <h4 className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">{t('income')}</h4>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-4xl font-bold text-emerald-400 font-serif relative">Rs. {income.toLocaleString()}</p>
        </div>
        <div className="bg-red-500/5 p-10 rounded-3xl border border-red-500/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <h4 className="text-red-500 font-bold uppercase tracking-widest text-[10px]">{t('expenses')}</h4>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-4xl font-bold text-red-400 font-serif relative">Rs. {expense.toLocaleString()}</p>
        </div>
      </div>

      <div className="glass-panel p-10 rounded-3xl shadow-2xl max-w-xl mx-auto">
        <div className="flex gap-2 mb-10 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button onClick={() => setType('income')} className={`flex-grow py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${type === 'income' ? 'bg-amber-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}>{t('income')}</button>
          <button onClick={() => setType('expense')} className={`flex-grow py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-red-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}>{t('expenses')}</button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {type === 'income' ? (
            <input placeholder={t('donor_name')} required className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl font-urdu text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
          ) : (
            <input placeholder={t('details')} required className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl font-urdu text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" value={data.details} onChange={e => setData({...data, details: e.target.value})} />
          )}
          <input placeholder={t('amount')} type="number" required className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" value={data.amount} onChange={e => setData({...data, amount: e.target.value})} />
          <input placeholder={t('purpose')} className="w-full p-3.5 bg-white/5 border border-white/10 rounded-xl font-urdu text-neutral-300 outline-none focus:ring-1 focus:ring-amber-500" value={data.purpose} onChange={e => setData({...data, purpose: e.target.value})} />
          <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white transition-all uppercase text-[10px] tracking-widest mt-4 shadow-xl ${type === 'income' ? 'bg-amber-600 shadow-amber-900/20' : 'bg-red-600 shadow-red-900/20'}`}>
            {t('save_transaction')}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

const ReportsView = ({ students, key }: any) => {
  return (
    <div className="glass-panel p-20 rounded-3xl shadow-2xl text-center">
       <BarChart3 className="w-16 h-16 text-neutral-800 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-[#E5E5E5] mb-2 uppercase tracking-widest text-sm">Institutional Analytics</h3>
      <p className="text-neutral-500 font-urdu">جامعہ کی تعلیمی اور مالیاتی رپورٹس یہاں دستیاب ہوں گی۔</p>
    </div>
  );
};
