import Link from 'next/link';
export const metadata = {
  title: 'Accès refusé',
};

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center p-6 space-y-6">
      <div className="text-7xl animate-bounce">🚫</div>
      <h1 className="text-4xl font-extrabold">Oups&nbsp;! Accès refusé</h1>
      <p className="text-lg max-w-md">Il semble que vous ayez pris un mauvais chemin&nbsp;!<br/>Cette zone est réservée à un autre rôle.</p>
      <Link
        href="/"
        className="inline-block px-5 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
