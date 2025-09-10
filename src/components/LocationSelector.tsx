import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

interface Location {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  featured?: boolean;
  state?: string;
}

interface LocationSelectorProps {
  onLocationChange: (location: Location) => void;
  currentLocation: string;
  className?: string;
}

const popularCities: Location[] = [
  // Indian States (Capital Cities)
  {
    name: "Thiruvananthapuram",
    latitude: 8.52,
    longitude: 76.94,
    country: "India",
    state: "Kerala",
  },
  {
    name: "Panaji",
    latitude: 15.5,
    longitude: 73.82,
    country: "India",
    state: "Goa",
  },
  {
    name: "Mumbai",
    latitude: 19.07,
    longitude: 72.88,
    country: "India",
    state: "Maharashtra",
    featured: true,
  },
  {
    name: "Gandhinagar",
    latitude: 23.22,
    longitude: 72.64,
    country: "India",
    state: "Gujarat",
  },
  {
    name: "Jaipur",
    latitude: 26.91,
    longitude: 75.79,
    country: "India",
    state: "Rajasthan",
  },
  {
    name: "Chandigarh",
    latitude: 30.73,
    longitude: 76.78,
    country: "India",
    state: "Punjab/Haryana",
  },
  {
    name: "Shimla",
    latitude: 31.1,
    longitude: 77.17,
    country: "India",
    state: "Himachal Pradesh",
  },
  {
    name: "Dehradun",
    latitude: 30.32,
    longitude: 78.03,
    country: "India",
    state: "Uttarakhand",
  },
  {
    name: "Delhi",
    latitude: 28.61,
    longitude: 77.21,
    country: "India",
    state: "Delhi",
  },
  {
    name: "Lucknow",
    latitude: 26.85,
    longitude: 80.95,
    country: "India",
    state: "Uttar Pradesh",
  },
  {
    name: "Patna",
    latitude: 25.59,
    longitude: 85.14,
    country: "India",
    state: "Bihar",
  },
  {
    name: "Ranchi",
    latitude: 23.35,
    longitude: 85.33,
    country: "India",
    state: "Jharkhand",
  },
  {
    name: "Kolkata",
    latitude: 22.57,
    longitude: 88.36,
    country: "India",
    state: "West Bengal",
  },
  {
    name: "Bhubaneswar",
    latitude: 20.27,
    longitude: 85.84,
    country: "India",
    state: "Odisha",
  },
  {
    name: "Raipur",
    latitude: 21.25,
    longitude: 81.63,
    country: "India",
    state: "Chhattisgarh",
  },
  {
    name: "Bhopal",
    latitude: 23.26,
    longitude: 77.41,
    country: "India",
    state: "Madhya Pradesh",
  },
  {
    name: "Chennai",
    latitude: 13.08,
    longitude: 80.27,
    country: "India",
    state: "Tamil Nadu",
    featured: true,
  },
  {
    name: "Bangalore",
    latitude: 12.97,
    longitude: 77.59,
    country: "India",
    state: "Karnataka",
  },
  {
    name: "Hyderabad",
    latitude: 17.36,
    longitude: 78.48,
    country: "India",
    state: "Telangana",
  },
  {
    name: "Amaravati",
    latitude: 16.51,
    longitude: 80.51,
    country: "India",
    state: "Andhra Pradesh",
  },
  {
    name: "Guwahati",
    latitude: 26.14,
    longitude: 91.74,
    country: "India",
    state: "Assam",
  },
  {
    name: "Imphal",
    latitude: 24.82,
    longitude: 93.95,
    country: "India",
    state: "Manipur",
  },
  {
    name: "Aizawl",
    latitude: 23.73,
    longitude: 92.72,
    country: "India",
    state: "Mizoram",
  },
  {
    name: "Kohima",
    latitude: 25.67,
    longitude: 94.11,
    country: "India",
    state: "Nagaland",
  },
  {
    name: "Agartala",
    latitude: 23.84,
    longitude: 91.28,
    country: "India",
    state: "Tripura",
  },
  {
    name: "Shillong",
    latitude: 25.57,
    longitude: 91.88,
    country: "India",
    state: "Meghalaya",
  },
  {
    name: "Itanagar",
    latitude: 27.1,
    longitude: 93.62,
    country: "India",
    state: "Arunachal Pradesh",
  },
  {
    name: "Gangtok",
    latitude: 27.34,
    longitude: 88.61,
    country: "India",
    state: "Sikkim",
  },

  // Union Territories
  {
    name: "Port Blair",
    latitude: 11.67,
    longitude: 92.75,
    country: "India",
    state: "Andaman and Nicobar Islands",
  },
  {
    name: "Kavaratti",
    latitude: 10.57,
    longitude: 72.64,
    country: "India",
    state: "Lakshadweep",
  },
  {
    name: "Daman",
    latitude: 20.39,
    longitude: 72.83,
    country: "India",
    state: "Dadra and Nagar Haveli and Daman and Diu",
  },
  {
    name: "Puducherry",
    latitude: 11.91,
    longitude: 79.81,
    country: "India",
    state: "Puducherry",
  },
  {
    name: "Jammu",
    latitude: 32.73,
    longitude: 74.87,
    country: "India",
    state: "Jammu and Kashmir",
  },
  {
    name: "Leh",
    latitude: 34.15,
    longitude: 77.58,
    country: "India",
    state: "Ladakh",
  },

  // International Cities
  {
    name: "London",
    latitude: 51.51,
    longitude: -0.13,
    country: "UK",
    featured: true,
  },
  {
    name: "New York",
    latitude: 40.71,
    longitude: -74.0,
    country: "USA",
    featured: true,
  },
  { name: "Tokyo", latitude: 35.68, longitude: 139.69, country: "Japan" },
  { name: "Paris", latitude: 48.85, longitude: 2.35, country: "France" },
  { name: "Sydney", latitude: -33.87, longitude: 151.21, country: "Australia" },
  { name: "Dubai", latitude: 25.2, longitude: 55.27, country: "UAE" },
  {
    name: "Singapore",
    latitude: 1.35,
    longitude: 103.82,
    country: "Singapore",
  },
  { name: "Los Angeles", latitude: 34.05, longitude: -118.24, country: "USA" },

  // Popular Travel Destinations
  { name: "Bangkok", latitude: 13.76, longitude: 100.5, country: "Thailand" },
  { name: "Istanbul", latitude: 41.01, longitude: 28.98, country: "Turkey" },
  { name: "Rome", latitude: 41.9, longitude: 12.5, country: "Italy" },
  { name: "Barcelona", latitude: 41.39, longitude: 2.16, country: "Spain" },
  {
    name: "Amsterdam",
    latitude: 52.37,
    longitude: 4.9,
    country: "Netherlands",
  },
  { name: "Berlin", latitude: 52.52, longitude: 13.4, country: "Germany" },
  { name: "Vienna", latitude: 48.21, longitude: 16.37, country: "Austria" },
  {
    name: "Prague",
    latitude: 50.08,
    longitude: 14.44,
    country: "Czech Republic",
  },
  { name: "Zurich", latitude: 47.38, longitude: 8.54, country: "Switzerland" },
  {
    name: "Hong Kong",
    latitude: 22.32,
    longitude: 114.17,
    country: "Hong Kong",
  },
  { name: "Seoul", latitude: 37.57, longitude: 126.98, country: "South Korea" },
  { name: "Bali", latitude: -8.41, longitude: 115.19, country: "Indonesia" },
  {
    name: "Kuala Lumpur",
    latitude: 3.16,
    longitude: 101.71,
    country: "Malaysia",
  },
  { name: "Cairo", latitude: 30.04, longitude: 31.24, country: "Egypt" },
  {
    name: "Cape Town",
    latitude: -33.92,
    longitude: 18.42,
    country: "South Africa",
  },
  { name: "Toronto", latitude: 43.65, longitude: -79.38, country: "Canada" },
  { name: "Vancouver", latitude: 49.28, longitude: -123.12, country: "Canada" },
  {
    name: "San Francisco",
    latitude: 37.77,
    longitude: -122.42,
    country: "USA",
  },
  { name: "Miami", latitude: 25.76, longitude: -80.19, country: "USA" },
  { name: "Las Vegas", latitude: 36.17, longitude: -115.14, country: "USA" },
  {
    name: "Mexico City",
    latitude: 19.43,
    longitude: -99.13,
    country: "Mexico",
  },
  {
    name: "Rio de Janeiro",
    latitude: -22.91,
    longitude: -43.17,
    country: "Brazil",
  },
  {
    name: "Buenos Aires",
    latitude: -34.61,
    longitude: -58.38,
    country: "Argentina",
  },
  { name: "Maldives", latitude: 3.2, longitude: 73.22, country: "Maldives" },
  { name: "Phuket", latitude: 7.89, longitude: 98.4, country: "Thailand" },
  { name: "Doha", latitude: 25.28, longitude: 51.53, country: "Qatar" },
  { name: "Abu Dhabi", latitude: 24.45, longitude: 54.38, country: "UAE" },
];

