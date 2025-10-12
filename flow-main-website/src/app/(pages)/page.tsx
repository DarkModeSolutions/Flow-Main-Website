import FlowButton from "@/components/FlowButton";
// import { useRouter } from "next/navigation";

const MainPage = () => {
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
        <FlowButton label="Buy Now" redirectTo="/shop" />
      </div>
    </div>
  );
};

export default MainPage;

// "use client";

// import FlowButton from "@/components/FlowButton";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef } from "react";

// const MainPage = () => {
//   const router = useRouter();
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     // Multiple aggressive attempts to play
//     const aggressivePlay = async () => {
//       if (video.paused) {
//         try {
//           video.muted = true;
//           video.volume = 0;
//           await video.play();
//         } catch (error) {
//           // Silently fail and try again
//           console.log("Error:", error);
//           setTimeout(aggressivePlay, 100);
//         }
//       }
//     };

//     // Start playing immediately
//     aggressivePlay();

//     // Try every 500ms until it plays
//     const interval = setInterval(() => {
//       if (video.paused) {
//         aggressivePlay();
//       } else {
//         clearInterval(interval);
//       }
//     }, 500);

//     // Force play on ANY user interaction
//     const forcePlay = () => {
//       video.play().catch(() => {});
//     };

//     // Listen to ALL possible user interactions
//     const interactionEvents = [
//       "click",
//       "touchstart",
//       "touchend",
//       "touchmove",
//       "mousedown",
//       "mouseup",
//       "mousemove",
//       "scroll",
//       "keydown",
//       "resize",
//       "focus",
//       "blur",
//     ];

//     interactionEvents.forEach((event) => {
//       document.addEventListener(event, forcePlay, { passive: true });
//       window.addEventListener(event, forcePlay, { passive: true });
//     });

//     // Try when video is ready
//     video.addEventListener("loadeddata", aggressivePlay);
//     video.addEventListener("canplay", aggressivePlay);
//     video.addEventListener("canplaythrough", aggressivePlay);

//     // Cleanup
//     return () => {
//       clearInterval(interval);
//       interactionEvents.forEach((event) => {
//         document.removeEventListener(event, forcePlay);
//         window.removeEventListener(event, forcePlay);
//       });
//     };
//   }, []);

//   return (
//     <div className="w-full">
//       <div className="w-full flex">
//         <div className="w-full h-[500px]">
//           <video
//             ref={videoRef}
//             className="w-full h-full object-cover"
//             autoPlay
//             loop
//             muted
//             playsInline
//             preload="auto"
//             // defaultMuted
//             webkit-playsinline="true"
//           >
//             <source
//               src="/assets/videos/carousel animation.mp4"
//               type="video/mp4"
//             />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       </div>
//       <div className="md:w-[20%] w-[70%] mx-auto my-4 mt-0 md:my-16">
//         <FlowButton
//           label="Buy Now"
//           onClickHandler={() => router.push("/shop")}
//         />
//       </div>
//     </div>
//   );
// };

// export default MainPage;
