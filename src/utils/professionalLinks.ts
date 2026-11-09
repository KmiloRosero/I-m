import { getPersonalInfo } from '@/data/personalInfo'
import { translator, type Locale } from '@/i18n/config'
import type { SocialLink } from '@/types/personalInfo'
import { getDriveDownloadUrl } from '@/utils/googleDrive'

export function getCvLinks(locale: Locale): SocialLink[] {
  const { cvUrl } = getPersonalInfo(locale)
  if (!cvUrl) return []

  const t = translator(locale)
  const downloadUrl = getDriveDownloadUrl(cvUrl)
  const viewLink = { label: t('Ver CV', 'View CV'), url: cvUrl }
  return downloadUrl ? [viewLink, { label: t('Descargar CV', 'Download CV'), url: downloadUrl }] : [viewLink]
}

export function getProfessionalLinks(locale: Locale): SocialLink[] {
  const info = getPersonalInfo(locale)
  return [{ label: info.email, url: `mailto:${info.email}` }, ...info.socialLinks, ...getCvLinks(locale)]
}
