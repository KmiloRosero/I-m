import { blogIndexMetadata } from '@/utils/siteMetadata'
import { BlogIndexView } from '@/views/BlogIndexView'

export const metadata = blogIndexMetadata('en')

export default function BlogPage() {
  return <BlogIndexView locale="en" />
}
