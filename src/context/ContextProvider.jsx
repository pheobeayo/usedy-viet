import React, { createContext, useContext, useState, useEffect } from "react";
import useContractInstance from "../hooks/useContractInstance";
import useContractEvent from "../hooks/useContractevents";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import useGetUsedyToken from "../hooks/useGetUsedyToken";
import useGetPendingPayments from "../hooks/useGetPendingPayments";
import useGetApprovedPayments from "../hooks/useGetApprovedPayments";

// Create the context
const ProductContext = createContext();

// Context Provider
export const ContextProvider = ({ children }) => {
  const contract = useContractInstance(true);
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { userBal, refreshBalance } = useGetUsedyToken();
  const { refetchPendingPayments } = useGetPendingPayments();
  const { refetchApprovedPayments } = useGetApprovedPayments();

  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [purchaseId, setPurchaseId] = useState([]);

  // Fetch all products
  const refreshProducts = async () => {
    if (!isConnected || !walletProvider || !contract) return;
    try {
      const data = await contract.getAllproduct();
      const convertIpfsUrl = (url) =>
        url.startsWith("ipfs://")
          ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
          : url;

      const formatted = data?.map((item, index) => ({
        id: index + 1,
        address: item[0],
        name: item[1],
        image: convertIpfsUrl(item[2]),
        location: item[3],
        product: item[4],
        price: item[5],
        weight: item[6],
        sold: item[7],
        inProgress: item[8],
      }));
      setProducts(formatted);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };

  // Fetch all sellers
  const refreshSellers = async () => {
    if (!isConnected || !walletProvider || !contract) return;
    try {
      const data = await contract.getallSeller();
      const formatted = data?.map((item) => ({
        address: item[0],
        id: item[1],
        name: item[2],
        location: item[3],
        mail: item[4],
        product: item[5],
        weight: item[6],
        payment: item[7],
      }));
      setSellers(formatted);
    } catch (err) {
      console.error("Failed to fetch sellers:", err);
      setSellers([]);
    }
  };

   // Fetch all user purchases
   const refreshPurchase = async () => {
    if (!isConnected || !walletProvider || !contract) return;
    try {
      const data = await contract.getBuyersProductId(address);
      const formatted = data.map((id) => ({
        id: id.toString(),
      }))
      setPurchaseId(data);
    } catch (err) {
      console.error("Failed to fetch sellers:", err);
      setPurchaseId([]);
    }
  };

  // Initial fetch
  useEffect(() => {
    refreshProducts();
    refreshSellers();
    refreshPurchase();
  }, [isConnected, walletProvider, contract]);

  // 🔥 Auto-refresh on blockchain events
  useContractEvent(contract, "ProductListed", () => {
    refreshProducts();
    refreshBalance(); // Refresh balance when product is listed
  });
  useContractEvent(contract, "ProductUpdated", refreshProducts);
  useContractEvent(contract, "ProfileCreated", refreshSellers);
  useContractEvent(contract, "ProfileUpdated", refreshSellers);
  useContractEvent(contract, "ProductBought", () => {
    refreshPurchase();
    refreshBalance(); // Refresh balance when product is bought
    if (refetchPendingPayments) refetchPendingPayments(); // Refresh pending payments
  });
  useContractEvent(contract, "PaymentApproved", () => {
    refreshBalance(); // Refresh balance when payment is approved
    if (refetchPendingPayments) refetchPendingPayments(); // Refresh pending payments
    if (refetchApprovedPayments) refetchApprovedPayments(); // Refresh approved payments
  });
  useContractEvent(contract, "PaymentApproved", () => {
    refreshPurchase();
    refreshBalance(); // Refresh balance when payment is approved
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        refreshProducts,
        purchaseId,
        refreshPurchase,
        sellers,
        setSellers,
        refreshSellers,
        userBal,
        refreshBalance,
        refetchPendingPayments,
        refetchApprovedPayments,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for context
export const useProduct = () => useContext(ProductContext);
