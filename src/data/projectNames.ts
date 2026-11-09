import { perLocale, translator } from '@/i18n/config'

export const getProjectNames = perLocale((locale) => {
  const t = translator(locale)
  return {
    biomedical: 'Biomedical Waste Platform',
    cineTracker: 'CineTracker',
    mercaJusto: 'MercaJusto',
    moniWatch: 'MoniWatch',
    portfolio: t('Este portafolio', 'This portfolio'),
    reticula: 'Retícula',
  } as const
})
