import { Link } from 'react-router-dom';
import { Search, PlusCircle, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// A simple SVG graphic component for the hero section
const HeroGraphic = () => (
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M496 240H312C298.7 240 288 250.7 288 264V448C288 461.3 298.7 472 312 472H496C509.3 472 520 461.3 520 448V264C520 250.7 509.3 240 496 240Z" fill="url(#paint0_linear_101_2)" stroke="#E2E8F0" strokeWidth="4"/>
    <path d="M224 64H40C26.75 64 16 74.75 16 88V272C16 285.3 26.75 296 40 296H224C237.3 296 248 285.3 248 272V88C248 74.75 237.3 64 224 64Z" fill="url(#paint1_linear_101_2)" stroke="#E2E8F0" strokeWidth="4"/>
    <path d="M160 320H40C26.75 320 16 330.7 16 344V448C16 461.3 26.75 472 40 472H160C173.3 472 184 461.3 184 448V344C184 330.7 173.3 320 160 320Z" fill="url(#paint2_linear_101_2)" stroke="#E2E8F0" strokeWidth="4"/>
    <defs>
      <linearGradient id="paint0_linear_101_2" x1="288" y1="240" x2="520" y2="472" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1D4ED8"/>
        <stop offset="1" stopColor="#3B82F6"/>
      </linearGradient>
      <linearGradient id="paint1_linear_101_2" x1="16" y1="64" x2="248" y2="296" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA"/>
        <stop offset="1" stopColor="#93C5FD"/>
      </linearGradient>
      <linearGradient id="paint2_linear_101_2" x1="16" y1="320" x2="184" y2="472" gradientUnits="userSpaceOnUse">
        <stop stopColor="#BFDBFE"/>
        <stop offset="1" stopColor="#DBEAFE"/>
      </linearGradient>
    </defs>
  </svg>
);

const Home = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Search with Ease",
      description: "Quickly browse through a collection of all found items reported by the community.",
    },
    {
      icon: <PlusCircle className="w-8 h-8 text-blue-600" />,
      title: "Report and Help",
      description: "Found something? Create a listing in seconds to help it find its way back home.",
    },
    {
      icon: <UserCheck className="w-8 h-8 text-blue-600" />,
      title: "Manage Your Finds",
      description: "Easily view, edit, or remove the items you've reported once they are claimed.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="space-y-16 overflow-hidden pb-8">
      <section className="pt-4 md:pt-8">
        <div className="glass-surface mx-auto grid max-w-6xl gap-10 rounded-[2rem] p-8 md:grid-cols-[1.05fr_0.95fr] md:p-12">
          <motion.div
            className="text-center md:text-left"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.p variants={itemVariants} className="text-xs font-bold uppercase tracking-[0.28em] text-blue-600">
              Community Recovery Hub
            </motion.p>
            <motion.h1
              className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl"
              variants={itemVariants}
            >
              Lost and Found,
              <span className="block bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
                redesigned for speed
              </span>
            </motion.h1>
            <motion.p className="mt-6 max-w-xl text-base text-slate-600 md:text-lg" variants={itemVariants}>
              Browse recently reported items, post what you found, and resolve claims in a cleaner workflow built for campus and neighborhood communities.
            </motion.p>
            <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={itemVariants}>
              <Link to="/browse" className="brand-button inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold">
                Explore Listings <ArrowRight size={20} />
              </Link>
              <Link to="/add-item" className="outline-button inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold">
                Report Found Item
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'backOut' }}
          >
            <div className="rounded-3xl bg-gradient-to-br from-blue-100 to-white p-5 shadow-inner ring-1 ring-blue-100">
              <HeroGraphic />
            </div>
            <div className="absolute -bottom-5 left-6 rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 text-sm font-semibold text-blue-700 shadow-lg">
              Live notifications enabled
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {["Instant posting", "Claim tracking", "Real-time notifications"].map((label) => (
            <div key={label} className="glass-surface rounded-2xl px-6 py-5 text-center text-sm font-semibold uppercase tracking-wide text-blue-700">
              {label}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <h2 className="mb-3 text-center text-3xl font-bold text-slate-900 md:text-4xl">How It Works</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">
          A clear three-step flow designed to help items return to their owners quickly.
        </p>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass-surface rounded-2xl p-7 transition hover:-translate-y-1"
              variants={itemVariants}
            >
              <div className="mb-4 inline-flex rounded-full bg-blue-100 p-3">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;