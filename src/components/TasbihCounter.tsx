import { useState, useEffect } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TasbihCounterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dhikrList = [
  { arabic: "سُبْحَانَ اللَّهِ", transliteration: "SubhanAllah", meaning: "Glory be to Allah", target: 33 },
  { arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Alhamdulillah", meaning: "Praise be to Allah", target: 33 },
  { arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allahu Akbar", meaning: "Allah is the Greatest", target: 34 },
  { arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", transliteration: "La ilaha illallah", meaning: "There is no god but Allah", target: 100 },
  { arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullah", meaning: "I seek forgiveness from Allah", target: 100 },
];

const TasbihCounter = ({ open, onOpenChange }: TasbihCounterProps) => {
  const [count, setCount] = useState(0);
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isVibrating, setIsVibrating] = useState(false);

  const currentDhikr = dhikrList[selectedDhikr];

  const playClickSound = () => {
    if (soundEnabled && typeof window !== "undefined") {
      // Create a simple click sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        // Audio not supported
      }
    }
  };

  const vibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleCount = () => {
    setCount((prev) => prev + 1);
    setTotalCount((prev) => prev + 1);
    playClickSound();
    vibrate();
    
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 100);
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleDhikrChange = (index: number) => {
    setSelectedDhikr(index);
    setCount(0);
  };

  const progress = Math.min((count / currentDhikr.target) * 100, 100);
  const isComplete = count >= currentDhikr.target;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              📿 Tasbih Counter
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4 space-y-6">
          {/* Dhikr Selection */}
          <div className="flex gap-2 flex-wrap justify-center">
            {dhikrList.map((dhikr, index) => (
              <button
                key={index}
                onClick={() => handleDhikrChange(index)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedDhikr === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {dhikr.transliteration}
              </button>
            ))}
          </div>

          {/* Current Dhikr Display */}
          <div className="text-center space-y-2">
            <p className="text-3xl font-arabic text-primary">{currentDhikr.arabic}</p>
            <p className="text-lg font-medium">{currentDhikr.transliteration}</p>
            <p className="text-sm text-muted-foreground">{currentDhikr.meaning}</p>
          </div>

          {/* Counter Button */}
          <button
            onClick={handleCount}
            className={`relative w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg transition-all active:scale-95 ${
              isVibrating ? "scale-95" : ""
            } ${isComplete ? "ring-4 ring-green-500 ring-offset-2" : ""}`}
          >
            <div className="absolute inset-2 rounded-full bg-primary/20" />
            <span className="relative text-5xl font-bold">{count}</span>
          </button>

          {/* Progress Bar */}
          <div className="w-full max-w-xs space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{count} / {currentDhikr.target}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isComplete ? "bg-green-500" : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </Button>
          </div>

          {/* Total Counter */}
          <p className="text-sm text-muted-foreground">
            Total today: <span className="font-semibold">{totalCount}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TasbihCounter;
