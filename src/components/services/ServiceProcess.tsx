import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { getProcess } from '@/data/process'
import type { Locale } from '@/i18n/config'
import { sectionId } from '@/i18n/paths'

type StepStyle = CSSProperties & Record<'--step-index', number>

/** Four numbered steps under the services, ending in a call to get in touch. */
export function ServiceProcess({ locale }: { locale: Locale }) {
  const process = getProcess(locale)

  return (
    <section aria-labelledby="process-title" className="process">
      <div className="process-head">
        <h3 className="process-title" id="process-title">
          {process.title}
        </h3>
        <p className="process-lead">{process.lead}</p>
      </div>

      <ol className="process-steps">
        {process.steps.map((step, index) => (
          <li className="process-step" key={step.title} style={{ '--step-index': index } as StepStyle}>
            <span aria-hidden="true" className="process-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h4 className="process-step-title">{step.title}</h4>
            <p className="process-step-text">{step.description}</p>
          </li>
        ))}
      </ol>

      <a className="button-link process-cta" data-variant="primary" href={`#${sectionId('contact', locale)}`}>
        {process.cta}
        <ArrowRight aria-hidden="true" className="process-cta-arrow" />
      </a>
    </section>
  )
}
