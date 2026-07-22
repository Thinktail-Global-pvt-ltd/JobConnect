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
    <div className="min-h-screen pt-20 pb-24 px-6 bg-background">
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
            <span className="text-base md:text-xl font-sans tracking-wide text-accent uppercase">
              Talent Feed — Job Seekers
            </span>
            <span className="w-12 h-px bg-accent"></span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-white mb-10 leading-[0.9]"
          >
            Opportunities near you —<br />
            <span className="italic font-semibold text-accent">
              and far beyond.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-white/55 font-sans leading-relaxed max-w-2xl mx-auto"
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
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <AppStoreButton />
            <GooglePlayButton />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
