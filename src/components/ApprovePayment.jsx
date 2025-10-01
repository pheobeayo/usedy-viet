import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useApprovePayment from '../hooks/useApprovePayment';

const ApprovePayment = ({ productId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const approvePayment = useApprovePayment();

  const handleApprovePayment = async () => {
    if (!productId) {
      toast.error("Invalid product ID");
      return;
    }

    setLoading(true);
    try {
      const success = await approvePayment(productId);
      if (success && onSuccess) {
        onSuccess(); // Callback to refresh the parent component
      }
    } catch (error) {
      console.error("Error approving payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApprovePayment}
      disabled={loading}
      className={`w-full py-2 px-4 rounded-lg font-bold transition-colors ${
        loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      {loading ? 'Approving...' : 'Approve Payment'}
    </button>
  );
};

export default ApprovePayment;