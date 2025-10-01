import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { ultraNebulaTestnet } from "../connection/index";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../constants/abi.json";
import { useProduct } from "../context/ContextProvider";

const useApprovePayment = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const errorDecoder = ErrorDecoder.create([abi]);
  const { refreshBalance } = useProduct();

  const approvePayment = useCallback(
    async (productId) => {
      if (!productId) {
        toast.error("Invalid product ID!");
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
        const tx = await contract.approvePayment(productId);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Payment approved successfully! UTN has been minted to you");
          // Refresh balance after successful approval
          if (refreshBalance) {
            refreshBalance();
          }
          return true;
        } else {
          toast.error("Failed to approve payment");
          return false;
        }
      } catch (err) {
        const decodedError = await errorDecoder.decode(err);
        toast.error(`Failed to approve payment - ${decodedError.reason}`, {
          position: "top-center",
        });
        console.error("Approve payment error:", err);
        return false;
      }
    },
    [contract, address, chainId, refreshBalance]
  );

  return approvePayment;
};

export default useApprovePayment;