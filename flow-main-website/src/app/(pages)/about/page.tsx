import { GiWaterDrop } from "react-icons/gi";
import { MdOutlineScience } from "react-icons/md";
import { SlEnergy } from "react-icons/sl";
import { TbSalt } from "react-icons/tb";
import Image from "next/image";

const AboutPage = () => {
  const flowCharacteristics = [
    {
      icon: <MdOutlineScience size={36} />,
      title: "Scientific Formula",
      desc: "Precision-crafted for optimal hydration",
    },
    {
      icon: <GiWaterDrop size={36} />,
      title: "Vitamins & Electrolytes",
      desc: "13 vitamins and 5 essential electrolytes",
    },
    {
      icon: <SlEnergy size={36} />,
      title: "Mind & Body Refresh",
      desc: "Sustained energy throughout the day",
    },
    {
      icon: <TbSalt size={36} />,
      title: "Essential Salts",
      desc: "Balanced mineral composition",
    },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col text-white">
      {/* ================= HERO SECTION ================= */}
      <section className="w-full flex flex-col md:flex-row items-center gap-12 px-6 md:px-16 py-20">
        {/* Text */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="manrope manrope-semibold text-[#24BFCF] text-3xl md:text-4xl">
            About FLOW Hydration
          </h2>

          <p className="text-base leading-relaxed max-w-xl">
            Flow is a complete hydration solution designed to keep you refreshed
            throughout the day. With 5 essential salts and 10 vitamins, your
            micronutrient needs are met.
          </p>

          <p className="text-base leading-relaxed max-w-xl">
            Scientifically crafted, Flow delivers exactly what your body needs
            to maintain peak performance—consistently and reliably.
          </p>
        </div>

        {/* Image Placeholder */}
        <div className="flex-1 w-4/5 mx-auto h-96 md:h-[500px] rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
          <Image
            src="/assets/images/Flow-ad-image.png"
            alt="Flow ad"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section className="w-full px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {flowCharacteristics.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-4 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <div className="text-[#24BFCF]">{item.icon}</div>
              <h3 className="text-sm font-semibold tracking-wide uppercase">
                {item.title}
              </h3>
              <p className="text-sm text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SCIENCE SECTION ================= */}
      <section className="w-full flex flex-col md:flex-row gap-12 px-6 md:px-16 py-20">
        {/* Image Placeholder */}
        <div className="flex-1 w-full h-72 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
          <span className="text-white/40 text-sm">
            Science / Ingredients Visual Placeholder
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="manrope manrope-semibold text-[#24BFCF] text-3xl">
            Built on Science
          </h2>

          <p className="text-base leading-relaxed">
            FLOW formulations are built with precision and intent. Every
            ingredient is selected to support hydration efficiency, endurance,
            and daily performance—without unnecessary additives.
          </p>

          <div className="flex gap-8 mt-4">
            <div>
              <p className="text-3xl font-semibold text-[#24BFCF]">13</p>
              <p className="text-sm text-white/70">Essential Vitamins</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-[#24BFCF]">5</p>
              <p className="text-sm text-white/70">Electrolytes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISION SECTION ================= */}
      <section className="w-full px-6 md:px-16 py-20 flex flex-col gap-12">
        <h2 className="manrope manrope-semibold text-[#24BFCF] text-3xl">
          Our Vision
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Quality Without Compromise</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Whether for everyday hydration or athletic performance, we believe
              nothing short of the best should be delivered. Our ingredients and
              formulations meet the highest standards.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Transparency First</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Clear communication, easy-to-read labels, and no “BS” marketing.
              We aim to build trust through honesty and simplicity.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Built for India’s Future</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Our commitment is to contribute meaningfully to India’s growing
              health and sports ecosystem by innovating and pushing performance
              boundaries.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CLOSING STATEMENT ================= */}
      <section className="w-full px-6 md:px-16 py-16">
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-lg md:text-xl leading-relaxed text-white/80 max-w-3xl mx-auto">
            FLOW exists to redefine hydration—through science, transparency, and
            uncompromising quality—helping people perform better every day.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
