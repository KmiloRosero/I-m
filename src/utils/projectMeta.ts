import type { Project } from '@/types/project'

export function getProjectMeta({ platform, status }: Pick<Project, 'platform' | 'status'>): string {
  return status ? `${platform}. ${status}` : platform
}
