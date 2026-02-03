import React from 'react';
import x3 from '../../../assets/Landing/dashboard.jpg'

const Convenient = () => {
  return (
    <section className="relative container mx-auto lg:px-[115px] mb-[80px]">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-3 max-w-[343px] lg:max-w-[720px] mx-auto text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-[12px] bg-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.5 7.125C1.5 6.089 2.34 5.25 3.375 5.25H9.375C10.411 5.25 11.25 6.09 11.25 7.125V10.875C11.25 11.911 10.41 12.75 9.375 12.75H3.375C2.87772 12.75 2.40081 12.5525 2.04917 12.2008C1.69754 11.8492 1.5 11.3723 1.5 10.875V7.125ZM13.5 8.625C13.5 7.589 14.34 6.75 15.375 6.75H20.625C21.66 6.75 22.5 7.59 22.5 8.625V16.875C22.5 17.91 21.66 18.75 20.625 18.75H15.375C14.8777 18.75 14.4008 18.5525 14.0492 18.2008C13.6975 17.8492 13.5 17.3723 13.5 16.875V8.625ZM3 16.125C3 15.089 3.84 14.25 4.875 14.25H10.125C11.161 14.25 12 15.09 12 16.125V18.375C12 19.41 11.16 20.25 10.125 20.25H4.875C4.37772 20.25 3.90081 20.0525 3.54917 19.7008C3.19754 19.3492 3 18.8723 3 18.375V16.125Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Title & Description */}
        <h2 className="text-[32px] lg:text-[48px] font-normal lg:font-medium leading-[1.21] lg:leading-[1.21] text-center">
          Convenient office
        </h2>
        <p className="text-sm lg:text-lg text-gray-400 lg:text-white-500 font-light lg:font-normal">
          Interactive online visualization of active slots showing your unique NFT collection and your financial progress.
        </p>
      </div>

      {/* Image Section */}
      <img
        className="mt-[4rem] lg:mt-[8rem] max-w-[85%] mx-auto"
        src={x3}
        alt="Convenient Office Visualization"
      />
    </section>
  );
};

export default Convenient;
