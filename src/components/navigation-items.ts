
import type { LucideIcon } from 'lucide-react';
import { Home, UserCheck, BrainCircuit, MessageSquareHeart, ShieldCheck } from 'lucide-react';
// import type { useTranslations } from 'next-intl'; // Removed

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: 'exact' | 'startsWith';
}

// type TFunction = ReturnType<typeof useTranslations<string>>; // Removed

// Modified to not take 't' function and use hardcoded English strings
export const getNavigationItems = (): NavItem[] => [
  {
    label: "Home", // Hardcoded
    href: '/',
    icon: Home,
    match: 'exact',
  },
  {
    label: "Patient Interview", // Hardcoded
    href: '/interview',
    icon: UserCheck,
    match: 'startsWith',
  },
  {
    label: "Specialist Insights", // Hardcoded
    href: '/insights',
    icon: BrainCircuit,
    match: 'startsWith',
  },
  {
    label: "Recommendations", // Hardcoded
    href: '/recommendations',
    icon: MessageSquareHeart,
    match: 'startsWith',
  },
];

// Modified to not take 't' function and use hardcoded English strings
export const getFooterNavigationItems = (): NavItem[] => [
    {
        label: "Data Privacy", // Hardcoded
        href: '/privacy',
        icon: ShieldCheck,
        match: 'exact',
    }
];
