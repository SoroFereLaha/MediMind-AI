
'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

const displayLocales = [ // Pour l'affichage, même si la fonctionnalité est désactivée
  { code: 'fr', name: "Français" },
  { code: 'en', name: "Anglais" },
  { code: 'ar', name: "Arabe" },
];

export function LanguageSwitcher() {
  const toggleLanguageLabel = "Changer de langue";
  const currentDisplayLocale = "Français"; // Puisque l'application est maintenant en français uniquement

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={toggleLanguageLabel} disabled>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{toggleLanguageLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {displayLocales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            disabled // La sélection de langue est désactivée
          >
            {loc.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
