import { useEffect, useState } from "react";
import { WeatherCard } from "@/components/WeatherCard";
import { LocationSelector } from "@/components/LocationSelector";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useWeather } from "@/hooks/useWeather";
import { Button } from "@/components/ui/button";
import { RefreshCw, Cloud, Sparkles, Clock, MapPin } from "lucide-react";

const fallbackLocation = {
  name: "Chennai",
  latitude: 13.08,
  longitude: 80.27,
};

function App() {
  const [userLocation, setUserLocation] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [geoLoading, setGeoLoading] = useState(true);
  const [geoError, setGeoError] = useState<string | null>(null);

  const { weather, loading, error, location, updateLocation, refetch } =
    useWeather(userLocation || fallbackLocation);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get user's current location on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Reverse geocoding to get location name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            setUserLocation({
              name: data.city || data.locality || "Your Location",
              latitude,
              longitude,
            });
            setGeoError(null);
          } catch (err) {
            console.error("Geocoding failed:", err);
            setUserLocation(null);
            setGeoError("Could not determine location name");
          } finally {
            setGeoLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation(null);
          setGeoError("Location access denied or unavailable");
          setGeoLoading(false);
        },
        {
          timeout: 10000,
          maximumAge: 5 * 60 * 1000, // 5 minutes
        }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser");
      setGeoLoading(false);
    }
  }, []);

  useEffect(() => {
    if (weather) {
      setLastUpdated(new Date());
    }
  }, [weather]);

  useEffect(() => {
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => {
      refetch();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getBackgroundGradient = () => {
    if (!weather) return "from-slate-900 via-blue-900 to-indigo-900";

    const code = weather.weathercode;
    const temp = weather.temperature;
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    if (code === 0) {
      // Clear sky
      if (isNight) {
        return "from-indigo-900 via-purple-900 to-blue-900";
      }
      return temp > 25
        ? "from-orange-400 via-yellow-500 to-blue-500" // Hot and sunny
        : "from-blue-400 via-cyan-500 to-blue-600"; // Cool and clear
    }
    if (code <= 3) return "from-gray-600 via-slate-700 to-gray-800"; // Cloudy
    if (code <= 67) return "from-slate-700 via-blue-800 to-gray-900"; // Rainy
    if (code <= 77) return "from-blue-200 via-slate-300 to-gray-400"; // Snowy
    if (code >= 95) return "from-purple-900 via-indigo-900 to-gray-900"; // Storm
    return "from-gray-700 via-slate-800 to-gray-900"; // Default
  };

  const getFloatingElements = () => {
    if (!weather) return null;

    const elements = [];
    const code = weather.weathercode;

    // Add floating elements based on weather
    if (code === 0) {
      // Clear sky
      for (let i = 0; i < 3; i++) {
        elements.push(
          <div
            key={`star-${i}`}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-twinkle opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        );
      }
    } else if (code <= 67) {
      // Rainy
      for (let i = 0; i < 5; i++) {
        elements.push(
          <div
            key={`rain-${i}`}
            className="absolute w-0.5 h-6 bg-blue-300 opacity-60 animate-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        );
      }
    }

    return elements;
  };

  // Show loading while getting geolocation
  if (geoLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <MapPin className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Detecting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} transition-all duration-2000 ease-in-out relative overflow-hidden`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getFloatingElements()}
        <div className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl animate-spin-very-slow"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-4 px-2 sm:px-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="relative">
              <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-2xl">
              Weather
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Pro
              </span>
            </h1>
          </div>
          <p className="text-white/80 text-xs sm:text-sm md:text-base font-medium max-w-2xl mx-auto">
            Experience weather like never before with stunning visuals
          </p>
          {geoError && (
            <div className="mt-2 text-yellow-300 text-xs">
              <p>Using fallback location: {fallbackLocation.name}</p>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 pb-4">
          {/* Weather Card Section */}
          <div className="flex-1 min-h-0 flex flex-col">
            {loading && (
              <div className="animate-fade-in flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {error && !loading && (
              <div className="animate-slide-in-bottom h-64 flex items-center justify-center">
                <ErrorMessage message={error} onRetry={refetch} />
              </div>
            )}

            {weather && !loading && !error && (
              <div className="animate-slide-in-bottom flex-1 min-h-0">
                <WeatherCard
                  weather={weather}
                  location={location.name}
                  className="h-full"
                />
              </div>
            )}
          </div>

          {/* Sidebar Section */}
          <div className="flex flex-col gap-4 w-full lg:max-w-md">
            {/* Location Selector */}
            <div className="animate-slide-in-left">
              <LocationSelector
                onLocationChange={updateLocation}
                currentLocation={location.name}
              />
            </div>

            {/* Footer Actions */}
            {!loading && (
              <div className="animate-fade-in-delayed">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-white/20 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 text-white/80">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium">Last Updated</p>
                        <p className="text-xs opacity-75">
                          {lastUpdated.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleRefresh}
                      disabled={loading || isRefreshing}
                      className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 text-sm w-full sm:w-auto"
                    >
                      <RefreshCw
                        className={`w-4 h-4 mr-1 ${
                          loading || isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                      {isRefreshing ? "Refreshing..." : "Refresh"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;