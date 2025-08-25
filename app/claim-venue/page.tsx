'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import VenueSearch from '@/components/VenueSearch';
import { Venue } from '@/types/venue';
import { claimVenue } from '@/lib/firebase/venues';
import { Building2, Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function ClaimVenuePage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user already has a venue, redirect to dashboard
    if (userData?.ownedVenueIds && userData.ownedVenueIds.length > 0) {
      router.push('/dashboard');
    }
  }, [userData, router]);

  const handleClaimVenue = async () => {
    if (!selectedVenue || !user) {
      setError('Please select a venue to claim');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await claimVenue(selectedVenue.id, user.uid, user.email || '');
      
      // Update local user data
      if (userData) {
        userData.ownedVenueIds = [selectedVenue.id];
        userData.venueId = selectedVenue.id;
      }
      
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to claim venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Claim Your Venue</h1>
                <p className="text-purple-100 text-sm mt-1">
                  Select your venue from our database to get started
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Welcome Message */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900 font-medium">Welcome to CueFinder!</p>
                  <p className="text-sm text-blue-700 mt-1">
                    To complete your account setup, please search for and select your venue below. 
                    Once claimed, you&apos;ll have full access to manage bookings and analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Venue Search */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search for Your Venue
                </label>
                <VenueSearch
                  onSelect={(venue) => setSelectedVenue(venue)}
                  placeholder="Type your venue name..."
                />
              </div>

              {/* Selected Venue Display */}
              {selectedVenue && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Selected Venue</p>
                      <p className="text-lg font-semibold text-blue-900 mt-1">
                        {selectedVenue.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedVenue.address}
                      </p>
                      {selectedVenue.phone && (
                        <p className="text-sm text-blue-700 mt-1">
                          Phone: {selectedVenue.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Claim Button */}
              <button
                onClick={handleClaimVenue}
                disabled={!selectedVenue || loading}
                className="w-full mt-6 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Claiming venue...
                  </>
                ) : (
                  <>
                    Claim This Venue
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Can&apos;t find your venue? Contact support at support@cuefinder.com to add your venue to our database.
                Your claim will be reviewed within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}