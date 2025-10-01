import React from 'react';
import { formatUnits } from 'ethers';
import useGetProductBuyers from '../hooks/useGetProductBuyers';

const ProductBuyersInfo = ({ productId, productPrice }) => {
  const { buyersData, loading } = useGetProductBuyers(productId);

  const truncateAddress = (address) => {
    if (!address) return "";
    const start = address.slice(0, 8);
    const end = address.slice(-6);
    return `${start}...${end}`;
  };

  const calculateQuantityFromAmount = (totalAmount, pricePerUnit) => {
    if (!totalAmount || !pricePerUnit) return 0;
    try {
      const amount = parseFloat(formatUnits(totalAmount, 18));
      const price = parseFloat(formatUnits(pricePerUnit, 18));
      return price > 0 ? (amount / price).toFixed(2) : 0;
    } catch (error) {
      console.error("Error calculating quantity:", error);
      return 0;
    }
  };

  // Calculate totals
  const totalPendingRevenue = buyersData.reduce((total, buyer) => {
    return total + parseFloat(formatUnits(buyer.amountBought, 18));
  }, 0);

  const totalQuantitySold = buyersData.reduce((total, buyer) => {
    return total + parseFloat(calculateQuantityFromAmount(buyer.amountBought, productPrice));
  }, 0);

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h4 className="font-bold text-lg mb-4 text-[#0F160F]">Sales Dashboard</h4>
        <div className="flex justify-center items-center p-4">
          <p>Loading sales information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-6">
      <h4 className="font-bold text-lg mb-4 text-[#0F160F]">Sales Dashboard</h4>
      
      {/* Sales Summary */}
      {buyersData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 font-medium">Pending Orders</p>
            <p className="text-2xl font-bold text-blue-800">{buyersData.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600 font-medium">Units Sold (Pending)</p>
            <p className="text-2xl font-bold text-green-800">{totalQuantitySold.toFixed(2)}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <p className="text-sm text-purple-600 font-medium">Pending Revenue</p>
            <p className="text-2xl font-bold text-purple-800">{totalPendingRevenue.toFixed(4)} U2U</p>
          </div>
        </div>
      )}
      
      {buyersData.length === 0 ? (
        <div className="text-center p-6 text-gray-500 bg-white rounded-lg">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="font-medium">No pending purchases for this product</p>
          <p className="text-sm mt-1">New buyers will appear here after purchase and before payment approval</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h5 className="font-semibold text-[#0F160F] border-b pb-2">Recent Buyers (Pending Payment)</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {buyersData.map((buyer, index) => {
              const quantity = calculateQuantityFromAmount(buyer.amountBought, productPrice);
              
              return (
                <div 
                  key={index} 
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Buyer #{index + 1}
                      </span>
                      <span className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                        Pending
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-600">Address:</span>
                      <p className="text-sm font-mono text-[#0C3B45] break-all mt-1">
                        {truncateAddress(buyer.address)}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-medium text-gray-600">Quantity</span>
                        <p className="text-lg font-bold text-green-600">
                          {quantity}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs font-medium text-gray-600">Amount</span>
                        <p className="text-lg font-bold text-[#0C3B45]">
                          {parseFloat(formatUnits(buyer.amountBought, 18)).toFixed(4)} U2U
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h6 className="font-semibold text-blue-800 mb-1">Payment Process</h6>
                <p className="text-sm text-blue-700">
                  These buyers have purchased your product but haven't approved payment yet. 
                  Once they approve payment, the transaction will be completed and you'll receive your payment automatically.
                  The buyers will then be removed from this pending list.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductBuyersInfo;