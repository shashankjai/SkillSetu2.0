import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Users, 
  Target, 
  TrendingUp, 
  ArrowRight,
  Star,
  Zap,
  Globe,
  Shield,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../components/footer/Footer";
import "./Home.css";

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Global Community",
      description: "Join thousands of learners from around the world",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Smart Matching",
      description: "AI-powered skill matching for perfect connections",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Together",
      description: "Track progress and achieve goals collectively",
      color: "from-emerald-500 to-green-400"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Learners", icon: <Users /> },
    { number: "500+", label: "Skills Available", icon: <Zap /> },
    { number: "98%", label: "Satisfaction Rate", icon: <Star /> },
    { number: "50+", label: "Countries", icon: <Globe /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
        
        {/* Mouse Follow Effect */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"
          animate={{
            x: mousePosition.x - 250,
            y: mousePosition.y - 250
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              y: [null, -100],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            className={`absolute w-1 h-1 rounded-full ${
              i % 4 === 0 ? 'bg-cyan-400' : 
              i % 4 === 1 ? 'bg-purple-400' : 
              i % 4 === 2 ? 'bg-emerald-400' : 
              'bg-pink-400'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-full mb-8"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-medium">PREMIUM LEARNING PLATFORM</span>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                SkillSetu
              </span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block ml-4"
              >
                ✨
              </motion.span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8"
            >
              Where Skills Meet
              <span className="block text-cyan-300">Opportunity</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              A revolutionary platform where knowledge flows freely, 
              skills are exchanged, and communities grow together through 
              collaborative learning.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl text-lg flex items-center gap-3 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="group px-8 py-4 bg-transparent text-cyan-300 font-bold rounded-2xl text-lg border-2 border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center gap-3"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Join Community</span>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8"
          >
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <span className="text-sm">Explore More</span>
              <div className="w-6 h-10 border-2 border-gray-400/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6 text-center hover:border-cyan-500/30 transition-all"
                >
                  <div className="inline-block p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  SkillSetu?
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Experience learning like never before with our premium features
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl border border-white/10 p-8 hover:border-cyan-500/30 transition-all h-full">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                    <motion.div
                      className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="py-32 px-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-white/10 flex items-center justify-center">
                <Heart className="w-12 h-12 text-pink-400" />
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your
              <span className="block bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Learning Journey?
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of successful learners who transformed their skills 
              through our community
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-bold rounded-3xl text-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center gap-4"
              >
                <Shield className="w-6 h-6" />
                <span>Join Free Today</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
              </Link>
            </motion.div>

            <p className="text-gray-500 mt-6">
              No credit card required • 30-second signup • Free forever plan
            </p>
          </div>
        </motion.section>

        <Footer />
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;