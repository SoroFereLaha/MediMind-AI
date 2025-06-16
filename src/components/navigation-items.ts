
import type { LucideIcon } from 'lucide-react';
import { Home, UserCheck, BrainCircuit, MessageSquareHeart, ShieldCheck, Stethoscope, Users, FilePlus, LayoutDashboard } from 'lucide-react';
import type { UserRole } from '@/contexts/app-context';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: 'exact' | 'startsWith';
  roles?: UserRole[]; // undefined means visible to all (even if no role selected)
}

const commonNavItems: NavItem[] = [
   {
    label: "Confidentialité", // Renamed for clarity as it's common
    href: '/privacy',
    icon: ShieldCheck,
    match: 'exact',
  }
];

const patientNavItems: NavItem[] = [
  {
    label: "Accueil Patient",
    href: '/', // Assuming patient home is root
    icon: Home,
    match: 'exact',
    roles: ['patient']
  },
  {
    label: "Entretien Patient",
    href: '/interview',
    icon: UserCheck,
    match: 'startsWith',
    roles: ['patient']
  },
  {
    label: "Avis de Spécialistes",
    href: '/insights',
    icon: BrainCircuit,
    match: 'startsWith',
    roles: ['patient']
  },
  {
    label: "Trouver un Médecin",
    href: '/find-doctor',
    icon: Stethoscope,
    match: 'startsWith',
    roles: ['patient']
  },
  {
    label: "Recommandations (IA)",
    href: '/recommendations',
    icon: MessageSquareHeart,
    match: 'startsWith',
    roles: ['patient']
  }
];

const medecinNavItems: NavItem[] = [
  {
    label: "Tableau de Bord",
    href: '/medecin',
    icon: LayoutDashboard,
    match: 'exact',
    roles: ['medecin']
  },
  {
    label: "Gérer Patients",
    href: '/medecin/patients',
    icon: Users,
    match: 'startsWith',
    roles: ['medecin']
  },
  {
    label: "Nouvelle Fiche Suivi",
    href: '/medecin/patients/nouveau',
    icon: FilePlus,
    match: 'exact',
    roles: ['medecin']
  },
];


export const getNavigationItems = (role: UserRole): NavItem[] => {
  if (role === 'patient') {
    return patientNavItems;
  }
  if (role === 'medecin') {
    return medecinNavItems;
  }
  // If no role or unknown role, show minimal/public items or patient items by default
  // For now, let's default to patient view if no specific role or unauthenticated
  return patientNavItems; 
};

export const getFooterNavigationItems = (role: UserRole): NavItem[] => {
  // Footer items could also be role-dependent if needed
  // For now, common privacy link for all
  return commonNavItems;
};
