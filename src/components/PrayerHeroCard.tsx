import { useState, useEffect } from "react";
import { MapPin, Clock } from "lucide-react";
import prayingPerson from "@/assets/praying-person.png";

interface PrayerHeroCardProps {
  location?: string;
  hijriDate?: string;
}

const PrayerHeroCard = ({ 
  location = "New York", 
  hijriDate = "3 Rajab, 1447 AH" 
}: PrayerHeroCardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Prayer times for demo (would come from API in real app)
  const prayerSchedule = [
    { name: "Fajr", time: "04:54" },
    { name: "Sunrise", time: "06:14" },
    { name: "Dhuhr", time: "12:30" },
    { name: "Asr", time: "15:24" },
    { name: "Maghrib", time: "18:45" },
    { name: "Isha", time: "20:15" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentPrayer = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    for (let i = prayerSchedule.length - 1; i >= 0; i--) {
      const [hours, minutes] = prayerSchedule[i].time.split(":").map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (now >= prayerMinutes) {
        return prayerSchedule[i].name;
      }
    }
    return "Isha";
  };

  const getNextPrayer = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    for (let i = 0; i < prayerSchedule.length; i++) {
      const [hours, minutes] = prayerSchedule[i].time.split(":").map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (now < prayerMinutes) {
        return { name: prayerSchedule[i].name, time: prayerSchedule[i].time };
      }
    }
    return { name: prayerSchedule[0].name, time: prayerSchedule[0].time };
  };

  const getCountdown = () => {
    const next = getNextPrayer();
    const [hours, minutes] = next.time.split(":").map(Number);
    const nextMinutes = hours * 60 + minutes;
    const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const nowSeconds = currentTime.getSeconds();
    
    let diffMinutes = nextMinutes - nowMinutes;
    if (diffMinutes < 0) diffMinutes += 24 * 60;
    
    const diffSeconds = 60 - nowSeconds;
    if (diffSeconds < 60) diffMinutes -= 1;
    
    const h = Math.floor(diffMinutes / 60);
    const m = diffMinutes % 60;
    const s = diffSeconds === 60 ? 0 : diffSeconds;
    
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const period = currentTime.getHours() >= 12 ? "PM" : "AM";

  return (
    <div className="islamic-card min-h-[200px]">
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary-foreground/5" />
      <div className="absolute -right-5 top-20 w-24 h-24 rounded-full bg-primary-foreground/5" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1">
          {/* Location and Date */}
          <div className="flex items-center gap-4 text-sm opacity-90 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
            <span>•</span>
            <span className="font-arabic">{hijriDate}</span>
          </div>

          {/* Current Prayer */}
          <h2 className="text-3xl font-bold mb-1">{getCurrentPrayer()}</h2>
          
          {/* Time */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-5xl font-bold tracking-tight">
              {formatTime(currentTime)}
            </span>
            <span className="text-xl font-medium opacity-80">{period}</span>
          </div>

          {/* Countdown */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/15 rounded-full px-4 py-2">
            <Clock size={16} className="animate-pulse-soft" />
            <span className="text-sm font-medium">Next in {getCountdown()}</span>
          </div>
        </div>

        {/* Praying Person Image */}
        <div className="hidden sm:block animate-float">
          <img 
            src={prayingPerson} 
            alt="Person praying" 
            className="w-36 h-36 object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PrayerHeroCard;
