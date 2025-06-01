
import { PageHeader } from '@/components/page-header';
import { BrainCircuit } from 'lucide-react';
import { InsightsForm } from './insights-form';

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Avis de Spécialistes IA"
        description="Obtenez une analyse approfondie d'IA spécialistes basée sur les informations du patient."
        icon={BrainCircuit}
      />
      <InsightsForm />
    </div>
  );
}
