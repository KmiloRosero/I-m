import { perLocale, translator } from '@/i18n/config'

export interface ProcessStep {
  title: string
  description: string
}

/** How a freelance project goes, from the first message to launch. */
export const getProcess = perLocale((locale) => {
  const t = translator(locale)
  return {
    title: t('Cómo trabajo', 'How I work'),
    lead: t('Del primer mensaje a tu proyecto en línea.', 'From the first message to your project going live.'),
    cta: t('Cuéntame tu proyecto', 'Tell me about your project'),
    steps: [
      {
        title: t('Hablamos', 'We talk'),
        description: t(
          'Me cuentas qué necesitas y para quién es. Pregunto lo necesario para entender tu negocio.',
          "You tell me what you need and who it's for. I ask what I need to understand your business.",
        ),
      },
      {
        title: t('Propuesta', 'Proposal'),
        description: t(
          'Te envío qué voy a construir, en cuánto tiempo y cuánto cuesta, antes de empezar.',
          "I send you what I'll build, how long it will take and what it costs, before I start.",
        ),
      },
      {
        title: t('Construcción', 'Build'),
        description: t(
          'Desarrollo por partes y te muestro avances, para que opines mientras se construye.',
          'I build it in parts and show you progress, so you can give feedback along the way.',
        ),
      },
      {
        title: t('Entrega', 'Launch'),
        description: t(
          'Publico el proyecto, te explico cómo usarlo y queda en línea para tus clientes.',
          'I publish the project, show you how to use it, and it goes live for your customers.',
        ),
      },
    ] satisfies ProcessStep[],
  }
})
