import React from "react";
import logo from "@/../public/assets/images/Flow Logo.png";
import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PageHeader = () => {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-between px-10 py-2 pl-2 pt-0">
      <div onClick={() => router.push("/")}>
        <Image
          src={logo}
          alt="Flow Logo"
          className="w-[50px] h-auto cursor-pointer"
        />
      </div>
      <div className="p-2 transition-all ease-in-out w-[30%] ml-20">
        <Input
          placeholder="🔍 Search here"
          type="text"
          className="rounded-[40px] transition-all ease-in-out placeholder:font-bold"
        />
      </div>
      <div className="flex items-center gap-10 text-2xl">
        <Link href={"/cart"}>
          <IoCartOutline className="text-white" />
        </Link>
        <IoPersonSharp className="text-white" />
        <GiHamburgerMenu className="text-white" />
      </div>
    </div>
  );
};

export default PageHeader;
