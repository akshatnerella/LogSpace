import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'

const navigation = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Changelog', href: '/changelog' }
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' }
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'Community', href: '/community' },
    { name: 'API', href: '/api' }
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' }
  ]
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'GitHub', href: '#', icon: Github },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'Email', href: 'mailto:hello@logspace.com', icon: Mail }
]

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-8 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 sm:mb-6 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="LogSpace" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">LogSpace</span>
            </Link>
            <p className="text-text-secondary mb-4 sm:mb-6 max-w-sm text-sm sm:text-base">
              The simplest way to build in public. Share your journey, connect with builders, and grow your projects transparently.
            </p>
            
            {/* Social links */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:border-border-hover hover:bg-surface-hover transition-colors min-h-[44px]"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Navigation links - Mobile: 2 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:col-span-2 lg:col-span-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Product</h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigation.product.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-text-secondary hover:text-foreground transition-colors text-sm sm:text-base flex items-center min-h-[44px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-text-secondary hover:text-foreground transition-colors text-sm sm:text-base flex items-center min-h-[44px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Resources</h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigation.resources.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-text-secondary hover:text-foreground transition-colors text-sm sm:text-base flex items-center min-h-[44px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
              <ul className="space-y-2 sm:space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-text-secondary hover:text-foreground transition-colors text-sm sm:text-base flex items-center min-h-[44px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-text-secondary text-xs sm:text-sm text-center sm:text-left">
            © 2024 LogSpace. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-text-secondary text-xs sm:text-sm text-center sm:text-right">
              Made with ❤️ by builders, for builders
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
