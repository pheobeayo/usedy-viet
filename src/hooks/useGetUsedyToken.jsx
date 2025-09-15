import { useCallback, useState, useEffect } from "react";
import { tokenContract } from "../constants/tokenContract";
import { useAppKitAccount } from "@reown/appkit/react";

const useGetUsedyToken = () => {
  const { address } = useAppKitAccount();
  const [userBal, setUserBal] = useState(0);

  const refreshBalance = useCallback(async () => {
    try {
      const tx = await tokenContract.balanceOf(address);
      setUserBal(tx);
    } catch (err) {
      console.log(err);
    }
  }, [address]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  return { userBal, refreshBalance };
};

export default useGetUsedyToken;
