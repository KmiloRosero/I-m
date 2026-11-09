import { ExperienceTimeline } from '@/components/experience/ExperienceTimeline'
import { Section } from '@/components/ui/Section'
import { getExperience, getExperienceGroups } from '@/data/experience'
import { getGithubStats } from '@/data/github'
import type { Locale } from '@/i18n/config'
import { getMessages } from '@/i18n/messages'

export async function ExperienceSection({ locale }: { locale: Locale }) {
  const entries = getExperience(locale)
  const github = await getGithubStats()
  const copy = getMessages(locale).experience
  const liveSites = new Set(
    entries.flatMap((entry) => entry.links.filter((link) => link.kind === 'demo').map((link) => link.href)),
  ).size
  const stats = [
    { value: String(github.firstRepoYear), label: copy.firstRepo },
    { value: String(github.publicRepos), label: copy.publicRepos },
    { value: String(liveSites), label: copy.liveProjects },
  ]

  return (
    <Section locale={locale} section="experience" titleAlign="center" tone="white">
      <p className="lead-text mx-auto mt-6 max-w-text text-center">{copy.intro}</p>
      <dl className="xp-stats">
        {stats.map(({ value, label }) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd className="xp-stat-value">{value}</dd>
            <dd aria-hidden="true" className="xp-stat-label">
              {label}
            </dd>
          </div>
        ))}
      </dl>
      <ExperienceTimeline entries={entries} groups={getExperienceGroups(locale)} />
    </Section>
  )
}
