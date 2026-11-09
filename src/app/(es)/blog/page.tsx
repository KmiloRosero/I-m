import { blogIndexMetadata } from '@/utils/siteMetadata'
import { BlogIndexView } from '@/views/BlogIndexView'

export const metadata = blogIndexMetadata('es')

export default function BlogPage() {
  return <BlogIndexView locale="es" />
}
