import { useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";
import { toast } from "react-toastify"
import { ultraNebulaTestnet } from "../connection/index";
import { ErrorDecoder } from "ethers-decode-error";
import abi from "../constants/abi.json";
import { ethers, Contract, formatUnits } from "ethers";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 10,
  boxShadow: 24,
  maxHeight: "90vh",        
  overflowY: "auto",  
  border: "1px solid #42714262",
  backgroundColor: "#1E1D34",
  p: 4,
};

const BuyProduct = ({ id, price }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [amount, setAmount] = useState("");
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const errorDecoder = ErrorDecoder.create([abi]);
  const { walletProvider } = useAppKitProvider("eip155");

  const totalAmount = useMemo(() => {
    if (!amount || !price || isNaN(Number(amount)) || Number(amount) <= 0) {
      return "0";
    }

    try {
      const priceInWei = ethers.parseUnits(price.toString(), 18);
      const total = priceInWei * BigInt(Math.floor(Number(amount)));
      return formatUnits(total, 18);
    } catch {
      return "0";
    }
  }, [amount, price]);

  const handleBuyProduct = useCallback(
    async (id, amount) => {
      if (!id || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        toast.error("Please enter a valid amount!");
        return;
      }

      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }

      if (Number(chainId) !== Number(ultraNebulaTestnet.id)) {
        toast.error("You're not connected to ultraNebula Testnet network");
        return;
      }

      const getProvider = (provider) => new ethers.BrowserProvider(provider);
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const contract = new Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const total =
        ethers.parseUnits(price.toString(), 18) *
        BigInt(Math.floor(Number(amount)));

      try {
        const transaction = await contract.buyProduct(
          id,
          Math.floor(Number(amount)),
          {
            value: total,
          }
        );

        const receipt = await transaction.wait();

        if (receipt.status) {
          toast.success("Product purchase successful!", {
            position: "top-center",
          });
        } else {
          toast.error("Product purchase failed", {
            position: "top-center",
          });
        }
      } catch (err) {
        const decodedError = await errorDecoder.decode(err);
        toast.error(`Product purchase failed - ${decodedError.reason}`, {
          position: "top-center",
        });
        console.log(decodedError.reason);
      } finally {
        setAmount("");
        setOpen(false);
      }
    },
    [address, chainId, walletProvider, price, errorDecoder]
  );

  return (
    <div>
      <div>
        <button
          className="bg-white text-[#0C3B45] border border-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
          onClick={handleOpen}
        >
          Buy Products
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2 className="text-white text-xl font-bold mb-4">
              Purchase Product
            </h2>

            <input
              type="text"
              placeholder="Product ID"
              value={id}
              className="text-white rounded-lg w-[100%] p-4 bg-[#2E343A] border border-white/50 backdrop-blur-lg mb-4 outline-none hidden"
              readOnly
            />

            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">
                Price per item:
              </label>
              <div className="text-white bg-[#2E343A] rounded-lg p-4 border border-white/50">
                {price} U2U
              </div>
            </div>

            <div className="mb-4">
              <label className="text-white text-sm mb-2 block">Quantity:</label>
              <input
                type="number"
                min="1"
                value={amount}
                placeholder="How many items?"
                onChange={(e) => setAmount(e.target.value)}
                className="text-white rounded-lg w-[100%] p-4 bg-[#2E343A] border border-white/50 backdrop-blur-lg outline-none"
              />
            </div>

            <div className="mb-4 p-4 bg-[#073F77] rounded-lg border-2 border-[#0C3B45]">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Amount:</span>
                <span className="text-white font-bold text-lg">
                  {totalAmount} U2U
                </span>
              </div>
              {amount && Number(amount) > 0 && (
                <div className="text-sm text-gray-300 mt-2">
                  {amount} × {price} U2U = {totalAmount} U2U
                </div>
              )}
            </div>

            <button
              className="bg-[#2E343A] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4 hover:bg-[#073F77] transition-colors"
              onClick={() => handleBuyProduct(id, amount)}
              disabled={!amount || Number(amount) <= 0}
            >
              Buy Product &rarr;
            </button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default BuyProduct;
