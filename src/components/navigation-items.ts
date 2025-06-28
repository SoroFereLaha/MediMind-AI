import { Bot, FileText, Briefcase, Home, Users, ShieldCheck, LayoutDashboard } from 'lucide-react';
import type { UserRole } from '@/contexts/app-context';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: 'exact' | 'startsWith';
  roles?: UserRole[];
}

// ===================================
// Patient Navigation (Refactored)
// ===================================
const patientNavItems: NavItem[] = [
  {
    label: 'Assistant Santé',
    href: '/health-assistant',
    icon: Bot,
    match: 'startsWith',
    roles: ['patient'],
  },

  {
    label: 'Médicaments',
    href: '/medications',
    icon: Briefcase,
    match: 'startsWith',
    roles: ['patient'],
  },
];

// ===================================
// Doctor Navigation (Unchanged)
// ===================================
const medecinNavItems: NavItem[] = [
  {
    label: 'Tableau de Bord',
    href: '/medecin',
    icon: LayoutDashboard,
    match: 'exact',
    roles: ['medecin'],
  },
  {
    label: 'Gérer Patients',
    href: '/medecin/patients',
    icon: Users,
    match: 'startsWith',
    roles: ['medecin'],
  },
  {
    label: 'Recherche Documents',
    href: '/medecin/recherche-documents',
    icon: FileText,
    match: 'startsWith',
    roles: ['medecin'],
  },
];

// ===================================
// Common & Footer Links
// ===================================
const commonNavItems: NavItem[] = [
  {
    label: 'Confidentialité',
    href: '/privacy',
    icon: ShieldCheck,
    match: 'exact',
  },
];

// ===================================
// Exported Functions
// ===================================
export const getNavigationItems = (role: UserRole): NavItem[] => {
  if (role === 'patient') {
    return patientNavItems;
  }
  if (role === 'medecin') {
    return medecinNavItems;
  }
  // Default to patient view if no specific role or unauthenticated
  return patientNavItems;
};

export const getFooterNavigationItems = (): NavItem[] => {
  return commonNavItems;
};
