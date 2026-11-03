import { CurrentYear } from '@/components/layout/CurrentYear'
import { profile } from '@/data/profile'

export function SiteFooter() {
  return (
    <footer className="flex flex-wrap justify-between gap-x-8 gap-y-1 bg-black px-4 py-6 text-white sm:px-8">
      <p>
        © <CurrentYear /> {profile.name}
      </p>
      <p>{profile.location}</p>
    </footer>
  )
}
