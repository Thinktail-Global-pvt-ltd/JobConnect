import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import appstoreBadge from "@/assets/appstore.png";
import playstoreBadge from "@/assets/playstore.png";

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

const jobSeekerFeatures = [
  "Browse thousands of verified hospitality roles",
  "Apply instantly from your phone",
  "Get matched by skill, role & location",
  "Real-time alerts for new openings",
];

const employerFeatures = [
  "Post a job listing in under 2 minutes",
  "Jobrito's smart engine matches your role to the right talent",
  "Matched candidates are notified directly in-app",
  "Interested job seekers connect with you — no searching needed",
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-4 h-4 fill-none stroke-current text-accent flex-shrink-0"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 10l4.5 4.5L16 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-accent/30 selection:text-white overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-12 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-chef.png`}
            alt="Chef plating in moody lighting"
            className="w-full h-full object-cover opacity-40 scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h1
              variants={fadeUp}
              className="text-[2.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-display font-bold tracking-tight text-white leading-[1.15]"
            >
              Connecting
              <br />
              hospitality
              <br />
              <span className="italic font-semibold text-accent">talent.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-[1.25rem] md:text-[1.5rem] text-white/65 font-sans leading-[1.1]"
            >
              Discover opportunities. Hire with confidence. Connect with
              culinary experts — all from one app.
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
      </section>

      {/* Download Section */}
      <section
        id="download"
        className="relative py-24 px-6 bg-background border-t border-white/5"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="flex flex-col items-center text-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-base md:text-xl font-sans tracking-wide text-accent uppercase mb-6"
            >
              Download the App
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 leading-tight"
            >
              Get Jobrito on
              <br />
              your phone.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/45 font-sans mb-16 max-w-sm leading-relaxed"
            >
              Scan with your camera to download instantly — available on iOS and
              Android.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row justify-center gap-12 md:gap-20"
            >
              {/* App Store */}
              <div className="flex flex-col items-center gap-5">
                <div className="bg-white p-4 rounded-2xl shadow-2xl">
                  <QRCodeSVG
                    value="https://apps.apple.com/in/app/jobrito"
                    size={160}
                    bgColor="#ffffff"
                    fgColor="#153e69"
                    level="M"
                  />
                </div>
                <div className="flex items-center gap-2.5 px-6 py-3 bg-white/[0.06] border border-white/10 rounded-xl">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-white fill-current flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.78 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">
                    App Store
                  </span>
                </div>
              </div>

              {/* Google Play */}
              <div className="flex flex-col items-center gap-5">
                <div className="bg-white p-4 rounded-2xl shadow-2xl">
                  <QRCodeSVG
                    value="https://play.google.com/store/apps/details?id=com.jobrito"
                    size={160}
                    bgColor="#ffffff"
                    fgColor="#153e69"
                    level="M"
                  />
                </div>
                <div className="flex items-center gap-2.5 px-6 py-3 bg-white/[0.06] border border-white/10 rounded-xl">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current text-white flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3.18 23.76C3.06 23.84 2.93 23.88 2.8 23.88C2.56 23.88 2.32 23.77 2.16 23.56L2.14 23.54C1.96 23.3 1.96 22.97 2.14 22.73L10.15 12L2.14 1.27C1.96 1.03 1.96 0.7 2.14 0.46L2.16 0.44C2.32 0.23 2.56 0.12 2.8 0.12C2.93 0.12 3.06 0.16 3.18 0.24L21.32 11.12C21.55 11.25 21.7 11.62 21.7 12C21.7 12.38 21.55 12.75 21.32 12.88L3.18 23.76ZM4.22 2.24L11.16 12L4.22 21.76V2.24Z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">
                    Google Play
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Discover Jobrito */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2340] via-[#0a1a2e] to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(210_67%_24%/0.3),transparent)]"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.p
              variants={fadeUp}
              className="text-[1.25rem] md:text-xl font-sans tracking-wide text-accent uppercase mb-5 text-center"
            >
              Discover Jobrito
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-[2.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-display font-bold text-white leading-tight text-center mb-10"
            >
              One Community.
              <br />
              One Platform.
              <br />
              Endless Opportunities.
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="max-w-3xl mx-auto space-y-5 text-center mb-14"
            >
              <p className="text-white/60 font-sans leading-relaxed text-lg">
                Jobrito connects hospitality professionals, employers, chefs,
                and aspiring talent through hiring, Chef Connect, training, and
                industry networking — all in one trusted platform built
                exclusively for hospitality.
              </p>
              <p className="text-white/45 font-sans leading-relaxed">
                Whether you're building your career, growing your business,
                sharing culinary expertise, or learning new skills, Jobrito
                helps you connect with the people and opportunities that matter.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row justify-center gap-12 md:gap-24 pb-8"
            >
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-1">
                  50k+
                </div>
                <div className="text-sm font-sans text-white/45 tracking-wide">
                  Hospitality Professionals
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-1">
                  1.2k+
                </div>
                <div className="text-sm font-sans text-white/45 tracking-wide">
                  Hospitality Businesses
                </div>
              </div>
            </motion.div>

            {/* Divider after stats */}
            <div className="border-t border-white/10"></div>
          </motion.div>
        </div>
      </section>

      {/* Pillar 1: Talent Feed — Job Seekers */}
      <section className="relative min-h-[90dvh] flex items-center py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/bartender.png`}
              alt="Bartender in dimly lit bar"
              className="w-full h-full object-cover opacity-30"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-10 h-px bg-accent"></span>
              <span className="text-base md:text-xl font-sans tracking-wide text-accent uppercase">
                Talent Feed — Job Seekers
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-[2.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-display font-bold text-white mb-6 leading-[1.15]"
            >
              Opportunities
              <br />
              near you —<br />
              <span className="italic font-semibold text-accent">
                and far beyond.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/55 font-sans leading-relaxed mb-10"
            >
              Find the right role faster — built exclusively for hospitality
              professionals across India and the Middle East.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4 mb-10">
              {jobSeekerFeatures.map((f) => (
                <motion.li
                  key={f}
                  variants={fadeUp}
                  className="flex items-center gap-3 text-sm font-sans text-white/75"
                >
                  <CheckIcon />
                  {f}
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp}>
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("download")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-md bg-accent text-background hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
              >
                Join Today
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pillar 2: Hire Talent — Employers */}
      <section className="relative min-h-[90dvh] flex items-center py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/hotel-lobby.png`}
              alt="Sophisticated hotel lobby"
              className="w-full h-full object-cover opacity-20"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/75 to-background/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_70%_at_80%_50%,hsl(29_91%_20%/0.55),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_85%_30%,hsl(40_83%_30%/0.3),transparent)]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-end">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl text-right flex flex-col items-end"
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mb-6"
            >
              <span className="text-base md:text-xl font-sans tracking-wide text-accent uppercase">
                Hire Talent — Employers
              </span>
              <span className="w-10 h-px bg-accent"></span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-[2.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-display font-bold text-white mb-6 leading-[1.15]"
            >
              The right person.
              <br />
              <span className="italic font-semibold text-accent">
                Before service starts.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/55 font-sans leading-[1.1] mb-10"
            >
              Post a role and let Jobrito do the work. Our smart matching engine
              notifies the right talent — and if they're interested, they come
              to you.
            </motion.p>
            <motion.ul variants={staggerContainer} className="space-y-4 mb-10">
              {employerFeatures.map((f) => (
                <motion.li
                  key={f}
                  variants={fadeUp}
                  className="flex items-center justify-end gap-3 text-sm font-sans text-white/75"
                >
                  {f}
                  <CheckIcon />
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={fadeUp}>
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("download")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-md bg-accent text-background hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
              >
                Post a Job
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pillar 3: Chef Connect */}
      <section className="relative min-h-[90dvh] flex items-center py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/kitchen-steam.png`}
              alt="Steam in professional kitchen"
              className="w-full h-full object-cover opacity-30"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <span className="w-8 h-px bg-accent"></span>
              <span className="text-base md:text-xl font-sans tracking-wide text-accent uppercase">
                Chef Connect — Hospitality Consultant
              </span>
              <span className="w-8 h-px bg-accent"></span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-[2.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-display font-bold text-white mb-8 leading-[1.15] max-w-5xl"
            >
              The Right Expert for
              <br />
              Every Hospitality Challenge.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-white/55 font-sans max-w-lg mx-auto mb-10 leading-relaxed"
            >
              Connect with verified hospitality experts from India & Middle East
              for restaurant setup, operations, branding, training, technology,
              procurement, menu strategy, franchising, and business growth.
            </motion.p>
            <motion.div variants={fadeUp}>
              <a
                href="#download"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("download")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold px-8 py-3.5 rounded-md bg-accent text-background hover:bg-accent/90 transition-colors duration-200 cursor-pointer"
              >
                Join The Network
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
