import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Code2, Server, Database, Smartphone } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../../components/shared/BrandIcons'
import hussainPhoto from '../../assets/hussain-ahmed.png'

const STACK = [
  {
    icon: Code2,
    title: 'Frontend',
    items: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Redux Toolkit', 'TanStack Query', 'Framer Motion'],
  },
  {
    icon: Server,
    title: 'Backend',
    items: ['Node.js', 'Express 5', 'Socket.io', 'JWT Auth', 'Passport / Google OAuth', 'Zod', 'Brevo Email'],
  },
  {
    icon: Database,
    title: 'Data & Cloud',
    items: ['PostgreSQL', 'Prisma 7', 'Supabase', 'Cloudinary', 'Railway', 'Vercel'],
  },
  {
    icon: Smartphone,
    title: 'App Development',
    items: ['React Native', 'Cross-platform UI', 'REST APIs', 'Real-time apps', 'Responsive design'],
  },
]

const SOCIALS = [
  { icon: GithubIcon, label: 'GitHub', value: 'github.com/hussainislive', href: 'https://github.com/hussainislive' },
  { icon: LinkedinIcon, label: 'LinkedIn', value: 'linkedin.com/in/hussainislive', href: 'https://linkedin.com/in/hussainislive' },
  { icon: Mail, label: 'Email', value: 'developer.hussain125@gmail.com', href: 'mailto:developer.hussain125@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+92 322 9817456', href: 'tel:+923229817456' },
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
      {/* Hero */}
      <section className="bg-brand-gradient py-16 md:py-20 px-5 md:px-margin-desktop">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-container mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
          <img
            src={hussainPhoto}
            alt="Hussain Ahmed"
            loading="eager"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/80 shadow-modal shrink-0"
          />
          <div className="text-center md:text-left">
            <p className="text-white/80 text-label font-semibold uppercase tracking-wide mb-2">Meet the Developer</p>
            <h1 className="text-[34px] md:text-section font-bold text-white mb-3">Hussain Ahmed</h1>
            <p className="text-white/90 text-lg font-medium mb-4">Full-Stack Software Engineer &amp; App Developer</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 text-body">
              <MapPin size={16} />
              <span>Pakistan</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section className="max-w-3xl mx-auto px-5 md:px-margin-desktop py-14">
        <motion.div {...fade}>
          <h2 className="text-2xl md:text-section font-semibold text-text-primary mb-5">About Me</h2>
          <div className="space-y-4 text-body text-text-primary/70 leading-relaxed">
            <p>
              I'm a full-stack software engineer and app developer who loves turning ideas into polished,
              production-ready products. I build fast, scalable web and mobile applications end to end — from
              database design and secure APIs to pixel-perfect, responsive user interfaces.
            </p>
            <p>
              GO Marketplace is a project I designed and built from the ground up: a complete classified-ads
              platform featuring real-time chat, authentication with Google OAuth, image uploads, an admin
              dashboard, email verification, and a clean, modern design system. It showcases the kind of
              robust, well-architected software I enjoy creating.
            </p>
            <p>
              I care deeply about clean code, great user experience, and shipping things that actually work in
              the real world. If you'd like to collaborate or just say hello, I'd love to hear from you.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white py-14 px-5 md:px-margin-desktop">
        <div className="max-w-container mx-auto">
          <motion.h2 {...fade} className="text-2xl md:text-section font-semibold text-text-primary mb-10 text-center">
            Tech Stack
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STACK.map((group, i) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="bg-background-soft rounded-card p-6"
              >
                <div className="w-12 h-12 rounded-button bg-brand-gradient flex items-center justify-center mb-5">
                  <group.icon size={22} className="text-white" />
                </div>
                <h3 className="text-card-title font-semibold text-text-primary mb-3">{group.title}</h3>
                <ul className="space-y-1.5">
                  {group.items.map(item => (
                    <li key={item} className="text-body text-text-primary/65 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-pink shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="max-w-container mx-auto px-5 md:px-margin-desktop py-14">
        <motion.h2 {...fade} className="text-2xl md:text-section font-semibold text-text-primary mb-10 text-center">
          Let's Connect
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-center gap-4 bg-white rounded-card shadow-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 rounded-button bg-brand-gradient flex items-center justify-center shrink-0">
                <s.icon size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-label font-semibold text-text-primary">{s.label}</p>
                <p className="text-body text-text-primary/60 truncate">{s.value}</p>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div {...fade} className="text-center mt-10">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center h-12 px-8 rounded-button bg-brand-gradient text-white font-semibold text-body shadow-card hover:shadow-card-hover hover:brightness-105 transition-all active:scale-95"
          >
            Get in Touch
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
