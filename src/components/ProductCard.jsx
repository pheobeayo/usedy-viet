import { Link } from "react-router-dom";

import { formatUnits } from "ethers";
import { useProduct } from "../context/ContextProvider";

const ProductCard = () => {
  const { products } = useProduct();

  return (
    <div className="flex lg:flex-row md:flex-row flex-col justify-between items-center my-10 flex-wrap">
      {products.map((info) => (
        <div className="lg:w-[32%] md:w-[32%] w-[100%] p-4 border border-[#0F160F]/20 rounded-lg mb-4 shadow-lg relative"  key={info.id}>
          {Number(info.weight) === 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
              Out of Stock
            </div>
          )}
          <div className={`text-[#0F160F] ${Number(info.weight) === 0 ? 'opacity-75' : ''}`}>
            <img
              src={info.image}
              alt=""
              className="w-[100%] h-[237px] object-cover object-center rounded-lg"
            />
            <h3 className="font-bold mt-4 lg:text-[20px] md:text-[20px] text-[18px] capitalise">
              {info.name}
            </h3>
            <p className="flex justify-between my-4">
              Quantity <span className={Number(info.weight) === 0 ? 'text-red-500 font-bold' : ''}>{Number(info.weight) === 0 ? '0 (Out of Stock)' : Number(info.weight)}</span>
            </p>
            <p className="flex justify-between my-4">
              Seller's location <span>{info.location}</span>
            </p>
            <p className="flex justify-between my-4 font-bold truncate">
              Price <span>{formatUnits(info.price)}U2U</span>{" "}
            </p>
            {Number(info.weight) === 0 ? (
              <button 
                disabled
                className="my-4 border w-[100%] py-2 px-4 rounded-lg border-gray-400 text-gray-400 cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : (
              <Link
                to={`/dashboard/market_place/${info.id}`}
                className="block"
              >
                <button className="my-4 border w-[100%] py-2 px-4 border-[#0C3B45] text-[#0C3B45] rounded-lg hover:bg-[#0C3B45] hover:text-white transition-colors duration-200">
                  View details
                </button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
