import { useState, useMemo } from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface HadithTranslation {
  bengali: string;
  english: string;
  arabic: string;
  urdu: string;
  turkish: string;
}

interface Hadith {
  translations: HadithTranslation;
  arabicOriginal: string;
  source: string;
  chapter: string;
}

// Collection of hadiths that will rotate daily
const hadithCollection: Hadith[] = [
  {
    translations: {
      bengali: "জ্ঞান অনুন্ধান করা প্রতিটি মুসলিমের জন্য বাধ্যতামূলক।",
      english: "Seeking knowledge is an obligation upon every Muslim.",
      arabic: "طلب العلم فريضة على كل مسلم",
      urdu: "علم حاصل کرنا ہر مسلمان پر فرض ہے۔",
      turkish: "İlim öğrenmek her Müslümana farzdır.",
    },
    arabicOriginal: "طلب العلم فريضة على كل مسلم",
    source: "Ibn Majah",
    chapter: "Knowledge",
  },
  {
    translations: {
      bengali: "কর্মের ফলাফল নিয়তের উপর নির্ভরশীল।",
      english: "Actions are judged by intentions.",
      arabic: "إنما الأعمال بالنيات",
      urdu: "اعمال کا دارومدار نیتوں پر ہے۔",
      turkish: "Ameller niyetlere göredir.",
    },
    arabicOriginal: "إنما الأعمال بالنيات",
    source: "Sahih Bukhari",
    chapter: "Revelation",
  },
  {
    translations: {
      bengali: "যে ব্যক্তি আল্লাহ ও শেষ দিবসে বিশ্বাস করে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
      english: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
      arabic: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت",
      urdu: "جو اللہ اور آخرت پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے۔",
      turkish: "Allah'a ve ahiret gününe iman eden ya hayır söylesin ya da sussun.",
    },
    arabicOriginal: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت",
    source: "Sahih Bukhari",
    chapter: "Belief",
  },
  {
    translations: {
      bengali: "তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি যে কুরআন শেখে এবং অন্যদের শেখায়।",
      english: "The best of you is the one who learns the Quran and teaches it.",
      arabic: "خيركم من تعلم القرآن وعلمه",
      urdu: "تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔",
      turkish: "En hayırlınız Kuran'ı öğrenen ve öğretendir.",
    },
    arabicOriginal: "خيركم من تعلم القرآن وعلمه",
    source: "Sahih Bukhari",
    chapter: "Knowledge",
  },
  {
    translations: {
      bengali: "মুমিনদের মধ্যে সবচেয়ে পূর্ণ ঈমানের অধিকারী সে যার চরিত্র সবচেয়ে সুন্দর।",
      english: "The most complete believer in faith is the one with the best character.",
      arabic: "أكمل المؤمنين إيماناً أحسنهم خلقاً",
      urdu: "ایمان میں سب سے کامل وہ ہے جس کا اخلاق سب سے اچھا ہو۔",
      turkish: "İmanda en olgun olan, ahlakı en güzel olandır.",
    },
    arabicOriginal: "أكمل المؤمنين إيماناً أحسنهم خلقاً",
    source: "Abu Dawud",
    chapter: "Character",
  },
  {
    translations: {
      bengali: "মুসলিম সেই ব্যক্তি যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।",
      english: "A Muslim is the one from whose tongue and hands other Muslims are safe.",
      arabic: "المسلم من سلم المسلمون من لسانه ويده",
      urdu: "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔",
      turkish: "Müslüman, dilinden ve elinden diğer Müslümanların selamette olduğu kimsedir.",
    },
    arabicOriginal: "المسلم من سلم المسلمون من لسانه ويده",
    source: "Sahih Bukhari",
    chapter: "Belief",
  },
  {
    translations: {
      bengali: "লজ্জাশীলতা ঈমানের অংশ।",
      english: "Modesty is part of faith.",
      arabic: "الحياء من الإيمان",
      urdu: "حیا ایمان کا حصہ ہے۔",
      turkish: "Hayâ imandan bir şubedir.",
    },
    arabicOriginal: "الحياء من الإيمان",
    source: "Sahih Bukhari",
    chapter: "Belief",
  },
];

