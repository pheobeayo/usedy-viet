import { useCallback, useEffect, useState } from "react";
import useSignerOrProvider from "./useSignerOrProvider";
import { Contract } from "ethers";
import abi from '../constants/abi.json'

const useGetProduct = () => {
    const [product, setProduct] = useState([]);
    const { readOnlyProvider} = useSignerOrProvider()

    const convertIpfsUrl = (url) => {
        if (url.startsWith("ipfs://")) {
            return url.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        return url;
    };

    const fetchProduct = useCallback(async () => {
        try {
            const contract = new Contract(import.meta.env.VITE_CONTRACT_ADDRESS, abi, readOnlyProvider);
            const res = await contract.getAllproduct();
            const converted = res?.map((item, index)=>{
                return{id: index+1,
                    address: item[0],
                name: item[1],
                image: convertIpfsUrl(item[2]),
                location: item[3],
                product: item[4],
                price: item[5],
                weight: item[6],
                sold: item[7],
                inProgress: item[8]   
              }      
            }) 
            setProduct(converted)
        } catch (error) {
      console.log("Error fetching all Product", error);
      setProduct([]);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product: Array.isArray(product) ? product : [],
  };
};

export default useGetProduct;
