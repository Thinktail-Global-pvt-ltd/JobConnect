import { Link } from "react-router-dom";
import logo from '../../../public/images/jobrito-logo-full.png';
import appstoreBadge from "@/assets/appstore.png";
import playstoreBadge from "@/assets/playstore.png";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/jobritoapp",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/jobrito",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/jobritoapp",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://www.twitter.com/jobritoapp",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-background pt-24 pb-12">
      <div className="w-full mx-auto px-8 max-w-[1440px]">
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-24">
          <div className="max-w-md">
            <Link to="/" className="inline-flex mb-10 w-fit group">
              <img
                src={logo}
                alt="Jobrito — Connecting Hospitality Talent"
                className="h-28 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-200"
              />
            </Link>
            <p className="text-white/50 max-w-sm font-sans leading-relaxed mb-2">
              Built for Hospitality. Made for You.
            </p>
            <p className="text-white/[0.35] max-w-sm font-sans text-sm leading-relaxed mb-8">
              Follow Jobrito for hospitality opportunities, hiring updates, Chef
              Connect, training, industry news, and inspiring community stories.
            </p>

            <div className="mb-6">
              <div className="text-xs font-sans tracking-widest text-white/[0.25] uppercase mb-3">
                Follow us
              </div>
              <div className="flex items-center gap-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-white/[0.35] hover:text-accent transition-colors duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-sans tracking-widest text-white/[0.25] uppercase mb-3">
                Download
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                {/* App Store Download */}
                <a
                  href="#"
                  className="box-border inline-flex items-center justify-center gap-2.5 bg-black/40 border border-white/10 backdrop-blur-[6px] rounded-[6px] w-[140px] h-[40px] text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm flex-shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[7px] font-semibold uppercase tracking-wider text-white/50 leading-none">Download on the</p>
                    <p className="text-[10px] font-bold text-white mt-0.5 leading-none">App Store</p>
                  </div>
                </a>

                {/* Google Play Download */}
                <a
                  href="#"
                  className="box-border inline-flex items-center justify-center gap-2.5 bg-black/40 border border-white/10 backdrop-blur-[6px] rounded-[6px] w-[140px] h-[40px] text-white transition-all duration-300 hover:-translate-y-0.5 shadow-sm flex-shrink-0"
                >
                  <svg viewBox="0 0 16 16" className="w-[18px] h-[18px] fill-current text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[7px] font-semibold uppercase tracking-wider text-white/50 leading-none">GET IT ON</p>
                    <p className="text-[10px] font-bold text-white mt-0.5 leading-none">Google Play</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="flex gap-16 sm:gap-24 md:gap-32 lg:gap-40 flex-shrink-0">
            <div className="min-w-[140px]">
              <h4 className="font-sans text-xs tracking-widest text-white/30 uppercase mb-6">
                Platform
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/find-jobs"
                    className="text-sm font-sans tracking-wide text-white/60 hover:text-white transition-colors"
                  >
                    Talent Feed
                  </Link>
                </li>
                <li>
                  <Link
                    to="/hire-talent"
                    className="text-sm font-sans tracking-wide text-white/60 hover:text-white transition-colors"
                  >
                    Hire Talent
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chef-connect"
                    className="text-sm font-sans tracking-wide text-white/60 hover:text-white transition-colors"
                  >
                    Chef Connect
                  </Link>
                </li>
              </ul>
            </div>

            <div className="min-w-[180px]">
              <h4 className="font-sans text-xs tracking-widest text-white/30 uppercase mb-6">
                Company
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/about"
                    className="text-sm font-sans tracking-wide text-white/60 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm font-sans tracking-wide text-white/60 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:jobritoapp@gmail.com"
                    className="text-sm font-sans tracking-wide text-white/60 hover:text-white transition-colors"
                  >
                    jobritoapp@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-center md:text-left">
            <p className="text-xs font-sans tracking-wider text-white/[0.25] uppercase">
              &copy; {new Date().getFullYear()} Jobrito. All rights reserved.
            </p>
            <span className="footer-bullet text-white/[0.15] text-xs">·</span>
            <p className="text-xs font-sans font-semibold tracking-wide text-white">
              An Initiative by Hoss Global Inc., India
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-sans tracking-wider text-white/[0.25] uppercase">
            <Link to="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
