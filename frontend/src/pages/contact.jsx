import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function Contact() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 mb-8"
          >
            <span className="w-12 h-px bg-accent"></span>
            <span className="text-xs font-sans tracking-widest text-accent uppercase">
              Contact
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-8xl font-display font-bold tracking-tight text-white mb-12 leading-[1]"
          >
            Start the
            <br />
            conversation.
          </motion.h1>

          <motion.div variants={fadeUp} className="space-y-12 mt-16">
            <div>
              <div className="text-xs font-sans tracking-widest text-white/30 uppercase mb-4">
                Email Us
              </div>
              <a
                href="mailto:jobritoapp@gmail.com"
                className="text-xl md:text-2xl font-sans font-medium text-white hover:text-accent transition-colors duration-200"
              >
                jobritoapp@gmail.com
              </a>
            </div>
            <div>
              <div className="text-xs font-sans tracking-widest text-white/30 uppercase mb-4">
                Follow Us
              </div>
              <div className="flex items-center gap-5 mt-2">
                <a
                  href="https://www.instagram.com/jobritoapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-accent transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/jobrito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-accent transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/jobritoapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-accent transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.twitter.com/jobritoapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-accent transition-colors duration-200"
                  aria-label="X / Twitter"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <div className="text-xs font-sans tracking-widest text-white/30 uppercase mb-4">
                Download the App
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2.5 px-5 py-3 bg-white/[0.06] border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-white fill-current flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                  </svg>
                  <div>
                    <div className="text-[9px] text-white/35 tracking-widest uppercase">
                      Download on the
                    </div>
                    <div className="text-xs font-semibold text-white">
                      App Store
                    </div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2.5 px-5 py-3 bg-white/[0.06] border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current text-white flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.18 23.76C3.06 23.84 2.93 23.88 2.8 23.88C2.56 23.88 2.32 23.77 2.16 23.56L2.14 23.54C1.96 23.3 1.96 22.97 2.14 22.73L10.15 12L2.14 1.27C1.96 1.03 1.96 0.7 2.14 0.46L2.16 0.44C2.32 0.23 2.56 0.12 2.8 0.12C2.93 0.12 3.06 0.16 3.18 0.24L21.32 11.12C21.55 11.25 21.7 11.62 21.7 12C21.7 12.38 21.55 12.75 21.32 12.88L3.18 23.76ZM4.22 2.24L11.16 12L4.22 21.76V2.24Z" />
                  </svg>
                  <div>
                    <div className="text-[9px] text-white/35 tracking-widest uppercase">
                      Get it on
                    </div>
                    <div className="text-xs font-semibold text-white">
                      Google Play
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="pt-12 lg:pt-32"
        >
          <form className="space-y-16">
            <motion.div variants={fadeUp} className="relative">
              <input
                type="text"
                id="name"
                required
                className="peer w-full bg-transparent border-b border-white/20 py-4 text-white font-sans text-2xl focus:outline-none focus:border-accent transition-colors placeholder-transparent"
                placeholder="Name"
              />
              <label
                htmlFor="name"
                className="absolute left-0 top-4 text-white/40 font-sans tracking-widest text-xs uppercase peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent peer-valid:-top-4 peer-valid:text-xs transition-all duration-300 cursor-text"
              >
                Full Name
              </label>
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <input
                type="email"
                id="email"
                required
                className="peer w-full bg-transparent border-b border-white/20 py-4 text-white font-sans text-2xl focus:outline-none focus:border-accent transition-colors placeholder-transparent"
                placeholder="Email"
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-4 text-white/40 font-sans tracking-widest text-xs uppercase peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent peer-valid:-top-4 peer-valid:text-xs transition-all duration-300 cursor-text"
              >
                Email Address
              </label>
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <textarea
                id="message"
                required
                rows={3}
                className="peer w-full bg-transparent border-b border-white/20 py-4 text-white font-sans text-2xl focus:outline-none focus:border-accent transition-colors placeholder-transparent resize-none"
                placeholder="Message"
              ></textarea>
              <label
                htmlFor="message"
                className="absolute left-0 top-4 text-white/40 font-sans tracking-widest text-xs uppercase peer-focus:-top-4 peer-focus:text-xs peer-focus:text-accent peer-valid:-top-4 peer-valid:text-xs transition-all duration-300 cursor-text"
              >
                Message
              </label>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-8">
              <button
                type="button"
                className="text-sm font-sans tracking-widest uppercase px-12 py-4 border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-500"
              >
                Send Message
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
