
import { PageHeader } from '@/components/page-header';
import { Stethoscope } from 'lucide-react';
import { FindDoctorForm } from './find-doctor-form';

export default function FindDoctorPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Trouver un Médecin"
        description="Décrivez vos symptômes et nous vous aiderons à identifier une spécialité pertinente et à trouver des médecins (simulation actuelle)."
        icon={Stethoscope}
      />
      <FindDoctorForm />
    </div>
  );
}
    
