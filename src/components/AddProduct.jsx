import React, { useState } from "react";
import { ethers } from "ethers";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import useAddProduct from "../hooks/useAddProduct";
import usePinataUpload from "../hooks/usePinataUpload";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { RiImageAddFill } from "react-icons/ri";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 10,
  boxShadow: 24,
  border: "1px solid #42714262",
  backgroundColor: "#1E1D34",
  maxHeight: "90vh",        
  overflowY: "auto",        
  p: 4,
};

const AddProduct = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAdd = useAddProduct();
  const { uploadToPinata, isUploading } = usePinataUpload();

  const [imageUrl, setImageUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [error, setError] = useState("");

  const handleListproduct = async () => {
    const amount = ethers.parseUnits(productPrice);
    await handleAdd(productName, imageUrl, productDesc, amount, productWeight);
    setImageUrl("");
    setProductName("");
    setProductDesc("");
    setProductPrice("");
    setProductWeight("");
    handleClose();
  };

  const convertIpfsUrl = (url) =>
    url.startsWith("ipfs://")
      ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
      : url;

  const changeHandler = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 1) {
        setError("File size exceeds 1MB. Please choose a smaller file.");
      } else {
        setError("");
        try {
          const uploadedUrl = await uploadToPinata(file);
          setImageUrl(uploadedUrl);
        } catch (error) {
          console.error("File upload failed:", error);
        }
      }
    }
  };

  return (
    <div>
      <button
        className="bg-white text-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] lg:w-[50%] md:w-[50%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
        onClick={handleOpen}
      >
        Add New Products
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p className="font-bold text-[24px] text-center font-titiliumweb my-6">
            List Product
          </p>
          <label>Select a Product Image (Image URL (Below 1mb))</label>
          <div className="mb-4 w-full relative">
            {imageUrl ? (
              <div className="relative w-[150px] mx-auto h-26 border border-white/20 rounded-md overflow-hidden">
                <img
                  src={convertIpfsUrl(imageUrl)}
                  alt="Uploaded"
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className="absolute bottom-0 right-0 bg-black/80 p-2 rounded-full hover:bg-black/70 transition"
                  title="Change image"
                >
                  <RiImageAddFill className="text-white text-xl" />
                </button>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={changeHandler}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            ) : (
              <div
                className="w-[150px] my-3 mx-auto flex items-center justify-center h-26 rounded-lg border border-white/20 cursor-pointer hover:border-[#aaa] transition"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <RiImageAddFill className="text-[64px] text-white/70" />
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={changeHandler}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                <LoadingSpinner />
              </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {imageUrl && (
              <input
                type="text"
                value={imageUrl}
                className="mt-4 hidden border border-white/20 w-full rounded-md p-3 text-sm bg-transparent text-white"
              />
            )}
          </div>
          <p className="mb-2">Product Name</p>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <p className="mb-2">Product Description</p>
          <input
            type="text"
            value={productDesc}
            onChange={(e) => setProductDesc(e.target.value)}
            placeholder="Enter product description"
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <p className="mb-2">Product Quantity</p>
          <input
            type="text"
            value={productWeight}
            onChange={(e) => setProductWeight(e.target.value)}
            placeholder="Enter quantity"
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <p className="mb-2">Purchase Price Per Unit</p>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Enter product price"
            className="border mb-4 border-white/20 w-[100%] rounded-md hover:outline-0 p-3"
          />
          <button
            className="bg-[#073F77] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4"
            onClick={handleListproduct}
          >
            Create &rarr;
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default AddProduct;
