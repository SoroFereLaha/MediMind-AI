
import { PageHeader } from '@/components/page-header';
import { Pill } from 'lucide-react';
import { MedicationForm } from './medication-form';

export default function MedicationPage() {
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
    