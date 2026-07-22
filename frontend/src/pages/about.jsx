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
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-32"
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 mb-8"
          >
            <span className="w-12 h-px bg-accent"></span>
            <span className="text-lg md:text-xl font-sans tracking-wide text-accent uppercase">
              What is Jobrito
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-light tracking-tight text-white leading-[1.1]"
          >
            Hospitality hiring,
            <br />
            reimagined.
          </motion.h1>
        </motion.header>

      <motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={staggerContainer}
  className="
    max-w-6xl
    space-y-20
    text-3xl
    md:text-5xl
    lg:text-[3.8rem]
    font-display
    font-light
    text-white/60

    tracking-[-0.03em]
    leading-[1.6]
  "
>
  <motion.p variants={fadeUp}>
    For decades, hiring in hospitality has relied on fragmented
    networks, messy job boards, and word-of-mouth. The industry moves
    too fast for traditional recruitment tools.
  </motion.p>

  <motion.p variants={fadeUp}>
    We've initiated Jobrito as a platform only for hospitality service
    industry that is faster, simpler, and smarter.
  </motion.p>

  <motion.p
    variants={fadeUp}
    className="text-white"
  >
    Our belief is simple: great venues deserve great talent instantly,
    and skilled professionals deserve transparent access to the best
    roles. We eliminate friction.
  </motion.p>
</motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row gap-16"
        >
          <motion.div variants={fadeUp}>
            <div className="text-xs font-sans tracking-widest text-white/30 uppercase mb-4">
              Headquarters
            </div>
            <div className="font-display text-2xl text-white">
              Hoss Global Inc.
            </div>
            <div className="text-white/50 font-sans tracking-wide mt-2">
              India
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
