
import { PageHeader } from '@/components/page-header';
import { Salad } from 'lucide-react'; // Ou une autre icône pertinente
import { NutritionForm } from './nutrition-form';

export default function NutritionPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Conseils Nutritionnels Personnalisés"
        description="Obtenez des recommandations alimentaires basées sur vos données de santé et votre localisation, fournies par notre API."
        icon={Salad}
      />
      <NutritionForm />
    </div>
  );
}
