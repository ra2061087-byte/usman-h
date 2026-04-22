export interface Student {
  id: string;
  studentId: string;
  name: string;
  fatherName: string;
  caste: string;
  age: number;
  address: string;
  phone: string;
  whatsapp: string;
  gmail: string;
  admissionDate: string;
  referenceNumber: string;
  createdAt: string;
}

export interface AcademicRecord {
  id: string;
  studentId: string;
  date: string;
  sabaqi: string;
  sabqi: string;
  manzil: string;
  duas: string;
  namaz: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  updatedAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
}

export interface Income {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  purpose: string;
}

export interface Expense {
  id: string;
  details: string;
  amount: number;
  purpose: string;
  date: string;
}
