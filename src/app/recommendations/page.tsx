
import { PageHeader } from '@/components/page-header';
import { MessageSquareHeart } from 'lucide-react';
import { RecommendationsForm } from './recommendations-form';

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Recommandations de Santé Contextuelles"
        description="Recevez des recommandations basées sur l'IA à partir de vos symptômes et antécédents médicaux."
        icon={MessageSquareHeart}
      />
      <RecommendationsForm />
    </div>
  );
}
