import { homeMetadata } from '@/utils/siteMetadata'
import { HomeView } from '@/views/HomeView'

export const metadata = homeMetadata('es')

export default function HomePage() {
  return <HomeView locale="es" />
}
