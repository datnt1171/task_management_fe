"use client"

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from "@/i18n/navigation"
import { Select, SelectItem } from "@/components/ui/select"
import { languages } from "@/constants/navigation"

export function LanguageSelector() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale })
  }

  return (
    <div className="w-32">
      <Select
        value={locale}
        onValueChange={handleLanguageChange}
        className="h-8"
      >
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}