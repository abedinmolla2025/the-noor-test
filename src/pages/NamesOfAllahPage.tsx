import { useState } from "react";
import { ArrowLeft, Search, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface NameOfAllah {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  bengaliMeaning?: string;
}

const namesOfAllah: NameOfAllah[] = [
  { id: 1, arabic: "الرَّحْمَنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious", bengaliMeaning: "পরম করুণাময়" },
  { id: 2, arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful", bengaliMeaning: "পরম দয়ালু" },
  { id: 3, arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King", bengaliMeaning: "রাজাধিরাজ" },
  { id: 4, arabic: "الْقُدُّوسُ", transliteration: "Al-Quddus", meaning: "The Most Holy", bengaliMeaning: "পবিত্রতম" },
  { id: 5, arabic: "السَّلَامُ", transliteration: "As-Salam", meaning: "The Source of Peace", bengaliMeaning: "শান্তিদাতা" },
  { id: 6, arabic: "الْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning: "The Guardian of Faith", bengaliMeaning: "বিশ্বাসের রক্ষক" },
  { id: 7, arabic: "الْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning: "The Protector", bengaliMeaning: "রক্ষাকর্তা" },
  { id: 8, arabic: "الْعَزِيزُ", transliteration: "Al-Aziz", meaning: "The Almighty", bengaliMeaning: "পরাক্রমশালী" },
  { id: 9, arabic: "الْجَبَّارُ", transliteration: "Al-Jabbar", meaning: "The Compeller", bengaliMeaning: "মহাপ্রতাপশালী" },
  { id: 10, arabic: "الْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning: "The Supreme", bengaliMeaning: "শ্রেষ্ঠতম" },
  { id: 11, arabic: "الْخَالِقُ", transliteration: "Al-Khaliq", meaning: "The Creator", bengaliMeaning: "সৃষ্টিকর্তা" },
  { id: 12, arabic: "الْبَارِئُ", transliteration: "Al-Bari", meaning: "The Evolver", bengaliMeaning: "উদ্ভাবক" },
  { id: 13, arabic: "الْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning: "The Fashioner", bengaliMeaning: "আকৃতিদাতা" },
  { id: 14, arabic: "الْغَفَّارُ", transliteration: "Al-Ghaffar", meaning: "The Forgiver", bengaliMeaning: "ক্ষমাশীল" },
  { id: 15, arabic: "الْقَهَّارُ", transliteration: "Al-Qahhar", meaning: "The Subduer", bengaliMeaning: "পরাভূতকারী" },
  { id: 16, arabic: "الْوَهَّابُ", transliteration: "Al-Wahhab", meaning: "The Bestower", bengaliMeaning: "দানকারী" },
  { id: 17, arabic: "الرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning: "The Provider", bengaliMeaning: "রিজিকদাতা" },
  { id: 18, arabic: "الْفَتَّاحُ", transliteration: "Al-Fattah", meaning: "The Opener", bengaliMeaning: "উদ্ঘাটক" },
  { id: 19, arabic: "اَلْعَلِيْمُ", transliteration: "Al-Alim", meaning: "The All-Knowing", bengaliMeaning: "সর্বজ্ঞ" },
  { id: 20, arabic: "الْقَابِضُ", transliteration: "Al-Qabid", meaning: "The Constrictor", bengaliMeaning: "সংকোচক" },
  { id: 21, arabic: "الْبَاسِطُ", transliteration: "Al-Basit", meaning: "The Expander", bengaliMeaning: "প্রসারক" },
  { id: 22, arabic: "الْخَافِضُ", transliteration: "Al-Khafid", meaning: "The Abaser", bengaliMeaning: "অবনমনকারী" },
  { id: 23, arabic: "الرَّافِعُ", transliteration: "Ar-Rafi", meaning: "The Exalter", bengaliMeaning: "উন্নীতকারী" },
  { id: 24, arabic: "الْمُعِزُّ", transliteration: "Al-Mu'izz", meaning: "The Bestower of Honor", bengaliMeaning: "সম্মানদাতা" },
  { id: 25, arabic: "المُذِلُّ", transliteration: "Al-Muzil", meaning: "The Humiliator", bengaliMeaning: "অপমানকারী" },
  { id: 26, arabic: "السَّمِيعُ", transliteration: "As-Sami", meaning: "The All-Hearing", bengaliMeaning: "সর্বশ্রোতা" },
  { id: 27, arabic: "الْبَصِيرُ", transliteration: "Al-Basir", meaning: "The All-Seeing", bengaliMeaning: "সর্বদ্রষ্টা" },
  { id: 28, arabic: "الْحَكَمُ", transliteration: "Al-Hakam", meaning: "The Judge", bengaliMeaning: "বিচারক" },
  { id: 29, arabic: "الْعَدْلُ", transliteration: "Al-Adl", meaning: "The Just", bengaliMeaning: "ন্যায়বিচারক" },
  { id: 30, arabic: "اللَّطِيفُ", transliteration: "Al-Latif", meaning: "The Subtle One", bengaliMeaning: "সূক্ষ্মদর্শী" },
  { id: 31, arabic: "الْخَبِيرُ", transliteration: "Al-Khabir", meaning: "The All-Aware", bengaliMeaning: "সর্বজ্ঞাত" },
  { id: 32, arabic: "الْحَلِيمُ", transliteration: "Al-Halim", meaning: "The Forbearing", bengaliMeaning: "ধৈর্যশীল" },
  { id: 33, arabic: "الْعَظِيمُ", transliteration: "Al-Azim", meaning: "The Magnificent", bengaliMeaning: "মহান" },
  { id: 34, arabic: "الْغَفُورُ", transliteration: "Al-Ghafur", meaning: "The All-Forgiving", bengaliMeaning: "মহাক্ষমাশীল" },
  { id: 35, arabic: "الشَّكُورُ", transliteration: "Ash-Shakur", meaning: "The Appreciative", bengaliMeaning: "কৃতজ্ঞতাপূর্ণ" },
  { id: 36, arabic: "الْعَلِيُّ", transliteration: "Al-Ali", meaning: "The Highest", bengaliMeaning: "সর্বোচ্চ" },
  { id: 37, arabic: "الْكَبِيرُ", transliteration: "Al-Kabir", meaning: "The Greatest", bengaliMeaning: "মহীয়ান" },
  { id: 38, arabic: "الْحَفِيظُ", transliteration: "Al-Hafiz", meaning: "The Preserver", bengaliMeaning: "সংরক্ষক" },
  { id: 39, arabic: "المُقِيتُ", transliteration: "Al-Muqit", meaning: "The Sustainer", bengaliMeaning: "পালনকর্তা" },
  { id: 40, arabic: "الْحَسِيبُ", transliteration: "Al-Hasib", meaning: "The Reckoner", bengaliMeaning: "হিসাবকারী" },
  { id: 41, arabic: "الْجَلِيلُ", transliteration: "Al-Jalil", meaning: "The Majestic", bengaliMeaning: "মহিমান্বিত" },
  { id: 42, arabic: "الْكَرِيمُ", transliteration: "Al-Karim", meaning: "The Generous", bengaliMeaning: "মহানুভব" },
  { id: 43, arabic: "الرَّقِيبُ", transliteration: "Ar-Raqib", meaning: "The Watchful", bengaliMeaning: "পর্যবেক্ষক" },
  { id: 44, arabic: "الْمُجِيبُ", transliteration: "Al-Mujib", meaning: "The Responsive", bengaliMeaning: "উত্তরদাতা" },
  { id: 45, arabic: "الْوَاسِعُ", transliteration: "Al-Wasi", meaning: "The All-Encompassing", bengaliMeaning: "সর্বব্যাপী" },
  { id: 46, arabic: "الْحَكِيمُ", transliteration: "Al-Hakim", meaning: "The Wise", bengaliMeaning: "প্রজ্ঞাময়" },
  { id: 47, arabic: "الْوَدُودُ", transliteration: "Al-Wadud", meaning: "The Loving One", bengaliMeaning: "প্রেমময়" },
  { id: 48, arabic: "الْمَجِيدُ", transliteration: "Al-Majid", meaning: "The Glorious", bengaliMeaning: "গৌরবান্বিত" },
  { id: 49, arabic: "الْبَاعِثُ", transliteration: "Al-Ba'ith", meaning: "The Resurrector", bengaliMeaning: "পুনরুত্থানকারী" },
  { id: 50, arabic: "الشَّهِيدُ", transliteration: "Ash-Shahid", meaning: "The Witness", bengaliMeaning: "সাক্ষী" },
  { id: 51, arabic: "الْحَقُّ", transliteration: "Al-Haqq", meaning: "The Truth", bengaliMeaning: "সত্য" },
  { id: 52, arabic: "الْوَكِيلُ", transliteration: "Al-Wakil", meaning: "The Trustee", bengaliMeaning: "অভিভাবক" },
  { id: 53, arabic: "الْقَوِيُّ", transliteration: "Al-Qawiyy", meaning: "The Strong", bengaliMeaning: "শক্তিমান" },
  { id: 54, arabic: "الْمَتِينُ", transliteration: "Al-Matin", meaning: "The Firm One", bengaliMeaning: "দৃঢ়" },
  { id: 55, arabic: "الْوَلِيُّ", transliteration: "Al-Waliyy", meaning: "The Protecting Friend", bengaliMeaning: "অভিভাবক বন্ধু" },
  { id: 56, arabic: "الْحَمِيدُ", transliteration: "Al-Hamid", meaning: "The Praiseworthy", bengaliMeaning: "প্রশংসনীয়" },
  { id: 57, arabic: "الْمُحْصِي", transliteration: "Al-Muhsi", meaning: "The Accounter", bengaliMeaning: "গণনাকারী" },
  { id: 58, arabic: "الْمُبْدِئُ", transliteration: "Al-Mubdi", meaning: "The Originator", bengaliMeaning: "আদি সৃষ্টিকর্তা" },
  { id: 59, arabic: "الْمُعِيدُ", transliteration: "Al-Mu'id", meaning: "The Restorer", bengaliMeaning: "পুনঃসৃষ্টিকর্তা" },
  { id: 60, arabic: "الْمُحْيِي", transliteration: "Al-Muhyi", meaning: "The Giver of Life", bengaliMeaning: "জীবনদাতা" },
  { id: 61, arabic: "اَلْمُمِيتُ", transliteration: "Al-Mumit", meaning: "The Taker of Life", bengaliMeaning: "মৃত্যুদাতা" },
  { id: 62, arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: "The Ever Living", bengaliMeaning: "চিরঞ্জীব" },
  { id: 63, arabic: "الْقَيُّومُ", transliteration: "Al-Qayyum", meaning: "The Self-Existing", bengaliMeaning: "স্বয়ংসম্পূর্ণ" },
  { id: 64, arabic: "الْوَاجِدُ", transliteration: "Al-Wajid", meaning: "The Finder", bengaliMeaning: "প্রাপ্তিকর্তা" },
  { id: 65, arabic: "الْمَاجِدُ", transliteration: "Al-Majid", meaning: "The Noble", bengaliMeaning: "মহৎ" },
  { id: 66, arabic: "الْوَاحِدُ", transliteration: "Al-Wahid", meaning: "The Only One", bengaliMeaning: "এক" },
  { id: 67, arabic: "اَلاَحَدُ", transliteration: "Al-Ahad", meaning: "The One", bengaliMeaning: "একক" },
  { id: 68, arabic: "الصَّمَدُ", transliteration: "As-Samad", meaning: "The Eternal", bengaliMeaning: "চিরস্থায়ী" },
  { id: 69, arabic: "الْقَادِرُ", transliteration: "Al-Qadir", meaning: "The Able", bengaliMeaning: "সক্ষম" },
  { id: 70, arabic: "الْمُقْتَدِرُ", transliteration: "Al-Muqtadir", meaning: "The Powerful", bengaliMeaning: "ক্ষমতাবান" },
  { id: 71, arabic: "الْمُقَدِّمُ", transliteration: "Al-Muqaddim", meaning: "The Expediter", bengaliMeaning: "অগ্রসরকারী" },
  { id: 72, arabic: "الْمُؤَخِّرُ", transliteration: "Al-Mu'akhkhir", meaning: "The Delayer", bengaliMeaning: "বিলম্বকারী" },
  { id: 73, arabic: "الأوَّلُ", transliteration: "Al-Awwal", meaning: "The First", bengaliMeaning: "প্রথম" },
  { id: 74, arabic: "الآخِرُ", transliteration: "Al-Akhir", meaning: "The Last", bengaliMeaning: "শেষ" },
  { id: 75, arabic: "الظَّاهِرُ", transliteration: "Az-Zahir", meaning: "The Manifest", bengaliMeaning: "প্রকাশ্য" },
  { id: 76, arabic: "الْبَاطِنُ", transliteration: "Al-Batin", meaning: "The Hidden", bengaliMeaning: "গুপ্ত" },
  { id: 77, arabic: "الْوَالِي", transliteration: "Al-Wali", meaning: "The Governor", bengaliMeaning: "শাসক" },
  { id: 78, arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", meaning: "The Most Exalted", bengaliMeaning: "সর্বোচ্চ মহিমাময়" },
  { id: 79, arabic: "الْبَرُّ", transliteration: "Al-Barr", meaning: "The Source of Goodness", bengaliMeaning: "পুণ্যদাতা" },
  { id: 80, arabic: "التَّوَابُ", transliteration: "At-Tawwab", meaning: "The Acceptor of Repentance", bengaliMeaning: "তওবা গ্রহণকারী" },
  { id: 81, arabic: "الْمُنْتَقِمُ", transliteration: "Al-Muntaqim", meaning: "The Avenger", bengaliMeaning: "প্রতিশোধ গ্রহণকারী" },
  { id: 82, arabic: "العَفُوُّ", transliteration: "Al-Afuww", meaning: "The Pardoner", bengaliMeaning: "ক্ষমাকারী" },
  { id: 83, arabic: "الرَّؤُوفُ", transliteration: "Ar-Ra'uf", meaning: "The Compassionate", bengaliMeaning: "স্নেহশীল" },
  { id: 84, arabic: "مَالِكُ الْمُلْكِ", transliteration: "Malik-ul-Mulk", meaning: "Owner of Sovereignty", bengaliMeaning: "সার্বভৌমত্বের মালিক" },
  { id: 85, arabic: "ذُوالْجَلاَلِ وَالإكْرَامِ", transliteration: "Dhul-Jalal wal-Ikram", meaning: "Lord of Majesty", bengaliMeaning: "মহিমা ও সম্মানের অধিকারী" },
  { id: 86, arabic: "الْمُقْسِطُ", transliteration: "Al-Muqsit", meaning: "The Equitable", bengaliMeaning: "ন্যায়পরায়ণ" },
  { id: 87, arabic: "الْجَامِعُ", transliteration: "Al-Jami", meaning: "The Gatherer", bengaliMeaning: "সংগ্রাহক" },
  { id: 88, arabic: "الْغَنِيُّ", transliteration: "Al-Ghani", meaning: "The Self-Sufficient", bengaliMeaning: "অভাবমুক্ত" },
  { id: 89, arabic: "الْمُغْنِي", transliteration: "Al-Mughni", meaning: "The Enricher", bengaliMeaning: "সমৃদ্ধকারী" },
  { id: 90, arabic: "اَلْمَانِعُ", transliteration: "Al-Mani", meaning: "The Preventer", bengaliMeaning: "বাধাদানকারী" },
  { id: 91, arabic: "الضَّارَّ", transliteration: "Ad-Darr", meaning: "The Distresser", bengaliMeaning: "ক্ষতিকারী" },
  { id: 92, arabic: "النَّافِعُ", transliteration: "An-Nafi", meaning: "The Propitious", bengaliMeaning: "উপকারী" },
  { id: 93, arabic: "النُّورُ", transliteration: "An-Nur", meaning: "The Light", bengaliMeaning: "আলো" },
  { id: 94, arabic: "الْهَادِي", transliteration: "Al-Hadi", meaning: "The Guide", bengaliMeaning: "পথপ্রদর্শক" },
  { id: 95, arabic: "الْبَدِيعُ", transliteration: "Al-Badi", meaning: "The Originator", bengaliMeaning: "অভিনব সৃষ্টিকর্তা" },
  { id: 96, arabic: "اَلْبَاقِي", transliteration: "Al-Baqi", meaning: "The Everlasting", bengaliMeaning: "চিরস্থায়ী" },
  { id: 97, arabic: "الْوَارِثُ", transliteration: "Al-Warith", meaning: "The Inheritor", bengaliMeaning: "উত্তরাধিকারী" },
  { id: 98, arabic: "الرَّشِيدُ", transliteration: "Ar-Rashid", meaning: "The Guide to Right Path", bengaliMeaning: "সঠিক পথের নির্দেশক" },
  { id: 99, arabic: "الصَّبُورُ", transliteration: "As-Sabur", meaning: "The Patient One", bengaliMeaning: "ধৈর্যশীল" },
];

const NamesOfAllahPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedName, setSelectedName] = useState<NameOfAllah | null>(null);

  const filteredNames = namesOfAllah.filter(
    (name) =>
      name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.arabic.includes(searchQuery) ||
      (name.bengaliMeaning && name.bengaliMeaning.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radial gradient overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-500/10 via-transparent to-transparent blur-3xl" />
        
        {/* Geometric Islamic pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Floating orbs */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl"
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-emerald-500/10"
      >
        <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                আল্লাহর ৯৯ নাম
              </h1>
              <p className="text-xs text-emerald-400/70">Asmaul Husna</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/30">
              <span className="text-sm font-medium text-emerald-300">৯৯</span>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {selectedName ? (
          /* Detail View */
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-8 max-w-2xl mx-auto"
          >
            <button 
              onClick={() => setSelectedName(null)}
              className="mb-8 flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">সব নাম দেখুন</span>
            </button>

            <motion.div 
              className="relative rounded-3xl overflow-hidden"
              layoutId={`card-${selectedName.id}`}
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-slate-800/50 to-amber-500/10" />
              <div className="absolute inset-0 backdrop-blur-xl" />
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-400/10 to-transparent rounded-full blur-xl" />
              
              <div className="relative p-8 md:p-12 text-center">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <span className="text-2xl font-bold text-white">{selectedName.id}</span>
                    </div>
                  </div>
                </div>

                {/* Arabic Name */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <h2 className="text-6xl md:text-7xl font-bold text-white mb-4" style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}>
                    {selectedName.arabic}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span className="text-xl text-amber-200/90 font-medium">{selectedName.transliteration}</span>
                    <Star className="h-4 w-4 text-amber-400" />
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                </div>

                {/* Meanings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-sm text-emerald-400/70 mb-1">English</p>
                    <p className="text-xl text-white font-medium">{selectedName.meaning}</p>
                  </div>
                  
                  {selectedName.bengaliMeaning && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-sm text-amber-400/70 mb-1">বাংলা</p>
                      <p className="text-xl text-white font-medium">{selectedName.bengaliMeaning}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* List View */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-6 max-w-7xl mx-auto"
          >
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-50" />
                <div className="relative flex items-center bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                  <Search className="h-5 w-5 text-emerald-400/50 ml-4" />
                  <input
                    type="text"
                    placeholder="নাম খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-slate-500 focus:outline-none text-base"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="mr-4 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Names Grid */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.02
                  }
                }
              }}
            >
              {filteredNames.map((name) => (
                <motion.button
                  key={name.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedName(name)}
                  className="group relative rounded-2xl overflow-hidden text-left transition-all duration-300"
                  layoutId={`card-${name.id}`}
                >
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 group-hover:from-emerald-900/40 group-hover:via-slate-800/60 group-hover:to-amber-900/20 transition-all duration-500" />
                  <div className="absolute inset-0 border border-white/5 group-hover:border-emerald-500/30 rounded-2xl transition-colors duration-300" />
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl" />
                  </div>
                  
                  <div className="relative p-4">
                    {/* Number */}
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-medium text-slate-500 group-hover:text-emerald-400/70 transition-colors">
                        {String(name.id).padStart(2, '0')}
                      </span>
                    </div>
                    
                    {/* Arabic */}
                    <div className="mb-3 pr-6">
                      <p 
                        className="text-2xl md:text-3xl font-bold text-white group-hover:text-emerald-100 transition-colors leading-tight"
                        style={{ fontFamily: "'Amiri', 'Noto Naskh Arabic', serif" }}
                      >
                        {name.arabic}
                      </p>
                    </div>
                    
                    {/* Transliteration */}
                    <p className="text-sm font-medium text-emerald-400/80 mb-1 truncate">
                      {name.transliteration}
                    </p>
                    
                    {/* Bengali Meaning */}
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 truncate transition-colors">
                      {name.bengaliMeaning || name.meaning}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {filteredNames.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-slate-400">কোনো নাম পাওয়া যায়নি</p>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  সব দেখুন
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NamesOfAllahPage;
