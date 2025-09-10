import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  const isNetworkError = message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch');

  return (
    <div className={cn("relative", className)}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-3xl blur-xl"></div>
      
      <Card className="relative bg-red-500/10 backdrop-blur-xl border-red-500/30 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5"></div>
        
        <div className="relative p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-red-500/20 rounded-full">
              {isNetworkError ? (
                <WifiOff className="w-10 h-10 text-red-300" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-red-300" />
              )}
            </div>
          </div>

          {/* Error Content */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">
              {isNetworkError ? 'Connection Problem' : 'Something Went Wrong'}
            </h3>
            <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <h4 className="text-white font-semibold mb-2">Try these solutions:</h4>
            <ul className="text-white/70 text-sm space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Refresh the page</li>
              <li>• Try a different location</li>
              {isNetworkError && <li>• Wait a moment and try again</li>}
            </ul>
          </div>

          {/* Retry Button */}
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>

          {/* Network Status Indicator */}
          <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
            <Wifi className="w-4 h-4" />
            <span>Checking connection...</span>
          </div>
        </div>
      </Card>
    </div>
  );
}