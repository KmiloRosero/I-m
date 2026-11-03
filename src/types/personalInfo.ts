export interface SocialLink {
  label: string
  url: string
}

export interface PersonalInfo {
  name: string
  role: string
  semester: string
  university: string
  location: string
  email: string
  socialLinks: readonly SocialLink[]
  cvUrl: string | null
}
