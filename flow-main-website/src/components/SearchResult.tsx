// import Image from "next/image";
import Link from "next/link";

const SearchResult = ({
  name,
  id,
}: {
  name: string;
  img: string | null;
  id: string;
}) => {
  return (
    <Link
      href={`/product/${id}`}
      className="flex justify-between items-center p-4 rounded-lg  w-full text-white hover:bg-gray-500 transition-all ease-in-out duration-300"
    >
      {/* <Image src={img!} alt={`Product ${name} Image`} /> */}
      <span className="text-sm">{name}</span>
    </Link>
  );
};

export default SearchResult;
