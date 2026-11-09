import { ExternalAwareLink } from '@/components/common/ExternalAwareLink'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'
import type { Project } from '@/types/project'

export function ProjectLinks({ locale, project }: { locale: Locale; project: Project }) {
  const links = [
    { label: project.demoLabel, url: project.demoUrl },
    { label: project.repoLabel, url: project.repoUrl },
    { label: getMessages(locale).projects.backendCode, url: project.extraRepoUrl },
  ]

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-1">
      {links.map(({ label, url }) =>
        url ? (
          <li key={url}>
            <ExternalAwareLink context={project.name} label={label} locale={locale} url={url} />
          </li>
        ) : null,
      )}
    </ul>
  )
}
