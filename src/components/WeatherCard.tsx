import { Card } from '@/components/ui/card';
import { Thermometer, Wind, Droplets, Eye, Sun, Cloud, CloudRain, CloudSnow, Zap, CloudDrizzle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

interface WeatherCardProps {
  weather: WeatherData;
  location: string;
  className?: string;
}

const getWeatherIcon = (weatherCode: number, size = "w-24 h-24") => {
  const iconClass = `${size} drop-shadow-2xl`;
  
  if (weatherCode === 0) return <Sun className={`${iconClass} text-yellow-300 animate-pulse`} />;
  if (weatherCode <= 3) return <Cloud className={`${iconClass} text-slate-300 animate-bounce`} />;
  if (weatherCode <= 67) return <CloudRain className={`${iconClass} text-blue-300 animate-pulse`} />;
  if (weatherCode <= 77) return <CloudSnow className={`${iconClass} text-blue-100 animate-bounce`} />;
  if (weatherCode >= 95) return <Zap className={`${iconClass} text-purple-300 animate-pulse`} />;
  return <CloudDrizzle className={`${iconClass} text-cyan-300 animate-pulse`} />;
};

const getWeatherDescription = (weatherCode: number) => {
  const descriptions: Record<number, string> = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Severe Thunderstorm',
  };
  return descriptions[weatherCode] || 'Unknown Weather';
};

const getWindDirection = (degrees: number) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(degrees / 22.5) % 16];
};

export function WeatherCard({ weather, location, className }: WeatherCardProps) {
  const temperature = Math.round(weather.temperature);
  const isHot = temperature > 30;
  const isCold = temperature < 10;
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <Card className="relative bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl p-8 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-8">
          {/* Location and Date Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
              {location}
            </h1>
            <p className="text-white/80 text-lg font-medium">
              {new Date(weather.time).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto rounded-full"></div>
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center justify-center space-x-12 animate-scale-in">
            <div className="text-center space-y-4">
              <div className="relative">
                {getWeatherIcon(weather.weathercode)}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full blur-xl"></div>
              </div>
              <p className="text-white/90 text-xl font-semibold tracking-wide">
                {getWeatherDescription(weather.weathercode)}
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className={cn(
                "text-8xl font-bold text-white drop-shadow-2xl transition-all duration-1000",
                isHot && "text-orange-200 animate-pulse",
                isCold && "text-blue-200"
              )}>
                {temperature}°
              </div>
              <div className="flex items-center justify-center text-white/70 text-lg">
                <Thermometer className="w-5 h-5 mr-2" />
                <span className="font-medium">Celsius</span>
              </div>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                  <Wind className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Wind Speed</p>
                  <p className="text-white text-2xl font-bold">
                    {weather.windspeed} <span className="text-lg font-normal">km/h</span>
                  </p>
                  <p className="text-white/70 text-sm">
                    Direction: {getWindDirection(weather.winddirection)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                  <Eye className="w-6 h-6 text-purple-200" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Weather Code</p>
                  <p className="text-white text-2xl font-bold">{weather.weathercode}</p>
                  <p className="text-white/70 text-sm">Condition ID</p>
                </div>
              </div>
            </div>

            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                  <Droplets className="w-6 h-6 text-green-200" />
                </div>
                <div>
                  <p className="text-white/60 text-sm font-medium uppercase tracking-wider">Feels Like</p>
                  <p className="text-white text-2xl font-bold">
                    {temperature > 25 ? 'Warm' : temperature < 10 ? 'Cold' : 'Mild'}
                  </p>
                  <p className="text-white/70 text-sm">Comfort Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Bar */}
          <div className="space-y-3 animate-fade-in-delayed">
            <div className="flex justify-between text-white/70 text-sm font-medium">
              <span>Cold</span>
              <span>Comfortable</span>
              <span>Hot</span>
            </div>
            <div className="relative h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-green-400 to-red-400 rounded-full"></div>
              <div 
                className="absolute top-0 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-0.5 transition-all duration-1000 ease-out"
                style={{ 
                  left: `${Math.min(Math.max((temperature + 10) / 50 * 100, 0), 100)}%`,
                  transform: 'translateX(-50%) translateY(-2px)'
                }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}