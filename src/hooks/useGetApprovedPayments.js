import { useState, useEffect, useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount } from "@reown/appkit/react";

const useGetApprovedPayments = () => {
  const [approvedPayments, setApprovedPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const contract = useContractInstance(true);
  const { address, isConnected } = useAppKitAccount();

  const fetchApprovedPayments = useCallback(async () => {
    if (!contract || !address || !isConnected) {
      setApprovedPayments([]);
      return;
    }

    setLoading(true);
    try {
      // Get all products the user has bought
      const allBoughtProducts = await contract.getBuyersProductId(address);
      
      // Get products with pending approval
      const pendingProducts = await contract.getAllBuyersProductWithPendingApproval(address);
      
      // Convert BigInt arrays to regular numbers for comparison
      const boughtProductIds = allBoughtProducts.map(id => parseInt(id.toString()));
      const pendingProductIds = pendingProducts.map(id => parseInt(id.toString()));
      
      // Approved products are those that were bought but don't have pending payments
      const approvedProductIds = boughtProductIds.filter(id => 
        !pendingProductIds.includes(id)
      );
      
      setApprovedPayments(approvedProductIds);
    } catch (error) {
      console.error("Error fetching approved payments:", error);
      setApprovedPayments([]);
    } finally {
      setLoading(false);
    }
  }, [contract, address, isConnected]);

  const refetchApprovedPayments = useCallback(() => {
    fetchApprovedPayments();
  }, [fetchApprovedPayments]);

  useEffect(() => {
    fetchApprovedPayments();
  }, [fetchApprovedPayments]);

  return {
    approvedPayments,
    loading,
    refetchApprovedPayments,
  };
};

export default useGetApprovedPayments;