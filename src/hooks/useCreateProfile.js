import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { ultraNebulaTestnet } from "../connection/index";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../constants/abi.json";
import { useProduct } from "../context/ContextProvider";

const useCreateProfile = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const errorDecoder = ErrorDecoder.create([abi]);
  
  const { refreshSellers } = useProduct();

  return useCallback(
    async (sellerName, location, mail) => {
      if (!sellerName || !location || !mail) {
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
        const tx = await contract.createProfile(sellerName, location, mail);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Profile Creation Successful");
          refreshSellers()
          return;
        }

        toast.error("Failed to Create Profile");
        return;
      } catch (err) {
        const decodedError = await errorDecoder.decode(err);
        toast.error(`Failed to Create Profile - ${decodedError.reason}`, {
          position: "top-center",
        });
      }
    },
    [contract, address, chainId, refreshSellers]
  );
};

export default useCreateProfile;
