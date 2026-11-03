import { personalInfo } from '@/data/personalInfo'
import type { SocialLink } from '@/types/personalInfo'
import { getDriveDownloadUrl } from '@/utils/googleDrive'

export function getCvLinks(): SocialLink[] {
  const { cvUrl } = personalInfo
  if (!cvUrl) return []

  const downloadUrl = getDriveDownloadUrl(cvUrl)
  const viewLink = { label: 'Ver CV', url: cvUrl }
  return downloadUrl ? [viewLink, { label: 'Descargar CV', url: downloadUrl }] : [viewLink]
}

export function getProfessionalLinks(): SocialLink[] {
  return [
    { label: personalInfo.email, url: `mailto:${personalInfo.email}` },
    ...personalInfo.socialLinks,
    ...getCvLinks(),
  ]
}
