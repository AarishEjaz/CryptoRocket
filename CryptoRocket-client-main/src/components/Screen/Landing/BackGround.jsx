import React from "react";

const BackGround = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
      
      {/* LEFT TOP CIRCLE */}
      <div
        className="
          fixed
          top-[-120px] left-[-120px]
          w-[420px]
          aspect-square
          rounded-full
          bg-purple-600/40
          blur-[160px]
          animate-floatGlow
          will-change-transform
          pointer-events-none
        "
      />

      {/* RIGHT BOTTOM CIRCLE */}
      <div
        className="
          fixed
          bottom-[-120px] right-[-120px]
          w-[420px]
          aspect-square
          rounded-full
          bg-pink-600/30
          blur-[160px]
          animate-floatGlowSlow
          will-change-transform
          pointer-events-none
        "
      />

    </div>
  );
};

export default BackGround;