export function LocationSelector({
  onLocationChange,
  currentLocation,
  className,
}: LocationSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleLocationSelect = (location: Location) => {
    onLocationChange(location);
    setSearchTerm("");
    setIsDialogOpen(false);
  };

  const filteredCities = popularCities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const otherCities = filteredCities.filter((city) => !city.featured);

  return (
    <div className={cn("relative", className)}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>

      <Card className="relative bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Current Location
                </h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  Tap to change location
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 rounded-xl px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white w-[95vw] max-w-5xl h-[95vh] sm:h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl sm:text-2xl">
                    Select Location
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-10 pr-4 py-2 sm:py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all text-sm sm:text-base"
                    />
                  </div>

                  {/* Other Cities */}
                  {otherCities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-white/90 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                        All Cities
                      </h4>
                      <ScrollArea className="h-[60vh] sm:h-[28rem] pr-2 sm:pr-4">
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {otherCities.map((city) => (
                            <Button
                              key={city.name}
                              variant="ghost"
                              onClick={() => handleLocationSelect(city)}
                              className={cn(
                                "bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg p-2 sm:p-3 h-auto flex-col items-start space-y-1 transition-all duration-200",
                                currentLocation === city.name &&
                                  "bg-white/20 border-white/30"
                              )}
                            >
                              <span className="text-white text-xs sm:text-sm text-start font-medium truncate w-full">
                                {city?.state
                                  ? `${city.name} / ${city?.state}`
                                  : city.name}
                              </span>
                              <span className="text-white/50 text-xs">
                                {city.country}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {filteredCities.length === 0 && searchTerm && (
                    <div className="text-center py-4 sm:py-8">
                      <Globe className="w-8 h-8 sm:w-12 sm:h-12 text-white/40 mx-auto mb-2 sm:mb-3" />
                      <p className="text-white/60 text-sm sm:text-base">
                        No cities found matching "{searchTerm}"
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Current Location Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white/80" />
              <span className="text-white text-base sm:text-lg font-semibold">
                {currentLocation}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
