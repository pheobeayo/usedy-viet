import React, { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import bgIcon from "../../assets/transaction.png";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../context/ContextProvider";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import emptyCart from "../../assets/cart.png";
import { formatUnits } from "ethers";

const Transactions = () => {
  const navigate = useNavigate();
  const { address } = useAppKitAccount();
  const { products, sellers, purchaseId } = useProduct();
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [buyerAddress, setBuyerAddress] = useState(address || "");
  const userSeller = address
  ? sellers.find(
      (data) => data?.address?.toLowerCase() === address.toLowerCase()
    )
  : null;
  const userPurchase = products.find((item) => item.id === Number(purchaseId));

  return (
    <main>
      <section className="flex flex-col mt-4 lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-[100%] text-white">
        <div className="lg:w-[60%] md:w-[60%] w-[100%] p-8">
          <h2 className="lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4">
            Usedy - Where environmental consciousness gets you rewarded
          </h2>
          <p>
            View all your eco-friendly product purchases in one place. Track
            your contributions to a greener planet with each sustainable product
            you buy.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/dashboard/marketplace")}
              className="bg-white text-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] lg:w-[50%] md:w-[50%] w-[100%] my-2 hover:bg-[#C7D5D8] hover:font-bold"
            >
              Buy Product
            </button>
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-[100%] bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center">
          <img src={bgIcon} alt="dashboard" className="w-[70%] mx-auto" />
        </div>
      </section>
      <section>
        <h2 className="font-titiliumweb text-[20px] text-[#0F160F] lg:text-[24px] md:text-[24px] font-[700] mt-4">
          Purchased Products
        </h2>
        <div className="flex mb-6 text-[#0F160F] items-center">
          <img
            src="https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg?t=st=1719630441~exp=1719634041~hmac=3d0adf83dadebd27f07e32abf8e0a5ed6929d940ed55342903cfc95e172f29b5&w=2000"
            alt=""
            className="w-[40px] h-[40px] rounded-full"
          />
          {userSeller ? (
            <p className="ml-4 font-bold">{userSeller.name}</p>
          ) : (
            <p>Unregistered.</p>
          )}
        </div>
      </section>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Purchased Items" value="1" />
              <Tab label="Approved Items" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <section className="text-[#0F160F] flex lg:flex-row md:flex-row flex-col justify-between">
              {purchaseId?.length === 0 ? (
                <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
                  <img src={emptyCart} alt="" />
                  <p>No purchase yet</p>
                </div>
              ) : (
                <div className="border p-4 mb-4 rounded-lg shadow-md lg:w-[32%] md:w-[32%] w-[100%]">
                  <div>
                    <img
                      src={userPurchase.image}
                      alt=""
                      className="w-[300px] h-[300px] mb-4"
                    />
                    <p>
                      <strong>Product Name:</strong> {userPurchase.name}
                    </p>
                    <p className="flex justify-between my-4 font-bold truncate">
                      Price <span>{formatUnits(userPurchase.price)}ETH</span>{" "}
                    </p>
                  </div>

                  {/* : (
                <p>Product details not available.</p>
              )} */}
                  {/* {approved?.map((item) => {
        return item.address !== address ? (
          <ApprovePayment key={item.id} id={p.id} index={index} />
        ) : null;
      })} */}
                </div>
              )}
            </section>
          </TabPanel>
          <TabPanel value="2">
            {/* <section className="text-[#0F160F] flex lg:flex-row md:flex-row flex-col justify-between">
    {approved?.length === 0 ? (
      <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
          <img src={emptyPurchase} alt="" />
          <p>No Approved Payment yet</p>
          </div>
        ) : (approved.map((p, index) => {
          const userApproval = allProduct.find((data) => data?.id === p.id);
          return (
            <div key={index} className="border p-4 mb-4 rounded-lg shadow-md lg:w-[32%] md:w-[32%] w-[100%]">
              {userApproval ? (
                <div>
                  <img src={userApproval.image} alt="" className="w-[300px] h-[300px] mb-4" />
                  <p className='flex justify-between my-4 font-bold'>Price <span>{formatUnits(userApproval.price)}ETH</span> </p>
                </div>
              ) : (
                <p>Product details not available.</p>
              )}
            </div>
          );
        }))}
      </section> */}
          </TabPanel>
        </TabContext>
      </Box>
    </main>
  );
};

export default Transactions;
