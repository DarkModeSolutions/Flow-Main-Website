import React from "react";

import { MdOutlineScience } from "react-icons/md";
import { GiWaterDrop } from "react-icons/gi";
import { SlEnergy } from "react-icons/sl";
import { TbSalt } from "react-icons/tb";

const AboutPage = () => {
  const flowCharacteristics = [
    {
      icon: <MdOutlineScience size={40} />,
      desc: "Scientific Formula",
    },
    {
      icon: <GiWaterDrop size={40} />,
      desc: "13 Essential Vitamins and 5 Electrolytes",
    },
    {
      icon: <SlEnergy size={40} />,
      desc: "Refresh Mind and Body",
    },
    {
      icon: <TbSalt size={40} />,
      desc: "Essential Salts",
    },
  ];

  return (
    <div className="pt-4 w-full h-screen flex flex-col gap-8">
      <div className="flex flex-col gap-2.5">
        <h2 className="manrope manrope-semibold text-[#24BFCF] text-2xl">
          About FLOW Hydration
        </h2>
        <p>
          Flow is a complete hydration solution that aims to keep you refreshed
          through the day. With 5 essential salts and 10 vitamins your
          micronutrient needs are met. <br />
          Scientifically crafted, Flow aims to provide you with exactly what is
          right for your body to remain in peak performance throughout the day.
        </p>
        <div className="flex justify-around gap-8 mt-4">
          {flowCharacteristics.map((characteristic, index) => (
            <div
              key={index}
              className="mt-3 flex flex-col items-center text-white"
            >
              <div className="text-sm mb-2">{characteristic.icon}</div>
              <div className="text-sm">{characteristic.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="manrope manrope-semibold text-[#24BFCF] text-2xl">
          Our Vision
        </h2>
        <div className="w-full flex flex-col gap-4">
          <p>
            We at FLOW, aim to bring quality hydration products to the market.
            Whether it be everyday hydration or for athletic performance, we
            believe nothing short of the best should be provided. Our
            formulations and ingredients are top grade and of the highest
            standard.
          </p>
          <p>
            Our aim to be a customer friendly brand is something we highly
            prioritize. Communication and transparency is part of core values.
            From having easy to read back of pack to no <q>BS</q> marketing we
            truly want to be a relatable product the customer trusts.
          </p>
          <p>
            Overall our commitment to contribute to the growing health and
            sports ecosystem in india is by providing the highest quality
            products that innovate and push the boundaries of performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
