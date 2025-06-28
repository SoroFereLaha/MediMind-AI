'use client';

import Image from 'next/image';

export function HomePageImage() {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 lg:mt-0">
      <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-2xl opacity-60 dark:opacity-40"></div>
      <div className="relative w-full h-auto bg-white dark:bg-transparent rounded-full overflow-hidden shadow-xl ring-1 ring-gray-900/5">
        <Image
          src="/img/10183033.jpg" // J'utilise une des images trouvées. A ajuster si ce n'est pas la bonne.
          alt="Illustration d'un médecin et d'un patient"
          width={1024}
          height={1024}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105 dark:brightness-90"
          priority
        />
      </div>
    </div>
  );
}
