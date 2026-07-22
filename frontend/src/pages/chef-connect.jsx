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

export default function ChefConnect() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl mb-24"
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span className="w-8 h-px bg-accent"></span>
            <span className="text-lg md:text-xl font-sans tracking-wide text-accent uppercase">
              Chef Connect — Hospitality Consultant
            </span>
            <span className="w-8 h-px bg-accent"></span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-7xl md:text-8xl lg:text-9xl font-display font-bold tracking-tight text-white mb-12 leading-[0.9]"
          >
            The Right Expert for
            <br />
            <span className="italic font-semibold text-accent">
              Every Hospitality Challenge.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-2xl font-sans text-white/55 leading-relaxed max-w-3xl mx-auto mb-16"
          >
            Connect with verified hospitality experts from India & Middle East
            for restaurant setup, operations, branding, training, technology,
            procurement, menu strategy, franchising, and business growth.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#153e69] text-white text-sm font-semibold tracking-wide rounded-md hover:bg-[#1c5290] transition-colors duration-300"
            >
              Register on the App
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-sans tracking-widest uppercase text-accent hover:text-white transition-colors duration-300 border border-accent/30 px-8 py-4 rounded-md hover:border-white/30"
            >
              Learn More
            </a>
          </motion.div>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/8 overflow-hidden rounded-lg"
        >
          {[
            {
              label: "Vetted Chefs",
              value: "500+",
              desc: "Master chefs across India on the network",
            },
            {
              label: "Premium Venues",
              value: "200+",
              desc: "Five-star hotels, resorts & fine dining establishments",
            },
            {
              label: "Placements",
              value: "1,000+",
              desc: "Successful placements facilitated via Chef Connect",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="bg-background/60 p-10 text-center"
            >
              <div className="text-4xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-sans tracking-widest text-white/30 uppercase mb-3">
                {stat.label}
              </div>
              <div className="text-sm text-white/50 leading-relaxed">
                {stat.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