// Function to get hadith based on current date
const getDailyHadith = (): Hadith => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hadithIndex = dayOfYear % hadithCollection.length;
  return hadithCollection[hadithIndex];
};

type Language = "bengali" | "english" | "arabic" | "urdu" | "turkish";

const languages: { key: Language; label: string }[] = [
  { key: "bengali", label: "বাংলা" },
  { key: "english", label: "English" },
  { key: "arabic", label: "العربية" },
  { key: "urdu", label: "اردو" },
  { key: "turkish", label: "Türkçe" },
];

const DailyHadith = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<Language>("bengali");
  
  // Get today's hadith - memoized so it doesn't change during the session
  const dailyHadith = useMemo(() => getDailyHadith(), []);

  return (
    <motion.div 
      className="rounded-3xl overflow-hidden shadow-xl relative"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Outer golden border frame */}
      <motion.div 
        className="absolute inset-0 rounded-3xl border-4 border-amber-400/60 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      />
      
      {/* Golden Header with curved bottom */}
      <div className="relative">
        {/* Main golden gradient header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 pt-4 pb-12 px-5 relative overflow-hidden">
          {/* Decorative golden frame lines */}
          <div className="absolute inset-x-2 top-2 bottom-8 border-2 border-amber-500/40 rounded-2xl" />
          
          {/* Decorative moon/circle with sparkles */}
          <div className="absolute right-8 top-4 w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/80 to-amber-300/60 rounded-full blur-sm" />
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-100/90 to-amber-200/70 rounded-full" />
            {/* Sparkle dots */}
            <div className="absolute -left-4 top-2 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute -left-2 top-8 w-1.5 h-1.5 bg-yellow-100 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
            <div className="absolute left-0 bottom-0 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          
          {/* Header content */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50">
              <BookOpen size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-amber-900 font-bold text-2xl font-arabic tracking-wide">হাদীস টুডে</h3>
              <p className="text-amber-800/90 text-sm font-semibold">Hadith Today</p>
            </div>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
          <svg viewBox="0 0 400 30" preserveAspectRatio="none" className="w-full h-full">
            <path 
              d="M0,0 L0,20 Q200,35 400,20 L400,0 Z" 
              fill="url(#goldGradient)"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Content area with cream/beige background */}
      <div className="bg-gradient-to-b from-amber-50 via-orange-50/50 to-amber-100/80 px-5 pt-6 pb-5 relative">
        {/* Subtle Islamic geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b45309' fill-opacity='1'%3E%3Cpath d='M30 30l15-15v30L30 30zM30 30L15 15v30l15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="relative z-10 space-y-5">
          {/* Translation Text */}
          <p className={`text-2xl font-bold text-amber-900 leading-relaxed ${
            selectedLang === "arabic" || selectedLang === "urdu" ? "text-right font-arabic" : ""
          } ${selectedLang === "bengali" ? "font-arabic" : ""}`}>
            {dailyHadith.translations[selectedLang]}
          </p>

          {/* Arabic Original - always shown */}
          {selectedLang !== "arabic" && (
            <p className="text-right text-amber-600 font-arabic text-xl leading-relaxed" dir="rtl">
              {dailyHadith.arabicOriginal}
            </p>
          )}

          {/* Language Selector Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {languages.map((lang) => (
              <button
                key={lang.key}
                onClick={() => setSelectedLang(lang.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border-2 ${
                  selectedLang === lang.key
                    ? "bg-gradient-to-r from-amber-300 to-yellow-300 text-amber-900 border-amber-400 shadow-md"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Footer with source and Read More button */}
          <div className="flex items-end justify-between pt-4">
            <div>
              <p className="font-bold text-amber-900 text-lg">{dailyHadith.source}</p>
              <p className="text-amber-600 font-medium">{dailyHadith.chapter}</p>
            </div>
            <motion.button 
              onClick={() => navigate("/bukhari")}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-amber-700 font-bold rounded-full shadow-md transition-colors duration-200 hover:shadow-lg border-2 border-amber-200 overflow-hidden relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <span className="relative z-10">Read More</span>
              <motion.span
                className="relative z-10"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ChevronRight size={18} className="group-hover:text-amber-800 transition-colors" />
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyHadith;
