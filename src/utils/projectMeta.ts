import type { Project } from '@/types/project'

export function getProjectMeta({ platform, status }: Project): string {
  return status ? `${platform}. ${status}` : platform
}
