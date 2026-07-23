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

export default function HireTalent() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-background overflow-hidden relative">
      {/* Warm ember/amber ambient background — brand color tones, not navy */}
      <div className="absolute top-0 right-0 w-2/3 h-[700px] bg-[radial-gradient(ellipse_at_top_right,hsl(29_91%_20%/0.45),transparent_70%)] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-[radial-gradient(ellipse_at_top_right,hsl(40_83%_30%/0.25),transparent_60%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-32 max-w-4xl"
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 mb-8"
          >
            <span className="w-12 h-px bg-accent"></span>
            <span className="text-lg md:text-xl font-sans tracking-wide text-accent uppercase">
              Hire Talent — Employers
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-display font-light tracking-tight text-white mb-8 leading-[0.9]"
          >
            The right person.
            <br />
            <span className="italic text-accent/70">
              Before service starts.
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-[1.25rem] md:text-[1.5rem] text-white/55 font-sans leading-[1.1] max-w-2xl mb-12"
          >
            Post a role and let Jobrito's smart matching engine take over. We
            notify the right talent from our pool — and if they're interested,
            they reach out to you directly. No searching. No sifting. Just the
            right fit.
          </motion.p>
<motion.div
  variants={fadeUp}
  className="group inline-flex p-2 border border-accent transition-all duration-500 hover:bg-accent cursor-pointer"
>
  <button
    className="px-6 py-2 text-sm font-sans uppercase tracking-[0.2em] border border-accent text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-background"
  >
    Post a Role
  </button>
</motion.div>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 py-16 border-t border-white/10"
        >
          <motion.div variants={fadeUp}>
            <div className="text-6xl md:text-7xl font-display font-light text-white mb-4 tracking-tighter">
              48h
            </div>
            <div className="w-8 h-px bg-accent mb-6"></div>
            <div className="text-sm font-sans tracking-wide text-white/50 uppercase">
              Average time from posting to matched candidates.
            </div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <div className="text-6xl md:text-7xl font-display font-light text-white mb-4 tracking-tighter">
              50k+
            </div>
            <div className="w-8 h-px bg-accent mb-6"></div>
            <div className="text-sm font-sans tracking-wide text-white/50 uppercase">
              Hospitality professionals across India & the Middle East.
            </div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <div className="text-6xl md:text-7xl font-display font-light text-white mb-4 tracking-tighter">
              94%
            </div>
            <div className="w-8 h-px bg-accent mb-6"></div>
            <div className="text-sm font-sans tracking-wide text-white/50 uppercase">
              90-day retention rate for matched placements.
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {[
            {
              title: "Smart Matching",
              body: "Jobrito's algorithm analyses your job requirements and identifies the most relevant candidates from our talent pool — no manual searching required.",
            },
            {
              title: "Candidate-Led Interest",
              body: "Matched professionals are notified of your opportunity. Those interested reach out to you directly, so every contact comes with genuine intent.",
            },
            {
              title: "Post in Minutes",
              body: "List a role in under 2 minutes. Specify the position, skills, location, and experience level — and Jobrito handles the rest.",
            },
            {
              title: "Hospitality-Only Pool",
              body: "Every professional on Jobrito is from the hospitality industry. No irrelevant applications — just chefs, managers, front-of-house, and support staff ready to work.",
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="p-8 border border-white/[0.07] rounded-xl bg-white/[0.025] hover:border-white/15 transition-colors duration-300"
            >
              <h3 className="text-lg font-display font-semibold text-white mb-3">
                {card.title}
              </h3>
              <p className="text-sm font-sans text-white/50 leading-relaxed">
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
