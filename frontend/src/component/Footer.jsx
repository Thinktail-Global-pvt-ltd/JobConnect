const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Find a Restaurant Job", href: "/jobs" },
      { label: "Discover the Community", href: "community.html" },
      { label: "Hiring with Recruit", href: "hiring-features.html" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "About Us", href: "about.html" }],
  },
  {
    title: "Resources",
    links: [
      { label: "Support", href: "https://support.seasoned.co", external: true },
      { label: "Privacy Policy", href: "privacypolicy.html" },
      { label: "Terms of Use", href: "termsofservice.html" },
      { label: "Community Guidelines", href: "communityguidelines.html" },
      { label: "Site Map", href: "/restaurant-jobs" },
    ],
  },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/beseasoned/",
    src: "https://static.seasoned.co/images/facebook.svg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/seasoned_community/",
    src: "https://static.seasoned.co/images/instagram.svg",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/beseasoned/",
    src: "https://static.seasoned.co/images/twitter.svg",
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-12 border-b border-white/10 pb-12 lg:flex-row lg:items-start lg:justify-between">
          <a href="index.html" aria-label="Seasoned home" className="inline-flex items-center">
            <img src="https://static.seasoned.co/images/Seasoned.svg" alt="Seasoned icon" className="h-10 w-auto" />
          </a>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
                  {column.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="text-sm text-white/80 transition hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
              >
                <img src={social.src} alt="" className="h-5 w-5 object-contain" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 text-sm text-white/55">
          Copyright 2020 - 2025 JobGet Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
