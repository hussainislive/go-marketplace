import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail,
  ArrowRight,
  Puzzle,
  Gauge,
  Palette,
  Code2,
  FileCode2,
  Server,
  Database,
  Cloud,
  Smartphone,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../../components/shared/BrandIcons'
import { Seo } from '../../components/shared/Seo'
import hussainPhoto from '../../assets/hussain-ahmed.png'

const GITHUB_URL = 'https://github.com/hussainislive'
const LINKEDIN_URL = 'https://linkedin.com/in/hussainislive'
const EMAIL = 'developer.hussain125@gmail.com'

const STATS = [
  { value: '3+', label: 'Years Exp' },
  { value: '30+', label: 'Projects' },
  { value: '5', label: 'Mobile Apps' },
  { value: '10x', label: 'AI-Powered' },
]

const STRENGTHS = [
  { icon: Puzzle, title: 'Problem Solver', desc: 'Tackling complex architectural challenges with elegant, scalable solutions.' },
  { icon: Gauge, title: 'Shipping Fast', desc: 'Balancing speed with quality to deliver value to users rapidly and reliably.' },
  { icon: Palette, title: 'Design-Driven', desc: 'Obsessing over micro-interactions, typography, and visual hierarchy.' },
]

const STACK = [
  { icon: Code2, label: 'React 19' },
  { icon: FileCode2, label: 'TypeScript' },
  { icon: Palette, label: 'Tailwind CSS' },
  { icon: Server, label: 'Node.js / Express' },
  { icon: Database, label: 'PostgreSQL / Prisma' },
  { icon: Cloud, label: 'Vercel / Railway' },
  { icon: Smartphone, label: 'React Native' },
]

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.4 },
}

export default function DeveloperPage() {
  return (
    <div>
      <Seo
        title="About the Developer"
        description="Meet Hussain Ahmed — the full-stack software engineer and mobile app developer behind GO Marketplace. Built with React, TypeScript, Node.js, Prisma and more."
        path="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Hussain Ahmed',
          jobTitle: 'Full-Stack Software Engineer & Mobile App Developer',
          url: 'https://go-marketplace-rouge.vercel.app/about',
          sameAs: [GITHUB_URL, LINKEDIN_URL],
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden py-16 pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-pink/5 via-brand-purple/5 to-background pointer-events-none" />
        <div className="max-w-container mx-auto px-5 md:px-margin-desktop w-full relative z-10 grid md:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <span className="text-caption font-bold tracking-widest uppercase text-brand-gradient mb-3 block">
                Meet The Developer
              </span>
              <h1 className="text-[34px] md:text-section font-extrabold leading-tight tracking-tight text-text-primary mb-3">
                Hussain Ahmed
              </h1>
              <p className="text-lg text-text-primary/60 max-w-xl leading-relaxed">
                Full-Stack Software Engineer &amp; Mobile App Developer building polished, scalable experiences.
                I believe in software that feels magical to use.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-badge font-semibold border-2 border-brand-pink text-brand-pink hover:bg-brand-pink/5 transition-colors flex items-center gap-2 text-body active:scale-95"
              >
                View GitHub <ArrowRight size={18} />
              </a>
              <Link
                to="/contact"
                className="px-6 py-2.5 rounded-badge font-semibold bg-brand-gradient text-white shadow-card hover:shadow-card-hover hover:brightness-105 transition-all flex items-center gap-2 text-body active:scale-95"
              >
                Let's Connect <Mail size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Right — photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex justify-center md:justify-end items-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-pink/20 to-brand-purple/20 rounded-full blur-2xl animate-pulse" />
              <div className="w-52 h-52 md:w-64 md:h-64 rounded-full border-4 border-white shadow-modal overflow-hidden relative z-10 ring-4 ring-border/50">
                <img src={hussainPhoto} alt="Hussain Ahmed" loading="eager" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-3 right-2 md:bottom-6 md:-right-4 z-20">
                <div className="bg-white px-4 py-2 rounded-badge shadow-card flex items-center gap-2 border border-border">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
                  <span className="font-semibold text-caption text-text-primary">Available for Hire</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats + Core Strengths */}
      <section className="py-12 border-y border-border bg-background-soft">
        <div className="max-w-container mx-auto px-5 md:px-margin-desktop">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Stats */}
            <motion.div {...fade} className="grid grid-cols-2 gap-6 sm:gap-8">
              {STATS.map(stat => (
                <div key={stat.label} className="space-y-1">
                  <div className="text-[32px] font-extrabold text-brand-gradient leading-none">{stat.value}</div>
                  <div className="text-caption font-semibold text-text-primary/60 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Core Strengths */}
            <motion.div {...fade} className="space-y-4 md:border-l border-border md:pl-8">
              {STRENGTHS.map(s => (
                <div key={s.title} className="flex items-start gap-4">
                  <s.icon size={22} className="text-brand-pink mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-text-primary">{s.title}</h3>
                    <p className="text-body text-text-primary/60">{s.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-background">
        <div className="max-w-container mx-auto px-5 md:px-margin-desktop">
          <motion.div {...fade} className="text-center mb-10">
            <h2 className="text-2xl md:text-section font-extrabold mb-2 text-text-primary">Tech Stack</h2>
            <p className="text-text-primary/55 text-body">The tools I use to build digital experiences.</p>
          </motion.div>
          <motion.div {...fade} className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {STACK.map(item => (
              <div
                key={item.label}
                className="px-4 py-2 bg-background-soft border border-border rounded-badge text-body font-medium flex items-center gap-2"
              >
                <item.icon size={18} className="text-brand-pink" />
                {item.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Let's Build Something Together */}
      <section className="py-16 bg-background-soft border-t border-border">
        <div className="max-w-4xl mx-auto px-5 md:px-margin-desktop text-center">
          <motion.h2 {...fade} className="text-2xl md:text-section font-extrabold mb-4 text-text-primary">
            Let's Build Something <span className="text-brand-gradient">Together</span>
          </motion.h2>
          <motion.p {...fade} className="text-text-primary/60 mb-8 max-w-xl mx-auto text-body">
            I'm always open to discussing new projects, creative ideas, or opportunities.
          </motion.p>
          <motion.div {...fade} className="flex flex-wrap justify-center gap-4 mb-8">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-button hover:border-brand-pink/50 transition-colors text-body font-medium"
            >
              <GithubIcon size={18} className="text-text-primary/70" /> GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-button hover:border-brand-purple/50 transition-colors text-body font-medium"
            >
              <LinkedinIcon size={18} className="text-text-primary/70" /> LinkedIn
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-button hover:border-brand-pink/50 transition-colors text-body font-medium"
            >
              <Mail size={18} className="text-text-primary/70" /> Email
            </a>
          </motion.div>
          <motion.div {...fade}>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-badge font-bold text-white bg-brand-gradient shadow-card hover:shadow-card-hover hover:brightness-105 transition-all text-body active:scale-95"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
