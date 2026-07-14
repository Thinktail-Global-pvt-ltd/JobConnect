import React from "react";
import construction from "../assets/construction.png";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 items-center">

        {/* Left Content */}
        <div className="text-center lg:text-left">

          <div className="inline-block px-4 py-2 rounded-full bg-indigo-50 text-[#55B8CF] font-semibold mb-6">
            🚀 Jobrito
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-[10px] uppercase text-[#55B8CF]">
            Coming Soon
          </h1>

          <p className="mt-8 text-lg text-gray-600 leading-8 max-w-xl">
            We're building something amazing for the hospitality industry.
            Jobrito will soon connect talented professionals, employers, and
            Chef Connect experts on one powerful platform.
          </p>

          <div className="mt-12">
            <p className="text-sm text-gray-500">
              Launching Soon • Stay Tuned
            </p>
          </div>

        </div>

        {/* Right Illustration */}
        <div className="flex justify-center">

          <img
            src={construction}
            alt="Coming Soon"
            className="w-full max-w-xl"
          />

        </div>

      </div>
    </div>
  );
};

export default ComingSoon;