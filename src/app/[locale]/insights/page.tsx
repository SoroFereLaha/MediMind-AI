import { PageHeader } from '@/components/page-header';
import { BrainCircuit } from 'lucide-react';
import { InsightsForm } from './insights-form';
// To translate this page, you'll need to use useTranslations or getTranslations
// For example:
// import { useTranslations } from 'next-intl';
// const t = useTranslations('InsightsPage');
// title={t('title')} description={t('description')}

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Specialist Insights" // Placeholder - needs translation
        description="Get in-depth analysis from AI specialists based on patient information." // Placeholder - needs translation
        icon={BrainCircuit}
      />
      <InsightsForm />
    </div>
  );
}
