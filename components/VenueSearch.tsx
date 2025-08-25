'use client';

import { useState, useEffect, useRef } from 'react';
import { searchVenues } from '@/lib/firebase/venues';
import { Venue } from '@/types/venue';
import { Search, MapPin, Check, Building2, Loader2 } from 'lucide-react';

interface VenueSearchProps {
  onSelect: (venue: Venue) => void;
  placeholder?: string;
  required?: boolean;
}

export default function VenueSearch({ 
  onSelect, 
  placeholder = "Search for your venue...",
  required = false 
}: VenueSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Venue[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        setIsSearching(true);
        const venues = await searchVenues(searchTerm);
        setResults(venues);
        setIsSearching(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    setSearchTerm(venue.name);
    setIsOpen(false);
    onSelect(venue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (selectedVenue && value !== selectedVenue.name) {
      setSelectedVenue(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Your Venue
      </label>
      
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : selectedVenue ? (
            <Check className="h-5 w-5 text-green-500" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className={`block w-full pl-10 pr-3 py-3 border ${
            selectedVenue ? 'border-green-300' : 'border-gray-200'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm`}
        />
      </div>

      {/* Helper Text */}
      {!selectedVenue && (
        <p className="mt-1 text-xs text-gray-500">
          Start typing to search for your venue in our database
        </p>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {results.map((venue) => (
            <button
              key={venue.id}
              type="button"
              onClick={() => handleSelect(venue)}
              className="w-full text-left px-4 py-3 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start space-x-3">
                <Building2 className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {venue.name}
                  </p>
                  {venue.address && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {venue.address}
                    </p>
                  )}
                  {venue.ownerId && (
                    <p className="text-xs text-orange-600 mt-1">
                      Already claimed - Contact support if this is your venue
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && searchTerm.length >= 2 && results.length === 0 && !isSearching && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500 text-center">
            No venues found matching &quot;{searchTerm}&quot;
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            If your venue isn&apos;t listed, please contact support to add it
          </p>
        </div>
      )}

      {/* Selected Venue Display */}
      {selectedVenue && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Venue Selected
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedVenue(null);
                setSearchTerm('');
                inputRef.current?.focus();
              }}
              className="text-xs text-green-600 hover:text-green-700"
            >
              Change
            </button>
          </div>
          {selectedVenue.address && (
            <p className="text-xs text-green-700 mt-1">{selectedVenue.address}</p>
          )}
        </div>
      )}
    </div>
  );
}