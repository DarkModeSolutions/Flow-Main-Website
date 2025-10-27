import FlowButton from "@/components/FlowButton";

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
      <div className="w-full mx-auto h-[500px] mt-10">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          {/* ✅ Fixed MIME type */}
          <source src="/assets/videos/ingredients video.mp4" type="video/mp4" />
          {/* ✅ Fallback message for unsupported browsers */}
          <p>
            Your browser does not support MOV videos. Please convert to MP4.
          </p>
        </video>
      </div>
    </div>
  );
};

export default MainPage;
