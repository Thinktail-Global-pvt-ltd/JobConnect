const Header = () => {
  const navLinks = [
    {
      title: "Find a Job",
      href: "/jobs",
    },
    {
      title: "Post Your Jobs",
      href: "/post-job",
    },
  ];

  return (
    <header
      className="sticky top-0 w-full bg-black border-b border-gray-800"
      style={{ zIndex: 999 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-around h-16 sm:h-18 md:h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          {/* <img
            src="https://static.seasoned.co/images/logo_onDark2x.png"
            alt="JobRito Logo"
            className="h-5 sm:h-5 md:h-7 lg:h-8 w-auto object-contain transition-all duration-300"
          /> */}
          <span className="text-[#EB4B66] text-lg font-bold">Job Rito</span>
        </a>

        {/* Navigation */}
    <nav className="flex items-center sm:gap-6 md:gap-20" style={{ gap: "20px" }}>
          {navLinks.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="
                relative
                text-white
                text-xs
                sm:text-sm
                md:text-base
                font-medium
                whitespace-nowrap
                transition-colors
                duration-300
                hover:text-gray-300

                after:content-['']
                after:absolute
                after:left-0
                after:-bottom-1
                after:w-0
                after:h-[2px]
                after:bg-white
                after:transition-all
                after:duration-300

                hover:after:w-full
              "
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;