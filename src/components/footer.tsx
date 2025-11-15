// components/Footer.tsx
import Link from 'next/link';
import { Linkedin, Facebook, Instagram, Youtube } from 'lucide-react';

// --- Data for Link Columns ---

const coreLinks = [
  { href: '/student', label: 'Students' },
  { href: '/partners/recruit', label: 'Recruitment Partners' },
  { href: '/partners/institution', label: 'Partner Institutions' },
];

const exploreLinks = [
  { href: '/search', label: 'Find Programs & Institutions' }, // 
  { href: '/solutions', label: '360 Solutions' }, // 
];

const destinationLinks = [
  // 
  { href: '/destinations/australia', label: 'Australia' },
  { href: '/destinations/canada', label: 'Canada' },
  { href: '/destinations/germany', label: 'Germany' },
  { href: '/destinations/ireland', label: 'Ireland' },
  { href: '/destinations/uk', label: 'United Kingdom' },
  { href: '/destinations/us', label: 'United States' },
];

const aboutLinks = [
  // 
  { href: '/about', label: 'Our Story' },
  { href: '/careers', label: 'Careers' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

// --- Helper Component ---

const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) => (
  <div>
    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
      {title}
    </h3>
    <ul className="mt-4 space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

// --- Main Footer Component ---

export default function Footer() {
  return (
    // Use bg-card for a slight contrast from the main bg-background
    <footer
      className="bg-card text-foreground border-t border-border"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      {/* --- Main Footer --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-8">
          {/* Col 1: Logo, Address, Socials (Spans 2 cols) */}
          <div className="col-span-2 sm:col-span-4 md:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold"
              style={{ color: 'var(--primary)' }}
            >
              CEDU
            </Link>
            <p className="text-sm text-muted-foreground mt-4 max-w-xs">
              101 Frederick St, Kitchener, ON N2H 6R2 
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-5 mt-6">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Core Links */}
          <FooterLinkColumn title="Platform" links={coreLinks} />

          {/* Col 3: Explore */}
          <FooterLinkColumn title="Explore" links={exploreLinks} />

          {/* Col 4: Destinations */}
          <FooterLinkColumn title="Destinations" links={destinationLinks} />

          {/* Col 5: Company (About/Resources) */}
          <FooterLinkColumn title="Company" links={aboutLinks} />
        </div>
      </div>

      {/* --- Bottom Bar (Copyright & Legal) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-border">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CEDU Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal"
              className="hover:text-foreground transition-colors"
            >
              Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}