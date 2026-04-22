import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "bismillah": "In the name of Allah, Most Gracious, Most Merciful",
      "jamia_name": "Jamia Naqshbandia Barvi Rizvia",
      "jamia_address": "Chak No. 109 GB Bajajanwala Jaranwala Faisalabad",
      "home": "Home",
      "login": "Login",
      "student_login": "Student Login",
      "admin_login": "Admin Login",
      "faisan_e_nazar": "Faisan-e-Nazar",
      "zair_e_nigrani": "Zair-e-Nigrani",
      "muallim": "Teacher Profile",
      "taqawun": "Please cooperate with Barvi Graphics Faisalabad",
      "student_id": "Student ID",
      "profile": "Profile",
      "attendance": "Attendance",
      "finance": "Finance",
      "academic_report": "Academic Report",
      "reports": "Reports",
      "daily": "Daily",
      "weekly": "Weekly",
      "monthly": "Monthly",
      "yearly": "Yearly",
      "name": "Name",
      "father_name": "Father Name",
      "caste": "Caste",
      "age": "Age",
      "address": "Address",
      "phone": "Phone",
      "whatsapp": "WhatsApp",
      "gmail": "Gmail",
      "admission_date": "Admission Date",
      "reference_number": "Reference Number",
      "sabaqi": "Sabaqi (Lessons)",
      "sabqi": "Sabqi",
      "manzil": "Manzil",
      "duas": "Duas",
      "namaz": "Namaz Record",
      "income": "Income",
      "expenses": "Expenses",
      "donor_name": "Donor Name",
      "amount": "Amount",
      "purpose": "Purpose",
      "date": "Date",
      "details": "Details",
      "add_student": "Add Student",
      "edit_student": "Edit Student",
      "delete_student": "Delete Student",
      "save": "Save",
      "cancel": "Cancel",
      "logout": "Logout"
    }
  },
  ur: {
    translation: {
      "bismillah": "بسم اللہ الرحمن الرحیم",
      "jamia_name": "جامعہ نقشبندیہ باروی رضویہ",
      "jamia_address": "چک نمبر 109 گ ب بجاجانوالہ جڑانوالہ فیصل آباد",
      "home": "ہوم",
      "login": "لاگ ان",
      "student_login": "طالب علم لاگ ان",
      "admin_login": "ایڈمن لاگ ان",
      "faisan_e_nazar": "فیضانِ نظر",
      "zair_e_nigrani": "زیرِ نگرانی",
      "muallim": "معلم پروفائل",
      "taqawun": "تعاون فرمائیں باروی گرافکس فیصل آباد",
      "student_id": "طالب علم آئی ڈی",
      "profile": "پروفائل",
      "attendance": "حاضری",
      "finance": "آمدن و خرچ",
      "academic_report": "تعلیمی رپورٹ",
      "reports": "رپورٹس",
      "daily": "روزانہ",
      "weekly": "ہفتہ وار",
      "monthly": "ماہانہ",
      "yearly": "سالانہ",
      "name": "نام",
      "father_name": "والد کا نام",
      "caste": "ذات",
      "age": "عمر",
      "address": "رہائش",
      "phone": "فون نمبر",
      "whatsapp": "واٹس ایپ",
      "gmail": "جی میل",
      "admission_date": "داخلہ تاریخ",
      "reference_number": "ریفرنس نمبر",
      "sabaqi": "سبق سبقی",
      "sabqi": "سبقی",
      "manzil": "منزل",
      "duas": "دعائیں",
      "namaz": "نماز ریکارڈ",
      "income": "آمدن",
      "expenses": "خرچ",
      "donor_name": "دینے والے کا نام",
      "amount": "رقم",
      "purpose": "مقصد",
      "date": "تاریخ",
      "details": "تفصیل",
      "add_student": "طالب علم شامل کریں",
      "edit_student": "طالب علم ایڈٹ کریں",
      "delete_student": "طالب علم ڈیلیٹ کریں",
      "save": "محفوظ کریں",
      "cancel": "منسوخ کریں",
      "logout": "لاگ آؤٹ"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ur',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
