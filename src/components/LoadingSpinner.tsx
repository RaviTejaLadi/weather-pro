import { Cloud, Sun, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-12 space-y-6", className)}>
      {/* Animated Weather Icons */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <div className="w-20 h-20 bg-white/20 rounded-full"></div>
        </div>
        <div className="relative flex items-center justify-center space-x-2">
          <Sun className={cn("text-yellow-300 animate-spin", sizeClasses[size])} />
          <Cloud className={cn("text-white/80 animate-bounce", sizeClasses[size])} />
          <CloudRain className={cn("text-blue-300 animate-pulse", sizeClasses[size])} />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-xl font-semibold animate-pulse">
          Fetching Weather Data
        </h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-white/80 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-loading-bar"></div>
      </div>
    </div>
  );
}