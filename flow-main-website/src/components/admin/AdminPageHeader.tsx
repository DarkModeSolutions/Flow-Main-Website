"use client";

import logo from "@/../public/assets/images/Flow Logo.png";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminPageHeader = () => {
  const router = useRouter();

  const [currentPath, setCurrentPath] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <div
      className={`p-6 flex items-center justify-start ${
        currentPath.includes("/auth/login") ? "hidden" : ""
      }`}
    >
      <div className="w-[40%]" onClick={() => router.push("/admin")}>
        <Image
          src={logo}
          alt="Flow Logo"
          className="w-[50px] h-auto cursor-pointer"
        />
      </div>
      <div className="text-3xl w-full md:ml-36">Admin Panel</div>
      <div className="w-[10%] cursor-pointer" onClick={() => signOut()}>
        Sign Out
      </div>
    </div>
  );
};

export default AdminPageHeader;
