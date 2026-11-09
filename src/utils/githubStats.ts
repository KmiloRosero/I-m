/** Public counts from a GitHub profile, shown in the experience section. */
export interface GithubStats {
  publicRepos: number
  firstRepoYear: number
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

/** The public repository count from `GET /users/{user}`, or null if the response isn't what we expect. */
export function parsePublicRepos(json: unknown): number | null {
  if (!isRecord(json)) return null
  const count = json['public_repos']
  return typeof count === 'number' && Number.isInteger(count) && count >= 0 ? count : null
}

/** The year of the oldest repository from `GET /users/{user}/repos?sort=created&direction=asc`. */
export function parseFirstRepoYear(json: unknown): number | null {
  if (!Array.isArray(json)) return null
  const [first] = json as unknown[]
  if (!isRecord(first) || typeof first['created_at'] !== 'string') return null
  const year = new Date(first['created_at']).getUTCFullYear()
  return Number.isFinite(year) ? year : null
}
