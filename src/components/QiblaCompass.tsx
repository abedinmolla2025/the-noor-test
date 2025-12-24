import { useState, useEffect } from "react";
import { Compass, Navigation, Loader2, X } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mecca coordinates (Kaaba)
const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

interface QiblaCompassProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QiblaCompass = ({ open, onOpenChange }: QiblaCompassProps) => {
  const { location, isLoading } = usePrayerTimes();
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [compassSupported, setCompassSupported] = useState(false);

  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const userLatRad = (lat * Math.PI) / 180;
    const userLngRad = (lng * Math.PI) / 180;
    const meccaLatRad = (MECCA_LAT * Math.PI) / 180;
    const meccaLngRad = (MECCA_LNG * Math.PI) / 180;

    const lngDiff = meccaLngRad - userLngRad;

    const x = Math.sin(lngDiff);
    const y =
      Math.cos(userLatRad) * Math.tan(meccaLatRad) -
      Math.sin(userLatRad) * Math.cos(lngDiff);

    let qibla = Math.atan2(x, y) * (180 / Math.PI);
    qibla = (qibla + 360) % 360;

    return qibla;
  };

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      const direction = calculateQiblaDirection(
        location.latitude,
        location.longitude
      );
      setQiblaDirection(direction);
    }
  }, [location]);

  useEffect(() => {
    if (!open) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setCompassSupported(true);
        setDeviceHeading(event.alpha);
      }
    };

    if (typeof DeviceOrientationEvent !== "undefined") {
      if (
        typeof (DeviceOrientationEvent as any).requestPermission !== "function"
      ) {
        window.addEventListener("deviceorientation", handleOrientation);
        setCompassSupported(true);
      }
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [open]);

  const requestCompassPermission = async () => {
    try {
      const permission = await (
        DeviceOrientationEvent as any
      ).requestPermission();
      if (permission === "granted") {
        window.addEventListener("deviceorientation", (event) => {
          if (event.alpha !== null) {
            setDeviceHeading(event.alpha);
            setCompassSupported(true);
          }
        });
      }
    } catch (error) {
      console.error("Compass permission denied:", error);
    }
  };

  const getCompassRotation = (): number => {
    if (qiblaDirection === null) return 0;
    if (deviceHeading !== null) {
      return qiblaDirection - deviceHeading;
    }
    return qiblaDirection;
  };

  const getDirectionLabel = (degrees: number): string => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            Qibla Direction
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            {/* Compass Container */}
            <div className="relative w-56 h-56 mb-4">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10" />

              {/* Cardinal Directions */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="absolute top-3 text-sm font-bold text-primary">N</span>
                <span className="absolute bottom-3 text-sm font-medium text-muted-foreground">S</span>
                <span className="absolute left-3 text-sm font-medium text-muted-foreground">W</span>
                <span className="absolute right-3 text-sm font-medium text-muted-foreground">E</span>
              </div>

              {/* Degree Markers */}
              <div className="absolute inset-2">
                {[...Array(72)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 left-1/2 origin-bottom h-full w-px"
                    style={{ transform: `rotate(${i * 5}deg)` }}
                  >
                    <div
                      className={`w-px ${
                        i % 6 === 0 ? "h-3 bg-primary/40" : "h-1 bg-primary/20"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Inner Circle */}
              <div className="absolute inset-8 rounded-full bg-background/80 backdrop-blur-sm border border-primary/10 shadow-inner" />

              {/* Qibla Arrow */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{ transform: `rotate(${getCompassRotation()}deg)` }}
              >
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className="absolute top-6 flex flex-col items-center">
                    <Navigation
                      className="w-7 h-7 text-primary fill-primary drop-shadow-lg"
                      strokeWidth={1.5}
                    />
                    <span className="text-xs font-bold text-primary mt-1">Qibla</span>
                  </div>
                </div>
              </div>

              {/* Center Point */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary shadow-lg" />
              </div>
            </div>

            {/* Direction Info */}
            {qiblaDirection !== null && (
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(qiblaDirection)}° {getDirectionLabel(qiblaDirection)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {location?.city && `From ${location.city}`}
                </p>
                {!compassSupported && (
                  <p className="text-xs text-muted-foreground">
                    Point your device towards {getDirectionLabel(qiblaDirection)} to face Qibla
                  </p>
                )}
              </div>
            )}

            {typeof (DeviceOrientationEvent as any).requestPermission === "function" &&
              !compassSupported && (
                <button
                  onClick={requestCompassPermission}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Enable Compass
                </button>
              )}

            {compassSupported && deviceHeading !== null && (
              <p className="text-xs text-green-600 mt-2">
                ✓ Compass active - rotate your device
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QiblaCompass;
