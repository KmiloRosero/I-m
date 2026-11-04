export interface SocialLink {
  label: string
  url: string
}

export interface PersonalInfo {
  name: string
  firstName: string
  lastName: string
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
