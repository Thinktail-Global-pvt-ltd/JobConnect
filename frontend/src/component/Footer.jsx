const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Find a Restaurant Job", href: "/jobs" },
      // { label: "Discover the Community", href: "community.html" },
      { label: "Hiring with JobRito", href: "/jobs" },
    ],
  },
  {
    title: "",
    links: [],
  },
  {
    title: "Resources",
    links: [
      { label: "Support", href: "", external: true },
      { label: "Privacy Policy", href: "privacy-policy" },
      { label: "Terms & Conditions", href: "/terms&conditions" },
      // { label: "Data Deletion", href: "/datadeletion" },
      // { label: "Site Map", href: "/restaurant-jobs" },
    ],
  },
];

// const socialLinks = [
//   {
//     label: "Facebook",
//     href: "https://www.facebook.com/beseasoned/",
//     src: "https://static.seasoned.co/images/facebook.svg",
//   },
//   {
//     label: "Instagram",
//     href: "https://www.instagram.com/seasoned_community/",
//     src: "https://static.seasoned.co/images/instagram.svg",
//   },
//   {
//     label: "Twitter",
//     href: "https://twitter.com/beseasoned/",
//     src: "https://static.seasoned.co/images/twitter.svg",
//   },
// ];

const Footer = () => {
  return (
    <footer className="bg-[#0d0d0d] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-12 border-b border-white/10 pb-12 lg:flex-row lg:items-start lg:justify-between">
          <a href="/" aria-label="Seasoned home" className="inline-flex items-center">
           <span className="text-[#EB4B66] text-lg font-bold">Job Rito</span>
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
            {/* {socialLinks.map((social) => (
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
            ))} */}
          </div>
        </div>

        <div className="pt-6 text-sm text-white/55">
          Copyright 2026 JobRito Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

