import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import appstoreBadge from "@/assets/appstore.png";
import playstoreBadge from "@/assets/playstore.png";

export default function Navbar() {
  const { pathname: location } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => location === href;

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07] bg-background/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo: Side-by-side icon and wordmark */}
          <Link to="/" data-testid="link-logo" className="flex items-center gap-0 flex-shrink-0" onClick={() => setIsOpen(false)}>
            <img
              src={`${import.meta.env.BASE_URL}images/jobrito-icon.png`}
              alt="Jobrito Icon"
              className="h-16 w-auto object-contain"
            />
            <img
              src={`${import.meta.env.BASE_URL}images/jobrito-wordmark.png`}
              alt="Jobrito Wordmark"
              className="h-[200px] -my-50 -ml-8 w-auto object-contain brightness-0 invert"
            />
          </Link>

          {/* Desktop Nav links + CTA */}
          <div className="navbar-desktop-menu items-center gap-6">
            {/* Home */}
            <Link
              to="/"
              data-testid="link-nav-home"
              className={`text-sm font-medium transition-colors duration-200 hover:text-white ${
                location === "/" ? "text-accent" : "text-white/50"
              }`}
            >
              Home
            </Link>

            {/* Talent Feed — Job Seeker */}
            <Link
              to="/find-jobs"
              data-testid="link-nav-find-jobs"
              className={`flex flex-col items-start leading-none transition-colors duration-200 hover:text-white group ${
                isActive("/find-jobs") ? "text-accent" : "text-white/50"
              }`}
            >
              <span className="text-sm font-medium">Talent Feed</span>
              <span
                className={`text-[10px] font-sans tracking-wide mt-0.5 ${
                  isActive("/find-jobs")
                    ? "text-accent/70"
                    : "text-white/30 group-hover:text-white/50"
                }`}
              >
                Job Seeker
              </span>
            </Link>

            {/* Hire Talent — Employer */}
            <Link
              to="/hire-talent"
              data-testid="link-nav-hire-talent"
              className={`flex flex-col items-start leading-none transition-colors duration-200 hover:text-white group ${
                isActive("/hire-talent") ? "text-accent" : "text-white/50"
              }`}
            >
              <span className="text-sm font-medium">Hire Talent</span>
              <span
                className={`text-[10px] font-sans tracking-wide mt-0.5 ${
                  isActive("/hire-talent")
                    ? "text-accent/70"
                    : "text-white/30 group-hover:text-white/50"
                }`}
              >
                Employer
              </span>
            </Link>

            {/* Chef Connect — Hospitality Consultants */}
            <Link
              to="/chef-connect"
              data-testid="link-nav-chef-connect"
              className={`flex flex-col items-start leading-none transition-colors duration-200 hover:text-white group ${
                isActive("/chef-connect") ? "text-accent" : "text-white/50"
              }`}
            >
              <span className="text-sm font-medium">Chef Connect</span>
              <span
                className={`text-[10px] font-sans tracking-wide mt-0.5 ${
                  isActive("/chef-connect")
                    ? "text-accent/70"
                    : "text-white/30 group-hover:text-white/50"
                }`}
              >
                Hospitality Consultants
              </span>
            </Link>

            {/* What is Jobrito — two lines */}
            <Link
              to="/about"
              data-testid="link-nav-about"
              className={`flex flex-col items-start leading-none transition-colors duration-200 hover:text-white ${
                isActive("/about") ? "text-accent" : "text-white/50"
              }`}
            >
              <span className="text-sm font-medium">What is</span>
              <span className="text-sm font-medium">Jobrito</span>
            </Link>

            {/* Join Now CTA */}
            <Link
              to="/find-jobs"
              data-testid="button-join-now"
              className="text-sm font-semibold px-5 py-2 rounded-md bg-[#153e69] text-white hover:bg-[#1c5290] transition-colors duration-200 flex-shrink-0"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer (Full Screen, Right-to-Left, z-[9999] sibling context) */}
      <div
        className={`fixed inset-0 bg-[#080f1e] z-[9999] p-6 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between mb-10 h-16 border-b border-white/[0.07] pb-4">
          <Link to="/" className="flex items-center gap-0 flex-shrink-0" onClick={() => setIsOpen(false)}>
            <img
              src={`${import.meta.env.BASE_URL}images/jobrito-icon.png`}
              alt="Jobrito Icon"
              className="h-16 w-auto object-contain"
            />
            <img
              src={`${import.meta.env.BASE_URL}images/jobrito-wordmark.png`}
              alt="Jobrito Wordmark"
              className="h-[200px] -my-121 -ml-8 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex flex-col gap-8 flex-grow overflow-y-auto pr-2">
          {/* Home */}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`text-xl font-semibold transition-colors duration-200 ${
              location === "/" ? "text-accent" : "text-white/70"
            }`}
          >
            Home
          </Link>

          {/* Talent Feed */}
          <Link
            to="/find-jobs"
            onClick={() => setIsOpen(false)}
            className={`flex flex-col items-start transition-colors duration-200 group ${
              isActive("/find-jobs") ? "text-accent" : "text-white/70"
            }`}
          >
            <span className="text-xl font-semibold">Talent Feed</span>
            <span className="text-sm text-white/30 mt-0.5">Job Seeker</span>
          </Link>

          {/* Hire Talent */}
          <Link
            to="/hire-talent"
            onClick={() => setIsOpen(false)}
            className={`flex flex-col items-start transition-colors duration-200 group ${
              isActive("/hire-talent") ? "text-accent" : "text-white/70"
            }`}
          >
            <span className="text-xl font-semibold">Hire Talent</span>
            <span className="text-sm text-white/30 mt-0.5">Employer</span>
          </Link>

          {/* Chef Connect */}
          <Link
            to="/chef-connect"
            onClick={() => setIsOpen(false)}
            className={`flex flex-col items-start transition-colors duration-200 group ${
              isActive("/chef-connect") ? "text-accent" : "text-white/70"
            }`}
          >
            <span className="text-xl font-semibold">Chef Connect</span>
            <span className="text-sm text-white/30 mt-0.5">Hospitality Consultants</span>
          </Link>

          {/* About */}
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className={`text-xl font-semibold transition-colors duration-200 ${
              isActive("/about") ? "text-accent" : "text-white/70"
            }`}
          >
            What is Jobrito
          </Link>

          {/* Join Now CTA */}
          <Link
            to="/find-jobs"
            onClick={() => setIsOpen(false)}
            className="text-center text-base font-semibold py-3.5 rounded-xl bg-[#153e69] text-white hover:bg-[#1c5290] transition-colors duration-200 w-full mt-4"
          >
            Join Now
          </Link>

          {/* Drawer Download Links */}
          <div className="mt-auto pt-8 border-t border-white/[0.07]">
            <div className="text-xs font-sans tracking-widest text-white/[0.25] uppercase mb-4 text-left">
              Download the App
            </div>
            <div className="flex flex-row gap-3">
              {/* App Store Download */}
              <a
                href="#"
                className="box-border inline-flex items-center justify-center gap-2 bg-black/40 border border-white/10 backdrop-blur-[6px] rounded-[6px] w-[136px] h-[40px] text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm flex-shrink-0"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
                <div className="text-left">
                  <p className="text-[6.5px] font-semibold uppercase tracking-wider text-white/50 leading-none">Download on the</p>
                  <p className="text-[10px] font-bold text-white mt-0.5 leading-none">App Store</p>
                </div>
              </a>

              {/* Google Play Download */}
              <a
                href="#"
                className="box-border inline-flex items-center justify-center gap-2 bg-black/40 border border-white/10 backdrop-blur-[6px] rounded-[6px] w-[136px] h-[40px] text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm flex-shrink-0"
              >
                <svg viewBox="0 0 16 16" className="w-[22px] h-[22px] fill-current text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27" />
                </svg>
                <div className="text-left">
                  <p className="text-[6.5px] font-semibold uppercase tracking-wider text-white/50 leading-none">GET IT ON</p>
                  <p className="text-[10px] font-bold text-white mt-0.5 leading-none">Google Play</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

