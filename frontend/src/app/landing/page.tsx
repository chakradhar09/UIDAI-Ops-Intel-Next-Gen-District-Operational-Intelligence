'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  BarChart3,
  Map,
  AlertTriangle,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Database,
  Brain,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  Activity,
  Target,
  Globe,
  Sparkles,
  LineChart,
  PieChart,
  Layers,
  Cpu,
  Clock,
  Award,
} from 'lucide-react'

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-uidai-saffron/20 to-uidai-navy/20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            x: [null, Math.random() * 1200, Math.random() * 1200],
            y: [null, Math.random() * 800, Math.random() * 800],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

// Animated counter component
const AnimatedCounter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// Feature card component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay,
  gradient 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  delay: number;
  gradient: string;
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-uidai-saffron/10 to-uidai-navy/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// Insight card component
const InsightCard = ({ 
  number, 
  title, 
  insight, 
  icon: Icon,
  color 
}: { 
  number: string; 
  title: string; 
  insight: string; 
  icon: any;
  color: string;
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="relative pl-8 pb-8 border-l-2 border-white/15 last:border-l-transparent last:pb-0"
    >
      <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full ${color} flex items-center justify-center shadow-md ring-2 ring-white/10`}>
        <span className="text-white text-xs font-bold">{number}</span>
      </div>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-20 flex items-center justify-center flex-shrink-0 shadow-lg ring-1 ring-white/10`}>
          <Icon className="w-6 h-6 text-white drop-shadow" />
        </div>
        <div className="pt-0.5">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-white/70 text-sm leading-relaxed">{insight}</p>
        </div>
      </div>
    </motion.div>
  )
}

