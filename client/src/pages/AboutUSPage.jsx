import React, { useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaLightbulb, 
  FaUsers, 
  FaExchangeAlt, 
  FaGraduationCap,
  FaRocket,
  FaGlobe,
  FaHandshake,
  FaChartLine,
  FaArrowRight
} from "react-icons/fa";

// Components
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Background from "../components/background/Background";
import "../components/background/Background.css";

// Assets
import profileImage from "../assets/profile.jpg";

const AboutUsPage = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  // Upgraded Feature Data with specific colors for Bento Grid
  const features = [
    {
      icon: <FaExchangeAlt />,
      title: "Skill Exchange",
      desc: "Trade your expertise for new knowledge seamlessly.",
      bg: "from-cyan-500/10 to-blue-500/10",
      border: "border-cyan-500/20"
    },
    {
      icon: <FaUsers />,
      title: "Community Driven",
      desc: "Learn from real people, not just static tutorials.",
      bg: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20"
    },
    {
      icon: <FaGraduationCap />,
      title: "Practical Learning",
      desc: "Get hands-on experience with immediate feedback.",
      bg: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-500/20"
    },
    {
      icon: <FaGlobe />,
      title: "Global Network",
      desc: "Connect with mentors and learners worldwide.",
      bg: "from-orange-500/10 to-red-500/10",
      border: "border-orange-500/20"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Learners" },
    { value: "500+", label: "Skills Exchanged" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Learning Support" }
  ];

  return (
    <div className="min-h-screen text-white bg-slate-950 overflow-hidden font-sans selection:bg-cyan-500 selection:text-white relative">
      
      {/* Subtle Noise Texture Overlay for premium feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="relative z-10">
        <Navbar />

        {/* HERO SECTION - Upgraded */}
        <section
          className="relative py-24 md:py-32 px-6 max-w-7xl mx-auto text-center"
        >
          <Background />
          
          {/* Ambient Glow Behind Hero */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/50 backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-medium text-cyan-300 uppercase tracking-wider">Now Live Worldwide</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                Redefining
              </span>
              <span className="block mt-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  Learning Together
                </span>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              A revolutionary peer-to-peer platform where skills flow freely, 
              knowledge is shared, and growth is collective.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/skill-matching")}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full 
                         shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-3"
              >
                <FaRocket className="group-hover:rotate-12 transition-transform" />
                Start Your Journey
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-transparent text-cyan-300 font-semibold rounded-full 
                         border border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10 
                         transition-all duration-300"
              >
                Join Community
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* STATS SECTION - Glassmorphism */}
        <section className="py-12 px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-3xl shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* --- FOUNDER SECTION (UNCHANGED AS REQUESTED) --- */}
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl rounded-3xl"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-8 md:p-12 rounded-2xl border border-white/10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-md opacity-30"></div>
                  <img
                    src={profileImage}
                    alt="Founder"
                    className="relative w-48 h-48 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-2">Shashank Jaiswal</h2>
                  <p className="text-cyan-300 mb-4">Founder & Visionary</p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "I built SkillSetu to break down barriers in education. Every person has 
                    something valuable to teach and an infinite capacity to learn. 
                    Together, we're building a world where knowledge flows freely."
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/20">
                      Educator
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/20">
                      Innovator
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/20">
                      Community Builder
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FEATURES GRID - Upgraded to Bento Style */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SkillSetu</span> Stands Out
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className={`group relative bg-gradient-to-br ${feature.bg} backdrop-blur-md p-8 rounded-3xl 
                         border ${feature.border} transition-all duration-300 hover:shadow-2xl`}
              >
                <div className="text-3xl mb-4 text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* VISION & MISSION - Enhanced Layout */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-transparent blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-cyan-500/10 h-full flex flex-col justify-center">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400 text-2xl border border-cyan-500/20">
                  <FaLightbulb />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-slate-400 leading-relaxed font-light">
                  To create a world where learning has no boundaries, 
                  where every individual can access any skill they desire 
                  through collaborative exchange, fostering a global 
                  community of continuous growth.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-l from-purple-500/10 to-transparent blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-purple-500/10 h-full flex flex-col justify-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400 text-2xl border border-purple-500/20">
                  <FaChartLine />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-slate-400 leading-relaxed font-light">
                  To democratize learning by providing a platform where 
                  skills are valued equally, where teaching and learning 
                  create symbiotic relationships, and where every 
                  interaction contributes to personal growth.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA SECTION - Ultimate Professional */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-800 border border-white/10 mb-8 shadow-2xl shadow-cyan-500/10">
                <FaHandshake className="text-2xl text-cyan-400" />
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Ready to Transform
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                  Your Learning Journey?
                </span>
              </h2>
              
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands who have discovered the power of peer-to-peer learning. 
                Your next skill is just one connection away.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/skill-matching")}
                  className="px-10 py-5 bg-white text-slate-950 font-bold text-lg rounded-full 
                           hover:bg-cyan-50 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group"
                >
                  Launch Your Skills
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/about-us")}
                  className="px-10 py-5 bg-transparent text-cyan-300 font-bold text-lg rounded-full
                           border border-slate-700 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
              
              <p className="mt-8 text-sm text-slate-600 font-medium tracking-wide uppercase">
                No credit card required • Join in 30 seconds
              </p>
            </motion.div>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;