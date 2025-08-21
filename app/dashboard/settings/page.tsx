'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getVenue } from '@/lib/firebase/firestore';
import { Venue } from '@/types/venue';
import { 
  Building2, 
  Clock, 
  DollarSign, 
  Save,
  MapPin,
  Phone,
  Globe,
  AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { userData } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userData?.venueId) {
      loadVenueSettings();
    }
  }, [userData]);

  const loadVenueSettings = async () => {
    if (!userData?.venueId) return;

    try {
      const venueData = await getVenue(userData.venueId);
      setVenue(venueData);
    } catch (error) {
      console.error('Error loading venue settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // In a real app, we'd update the venue in Firestore here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  if (!venue) {
    return <div>Venue not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Venue Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your venue information and preferences
        </p>
      </div>

      {message && (
        <div className={`rounded-md p-4 ${
          message.includes('Error') ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <div className="flex">
            <AlertCircle className={`h-5 w-5 ${
              message.includes('Error') ? 'text-red-400' : 'text-green-400'
            }`} />
            <p className={`ml-3 text-sm font-medium ${
              message.includes('Error') ? 'text-red-800' : 'text-green-800'
            }`}>
              {message}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Venue Name
                  </label>
                  <div className="mt-1 relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={venue.name}
                      onChange={(e) => setVenue({ ...venue, name: e.target.value })}
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={venue.phone || ''}
                      onChange={(e) => setVenue({ ...venue, phone: e.target.value })}
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <div className="mt-1 relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="url"
                      value={venue.website || ''}
                      onChange={(e) => setVenue({ ...venue, website: e.target.value })}
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="mt-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={venue.address}
                      onChange={(e) => setVenue({ ...venue, address: e.target.value })}
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Business Hours
              </h3>
              <div className="space-y-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} className="flex items-center space-x-4">
                    <span className="w-24 text-sm font-medium text-gray-700">{day}</span>
                    <input
                      type="time"
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      defaultValue="09:00"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      defaultValue="23:00"
                    />
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm text-gray-600">Open</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Pricing Settings
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Default Hourly Rate
                  </label>
                  <div className="mt-1 relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      defaultValue={20}
                      className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Peak Hour Multiplier
                  </label>
                  <select
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    defaultValue="1.5"
                  >
                    <option value="1">No peak pricing</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Booking Rules */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Booking Rules
              </h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-3"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">
                    Require confirmation for all bookings
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-3"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">
                    Allow online bookings
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    Require deposit for bookings
                  </span>
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum booking duration (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maximum advance booking (days)
                    </label>
                    <input
                      type="number"
                      defaultValue="30"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}