
import type { LucideIcon } from 'lucide-react';
import { Home, UserCheck, BrainCircuit, MessageSquareHeart, ShieldCheck, Pill } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: 'exact' | 'startsWith';
}

export const getNavigationItems = (): NavItem[] => [
  {
    label: "Accueil",
    href: '/',
    icon: Home,
    match: 'exact',
  },
  {
    label: "Entretien Patient",
    href: '/interview',
    icon: UserCheck,
    match: 'startsWith',
  },
  {
    label: "Avis de Spécialistes",
    href: '/insights',
    icon: BrainCircuit,
    match: 'startsWith',
  },
  {
    label: "Recommandations (IA Générale)",
    href: '/recommendations',
    icon: MessageSquareHeart,
    match: 'startsWith',
  },
  {
    label: "Suggestions Médicaments (IA)",
    href: '/medications',
    icon: Pill,
    match: 'startsWith',
  }
];

export const getFooterNavigationItems = (): NavItem[] => [
    {
        label: "Confidentialité des Données",
        href: '/privacy',
        icon: ShieldCheck,
        match: 'exact',
    }
];
    