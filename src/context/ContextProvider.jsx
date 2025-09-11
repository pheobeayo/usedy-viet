import React, { createContext, useContext, useState, useEffect } from "react";
import useContractInstance from "../hooks/useContractInstance";
import useContractEvent from "../hooks/useContractevents";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";

// Create the context
const ProductContext = createContext();

// Context Provider
export const ContextProvider = ({ children }) => {
  const contract = useContractInstance(true);
  const { isConnected, address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

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
  useContractEvent(contract, "ProductListed", refreshProducts);
  useContractEvent(contract, "ProductUpdated", refreshProducts);
  useContractEvent(contract, "ProfileCreated", refreshSellers);
  useContractEvent(contract, "ProfileUpdated", refreshSellers);
  useContractEvent(contract, "ProductBought", refreshPurchase)

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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook for context
export const useProduct = () => useContext(ProductContext);
