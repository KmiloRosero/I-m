import { CurrentYear } from '@/components/layout/CurrentYear'
import { personalInfo } from '@/data/personalInfo'

export function SiteFooter() {
  return (
    <footer className="bg-black px-gutter py-6 text-white">
      <div className="mx-auto flex max-w-content flex-wrap justify-between gap-x-8 gap-y-1">
        <p>
          © <CurrentYear /> {personalInfo.name}
        </p>
        <p>{personalInfo.location}</p>
      </div>
    </footer>
  )
}
