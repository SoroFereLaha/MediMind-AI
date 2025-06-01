
'use client';
// import { useLocale, useTranslations } from 'next-intl'; // Removed
// import { useRouter, usePathname } from 'next-intl/navigation'; // Removed
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
// import { locales } from '@/i18n'; // Removed, or keep if needed for a non-functional display

const locales = ['en', 'fr', 'ar']; // Keep for display purposes if menu items are still shown

export function LanguageSwitcher() {
  // const t = useTranslations('LanguageSwitcher'); // Removed
  // const locale = useLocale(); // Removed
  // const router = useRouter(); // Removed
  // const pathname = usePathname(); // Removed

  const toggleLanguageLabel = "Change language"; // Hardcoded
  const currentLocale = "en"; // Hardcoded default or dummy

  // const changeLocale = (nextLocale: string) => { // Functionality disabled
  //   router.replace(pathname, { locale: nextLocale });
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={toggleLanguageLabel} disabled>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{toggleLanguageLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            // onClick={() => changeLocale(loc)} // Functionality disabled
            disabled={currentLocale === loc || true} // Always disabled
          >
            {loc === 'en' && "English"}
            {loc === 'fr' && "French"}
            {loc === 'ar' && "Arabic"}
            {!['en', 'fr', 'ar'].includes(loc) && loc} 
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
