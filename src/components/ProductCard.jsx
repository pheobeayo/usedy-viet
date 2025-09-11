import { Link } from "react-router-dom";

import { formatUnits } from "ethers";
import { useProduct } from "../context/ContextProvider";

const ProductCard = () => {
  const { products } = useProduct();

  return (
    <div className="flex lg:flex-row md:flex-row flex-col justify-between items-center my-10 flex-wrap">
      {products.map((info) => (
        <div className="lg:w-[32%] md:w-[32%] w-[100%] p-4 border border-[#0F160F]/20 rounded-lg mb-4 shadow-lg"  key={info.id}>
          <Link
            to={`/dashboard/market_place/${info.id}`}
            className="text-[#0F160F]"
            key={info.id}
          >
            <img
              src={info.image}
              alt=""
              className="w-[100%] h-[237px] object-cover object-center rounded-lg"
            />
            <h3 className="font-bold mt-4 lg:text-[20px] md:text-[20px] text-[18px] capitalise">
              {info.name}
            </h3>
            <p className="flex justify-between my-4">
              Quantity <span>{Number(info.weight)}</span>
            </p>
            <p className="flex justify-between my-4">
              Seller's location <span>{info.location}</span>
            </p>
            <p className="flex justify-between my-4 font-bold truncate">
              Price <span>{formatUnits(info.price)}ETH</span>{" "}
            </p>
            <button className="my-4 border w-[100%] py-2 px-4 border-[#0C3B45] text-[#0C3B45] rounded-lg">
              View details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
