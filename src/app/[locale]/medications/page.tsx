
import { PageHeader } from '@/components/page-header';
import { Pill } from 'lucide-react';
// Importer le formulaire traduit si vous en créez un spécifique pour [locale]
// Sinon, assurez-vous que MedicationForm gère la traduction ou utilisez la version non-localisée.
// Pour cet exemple, nous supposons que MedicationForm est capable de gérer le texte via son propre mécanisme de 't' ou que la version non-localisée est acceptable.
import { MedicationForm } from '@/app/medications/medication-form';


export default function MedicationLocalePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Suggestions de Médicaments (IA)"
        description="Obtenez des suggestions de médicaments basées sur vos symptômes. CECI NE REMPLACE PAS UN AVIS MÉDICAL."
        icon={Pill}
      />
      <MedicationForm />
    </div>
  );
}

    