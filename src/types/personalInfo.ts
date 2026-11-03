export interface SocialLink {
  label: string
  url: string
}

export interface PersonalInfo {
  name: string
  studies: string
  position: string
  semester: string
  university: string
  location: string
  email: string
  introduction: string
  about: string
  interests: readonly string[]
  featuredStack: readonly string[]
  socialLinks: readonly SocialLink[]
  cvUrl: string | null
}
