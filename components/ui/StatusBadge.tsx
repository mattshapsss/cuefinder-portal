import React from 'react';

type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'cancelled' | 'completed' | 'no_show';
type TableStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

interface StatusBadgeProps {
  status: BookingStatus | TableStatus;
  type?: 'booking' | 'table';
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'booking',
  size = 'md',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  const statusConfig = {
    // Booking statuses
    pending: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Pending',
    },
    confirmed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Confirmed',
    },
    checked_in: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Checked In',
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Cancelled',
    },
    completed: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Completed',
    },
    no_show: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'No Show',
    },
    // Table statuses
    available: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Available',
    },
    occupied: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      label: 'Occupied',
    },
    reserved: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Reserved',
    },
    maintenance: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Maintenance',
    },
  };
  
  const config = statusConfig[status];
  
  if (!config) {
    return null;
  }
  
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${config.bg} ${config.text} ${sizeStyles[size]}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;