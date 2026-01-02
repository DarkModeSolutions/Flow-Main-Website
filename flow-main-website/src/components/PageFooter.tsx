import { Separator } from "@/components/ui/separator";

import { CiMail } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";

const PageFooter = () => {
  return (
    <div className="w-full">
      <Separator className="w-full h-1 bg-white md:mb-0 mb-10" />
      <div className="p-3 w-full">
        <div className="md:flex block w-full min-h-[100px] items-stretch">
          {" "}
          {/* ✅ Added items-stretch */}
          <div className="flex justify-center items-center md:w-[40%] w-full md:mb-0 mb-10 md:text-[15px] text-xl manrope-light">
            <span className="text-gray-500">Go with the&nbsp;</span>
            <span className="font-bold text-[#24bfcf] drop-shadow-[0_2px_4px_rgba(255,255,255,0.25)] flow-gradient-text">
              FLOW
            </span>
          </div>
          {/* <Separator className="bg-[#fff] w-1" orientation="vertical" />{" "} */}
          <div className="w-px bg-white"></div>
          {/* ✅ Removed h-full */}
          <div className="md:flex-1 md:flex md:justify-between md:items-center px-1 text-[15px] text-white manrope-light md:ml-8">
            <div className="flex flex-wrap md:flex-col justify-center gap-4 md:w-[50%] w-full mb-10 md:mb-0 md:justify-around text-center">
              <span>Contact Us</span>
              <span>Contact Careers</span>
              <span>Collaborate</span>
              <span>Rewards</span>
            </div>
            <div className="flex-1 flex justify-evenly items-center">
              <a
                href="https://www.instagram.com/flowhydration.in?igsh=Zzd6cXZxcXRqajc5"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <FaInstagram size={40} className="text-white" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&to=contact@flowhydration.in"
                className="hover:opacity-80 transition-opacity"
              >
                <CiMail size={40} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageFooter;
