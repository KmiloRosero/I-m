import { profile } from '../../data/profile'

const contactLinks = [
  { href: `mailto:${profile.email}`, label: profile.email },
  { href: profile.githubUrl, label: 'GitHub' },
  { href: profile.linkedinUrl, label: 'LinkedIn' },
] as const

export function ContactSection() {
  return (
    <footer aria-labelledby="contact-title" className="px-4 pb-10 pt-20 sm:px-8" id="contacto">
      <h2 className="text-2xl font-semibold [font-stretch:125%]" id="contact-title">
        Contacto
      </h2>
      <ul className="mt-6 flex flex-col gap-2 text-xl">
        {contactLinks.map(({ href, label }) => (
          <li key={href}>
            <a className="text-link" href={href}>
              {label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-16 text-base text-mist">{profile.location}</p>
    </footer>
  )
}
