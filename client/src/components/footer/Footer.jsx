import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from "react-icons/fa";

const Footer = () => {
  const internalLinks = [
    { name: "Home", to: "/" },
    { name: "Profile", to: "/profile" },
    { name: "Login", to: "/login" },
    { name: "Signup", to: "/register" },
    { name: "Chat", to: "/chat" },
    { name: "Skill Matching", to: "/skill-matching" },
    { name: "Settings", to: "/profile-settings" },
    { name: "About Us", to: "/about-us" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-gray-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            SkillSetu
          </h2>
          <p className="text-gray-400 leading-relaxed">
            A collaborative platform for peer-to-peer learning and skill development. 
            Empowering communities through knowledge exchange.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/30">
              Learning
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-700/30">
              Sharing
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/30">
              Growing
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-4 pb-2 border-b border-blue-800/50 inline-block">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {internalLinks.map(({ name, to }) => (
              <Link
                key={name}
                to={to}
                className="hover:text-blue-300 transition-all duration-300 hover:translate-x-2 hover:underline underline-offset-2"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Social & Contact */}
        <div>
          <h3 className="font-semibold text-white mb-4 pb-2 border-b border-blue-800/50 inline-block">
            Connect With Us
          </h3>
          <div className="space-y-4">
            <p className="text-gray-400">
              Follow us for updates, tips, and community stories.
            </p>
            
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-110 group"
                aria-label="GitHub"
              >
                <FaGithub className="text-gray-400 group-hover:text-white transition-colors" size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-blue-600 transition-all duration-300 hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-gray-400 group-hover:text-blue-400 transition-colors" size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-sky-500 transition-all duration-300 hover:scale-110 group"
                aria-label="Twitter"
              >
                <FaTwitter className="text-gray-400 group-hover:text-sky-400 transition-colors" size={20} />
              </a>
            </div>
            
            <div className="pt-4 text-sm text-gray-500">
              <p>📧 contact@skillsetu.com</p>
              <p className="mt-1">📍 Learning from everywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 border-t border-gray-800/50 mt-8 pt-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} SkillSetu. All rights reserved.
            </p>
            <div className="flex items-center mt-2 md:mt-0">
              {/* <span className="flex items-center">
                Made with <FaHeart className="mx-1 text-red-500 animate-pulse" /> by learners worldwide
              </span> */}
            </div>
            <p className="mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-blue-300 transition">Privacy Policy</Link>
              {" • "}
              <Link to="/terms" className="hover:text-blue-300 transition">Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;