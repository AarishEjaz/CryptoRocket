import React, { useState } from "react";
import Hero from "../../components/Screen/Landing/Hero";
import DocSlideFinal from "../../components/Screen/Landing/DocSlideFinal";
import School from "../../components/Screen/Landing/School";
import Convenient from "../../components/Screen/Landing/Convenient";
import Partners1 from "../../components/Screen/Landing/Partners1";
import Technology1 from "../../components/Screen/Landing/Technology1";
import Faq1 from "../../components/Screen/Landing/Faq1";
import BackGround from "../../components/Screen/Landing/BackGround";
import HowItWorks from "../../components/Screen/Landing/HowItWorks";
import WhyChooseUs from "../../components/Screen/Landing/WhyChooseUs";
import Security from "../../components/Screen/Landing/Security";
import Stats from "../../components/Screen/Landing/Stats";
import Community from "../../components/Screen/Landing/Community";
import BasicGrowthPlan from "../../components/Screen/Landing/BasicGrowthPlan";
import PlanPage from "../../components/Screen/Landing/PlanPage";
import ReferralBonus from "../../components/Screen/Landing/ReferralBonus";

const LandingPage = () => {
  return (
    <>
      <BackGround />
      <div className="min-h-screen bg-primary text-primary">
        {/* <Header /> */}
        <div className="pt-20 lg:pt-[60px]">
          <Hero />
          <div className="px-4 lg:px-0">
           
            <HowItWorks />
            <BasicGrowthPlan />
            <PlanPage />
            <ReferralBonus />
            <WhyChooseUs />
            {/* <Security />
            <Stats /> */}
            <Community/>
            <Faq1 />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
      {/* {isClicked && <Login handleClick={handleClick} />} */}
    </>
  );
};

export default LandingPage;
