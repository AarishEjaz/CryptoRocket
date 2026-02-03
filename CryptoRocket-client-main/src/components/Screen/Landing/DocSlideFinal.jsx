import React from "react";
import DocSpan from "./DocSpan";
import DocSlide from "./DocSlide";

const DocSlideFinal = () => {
  return (
    <div className="flex flex-col lg:space-y-[170px] py-20 space-y-[80px] lg:px-4 lg:h-full">
      <DocSpan />
      <DocSlide />
    </div>
  );
};

export default DocSlideFinal;
