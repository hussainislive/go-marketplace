import { ShieldCheck, FileText } from 'lucide-react'
import { Seo } from '../../components/shared/Seo'

const PRIVACY = [
  {
    heading: 'Information We Collect',
    body: 'We collect information you provide directly — such as your name, email, phone number, and listing details — as well as data generated through your use of the platform, including messages, favorites, and activity logs.',
  },
  {
    heading: 'How We Use Your Information',
    body: 'Your information is used to operate and improve GO Marketplace: to create and manage your account, display your listings, enable messaging between buyers and sellers, send verification and notification emails, and keep the platform safe.',
  },
  {
    heading: 'Data Storage & Security',
    body: 'Passwords are hashed with bcrypt and never stored in plain text. Authentication uses secure JSON Web Tokens. Media is stored on Cloudinary and data on a managed PostgreSQL database. We apply industry-standard security headers and rate limiting across all endpoints.',
  },
  {
    heading: 'Sharing Your Information',
    body: 'We do not sell your personal data. Limited information (such as your name and listings) is visible to other users to facilitate transactions. We only share data with trusted service providers required to run the platform.',
  },
  {
    heading: 'Your Rights',
    body: 'You can view, update, or delete your profile information at any time from your account settings. You may also request deletion of your account, which removes your listings and associated data.',
  },
]

const TERMS = [
  {
    heading: 'Acceptance of Terms',
    body: 'By accessing or using GO Marketplace, you agree to these terms. If you do not agree, please do not use the platform.',
  },
  {
    heading: 'User Accounts',
    body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must verify your email before posting listings. Accounts that violate these terms may be suspended or banned.',
  },
  {
    heading: 'Listings & Conduct',
    body: 'You agree to post accurate listings and to not list prohibited, illegal, counterfeit, or misleading items. Harassment, spam, fraud, and abusive behavior toward other users are strictly prohibited and may result in removal.',
  },
  {
    heading: 'Transactions',
    body: 'GO Marketplace is a platform that connects buyers and sellers. We are not a party to transactions and do not guarantee the quality, safety, or legality of items. Always meet in safe public places and inspect items before paying.',
  },
  {
    heading: 'Limitation of Liability',
    body: 'GO Marketplace is provided "as is" without warranties of any kind. We are not liable for any damages arising from transactions between users or from your use of the platform.',
  },
]

function Section({ items }: { items: { heading: string; body: string }[] }) {
  return (
    <div className="space-y-6">
      {items.map(item => (
        <div key={item.heading}>
          <h3 className="text-card-title font-semibold text-text-primary mb-2">{item.heading}</h3>
          <p className="text-body text-text-primary/65 leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-margin-desktop py-12">
      <Seo
        title="Privacy Policy & Terms of Use"
        description="Read the GO Marketplace Privacy Policy and Terms of Use covering data collection, security, user conduct, and your rights."
        path="/legal"
      />
      <h1 className="text-2xl md:text-section font-bold text-text-primary mb-2">Privacy Policy & Terms of Use</h1>
      <p className="text-body text-text-primary/55 mb-10">Last updated: June 2026</p>

      <div className="bg-white rounded-card shadow-card p-6 md:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-button bg-brand-gradient flex items-center justify-center shrink-0">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Privacy Policy</h2>
        </div>
        <Section items={PRIVACY} />
      </div>

      <div className="bg-white rounded-card shadow-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-button bg-brand-gradient flex items-center justify-center shrink-0">
            <FileText size={22} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Terms of Use</h2>
        </div>
        <Section items={TERMS} />
      </div>

      <p className="text-caption text-text-primary/50 text-center mt-10">
        Questions about these policies? <a href="/contact" className="text-brand-pink hover:underline">Contact us</a>.
      </p>
    </div>
  )
}
