import FlowButton from "@/components/FlowButton";
import PayButton from "@/components/PayButton";

const MainPage = () => {
  return (
    <div className="w-full">
      <div className="w-full flex">
        <div className="w-[80%] mx-auto h-[500px]">
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
        <FlowButton label="Buy Now" redirectTo="/shop" />
      </div>
      <div className="md:w-[20%] w-[70%] mx-auto my-4 mt-0 md:my-16">
        <PayButton />
      </div>
    </div>
  );
};

export default MainPage;
