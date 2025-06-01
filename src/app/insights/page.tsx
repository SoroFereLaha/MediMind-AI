import { PageHeader } from '@/components/page-header';
import { BrainCircuit } from 'lucide-react';
import { InsightsForm } from './insights-form';

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Specialist Insights"
        description="Get in-depth analysis from AI specialists based on patient information."
        icon={BrainCircuit}
      />
      <InsightsForm />
    </div>
  );
}
