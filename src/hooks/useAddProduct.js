import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { ultraNebulaTestnet } from "../connection/index";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../constants/abi.json";
import { useProduct } from "../context/ContextProvider";
import useGetUsedyToken from "./useGetUsedyToken";

const useAddProduct = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const errorDecoder = ErrorDecoder.create([abi]);

  const { refreshProducts } = useProduct(); 
  const { refreshBalance } = useGetUsedyToken()

  const addProduct = useCallback(
    async (productName, imageUrl, productDesc, amount, productWeight) => {
      if (!productName || !imageUrl || !productDesc || !amount || !productWeight) {
        toast.error("Invalid input!");
        return;
      }

      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!contract) {
        toast.error("Contract not found");
        return;
      }

      if (Number(chainId) !== Number(ultraNebulaTestnet.id)) {
        toast.error("You're not connected to ultraNebulaTestnet network");
        return;
      }

      try {
        const tx = await contract.listProduct(
          productName,
          imageUrl,
          productDesc,
          amount,
          productWeight
        );
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Product listed successfully. UTN has been minted to you");
          refreshProducts(); 
          refreshBalance();
        } else {
          toast.error("Failed to list product");
        }
      } catch (err) {
        const decodedError = await errorDecoder.decode(err);
        toast.error(`Failed to List Product - ${decodedError.reason}`, {
          position: "top-center",
        });
      }
    },
    [contract, address, chainId, refreshProducts]
  );

  return addProduct;
};

export default useAddProduct;
