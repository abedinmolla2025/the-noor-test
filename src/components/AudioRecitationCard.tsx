import { Play } from "lucide-react";

const AudioRecitationCard = () => {
  return (
    <div className="bg-islamic-gradient rounded-2xl p-5 shadow-card relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-primary-foreground/80 text-sm mb-1">Listen to Quran</p>
          <h3 className="text-primary-foreground text-xl font-bold">Audio Recitation</h3>
        </div>
        
        <button className="w-14 h-14 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95">
          <Play size={24} className="text-primary-foreground ml-1" fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default AudioRecitationCard;
