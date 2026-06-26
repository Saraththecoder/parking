import React from 'react';

const Badge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in progress':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
      case 'verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
      case 'requested':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
      case 'disabled':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      {status}
    </span>
  );
};

export default Badge;
