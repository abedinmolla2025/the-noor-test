import { useState } from "react";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DuaCollectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const duas = [
  {
    id: 1,
    category: "Morning",
    title: "Morning Dua",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is due to Allah.",
  },
  {
    id: 2,
    category: "Evening",
    title: "Evening Dua",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is due to Allah.",
  },
  {
    id: 3,
    category: "Before Sleep",
    title: "Dua Before Sleeping",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name O Allah, I live and die.",
  },
  {
    id: 4,
    category: "Waking Up",
    title: "Dua Upon Waking",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
  },
  {
    id: 5,
    category: "Before Eating",
    title: "Dua Before Eating",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa 'ala barakatillah",
    translation: "In the name of Allah and with the blessings of Allah.",
  },
  {
    id: 6,
    category: "After Eating",
    title: "Dua After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana wa ja'alana muslimin",
    translation: "All praise is for Allah who fed us, gave us drink and made us Muslims.",
  },
  {
    id: 7,
    category: "Entering Home",
    title: "Dua When Entering Home",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Allahi rabbina tawakkalna",
    translation: "In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we place our trust.",
  },
  {
    id: 8,
    category: "Leaving Home",
    title: "Dua When Leaving Home",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Bismillahi tawakkaltu 'alallah, la hawla wa la quwwata illa billah",
    translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
  },
  {
    id: 9,
    category: "Protection",
    title: "Ayatul Kursi",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    transliteration: "Allahu la ilaha illa huwal hayyul qayyum",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
  },
  {
    id: 10,
    category: "Forgiveness",
    title: "Seeking Forgiveness",
    arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    transliteration: "Rabbana zalamna anfusana wa illam taghfir lana wa tarhamna lanakunanna minal khasireen",
    translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
  },
];

const categories = [...new Set(duas.map((d) => d.category))];

const DuaCollection = ({ open, onOpenChange }: DuaCollectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDua, setSelectedDua] = useState<typeof duas[0] | null>(null);

  const filteredDuas = duas.filter((dua) => {
    const matchesSearch =
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || dua.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBack = () => {
    if (selectedDua) {
      setSelectedDua(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {(selectedDua || selectedCategory) && (
              <button
                onClick={handleBack}
                className="mr-2 p-1 hover:bg-muted rounded-md transition-colors"
              >
                ←
              </button>
            )}
            <BookOpen className="w-5 h-5 text-primary" />
            {selectedDua ? selectedDua.title : selectedCategory || "Dua Collection"}
          </DialogTitle>
        </DialogHeader>

        {selectedDua ? (
          // Dua Detail View
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <p className="text-3xl font-arabic leading-loose text-primary">
                  {selectedDua.arabic}
                </p>
                <p className="text-lg italic text-muted-foreground">
                  {selectedDua.transliteration}
                </p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium">Translation:</p>
                  <p className="text-foreground mt-1">{selectedDua.translation}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          // List View
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search duas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            {!selectedCategory && (
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Dua List */}
            <ScrollArea className="h-[50vh]">
              <div className="space-y-2 pr-4">
                {filteredDuas.map((dua) => (
                  <button
                    key={dua.id}
                    onClick={() => setSelectedDua(dua)}
                    className="w-full text-left p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{dua.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {dua.transliteration}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DuaCollection;
