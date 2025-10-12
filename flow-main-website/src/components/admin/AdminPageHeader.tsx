"use client";

import logo from "@/../public/assets/images/Flow Logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const AdminPageHeader = () => {
  const router = useRouter();

  return (
    <div className="p-6 flex items-center justify-start">
      <div className="w-[50%]" onClick={() => router.push("/admin")}>
        <Image
          src={logo}
          alt="Flow Logo"
          className="w-[50px] h-auto cursor-pointer"
        />
      </div>
      <div className="text-3xl w-full md:ml-36">Admin Panel</div>
    </div>
  );
};

export default AdminPageHeader;
