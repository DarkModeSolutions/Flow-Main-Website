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
      className="flex justify-between items-center p-4 rounded-lg hover:bg-black w-full text-white"
    >
      {/* <Image src={img!} alt={`Product ${name} Image`} /> */}
      <span>{name}</span>
    </Link>
  );
};

export default SearchResult;
