import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useGetProduct from '../hooks/useGetProduct';
import LoadingSpinner from '../components/Loader/LoadingSpinner'
import { formatUnits } from 'ethers';
import { IoClose } from "react-icons/io5";

const MarketplaceHomeDetails = () => {
    const { id } = useParams()
    const { product }= useGetProduct()
    const [transaction, setTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false)
    
    useEffect(() => {
        if (product.length > 0) {
            const foundTransaction = product.find(data => String(data?.id) === id);
            setTransaction(foundTransaction);
            console.log("Transaction:", foundTransaction);
        }
    }, [product, id]);

    const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.slice(0, 20);
    return `${start}...`;
    };

    const handleShowModal = () => {
        setShowModal(true);
     };

     const handleCloseModal = () => {
        setShowModal(false);
     };

  return (
    <main>
       { transaction ? ( <div className='w-[95%] mx-auto p-8'>
        <h2 className='lg:text-[28px] md:text-[28px] text-[18px] text-[#0F160F] font-bold mb-2 font-titiliumweb'>Product Details</h2>
       <section className='flex lg:flex-row md:flex-row flex-col justify-between'>
        <div className='lg:w-[45%] md:w-[45%] w-[100%]'>
            <img src={transaction.image} alt=""  className='rounded-lg w-[100%]'/>
            </div>
            <div className='text-[#0F160F] lg:w-[52%] md:w-[52%] w-[100%]'>
            <h3 className='font-bold mt-4 lg:mt-0 md:mt-0 lg:text-[24px] md:text-[24px] text-[20px] capitalise font-titiliumweb'>{transaction.name}</h3>
            <p className='font-titiliumweb mb-4 font-bold text-[#3F9AAE] lg:text-[24px] md:text-[24px] text-[20px]'>{formatUnits(transaction.price)} ETH (per unit of measure) </p>
            <p className='flex justify-between my-4'>Quantity available: <span>{Number(transaction.weight)}</span></p>
            <p className='flex justify-between my-4'>Seller's location: <span>{transaction.location}</span></p>
            <p className='flex justify-between my-4'>Seller's wallet address: <span>{truncateAddress(transaction.address)}</span></p>
            <button className='bg-[#3F9AAE] w-[100%] py-2 text-white mb-4' onClick={handleShowModal}>Edit information</button>
            <button className='bg-white w-[100%] py-2 text-[#3F9AAE] border border-[#3F9AAE] mb-4' onClick={handleShowModal}>Add Comment</button>
            <p>Kindly drop a comment upon receipt of your products. This is crucial to ensure the seller receives their payment promptly. <a href="#" className='text-[#3F9AAE] font-bold'>Learn More</a></p>
            </div>
            </section></div>) : (<div>
            <LoadingSpinner />
        </div>)} 
        {showModal && (
           <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75'>
           <div className='bg-white p-8 rounded-lg text-[#0F160F] flex flex-col items-center'>
            <IoClose  className='self-end mb-4 font-bold text-2xl' onClick={handleCloseModal} />
             <p className='mb-4'>Kindly connect your wallet to proceed</p>
             <w3m-button />
       </div>         
         </div>
        )}
    </main>
  )
}

export default MarketplaceHomeDetails