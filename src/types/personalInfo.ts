export interface SocialLink {
  label: string
  url: string
}

export interface PersonalInfo {
  name: string
  firstName: string
  lastName: string
  degree: string
  studies: string
  position: string
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
