import { Link, useLocation } from "react-router-dom";
import fullLogo from "../assets/Jobrito full logo.png";

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Footer = () => {
  const location = useLocation();

  const handleLinkClick = (href, e) => {
    if (href.startsWith("/#") && location.pathname === "/") {
      const targetId = href.split("#")[1];
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, null, href);
      }
    }
  };

  const footerColumns = [
    {
      title: "Platform",
      links: [
        { label: "Talent Feed", href: "/" },
        { label: "Hire Talent", href: "/jobs" },
        { label: "Chef Connect", href: "/#chef-connect" },
        { label: "Download App", href: "/#find-talent" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/privacy-policy" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms&conditions" },
        { label: "Unsubscribe", href: "/privacy-policy" },
      ],
    },
  ];

  return (
    <footer id="footer" className="border-t border-[#efe0d6] bg-white text-[#00284C]">
      <div className="mx-auto max-w-[1160px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start text-left">
          {/* Brand Info */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="inline-flex items-center">
              <img src={fullLogo} alt="Jobrito" className="h-[80px] w-auto" />
            </Link>

            <p className="max-w-[304px] text-[16px] leading-[24px] text-[#43474F] font-bold">
              Built for Hospitality. Made for You. Follow Jobrito for hospitality opportunities, hiring updates, Chef Connect, training, industry news, and inspiring community stories.
            </p>

            {/* Social Icons (rgba(0, 40, 76, 0.05) bg, 12px rounding, #211A18 icon) */}
            <div className="mt-2 flex items-center gap-4">
              <a
                href="#"
                className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#00284C]/5 text-[#211A18] transition-all duration-300 hover:text-[#F57F20] hover:bg-[#00284C]/10 shadow-sm"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-[15px] h-[16.67px]" />
              </a>
              <a
                href="#"
                className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#00284C]/5 text-[#211A18] transition-all duration-300 hover:text-[#F57F20] hover:bg-[#00284C]/10 shadow-sm"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-[16.67px] h-[15px]" />
              </a>
              <a
                href="#"
                className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#00284C]/5 text-[#211A18] transition-all duration-300 hover:text-[#F57F20] hover:bg-[#00284C]/10 shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-[16.67px] h-[16.67px]" />
              </a>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid gap-10 grid-cols-2">
            {footerColumns.map((column) => (
              <div key={column.title} className="flex flex-col gap-6">
                <h2 className="text-[16px] font-normal leading-[24px] text-[#00284C] font-heading">
                  {column.title}
                </h2>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link 
                          className="text-[16px] leading-[24px] text-[#43474F] font-normal transition hover:text-[#00284C]" 
                          to={link.href}
                          onClick={(e) => handleLinkClick(link.href, e)}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a 
                          className="text-[16px] leading-[24px] text-[#43474F] font-normal transition hover:text-[#00284C]" 
                          href={link.href}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#efe0d6] pt-8 flex flex-col sm:flex-row items-center justify-between text-[14px] leading-[20px] text-[#43474F] gap-4">
          <div>
            2026 Jobrito. All rights reserved - An Initiative by Hoss Global Inc.
          </div>
          <div className="flex gap-4">
            <span>Made for hospitality, built for local teams.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
