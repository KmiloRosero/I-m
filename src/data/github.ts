import { GITHUB_PROFILE_URL } from '@/data/personalInfo'
import { parseFirstRepoYear, parsePublicRepos, type GithubStats } from '@/utils/githubStats'

const USERNAME = new URL(GITHUB_PROFILE_URL).pathname.slice(1)
const API = `https://api.github.com/users/${USERNAME}`
/** Refresh the counts once a day; the page stays static in between. */
const REVALIDATE_SECONDS = 86_400

/** Last known values, shown if GitHub can't be reached or rate-limits the build. */
const FALLBACK: GithubStats = { publicRepos: 36, firstRepoYear: 2024 }

async function githubJson(path: string): Promise<unknown> {
  const token = process.env['GITHUB_TOKEN']
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: REVALIDATE_SECONDS },
  })
  if (!response.ok) throw new Error(`GitHub API ${response.status}`)
  return response.json()
}

/** Live counts from the GitHub profile, falling back to the last known ones. */
export async function getGithubStats(): Promise<GithubStats> {
  const [profile, oldest] = await Promise.allSettled([
    githubJson(''),
    githubJson('/repos?sort=created&direction=asc&per_page=1&type=owner'),
  ])
  const read = <T,>(result: PromiseSettledResult<unknown>, parse: (json: unknown) => T | null): T | null =>
    result.status === 'fulfilled' ? parse(result.value) : null

  return {
    publicRepos: read(profile, parsePublicRepos) ?? FALLBACK.publicRepos,
    firstRepoYear: read(oldest, parseFirstRepoYear) ?? FALLBACK.firstRepoYear,
  }
}
