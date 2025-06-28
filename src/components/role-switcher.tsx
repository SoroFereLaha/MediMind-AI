'use client';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/app-context';

export function RoleSwitcher() {
  const router = useRouter();
  const { setUserRole } = useAppContext();

  const switchRole = (role: 'patient' | 'medecin') => {
    // Mets à jour le contexte global
    setUserRole(role);

    // Cookie valable 1 jour sur tout le site
    document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24}`;

    // Redirige vers la racine du rôle
    router.replace(role === 'medecin' ? '/medecin' : '/');
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => switchRole('patient')}
        className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Je suis patient
      </button>
      <button
        onClick={() => switchRole('medecin')}
        className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:opacity-90 transition"
      >
        Je suis médecin
      </button>
    </div>
  );
}
