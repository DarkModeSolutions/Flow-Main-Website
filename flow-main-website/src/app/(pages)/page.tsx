"use client";

import FlowButton from "@/components/FlowButton";
import { useRouter } from "next/navigation";

const MainPage = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="w-full flex">
        <div className="w-full h-[500px]">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="/assets/videos/carousel animation.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="md:w-[20%] w-[70%] mx-auto my-4 mt-0 md:my-16">
        <FlowButton
          label="Buy Now"
          onClickHandler={() => router.push("/shop")}
        />
      </div>
    </div>
  );
};

export default MainPage;