// Stat card component
const StatCard = ({ value, label, icon: Icon, suffix = '' }: { value: number; label: string; icon: any; suffix?: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
  >
    <Icon className="w-8 h-8 text-uidai-saffron mb-3" />
    <div className="text-4xl font-bold text-white mb-1">
      <AnimatedCounter value={value} suffix={suffix} />
    </div>
    <p className="text-white/70">{label}</p>
  </motion.div>
)

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: BarChart3,
      title: "Workload Forecasting",
      description: "Predict future Aadhaar enrolments with advanced time-series analysis and exponential smoothing algorithms.",
      gradient: "bg-gradient-to-br from-uidai-navy to-uidai-navy-dark",
    },
    {
      icon: Map,
      title: "Migration Analysis",
      description: "Interactive choropleth maps showing migration patterns and demographic shifts across Telangana districts.",
      gradient: "bg-gradient-to-br from-uidai-saffron to-uidai-saffron-dark",
    },
    {
      icon: AlertTriangle,
      title: "Anomaly Detection",
      description: "Real-time alerts for statistical outliers, gender imbalances, and unusual demographic patterns.",
      gradient: "bg-gradient-to-br from-uidai-green to-uidai-green-dark",
    },
    {
      icon: Users,
      title: "Age-Based Projections",
      description: "Track mandatory biometric updates for citizens at age 5 and 15, ensuring compliance forecasting.",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Machine learning models analyze historical data to provide actionable operational intelligence.",
      gradient: "bg-gradient-to-br from-rose-500 to-rose-700",
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Enterprise-grade security with no PII exposure, analyzing only aggregated operational metrics.",
      gradient: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    },
  ]

  const insights = [
    {
      number: "1",
      title: "High Migration Corridors Identified",
      insight: "Districts like Hyderabad and Rangareddy show 2.3x higher address update ratios, indicating significant population movement from rural to urban areas.",
      icon: Globe,
      color: "bg-uidai-saffron",
    },
    {
      number: "2",
      title: "Seasonal Workload Patterns",
      insight: "Enrolment volumes peak 40% during March-May, correlating with academic year cycles and mandatory child updates.",
      icon: Activity,
      color: "bg-uidai-navy",
    },
    {
      number: "3",
      title: "Gender Balance Anomalies",
      insight: "3 districts flagged with female enrolment outside 47-53% expected range, requiring operational attention.",
      icon: AlertTriangle,
      color: "bg-rose-500",
    },
    {
      number: "4",
      title: "Youth Demographic Surge",
      insight: "18% increase in 5-17 age group biometric updates predicted for next quarter based on historical enrollment data.",
      icon: TrendingUp,
      color: "bg-uidai-green",
    },
    {
      number: "5",
      title: "Resource Optimization Potential",
      insight: "Predictive analytics can help redistribute 15-20% of resources across districts based on forecasted demand.",
      icon: Target,
      color: "bg-purple-500",
    },
  ]

  const techStack = [
    { name: "Next.js 14", icon: Layers, desc: "React Framework" },
    { name: "FastAPI", icon: Zap, desc: "Python Backend" },
    { name: "Tremor", icon: BarChart3, desc: "Data Visualization" },
    { name: "Pandas", icon: Database, desc: "Data Processing" },
    { name: "Statsmodels", icon: LineChart, desc: "Forecasting" },
    { name: "React-Leaflet", icon: Map, desc: "Interactive Maps" },
  ]

  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-uidai-navy via-uidai-navy-dark to-slate-900">
          <FloatingParticles />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          
          {/* Animated gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-uidai-saffron/30 blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-uidai-navy-light/40 blur-[100px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-8"
                >
                  <Sparkles className="w-4 h-4 text-uidai-saffron" />
                  <span className="text-white/90 text-sm font-medium">UIDAI Data Hackathon 2026</span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                >
                  <span className="block">District Operational</span>
                  <span className="block bg-gradient-to-r from-uidai-saffron via-yellow-400 to-uidai-saffron bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                    Intelligence Dashboard
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto"
                >
                  Empowering UIDAI Telangana with AI-driven insights for workload forecasting, 
                  migration analysis, and anomaly detection.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(242, 101, 34, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      className="group px-8 py-4 bg-gradient-to-r from-uidai-saffron to-uidai-saffron-dark text-white font-semibold rounded-2xl flex items-center gap-3 shadow-xl shadow-uidai-saffron/30 transition-all duration-300"
                    >
                      Launch Dashboard
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Explore Features
                  </motion.button>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
                >
                  <StatCard value={33} label="Districts Analyzed" icon={Map} />
                  <StatCard value={3} label="Analytics Modules" icon={Brain} />
                  <StatCard value={100} label="Data Accuracy" icon={CheckCircle} suffix="%" />
                  <StatCard value={24} label="Real-time Updates" icon={Clock} suffix="/7" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/50" />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-uidai-navy/10 text-uidai-navy rounded-full text-sm font-semibold mb-4">
              Core Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Powerful Analytics{' '}
              <span className="bg-gradient-to-r from-uidai-saffron to-uidai-navy bg-clip-text text-transparent">
                Modules
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three integrated modules working together to provide comprehensive operational intelligence for UIDAI Telangana.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Key Insights Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full border border-uidai-saffron/10"
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-uidai-saffron/20 text-uidai-saffron rounded-full text-sm font-semibold mb-4">
                Data-Driven Discoveries
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Key Insights{' '}
                <span className="bg-gradient-to-r from-uidai-saffron to-yellow-400 bg-clip-text text-transparent">
                  Uncovered
                </span>
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Our analysis of UIDAI Telangana data revealed actionable patterns that can transform operational planning.
              </p>

              {/* Visual metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold text-uidai-saffron mb-1">2.3x</div>
                  <div className="text-white/60 text-sm">Higher urban migration ratio</div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold text-uidai-green mb-1">40%</div>
                  <div className="text-white/60 text-sm">Peak season surge</div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold text-rose-400 mb-1">3</div>
                  <div className="text-white/60 text-sm">Districts with anomalies</div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold text-purple-400 mb-1">18%</div>
                  <div className="text-white/60 text-sm">Youth update increase</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {insights.map((insight, index) => (
                <InsightCard key={index} {...insight} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-uidai-green/10 text-uidai-green rounded-full text-sm font-semibold mb-4">
              Technology Stack
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Built with Modern{' '}
              <span className="bg-gradient-to-r from-uidai-navy to-uidai-green bg-clip-text text-transparent">
                Technologies
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-uidai-navy/10 to-uidai-saffron/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <tech.icon className="w-7 h-7 text-uidai-navy" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{tech.name}</h3>
                <p className="text-sm text-slate-500">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Modules Deep Dive */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Module A */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-24"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-uidai-saffron/10 text-uidai-saffron rounded-full text-sm font-semibold mb-4">
                <Map className="w-4 h-4" />
                Module A
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Migration Analysis</h3>
              <p className="text-lg text-slate-600 mb-6">
                Interactive choropleth visualization of migration patterns using address update ratios to identify population movement trends.
              </p>
              <ul className="space-y-3">
                {['Update ratio calculation (Address/Enrolments)', 'Migration intensity scoring', 'Interactive Telangana district map', 'Trend analysis over time'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <CheckCircle className="w-5 h-5 text-uidai-saffron flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-uidai-saffron/5 to-uidai-green/5 rounded-3xl p-8 border border-slate-200"
              >
                <div className="h-64 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="relative"
                  >
                    <Map className="w-32 h-32 text-uidai-saffron/30" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      className="absolute top-8 left-12 w-6 h-6 bg-uidai-green rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1.3, 1, 1.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                      className="absolute top-16 right-8 w-4 h-4 bg-uidai-saffron rounded-full"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Module B */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center mb-24"
          >
            <div className="order-2 lg:order-1 relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-uidai-navy/5 to-uidai-saffron/5 rounded-3xl p-8 border border-slate-200"
              >
                <div className="h-64 flex items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="relative"
                  >
                    <LineChart className="w-32 h-32 text-uidai-navy/30" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-uidai-saffron rounded-full flex items-center justify-center"
                    >
                      <TrendingUp className="w-4 h-4 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-uidai-navy/10 text-uidai-navy rounded-full text-sm font-semibold mb-4">
                <BarChart3 className="w-4 h-4" />
                Module B
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Workload Forecasting</h3>
              <p className="text-lg text-slate-600 mb-6">
                Leverage exponential smoothing and time-series analysis to predict future Aadhaar enrolment volumes with high accuracy.
              </p>
              <ul className="space-y-3">
                {['Age trigger analysis (5 & 15 year mandates)', 'District-wise projections', 'Seasonal pattern recognition', 'Resource allocation recommendations'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <CheckCircle className="w-5 h-5 text-uidai-green flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Module C */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-semibold mb-4">
                <AlertTriangle className="w-4 h-4" />
                Module C
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Anomaly Detection</h3>
              <p className="text-lg text-slate-600 mb-6">
                Real-time statistical analysis to detect outliers, gender imbalances, and unusual patterns requiring immediate attention.
              </p>
              <ul className="space-y-3">
                {['Gender ratio monitoring (47-53% range)', 'Volume anomaly detection', 'Age distribution analysis', 'Automated alert generation'].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-8 border border-slate-200"
              >
                <div className="h-64 flex items-center justify-center">
                  <motion.div className="relative">
                    <PieChart className="w-32 h-32 text-rose-300" />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1]
                      }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"
                    >
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-uidai-navy via-uidai-navy-dark to-slate-900 relative overflow-hidden">
        <FloatingParticles />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-uidai-saffron/5"
        />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award className="w-16 h-16 text-uidai-saffron mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform{' '}
              <span className="bg-gradient-to-r from-uidai-saffron to-yellow-400 bg-clip-text text-transparent">
                UIDAI Operations?
              </span>
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Experience the power of data-driven decision making with our comprehensive analytics dashboard.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(242, 101, 34, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="group px-10 py-5 bg-gradient-to-r from-uidai-saffron to-uidai-saffron-dark text-white font-bold text-lg rounded-2xl flex items-center gap-4 mx-auto shadow-2xl shadow-uidai-saffron/40 transition-all duration-300"
              >
                <Cpu className="w-6 h-6" />
                Launch Dashboard Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-uidai-saffron to-uidai-navy rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">UIDAI Ops-Intel</span>
            </div>
            <p className="text-slate-500 text-sm">
              Built for UIDAI Data Hackathon 2026 • Telangana State
            </p>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-sm">Powered by</span>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                <Zap className="w-4 h-4 text-uidai-saffron" />
                <span className="text-white text-sm font-medium">Next.js + FastAPI</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
