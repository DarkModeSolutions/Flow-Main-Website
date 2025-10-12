import { Separator } from "@/components/ui/separator";

import { AiOutlineYoutube } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

const PageFooter = () => {
  return (
    <div className="w-full">
      <Separator className="w-full h-1 bg-[#fff] md:mb-0 mb-10" />
      <div className="p-3 w-full">
        <div className="md:flex block w-full min-h-[100px] items-stretch">
          {" "}
          {/* ✅ Added items-stretch */}
          <div className="flex justify-center items-center md:w-[40%] w-full md:mb-0 mb-10 md:text-[15px] text-xl text-[#fff] manrope-light">
            Go with the FLOW
          </div>
          {/* <Separator className="bg-[#fff] w-1" orientation="vertical" />{" "} */}
          <div className="w-[1px] bg-[#fff]"></div>
          {/* ✅ Removed h-full */}
          <div className="md:flex-1 md:flex md:justify-between md:items-center px-1 text-[15px] text-[#fff] manrope-light md:ml-8">
            <div className="flex justify-evenly md:flex-col md:w-[50%] w-full mb-10 md:mb-0 md:justify-around gap-1.5">
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
