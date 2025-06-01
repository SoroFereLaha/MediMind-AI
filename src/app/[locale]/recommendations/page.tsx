import { PageHeader } from '@/components/page-header';
import { MessageSquareHeart } from 'lucide-react';
import { RecommendationsForm } from './recommendations-form';
// To translate this page, you'll need to use useTranslations or getTranslations
// For example:
// import { useTranslations } from 'next-intl';
// const t = useTranslations('RecommendationsPage');
// title={t('title')} description={t('description')}

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Contextual Health Recommendations" // Placeholder - needs translation
        description="Receive AI-driven recommendations based on your symptoms and medical history." // Placeholder - needs translation
        icon={MessageSquareHeart}
      />
      <RecommendationsForm />
    </div>
  );
}
