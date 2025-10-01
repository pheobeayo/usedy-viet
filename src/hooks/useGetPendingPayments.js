import { useState, useEffect, useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount } from "@reown/appkit/react";

const useGetPendingPayments = () => {
  const contract = useContractInstance(false);
  const { address, isConnected } = useAppKitAccount();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingPayments = useCallback(async () => {
    if (!contract || !address || !isConnected) {
      setPendingPayments([]);
      return;
    }

    setLoading(true);
    try {
      const pendingProductIds = await contract.getAllBuyersProductWithPendingApproval(address);
      setPendingPayments(pendingProductIds.map(id => Number(id)));
    } catch (err) {
      console.error("Failed to fetch pending payments:", err);
      setPendingPayments([]);
    } finally {
      setLoading(false);
    }
  }, [contract, address, isConnected]);

  useEffect(() => {
    fetchPendingPayments();
  }, [fetchPendingPayments]);

  return { 
    pendingPayments, 
    loading, 
    refetchPendingPayments: fetchPendingPayments 
  };
};

export default useGetPendingPayments;