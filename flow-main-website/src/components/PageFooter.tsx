import { Separator } from "@/components/ui/separator";
import React from "react";

import { FaInstagram } from "react-icons/fa";
import { AiOutlineYoutube } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { FaLinkedin } from "react-icons/fa";

const PageFooter = () => {
  return (
    <div className="w-full">
      <Separator className="w-full h-1 bg-[#fff]" />
      <div className="p-3 w-full">
        <div className="flex w-full min-h-[100px] items-stretch">
          {" "}
          {/* ✅ Added items-stretch */}
          <div className="flex justify-center items-center w-[40%] text-[15px] text-[#fff] manrope-light">
            Go with the FLOW
          </div>
          {/* <Separator className="bg-[#fff] w-1" orientation="vertical" />{" "} */}
          <div className="w-[1px] bg-[#fff]"></div>
          {/* ✅ Removed h-full */}
          <div className="flex-1 flex justify-between items-center px-1 text-[15px] text-[#fff] manrope-light ml-8">
            <div className="flex flex-col w-[50%] gap-1.5">
              <span>Contact Us</span>
              <span>Contact Careers</span>
              <span>Collaborate</span>
              <span>Rewards</span>
            </div>
            <div className="flex-1 flex justify-evenly items-center">
              <FaInstagram size={40} className="text-[#fff]" />
              <AiOutlineYoutube size={40} className="text-[#fff]" />
              <CiMail size={40} className="text-[#fff]" />
              <FaLinkedin size={40} className="text-[#fff]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageFooter;
