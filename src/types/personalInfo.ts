export interface SocialLink {
  label: string
  url: string
}

export interface PostalAddress {
  locality: string
  region: string
  /** ISO 3166-1 alpha-2 code. */
  country: string
}

export interface PersonalInfo {
  name: string
  /** The name on GitHub and LinkedIn, so searches for it find this site. */
  alternateName: string
  firstName: string
  lastName: string
  /** Browser-tab and search-result title of the home page. */
  seoTitle: string
  /** Portrait used on the hero laptop and in structured data. */
  photoSrc: string
  address: PostalAddress
  degree: string
  /** Technical high-school degree already completed. */
  technicalDegree: string
  title: string
  /** Roles the hero morphs through after the name; `\n` marks the line break. */
  heroRoles: readonly string[]
  studies: string
  position: string
  /** Short status shown in the hero, e.g. availability for work. */
  availability: string
  /** wa.me link for WhatsApp; the hero shows a WhatsApp button only when set. */
  whatsappUrl: string | null
  semester: string
  university: string
  location: string
  email: string
  metaDescription: string
  introduction: string
  about: string
  personality: string
  workStyle: string
  interests: readonly string[]
  ambition: string
  featuredStack: readonly string[]
  socialLinks: readonly SocialLink[]
  cvUrl: string | null
}
