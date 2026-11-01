import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ICONS (React Icons / SVG Fallbacks for ultimate reliability) ---
import {
  SiMicrosoftexcel,
  SiMicrosoftword,
  SiMicrosoftpowerpoint,
  SiReact,
  SiHtml5,
  SiJavascript,
  SiLinkedin,
} from 'react-icons/si';

import {
  FaChartBar,
  FaDatabase,
  FaGraduationCap,
  FaBriefcase,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaArrowRight,
  FaAward,
  FaCheckCircle,
  FaCopy,
  FaPaperPlane,
  FaSearch,
  FaFileAlt
} from 'react-icons/fa';

import { TbBrandGoogleDrive } from 'react-icons/tb';

export default function SayuriPortfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Initialize theme based on preference or system
  useEffect(() => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  // Update HTML class for Tailwind dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Interactive Dot Grid Canvas with Drag & Floating Links
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let dots = [];
    const spacing = 36;
    let animId;

    const mouse = {
      x: -2000,
      y: -2000,
      prevX: -2000,
      prevY: -2000,
      isDown: false,
    };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      dots = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            ox: i * spacing,
            oy: j * spacing,
            x: i * spacing,
            y: j * spacing,
            vx: 0,
            vy: 0,
            baseRadius: 1.6,
            radius: 1.6,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    const onMouseMove = (e) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onMouseDown = (e) => {
      mouse.isDown = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
    };

    const onMouseUp = () => {
      mouse.isDown = false;
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.isDown = true;
      }
    };

    const onTouchEnd = () => {
      mouse.isDown = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    resize();

    function render(time) {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const normalDotColor = isDark ? 'rgba(168, 85, 247, 0.32)' : 'rgba(147, 51, 234, 0.22)';
      const activeDotColor = isDark ? 'rgba(192, 132, 252, 0.95)' : 'rgba(147, 51, 234, 0.85)';
      const linkPrefix = isDark ? 'rgba(192, 132, 252, ' : 'rgba(147, 51, 234, ';

      const maxDist = mouse.isDown ? 210 : 130;
      const pushStrength = mouse.isDown ? 22 : 9;
      const spring = mouse.isDown ? 0.045 : 0.07;
      const damping = 0.88;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const floatX = Math.cos(time * 0.0018 + d.phase) * 2;
        const floatY = Math.sin(time * 0.0022 + d.phase) * 2.8;
        const targetX = d.ox + floatX;
        const targetY = d.oy + floatY;

        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist && dist > 0) {
          const factor = 1 - dist / maxDist;
          const angle = Math.atan2(dy, dx);
          d.vx += Math.cos(angle) * factor * pushStrength;
          d.vy += Math.sin(angle) * factor * pushStrength;

          if (mouse.isDown) {
            d.vx += (mouse.x - mouse.prevX) * 0.12 * factor;
            d.vy += (mouse.y - mouse.prevY) * 0.12 * factor;
          }
          d.radius = d.baseRadius + factor * (mouse.isDown ? 3.0 : 1.8);

          // Draw magnetic beam to cursor
          const alpha = factor * (mouse.isDown ? 0.45 : 0.25);
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = linkPrefix + alpha + ')';
          ctx.lineWidth = mouse.isDown ? 1.4 : 0.9;
          ctx.stroke();
        } else {
          d.radius += (d.baseRadius - d.radius) * 0.1;
        }

        d.vx += (targetX - d.x) * spring;
        d.vy += (targetY - d.y) * spring;
        d.vx *= damping;
        d.vy *= damping;
        d.x += d.vx;
        d.y += d.vy;
      }

      // Draw dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
        const isNear = dist < (mouse.isDown ? 190 : 120);

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fillStyle = isNear ? activeDotColor : normalDotColor;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard?.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 4000);
  };

  // Nav links configuration
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Education', href: '#education' },
    { name: 'Tools', href: '#tools' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  // Tools dataset with dynamic anti-gravity floating properties
  const toolsList = [
    {
      name: 'Microsoft Excel',
      category: 'Financial Modeling & Analysis',
      icon: <SiMicrosoftexcel className="w-12 h-12 text-[#107C41]" />,
      bgLight: 'hover:bg-emerald-50 hover:border-emerald-200',
      bgDark: 'dark:hover:bg-emerald-950/30 dark:hover:border-emerald-800/50',
      duration: 3.8,
      delay: 0,
      yRange: [-10, 10, -10],
    },
    {
      name: 'Microsoft Word',
      category: 'Documentation & Case Studies',
      icon: <SiMicrosoftword className="w-12 h-12 text-[#185ABD]" />,
      bgLight: 'hover:bg-blue-50 hover:border-blue-200',
      bgDark: 'dark:hover:bg-blue-950/30 dark:hover:border-blue-800/50',
      duration: 4.5,
      delay: 0.3,
      yRange: [-12, 12, -12],
    },
    {
      name: 'Microsoft PowerPoint',
      category: 'Strategic Decks & Pitches',
      icon: <SiMicrosoftpowerpoint className="w-12 h-12 text-[#D83B01]" />,
      bgLight: 'hover:bg-orange-50 hover:border-orange-200',
      bgDark: 'dark:hover:bg-orange-950/30 dark:hover:border-orange-800/50',
      duration: 3.5,
      delay: 0.6,
      yRange: [-8, 10, -8],
    },
    {
      name: 'IBM SPSS',
      category: 'Statistical & Survey Analytics',
      icon: <FaChartBar className="w-12 h-12 text-[#006699]" />,
      bgLight: 'hover:bg-sky-50 hover:border-sky-200',
      bgDark: 'dark:hover:bg-sky-950/30 dark:hover:border-sky-800/50',
      duration: 4.8,
      delay: 0.2,
      yRange: [-14, 12, -14],
    },
    {
      name: 'HTML5',
      category: 'Web Layout & UI Structure',
      icon: <SiHtml5 className="w-12 h-12 text-[#E34F26]" />,
      bgLight: 'hover:bg-amber-50 hover:border-amber-200',
      bgDark: 'dark:hover:bg-amber-950/30 dark:hover:border-amber-800/50',
      duration: 3.7,
      delay: 0.5,
      yRange: [-11, 11, -11],
    },
    {
      name: 'Google Apps Script',
      category: 'Cloud Automation & Sheets API',
      icon: <TbBrandGoogleDrive className="w-12 h-12 text-[#34A853]" />,
      bgLight: 'hover:bg-green-50 hover:border-green-200',
      bgDark: 'dark:hover:bg-green-950/30 dark:hover:border-green-800/50',
      duration: 4.2,
      delay: 0.4,
      yRange: [-9, 13, -9],
    },
    {
      name: 'React',
      category: 'Component Architecture',
      icon: <SiReact className="w-12 h-12 text-[#61DAFB]" />,
      bgLight: 'hover:bg-cyan-50 hover:border-cyan-200',
      bgDark: 'dark:hover:bg-cyan-950/30 dark:hover:border-cyan-800/50',
      duration: 5.1,
      delay: 0.1,
      yRange: [-15, 14, -15],
    },
  ];

  // Projects data
  const projectsList = [
    {
      title: 'JB Suspense Management Dashboard',
      subtitle: 'Automation & Reconciliation Web App',
      date: '2025 – Present',
      description:
        'A full-featured responsive internal web app developed with HTML and Google Apps Script, synchronized directly with Google Sheets. Streamlines suspense account tracking, automated error flagging, and transaction reconciliation.',
      tags: ['HTML5', 'Google Apps Script', 'Google Sheets', 'Workflow Automation'],
      image: './images/project1.jpg',
      linkText: 'System Overview',
    },
    {
      title: 'Second-Hand Product Research',
      subtitle: 'Consumer Behavioral Analytics',
      date: '2025',
      description:
        'An empirical market study evaluating consumer purchase intentions toward second-hand goods. Explored price sensitivity, perceived sustainability value, trust factors, and demographic inclinations in emerging markets.',
      tags: ['Market Research', 'Consumer Psychology', 'Empirical Modeling', 'Data Survey'],
      image: './images/project2.jpg',
      linkText: 'Read Study Details',
    },
    {
      title: 'Strategic Marketing Analysis for Eco Agri Tech',
      subtitle: 'Market Penetration & Growth Strategy',
      date: 'Dec 2025 – Feb 2026',
      description:
        'Conducted in-depth strategic analysis using SWOT and Ansoff Matrix frameworks for an agricultural technology venture. Evaluated market penetration, diversification strategies, and risk mitigation in sustainable farming sectors.',
      tags: ['SWOT Matrix', 'Ansoff Matrix', 'Strategic Management', 'AgriTech'],
      image: './images/project3.jpg',
      linkText: 'Strategic Framework',
    },
    {
      title: 'Pumpkin Flour Research & Consumer Acceptance',
      subtitle: 'Quantitative Data Analysis (100 Respondents)',
      date: 'Mar 2026 – May 2026',
      description:
        'Comprehensive quantitative data analysis performed using IBM SPSS on primary survey data collected from 100 respondents. Assessed sensory attributes, product viability, pricing elasticity, and readiness for commercial launch.',
      tags: ['IBM SPSS', 'Descriptive Stats', 'Hypothesis Testing', 'Feasibility Study'],
      image: './images/project4.jpg',
      linkText: 'SPSS Analysis Summary',
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#FAFAFC] text-slate-800'
    }`}>
      {/* Soft Pastel Background Ambient Blobs (Light & Dark) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-40 transition-colors duration-700 ${
          darkMode ? 'bg-purple-900/25' : 'bg-purple-200/60'
        }`} />
        <div className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl opacity-35 transition-colors duration-700 ${
          darkMode ? 'bg-indigo-900/20' : 'bg-blue-100/70'
        }`} />
        <div className={`absolute -bottom-20 left-1/4 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30 transition-colors duration-700 ${
          darkMode ? 'bg-purple-950/30' : 'bg-purple-100/50'
        }`} />
      </div>

      {/* Interactive Anti-Gravity Dot Grid with Drag & Link Physics */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* ----------------- 1. NAVIGATION BAR ----------------- */}
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 border-b ${
        darkMode
          ? 'bg-slate-900/85 border-slate-800/80 shadow-md shadow-slate-950/20'
          : 'bg-white/80 border-slate-200/70 shadow-sm shadow-purple-500/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#home"
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform duration-200">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Sayuri Pallewaththa
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Management Science
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:text-purple-600 dark:hover:text-purple-400 ${
                  darkMode ? 'text-slate-300 hover:bg-slate-800/70' : 'text-slate-600 hover:bg-purple-50/70'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Controls: Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center relative ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700 shadow-inner'
                  : 'bg-white border-slate-200 text-purple-700 hover:bg-purple-50 shadow-sm'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaSun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaMoon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className={`md:hidden p-2.5 rounded-xl border transition-colors ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`md:hidden border-b overflow-hidden ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="px-5 py-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      darkMode
                        ? 'text-slate-200 hover:bg-slate-800 hover:text-purple-400'
                        : 'text-slate-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10">
        {/* ----------------- 2. HERO SECTION (HOME) ----------------- */}
        <section
          id="home"
          className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column (Text & CTAs) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="md:col-span-7 flex flex-col justify-center text-center md:text-left"
            >
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold self-center md:self-start mb-6 border transition-colors bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Undergraduate & Aspirant Analyst
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Hello, I'm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-200">
                  Sayuri Pallewaththa
                </span>
              </h1>

              {/* Subtitle */}
              <h2 className="text-xl sm:text-2xl font-semibold mt-4 text-purple-700 dark:text-purple-300">
                Management Science Undergraduate
              </h2>

              {/* Bio Paragraph */}
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                A detail-oriented student eager to gain practical experience in the financial
                sector, focusing on data analysis, accounting, and strategic market modeling.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start items-center">
                <a
                  href="#contact"
                  className="px-8 py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-lg shadow-purple-600/30 transition-all duration-200 inline-flex items-center gap-2"
                >
                  Say Hello
                  <FaArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#projects"
                  className={`px-7 py-3.5 rounded-xl font-semibold border transition-all duration-200 active:scale-95 ${
                    darkMode
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-700 hover:bg-white hover:border-purple-300 shadow-sm'
                  }`}
                >
                  Explore Projects
                </a>
              </div>

              {/* Quick Highlight Pills */}
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-6 justify-center md:justify-start text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-purple-600 dark:text-purple-400" />
                  Financial Data Modeling
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-purple-600 dark:text-purple-400" />
                  Statistical SPSS Analysis
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCheckCircle className="text-purple-600 dark:text-purple-400" />
                  Strategic Market Analysis
                </span>
              </div>
            </motion.div>

            {/* Right Column (Headshot with Glowing Aesthetic Frame) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="md:col-span-5 flex justify-center items-center"
            >
              <div className="relative group">
                {/* Ambient Glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500" />

                {/* Main Profile Card Container */}
                <div className={`relative rounded-3xl p-3 border transition-colors ${
                  darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-purple-100 shadow-xl'
                }`}>
                  <img
                    src="./images/profile.jpeg"
                    onError={(e) => {
                      if (!e.target.dataset.triedJpg) {
                        e.target.dataset.triedJpg = "1";
                        e.target.src = "./images/profile.jpg";
                      } else if (!e.target.dataset.triedPng) {
                        e.target.dataset.triedPng = "1";
                        e.target.src = "./images/profile.png";
                      } else {
                        e.target.src = "https://placehold.co/400x400/9333ea/ffffff?text=Sayuri+Profile";
                      }
                    }}
                    alt="Sayuri Pallewaththa Profile"
                    className="w-72 h-72 sm:w-80 sm:h-80 md:w-84 md:h-84 object-cover rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  {/* Floating Mini Badge */}
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className={`absolute -bottom-5 -left-5 px-4 py-2.5 rounded-2xl border shadow-lg backdrop-blur-md flex items-center gap-3 ${
                      darkMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-sm">
                      🎓
                    </div>
                    <div>
                      <p className="text-xs font-semibold leading-tight">Univ. of Sri Jayewardenepura</p>
                      <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">BSc (Hons) '27</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ----------------- 3. EDUCATION SECTION ----------------- */}
        <section id="education" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-14">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                Academic Background
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">Education & Qualifications</h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
                Strong quantitative grounding in management science, statistics, and natural sciences.
              </p>
            </div>

            {/* Timeline / Card Layout */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-8 md:before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-purple-500 before:via-indigo-400 before:to-transparent before:hidden md:before:block">
              {/* Item 1: University */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:shadow-lg ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 hover:border-purple-500/50'
                    : 'bg-white border-slate-200/80 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20 shrink-0">
                      <FaGraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 mb-1.5">
                        2023 – 2027 (Expected)
                      </span>
                      <h3 className="text-xl font-bold">University of Sri Jayewardenepura</h3>
                      <p className="text-base font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                        BSc (Hons) in Applied Sciences (Management Science)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
                    Relevant Coursework:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Finance', 'Statistics', 'Marketing Analysis', 'Quantitative Modeling', 'Managerial Economics'].map((course) => (
                      <span
                        key={course}
                        className={`text-xs px-3 py-1 rounded-lg font-medium border ${
                          darkMode
                            ? 'bg-slate-900/70 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Item 2: High School */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:shadow-lg ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 hover:border-purple-500/50'
                    : 'bg-white border-slate-200/80 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 shrink-0">
                      <FaAward className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mb-1.5">
                        Completed 2022
                      </span>
                      <h3 className="text-xl font-bold">Girls' High School, Kandy</h3>
                      <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        G.C.E (A/L) in Biological Science
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Key Academic Distinction:
                  </span>
                  <span className="text-xs px-3 py-1 rounded-lg font-bold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                    Chemistry – Grade A
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Strong analytical, logical deduction, and empirical reasoning foundation.
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ----------------- 4. TOOLS I USE (FLOATING ANIMATION) ----------------- */}
        <section id="tools" className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                Technical Stack
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">Tools & Software I Use</h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-base max-w-2xl mx-auto">
                Specialized analytical software, statistical engines, and modern development tools
                driving data-informed solutions.
              </p>
            </div>

            {/* Anti-Gravity Floating Icons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-center justify-center">
              {toolsList.map((tool) => (
                <motion.div
                  key={tool.name}
                  animate={{
                    y: tool.yRange,
                    rotate: [-1, 1, -1],
                  }}
                  transition={{
                    duration: tool.duration,
                    delay: tool.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className={`flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm ${
                    darkMode
                      ? 'bg-slate-800/80 border-slate-700/80 shadow-slate-950/30'
                      : 'bg-white border-slate-200 shadow-purple-500/5'
                  } ${tool.bgLight} ${tool.bgDark}`}
                >
                  {/* Tool Icon */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 mb-4 transition-transform duration-300">
                    {tool.icon}
                  </div>

                  {/* Tool Name */}
                  <h3 className="font-bold text-base sm:text-lg tracking-tight">{tool.name}</h3>

                  {/* Tool Category Label */}
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {tool.category}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
              ⚡ Anti-gravity animation active: Dynamic Framer Motion easing simulating floating physics
            </div>
          </div>
        </section>

        {/* ----------------- 5. MY PROJECTS SECTION ----------------- */}
        <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-14">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                Applied Portfolio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">Featured Projects & Research</h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
                Showcasing practical solutions across financial automation, consumer behavior, and
                strategic market modeling.
              </p>
            </div>

            {/* 2-Column / 3-Column Responsive CSS Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {projectsList.map((project, idx) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 shadow-md ${
                    darkMode
                      ? 'bg-slate-800/90 border-slate-700/80 hover:border-purple-500/60 shadow-slate-950/40'
                      : 'bg-white border-slate-200/90 hover:border-purple-300 shadow-purple-500/5'
                  }`}
                >
                  {/* Project Image Thumbnail */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
                        {project.date}
                      </span>
                    </div>
                  </div>

                  {/* Project Card Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
                        {project.subtitle}
                      </p>
                      <h3 className="text-xl font-bold tracking-tight mb-3 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/60 mb-5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                              darkMode
                                ? 'bg-slate-900/60 border-slate-700 text-purple-300'
                                : 'bg-purple-50/70 border-purple-200 text-purple-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Link */}
                      <div className="flex items-center text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 group cursor-pointer">
                        <span>{project.linkText}</span>
                        <FaArrowRight className="ml-2 w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------- 6. EXPERIENCE SECTION ----------------- */}
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-14">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                Track Record
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-3">Professional & Leadership Experience</h2>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
                Practical corporate applications and foundational teamwork leadership development.
              </p>
            </div>

            {/* Experience Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Role 1: Management Science Intern */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 hover:border-purple-500/50'
                    : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                      Current Position
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Internship</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-600 text-white shrink-0">
                      <FaBriefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Management Science Intern</h3>
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        Corporate Sector Operations
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    Engaged in practical corporate applications across finance, marketing, and
                    supply chain management. Conducting quantitative analysis, financial variance
                    reporting, and supporting strategic decision models for process efficiency.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex flex-wrap gap-2">
                    {['Financial Analysis', 'Marketing Strategy', 'Supply Chain Management'].map((skill) => (
                      <span
                        key={skill}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                          darkMode
                            ? 'bg-slate-900/60 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Role 2: Leadership & First Aid Training */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 hover:border-purple-500/50'
                    : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                      2016
                    </span>
                    <span className="text-xs font-semibold text-slate-400">Certified Leadership</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-indigo-600 text-white shrink-0">
                      <FaAward className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Leadership & First Aid Training</h3>
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        St. John Ambulance & Teamwork Development Program
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    Successfully completed rigorous training in emergency first-aid protocols, team
                    coordination, and organizational leadership. Cultivated critical decision-making
                    under pressure, proactive teamwork, and empathetic crisis management.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex flex-wrap gap-2">
                    {['Team Coordination', 'Emergency First Response', 'Crisis Communication'].map((skill) => (
                      <span
                        key={skill}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                          darkMode
                            ? 'bg-slate-900/60 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ----------------- 7. FOOTER & CONTACT SECTION ----------------- */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              Get in Touch
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mt-3 tracking-tight">Let's connect!</h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Interested in collaborating, offering an internship opportunity, or discussing
              financial data analytics? Reach out anytime!
            </p>

            {/* Quick Contact Info Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Email Card */}
              <div
                onClick={() => copyToClipboard('pallewaththasayuri@gmail.com', 'email')}
                className={`p-6 rounded-2xl border transition-all duration-200 text-center cursor-pointer group ${
                  darkMode ? 'bg-slate-800/80 border-slate-700 hover:border-purple-400' : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <h4 className="text-xs uppercase font-bold text-slate-400">Email</h4>
                <p className="font-semibold text-sm mt-1 text-slate-800 dark:text-slate-200 break-all">
                  pallewaththasayuri@gmail.com
                </p>
                <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-2 inline-flex items-center gap-1">
                  {copiedEmail ? <FaCheckCircle /> : <FaCopy />}
                  {copiedEmail ? 'Copied to Clipboard!' : 'Click to Copy'}
                </span>
              </div>

              {/* Phone Card */}
              <div
                onClick={() => copyToClipboard('0778757262', 'phone')}
                className={`p-6 rounded-2xl border transition-all duration-200 text-center cursor-pointer group ${
                  darkMode ? 'bg-slate-800/80 border-slate-700 hover:border-purple-400' : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaPhoneAlt className="w-5 h-5" />
                </div>
                <h4 className="text-xs uppercase font-bold text-slate-400">Phone</h4>
                <p className="font-semibold text-sm mt-1 text-slate-800 dark:text-slate-200">
                  0778757262
                </p>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-2 inline-flex items-center gap-1">
                  {copiedPhone ? <FaCheckCircle /> : <FaCopy />}
                  {copiedPhone ? 'Copied to Clipboard!' : 'Click to Copy / Call'}
                </span>
              </div>

              {/* Location Card */}
              <div
                className={`p-6 rounded-2xl border transition-all duration-200 text-center ${
                  darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <h4 className="text-xs uppercase font-bold text-slate-400">Location</h4>
                <p className="font-semibold text-sm mt-1 text-slate-800 dark:text-slate-200">
                  Pilimathalawa, Sri Lanka
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-2 inline-block">
                  Open to Remote & On-Site
                </span>
              </div>
            </div>

            {/* Interactive Quick Contact Form */}
            <div className={`mt-12 p-8 sm:p-10 rounded-3xl border text-left ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-lg'
            }`}>
              <h3 className="text-xl font-bold mb-2">Send a Direct Message</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Fill out the quick note below and I will respond promptly.
              </p>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                  <FaCheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-bold text-sm">Thank you for your message!</h5>
                    <p className="text-xs">Your inquiry has been received. I'll get back to you shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-300">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Sayuri, I would love to connect regarding an opportunity..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 shadow-md shadow-purple-600/25 transition-all inline-flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane className="w-3.5 h-3.5" />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Clickable Social Icons */}
            <div className="mt-12 flex justify-center items-center gap-4">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Sayuri Pallewaththa on LinkedIn"
                className={`p-3.5 rounded-xl border transition-transform hover:scale-110 ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-purple-400 hover:text-white hover:bg-purple-600'
                    : 'bg-white border-slate-200 text-purple-600 hover:text-white hover:bg-purple-600 shadow-sm'
                }`}
              >
                <SiLinkedin className="w-5 h-5" />
              </a>

              <a
                href="mailto:pallewaththasayuri@gmail.com"
                aria-label="Send Email to Sayuri"
                className={`p-3.5 rounded-xl border transition-transform hover:scale-110 ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-purple-400 hover:text-white hover:bg-purple-600'
                    : 'bg-white border-slate-200 text-purple-600 hover:text-white hover:bg-purple-600 shadow-sm'
                }`}
              >
                <FaEnvelope className="w-5 h-5" />
              </a>

              <a
                href="tel:0778757262"
                aria-label="Call Sayuri"
                className={`p-3.5 rounded-xl border transition-transform hover:scale-110 ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 text-purple-400 hover:text-white hover:bg-purple-600'
                    : 'bg-white border-slate-200 text-purple-600 hover:text-white hover:bg-purple-600 shadow-sm'
                }`}
              >
                <FaPhoneAlt className="w-5 h-5" />
              </a>
            </div>

            {/* Copyright & Disclaimer */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <p>
                © {new Date().getFullYear()} Sayuri Pallewaththa. All rights reserved.
              </p>
              <p className="mt-1">
                Management Science Undergraduate • University of Sri Jayewardenepura
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
