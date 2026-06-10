import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Mail, Phone, Send } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../../components/shared/BrandIcons'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Seo } from '../../components/shared/Seo'
import { useSendContact } from '../../api/contact'
import { contactSchema } from '../../utils/validation'
import type { ContactValues } from '../../utils/validation'
import { cn, apiErrorMessage } from '../../utils/format'

const INFO = [
  { icon: Mail, label: 'Email', value: 'developer.hussain125@gmail.com', href: 'mailto:developer.hussain125@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+92 322 9817456', href: 'tel:+923229817456' },
  { icon: GithubIcon, label: 'GitHub', value: 'github.com/hussainislive', href: 'https://github.com/hussainislive' },
  { icon: LinkedinIcon, label: 'LinkedIn', value: 'linkedin.com/in/hussainislive', href: 'https://linkedin.com/in/hussainislive' },
]

export default function ContactPage() {
  const sendMut = useSendContact()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(values: ContactValues) {
    try {
      await sendMut.mutateAsync(values)
      toast.success("Message sent! We'll get back to you soon.")
      reset()
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not send your message. Please try again.'))
    }
  }

  return (
    <div>
      <Seo
        title="Contact Us"
        description="Get in touch with the GO Marketplace team. Send us a message with your questions, feedback, or partnership ideas."
        path="/contact"
      />
      {/* Hero */}
      <section className="bg-brand-gradient py-16 px-5 md:px-margin-desktop text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-container mx-auto"
        >
          <h1 className="text-[34px] md:text-section font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-white/85 text-lg max-w-xl mx-auto">
            Have a question, feedback, or just want to say hello? Send us a message and we'll reply soon.
          </p>
        </motion.div>
      </section>

      <section className="max-w-container mx-auto px-5 md:px-margin-desktop py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 space-y-4"
          >
            <h2 className="text-card-title font-semibold text-text-primary mb-4">Contact Information</h2>
            {INFO.map(item => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-4 bg-white rounded-card shadow-card p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
              >
                <div className="w-11 h-11 rounded-button bg-brand-gradient flex items-center justify-center shrink-0">
                  <item.icon size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-label font-semibold text-text-primary">{item.label}</p>
                  <p className="text-body text-text-primary/60 truncate">{item.value}</p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3 bg-white rounded-card shadow-card p-6 md:p-8"
          >
            <h2 className="text-card-title font-semibold text-text-primary mb-6">Send a Message</h2>
            <form onSubmit={e => void handleSubmit(onSubmit)(e)} className="space-y-4">
              <Input label="Your name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
              <Input
                label="Your email"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <div className="w-full">
                <label htmlFor="message" className="block text-label font-semibold text-text-primary mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Write your message here…"
                  className={cn(
                    'w-full rounded-input bg-background-soft text-body text-text-primary p-4 resize-y',
                    'border transition-all duration-150 placeholder:text-text-primary/40',
                    'focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink',
                    errors.message
                      ? 'border-status-error focus:ring-status-error/30 focus:border-status-error'
                      : 'border-border'
                  )}
                  {...register('message')}
                />
                {errors.message && <p className="mt-1.5 text-caption text-status-error">{errors.message.message}</p>}
              </div>
              <Button type="submit" fullWidth size="lg" loading={sendMut.isPending} rightIcon={<Send size={18} />}>
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
