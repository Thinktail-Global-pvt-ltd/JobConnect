import { motion } from "framer-motion";
import { AppStoreButton, GooglePlayButton } from "@/component/common/AppDownloadButtons";

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

export default function FindJobs() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-24 max-w-4xl"
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className="w-12 h-px bg-accent"></span>
            <span className="text-lg md:text-xl font-sans tracking-wide text-accent uppercase">
              Talent Feed — Job Seekers
            </span>
            <span className="w-12 h-px bg-accent"></span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-white mb-10 leading-[0.9]"
          >
            Opportunities near you —<br />
            <span className="italic font-semibold text-accent">
              and far beyond.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-2xl text-white/55 font-sans leading-relaxed max-w-2xl mx-auto"
          >
            Discover local and overseas hospitality roles — chefs, managers,
            front-of-house, and more — across India and the Middle East,
            directly inside the Jobrito app.
          </motion.p>
        </motion.header>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center gap-8"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-sans tracking-widest text-white/30 uppercase"
          >
            Download the app to explore roles
          </motion.p>

          <motion.div
                      variants={fadeUp}
                      className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                      {/* App Store Download */}
                      <a
                        href="#"
                        className="box-border inline-flex items-center justify-center gap-3 bg-[#0c1420] border border-white/10 rounded-[8px] w-[192px] h-[56px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black shadow-md flex-shrink-0"
                      >
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                        </svg>
                        <div className="text-left">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50 leading-none">Download on the</p>
                          <p className="text-sm font-bold text-white mt-1 leading-none">App Store</p>
                        </div>
                      </a>
        
                      {/* Google Play Download */}
                      <a
                        href="#"
                        className="box-border inline-flex items-center justify-center gap-3 bg-[#0c1420] border border-white/10 rounded-[8px] w-[192px] h-[56px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black shadow-md flex-shrink-0"
                      >
                        <svg viewBox="0 0 16 16" className="w-8 h-8 fill-current text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27" />
                        </svg>
                        <div className="text-left">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50 leading-none">GET IT ON</p>
                          <p className="text-sm font-bold text-white mt-1 leading-none">Google Play</p>
                        </div>
                      </a>
                    </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
