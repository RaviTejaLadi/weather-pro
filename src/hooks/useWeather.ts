import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export function useWeather(initialLocation: Location) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(initialLocation);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      if (data.current_weather) {
        setWeather(data.current_weather);
      } else {
        throw new Error('Invalid weather data received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching weather data');
    } finally {
      setLoading(false);
    }
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const updateLocation = useCallback((newLocation: Location) => {
    setLocation(newLocation);
  }, []);

  const refetch = useCallback(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    weather,
    loading,
    error,
    location,
    updateLocation,
    refetch,
  };
}