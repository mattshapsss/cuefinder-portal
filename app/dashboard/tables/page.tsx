'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getVenueTables, updateTableStatus, subscribeToTables } from '@/lib/firebase/firestore';
import { Table } from '@/types/table';
import { 
  Grid3x3, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

export default function TablesPage() {
  const { userData } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTable, setEditingTable] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.venueId) {
      loadTables();
      
      // Subscribe to real-time table updates
      const unsubscribe = subscribeToTables(userData.venueId, (realtimeTables) => {
        setTables(realtimeTables);
      });
      
      return () => unsubscribe();
    }
  }, [userData]);

  const loadTables = async () => {
    if (!userData?.venueId) return;

    try {
      const venueTables = await getVenueTables(userData.venueId);
      setTables(venueTables);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (tableId: string, currentStatus: 'available' | 'occupied' | 'maintenance') => {
    const newStatus = currentStatus === 'available' ? 'maintenance' : 'available';
    try {
      await updateTableStatus(tableId, newStatus);
      await loadTables();
    } catch (error) {
      console.error('Error updating table status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'occupied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'border-green-500 bg-green-50';
      case 'occupied': return 'border-red-500 bg-red-50';
      case 'maintenance': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300';
    }
  };

  if (loading) {
    return <div>Loading tables...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your pool tables and their availability
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </button>
      </div>

      {/* Table Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {tables.filter(t => t.status === 'available').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Occupied
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {tables.filter(t => t.status === 'occupied').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Maintenance
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {tables.filter(t => t.status === 'maintenance').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`relative rounded-lg border-2 p-4 ${getStatusColor(table.status)}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <Grid3x3 className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Table {table.number}
                </h3>
              </div>
              {getStatusIcon(table.status)}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Size:</span>
                <span className="font-medium">{table.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium capitalize">{table.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rate:</span>
                <span className="font-medium">${table.hourlyRate}/hr</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleStatusToggle(table.id, table.status)}
                className="flex-1 px-3 py-1 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {table.status === 'maintenance' ? 'Make Available' : 'Set Maintenance'}
              </button>
              <button
                onClick={() => setEditingTable(table.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>

            {table.currentBookingId && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">Current Booking</p>
                <p className="text-sm font-medium">Until 8:00 PM</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}