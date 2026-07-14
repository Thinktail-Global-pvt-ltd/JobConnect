import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import talentImage from "../assets/talent.png";
import chefImage from "../assets/chef.png";
import findTalentImage from "../assets/find talent.png";
import appstore from "../assets/appstore.png";
import playstore from "../assets/playstore.png";

const AppleIcon = (props) => (
  <svg viewBox="0 0 24 24" className="fill-current" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z"/>
  </svg>
);

const PlayStoreIcon = (props) => (
  <svg viewBox="0 0 24 24" className="fill-current" {...props}>
    <path d="M3 5.277c0-.986.666-1.745 1.545-1.921L14.7 12 4.545 20.644C3.666 20.468 3 19.709 3 18.723V5.277zm12.9 6.723L5.455 5.03l10.445 6.97-10.445 6.97L15.9 12zm1.2-1.2l4.545-3.03c.534-.356.534-.984 0-1.34L17.1 9.4z" />
  </svg>
);

const metrics = [
  { value: "50k+", label: "Hospitality Professionals" },
  { value: "1.2k+", label: "Hospitality Businesses" },
];

const HomeScreen = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#43474F] overflow-x-hidden pt-16 sm:pt-20">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#FFF8F6] border-b border-[#efe0d6]/50">
          <div className="relative mx-auto max-w-[1280px] px-[40px] pb-16 sm:pb-20 lg:pb-24 ">
            <div className="grid items-center gap-[44px] lg:grid-cols-[1.05fr_0.95fr]">
              {/* Left Content */}
              <div className="max-w-[608px] text-left flex flex-col gap-[12px]">
                

                <h1 className="text-[42px] font-black leading-[1.05] tracking-[-1.8px] text-[#00284C] sm:text-[56px] lg:text-[72px] lg:leading-[80px]">
                  Connecting hospitality talent
                </h1>

                {/* Tagline Overlay (faster, simpler, smarter) */}
                <div className="self-start inline-flex items-center rounded-md bg-[#00284C]/10 px-4 py-1">
                  <span className="text-[12px] font-normal tracking-[1.2px] uppercase text-[#00284C]">
                    faster, simpler, smarter
                  </span>
                </div>

                <p className="max-w-[576px] text-[18px] leading-[28px] text-[#43474F]">
                  Discover opportunities. Hire with confidence. Connect with culinary experts. Learn, grow, and stay connected with India's hospitality service industry—all from one app. <br /><br />Why wait? Download Jobrito today and be part of global growing hospitality community.
                </p>

                {/* Buttons row (Figma dimensions, brand orange shadow, app store and play store images restored) */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    to="/jobs"
                    className="inline-flex items-center justify-center rounded-lg bg-[#00284C] w-[213.44px] h-[67.5px] text-[16px] font-bold text-white shadow-[0_20px_25px_-5px_rgba(245,127,32,0.2),0_8px_10px_-6px_rgba(245,127,32,0.2)] transition-all duration-300 hover:bg-[#001e3b]"
                  >
                    Find Your Job
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    <a href="#" className="w-[50px] h-[43px] transition-transform duration-300 hover:scale-105">
                      <img src={appstore} alt="App Store" className="w-full h-full object-contain" />
                    </a>
                    <a href="#" className="w-[50px] h-[43px] transition-transform duration-300 hover:scale-105">
                      <img src={playstore} alt="Google Play" className="w-full h-full object-contain" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Mockup Phone & Floaty Cards */}
              <div className="relative mx-auto w-full max-w-[528px] h-[550px] flex items-center justify-center isolation-isolate mt-8 lg:mt-0">
                {/* Background glow decoration */}
                <div className="absolute w-[600px] h-[600px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00284C]/5 blur-[32px] rounded-full z-0" />
                
                {/* Smartphone container (w: 282px, h: 505px) */}
                <div className="relative w-[282px] h-[505px] rounded-[48px] border-[10px] border-[#0c1420] bg-[#00284C] p-5 shadow-[0px_25px_25px_rgba(0,0,0,0.15)] flex flex-col justify-between overflow-hidden z-10">
                  {/* Camera notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4.5 rounded-full bg-[#0c1420] z-20" />
                  
                  {/* Inner Screen Content */}
                  <div className="flex-1 flex flex-col justify-between pt-6 pb-2 text-white relative">
                    {/* Top pill */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        <div className="text-[9px] font-semibold text-white/95">Welcome back, Chef!</div>
                      </div>
                      <div className="h-1.5 w-16 bg-white/20 rounded-full mt-2.5" />
                    </div>

                    {/* Logo in center */}
                    <div className="text-center my-auto">
                      <h2 className="text-[34px] font-black tracking-tight text-white leading-none">Jobrito</h2>
                      <p className="text-[8px] uppercase tracking-[0.2em] text-[#ff8a2b] font-bold mt-1.5">Hospitality Match</p>
                    </div>

                    {/* Spacer */}
                    <div className="h-12" />
                  </div>
                </div>

                {/* Floating Snippet 1 (left: 81px, top: 80px) */}
                <div className="absolute w-[218px] h-[80px] left-[81px] top-[150px] z-20 bg-white rounded-[16px] p-4 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] flex items-center gap-3 border border-[#efe0d6]/30">
                  <div className="w-[32px] h-[32px] bg-[#FFD484] rounded-[12px] flex-shrink-0" />
                  <div className="w-[142px] h-[8px] bg-[#EEDFDC] rounded-[12px]" />
                </div>

                {/* Floating Snippet 2 (right: 32.5px, top: 270px) */}
                <div className="absolute w-[288px] h-[94px] right-[32.5px] top-[320px] z-20 bg-white rounded-[16px] p-4 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] border border-[#efe0d6]/30 text-left flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#00284C]">New job opportunity</span>
                    <span className="text-[10px] font-bold text-[#F57F20]">New</span>
                  </div>
                  <h4 className="text-[14px] font-bold text-[#211A18] leading-[20px]">Executive Chef</h4>
                  <p className="text-[10px] text-[#43474F]">The Oberoi, New Delhi</p>
                </div>

                {/* Floating Snippet 3 (left: 75px, bottom: 95px) */}
                <div className="absolute w-[240px] h-[52px] left-[75px] bottom-[45px] z-20 bg-[#00284C] rounded-[16px] p-4 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] flex items-center gap-2 border border-white/10 text-left">
                  <div className="w-[20px] h-[20px] bg-[#F2C879] rounded-full flex-shrink-0" />
                  <span className="text-[12px] font-bold text-white">Executive Chef</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discover Jobrito Section */}
        <section className="mx-auto max-w-[1280px] px-[40px] pt-[50px] pb-[33px] bg-white">
          <div className="grid gap-[96px] lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <h2 className="text-[48px] font-bold tracking-tight text-[#00284C] sm:text-[64px] lg:leading-[48px] text-left">
              Discover jobrito
            </h2>
            <div className="max-w-[552px] text-left flex flex-col gap-[32px]">
              <p className="text-[18px] leading-[28px] text-[#43474F]">
                Jobrito connects hospitality professionals, employers, chefs, and aspiring talent through hiring, Chef Connect, training, and industry networking—all in one trusted platform built exclusively for hospitality.
              </p>
              <p className="text-[18px] leading-[28px] text-[#43474F]">
                Whether you're building your career, growing your business, sharing culinary expertise, or learning new skills, Jobrito helps you connect with the people and opportunities that matter.
              </p>

              <div className="flex items-center gap-12 mt-[48px]">
                {metrics.map((item) => (
                  <div key={item.label} className="text-left border-l-2 border-[#00284C] pl-4">
                    <div className="text-[36px] font-extrabold text-[#00284C] leading-[40px]">{item.value}</div>
                    <div className="mt-2 text-[15px] font-normal uppercase tracking-wide text-black font-heading">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Full-width Banners (Contiguous layout with zero spacing, h-[600px]) */}
        <section className="w-full flex flex-col space-y-0 bg-[#FFF8F6]">
          
          {/* Chef Connect */}
          <div id="chef-connect" className="relative h-[550px] w-full overflow-hidden flex items-center">
            <img 
              src={chefImage} 
              alt="Chef Connect" 
              className="absolute inset-0 w-full h-full object-cover object-center" 
            />
            {/* Figma gold gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,200,121,0.9)_0%,rgba(242,200,121,0.4)_50%,rgba(242,200,121,0)_100%)] z-10" />
            
            <div className="mx-auto max-w-[1280px] w-full px-[40px] relative z-20 flex justify-start">
              <div className="text-left max-w-xl">
                <h3 className="text-[64px] font-normal leading-[96px] text-[#00284C]">Chef Connect</h3>
                <p className="mt-4 text-[18px] leading-[32px] text-[#00284C]/90">
                  Connect with experienced chefs and culinary experts for consulting, menu development, kitchen setup, staff training, and business growth.
                </p>
                <Link
                  to="/jobs"
                  className="mt-8 inline-flex items-center justify-center rounded-[4px] bg-[#00284C] w-[222px] h-[48px] text-[16px] font-medium text-white shadow-sm hover:bg-[#001e3b] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Chef Connect
                </Link>
              </div>
            </div>
          </div>

          {/* Talent */}
          <div id="talent" className="relative h-[550px] w-full overflow-hidden flex items-center border-t border-b border-[#C3C6D0]">
            <img 
              src={talentImage} 
              alt="Talent Opportunities" 
              className="absolute inset-0 w-full h-full object-cover object-center" 
            />
            {/* Figma dark gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,5,4,0.9)_0%,rgba(10,5,4,0.4)_50%,rgba(10,5,4,0)_100%)] z-10" />
            
            <div className="mx-auto max-w-[1280px] w-full px-[40px] relative z-20 flex justify-start">
              <div className="text-left max-w-xl">
                <h3 className="text-[64px] font-normal leading-[96px] text-white">Talent</h3>
                <p className="mt-4 text-[18px] leading-[32px] text-white/90">
                  Discover local and overseas opportunities, connect with employers, earn referrals, and access training—all in one platform built exclusively for hospitality professionals.
                </p>
                <Link
                  to="/jobs"
                  className="mt-8 inline-flex items-center justify-center rounded-[4px] bg-[#00284C] w-[222px] h-[48px] text-[16px] font-medium text-white shadow-sm hover:bg-[#001e3b] transition-all duration-300 hover:-translate-y-0.5"
                >
                  Explore Opportunities
                </Link>
              </div>
            </div>
          </div>

          {/* Find Talent */}
          <div id="find-talent" className="relative h-[550px] w-full overflow-hidden flex items-center">
            <img 
              src={findTalentImage} 
              alt="Find Talent" 
              className="absolute inset-0 w-full h-full object-cover object-center" 
            />
            {/* Figma blue gradient */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,40,76,0.8)_0%,rgba(0,40,76,0.4)_50%,rgba(0,40,76,0)_100%)] z-10" />
            
            <div className="mx-auto max-w-[1280px] w-full px-[40px] relative z-20 flex justify-start">
              <div className="text-left max-w-xl">
                <h3 className="text-[64px] font-normal leading-[96px] text-white">Find Talent</h3>
                <p className="mt-4 text-[18px] leading-[32px] text-white/90">
                  Find skilled hospitality professionals, post opportunities, and build exceptional teams through India's dedicated hospitality hiring platform.
                </p>
                <Link
                  to="/jobs"
                  className="mt-8 inline-flex items-center justify-center rounded-[4px] bg-[#F2F2F7] w-[149px] h-[48px] text-[16px] font-medium text-[#00284C] shadow-sm hover:bg-slate-100 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Start Hiring.
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="w-full bg-[#FFF8F6] pt-[120px]">
          {/* Header */}
          <div className="text-center px-[40px] pb-[64px] max-w-[1280px] mx-auto flex flex-col gap-[24px]">
            <h2 className="text-[32px] font-bold tracking-tight text-[#00284C] sm:text-[40px] leading-tight">
              One Community. One Platform. Endless Opportunities
            </h2>
            <p className="mx-auto max-w-[955px] text-[16px] leading-[24px] text-black/80 font-normal">
              From finding opportunities and hiring talent to Chef Connect, training, and industry networking—Jobrito brings the hospitality ecosystem together in one powerful app.
            </p>
          </div>
          
          {/* Dark blue fanned phones deck (w-full, no rounded edges!) */}
          <div className="w-full bg-[#12304d] px-[40px] pt-24 pb-16 h-[400px] sm:h-[504px] shadow-[0_24px_70px_rgba(14,40,70,0.3)] flex items-end justify-center overflow-hidden relative">
            <div className="flex items-end justify-center -space-x-6 sm:-space-x-10 md:-space-x-12 max-w-5xl mx-auto z-10">
              
              {/* Phone 1: Far Left (Teal) */}
              <div className="h-[230px] w-[110px] sm:h-[320px] sm:w-[145px] rounded-[24px] border-[5px] border-[#0c1420] p-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.35)] relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-8 hover:scale-105 hover:z-30 cursor-pointer -rotate-[12deg] translate-y-8">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-[#0c1420] z-20" />
                <div className="h-full w-full rounded-[18px] bg-[#123830] p-2 flex flex-col justify-between overflow-hidden text-left relative">
                  <div className="h-1 w-6 rounded-full bg-[#1a4d42] mt-2 mx-auto" />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 rounded-full bg-[#1a4d42] flex items-center justify-center text-[7px]">🥗</div>
                      <div className="h-1.5 w-10 bg-[#1a4d42] rounded-full" />
                    </div>
                    <div className="h-1 w-full bg-[#1a4d42] rounded-full" />
                    <div className="h-1 w-4/5 bg-[#1a4d42] rounded-full" />
                  </div>
                  <div className="mt-auto bg-[#1a4d42]/40 rounded-xl p-1.5 border border-[#1a4d42]/30">
                    <div className="h-2 w-full bg-[#1a4d42] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Phone 2: Middle Left (White/Orange) */}
              <div className="h-[230px] w-[110px] sm:h-[320px] sm:w-[145px] rounded-[24px] border-[5px] border-[#0c1420] p-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.35)] relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-8 hover:scale-105 hover:z-30 cursor-pointer -rotate-[6deg] translate-y-3">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-[#0c1420] z-20" />
                <div className="h-full w-full rounded-[18px] bg-white p-2 flex flex-col justify-between overflow-hidden text-left relative">
                  <div className="h-1 w-6 rounded-full bg-slate-300 mt-2 mx-auto" />
                  <div className="mt-3 space-y-1.5">
                    <div className="h-3 w-full bg-[#FFF0E6] rounded-md flex items-center px-1">
                      <div className="h-1.5 w-6 bg-[#ff8a2b] rounded-full" />
                    </div>
                    <div className="bg-[#FFF0E6] rounded-xl p-1.5 border border-[#FFE0CC] space-y-1">
                      <div className="h-1.5 w-8 bg-[#ff8a2b] rounded-full" />
                      <div className="h-1 w-full bg-slate-200 rounded-full" />
                    </div>
                  </div>
                  <div className="mt-auto bg-[#ff8a2b] h-4 rounded-xl flex items-center justify-center">
                    <div className="h-1 w-8 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              {/* Phone 3: Center (White/Blue, Large perspective) */}
              <div className="h-[265px] w-[125px] sm:h-[370px] sm:w-[165px] rounded-[24px] border-[5px] border-[#0c1420] p-1.5 shadow-[0_25px_50px_rgba(0,0,0,0.45)] relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-8 hover:scale-105 hover:z-30 cursor-pointer rotate-0 -translate-y-2 z-20 scale-105">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 rounded-full bg-[#0c1420] z-20" />
                <div className="h-full w-full rounded-[18px] bg-white p-2 flex flex-col justify-between overflow-hidden text-left relative">
                  <div className="h-1.5 w-8 bg-slate-300 mt-2 mx-auto" />
                  <div className="mt-3 space-y-2">
                    <div className="h-10 w-full bg-[#00284C] rounded-lg p-1.5 flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">👨‍🍳</div>
                      <div className="space-y-1">
                        <div className="h-2 w-12 bg-white/40 rounded-full" />
                        <div className="h-1 w-8 bg-white/20 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full" />
                      <div className="h-1.5 w-4/5 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                  <div className="mt-auto bg-[#00284C] h-6 rounded-xl flex items-center justify-center">
                    <span className="text-[7px] sm:text-[9px] font-bold text-white uppercase tracking-wider">Explore Feed</span>
                  </div>
                </div>
              </div>

              {/* Phone 4: Middle Right (Dark Grey) */}
              <div className="h-[230px] w-[110px] sm:h-[320px] sm:w-[145px] rounded-[24px] border-[5px] border-[#0c1420] p-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.35)] relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-8 hover:scale-105 hover:z-30 cursor-pointer rotate-[6deg] translate-y-3">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-[#0c1420] z-20" />
                <div className="h-full w-full rounded-[18px] bg-[#202938] p-2 flex flex-col justify-between overflow-hidden text-left relative">
                  <div className="h-1 w-6 rounded-full bg-[#374151] mt-2 mx-auto" />
                  <div className="mt-3 space-y-1.5">
                    <div className="h-3 w-full bg-[#374151] rounded-md" />
                    <div className="border border-[#374151] rounded-xl p-1.5 space-y-1.5">
                      <div className="h-1.5 w-10 bg-[#374151] rounded-full" />
                      <div className="h-1.5 w-6 bg-[#374151] rounded-full" />
                    </div>
                  </div>
                  <div className="mt-auto bg-[#374151] h-4 rounded-xl" />
                </div>
              </div>

              {/* Phone 5: Far Right (Steel Blue) */}
              <div className="h-[230px] w-[110px] sm:h-[320px] sm:w-[145px] rounded-[24px] border-[5px] border-[#0c1420] p-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.35)] relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-8 hover:scale-105 hover:z-30 cursor-pointer rotate-[12deg] translate-y-8">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-[#0c1420] z-20" />
                <div className="h-full w-full rounded-[18px] bg-[#1e344d] p-2 flex flex-col justify-between overflow-hidden text-left relative">
                  <div className="h-1 w-6 rounded-full bg-[#2b4c6f] mt-2 mx-auto" />
                  <div className="mt-3 grid grid-cols-2 gap-1">
                    <div className="h-8 bg-[#2b4c6f] rounded-md" />
                    <div className="h-8 bg-[#2b4c6f] rounded-md" />
                  </div>
                  <div className="mt-auto bg-[#2b4c6f] h-4 rounded-xl" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Built for Hospitality Section */}
        <section className="bg-[#0A0504] text-white py-[58px] border-t border-[#F57F20]/10">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
            <div className="mx-auto max-w-3xl text-center flex flex-col gap-[24px]">
              <h2 className="text-[40px] font-black tracking-[-1.8px] sm:text-[56px] lg:text-[64px] lg:leading-[80px] leading-tight text-white">
                Built for Hospitality.
                <br />
                Made for You.
              </h2>
              <p className="mx-auto max-w-[580px] text-[20px] leading-[28px] text-white/70">
                Join thousands of hospitality professionals and businesses using Jobrito to hire, learn, connect, and grow together.
              </p>
            </div>
            
            {/* Contact button (figma size: w-298px h-76px, bg: #00284C, rounded: 16px) */}
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center rounded-[16px] bg-[#00284C] w-[298.23px] h-[76px] text-[20px] font-medium text-white shadow-[0px_25px_50px_-12px_rgba(0,40,76,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#001c36]"
            >
              Contact Us Now
            </Link>

            {/* Figma-styled Download Buttons (Scan QR Removed, SVG Logos Used) */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {/* App Store Download */}
              <a
                href="#"
                className="box-border inline-flex items-center justify-center gap-3 bg-black/50 border border-white/20 backdrop-blur-[6px] rounded-[8px] w-[192px] h-[56px] text-white transition-all duration-300 hover:-translate-y-0.5 shadow-md"
              >
                {/* <AppleIcon className="w-6 h-6 text-white" /> */}
                      <img src={appstore} alt="App Store" className="w-[40px] h-full object-contain" />

                <div className="text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50 leading-none">Download on the</p>
                  <p className="text-sm font-bold text-white mt-1 leading-none">App Store</p>
                </div>
              </a>

              {/* Google Play Download */}
              <a
                href="#"
                className="box-border inline-flex items-center justify-center gap-3 bg-black/50 border border-white/20 backdrop-blur-[6px] rounded-[8px] w-[192px] h-[56px] text-white transition-all duration-300 hover:-translate-y-0.5 shadow-md"
              >
                {/* <PlayStoreIcon className="w-6 h-6 text-white" /> */}
                <img src={playstore} alt="Google Play" className="w-[40px] h-full object-contain" />
                <div className="text-left">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50 leading-none">GET IT ON</p>
                  <p className="text-sm font-bold text-white mt-1 leading-none">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomeScreen;
