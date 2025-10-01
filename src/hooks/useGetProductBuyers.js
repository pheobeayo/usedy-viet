import { useState, useEffect, useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount } from "@reown/appkit/react";

const useGetProductBuyers = (productId) => {
  const [buyersData, setBuyersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const contract = useContractInstance(true);
  const { isConnected } = useAppKitAccount();

  const fetchProductBuyers = useCallback(async () => {
    if (!contract || !productId || !isConnected) {
      setBuyersData([]);
      return;
    }

    setLoading(true);
    try {
      // Get all buyers of this product
      const buyers = await contract.getProductBuyers(productId);
      
      // For each buyer, get the amount they bought
      const buyersWithAmounts = await Promise.all(
        buyers.map(async (buyerAddress) => {
          try {
            // Get the amount this buyer bought for this product
            const amountBought = await contract.amountBought(productId, buyerAddress);
            return {
              address: buyerAddress,
              amountBought: amountBought.toString(),
              // Note: We can't get the exact purchase time from the current contract
              // but we could listen to ProductBought events in the future
            };
          } catch (error) {
            console.error(`Error fetching amount for buyer ${buyerAddress}:`, error);
            return {
              address: buyerAddress,
              amountBought: "0",
            };
          }
        })
      );

      // Filter out buyers with 0 amount (they might have approved payment already)
      const activeBuyers = buyersWithAmounts.filter(buyer => buyer.amountBought !== "0");
      
      setBuyersData(activeBuyers);
    } catch (error) {
      console.error("Error fetching product buyers:", error);
      setBuyersData([]);
    } finally {
      setLoading(false);
    }
  }, [contract, productId, isConnected]);

  useEffect(() => {
    fetchProductBuyers();
  }, [fetchProductBuyers]);

  const refetchBuyers = useCallback(() => {
    fetchProductBuyers();
  }, [fetchProductBuyers]);

  return {
    buyersData,
    loading,
    refetchBuyers,
  };
};

export default useGetProductBuyers;