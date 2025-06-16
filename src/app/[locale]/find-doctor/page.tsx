
import { PageHeader } from '@/components/page-header';
import { Stethoscope } from 'lucide-react';
// Importer le formulaire traduit si vous en créez un spécifique pour [locale]
// Sinon, assurez-vous que FindDoctorForm gère la traduction ou utilisez la version non-localisée.
// Pour cet exemple, nous supposons que FindDoctorForm est capable de gérer le texte via son propre mécanisme de 't' ou que la version non-localisée est acceptable.
import { FindDoctorForm } from '@/app/find-doctor/find-doctor-form'; // Utilise la version non-localisée

export default function FindDoctorLocalePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Trouver un Médecin"
        description="Décrivez vos symptômes. Nous analyserons cela et simulerons une recherche de médecins à proximité (via API simulée)."
        icon={Stethoscope}
      />
      <FindDoctorForm />
    </div>
  );
}
    
