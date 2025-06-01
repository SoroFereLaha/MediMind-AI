import { PageHeader } from '@/components/page-header';
import { MessageSquareHeart } from 'lucide-react';
import { RecommendationsForm } from './recommendations-form';

export default function RecommendationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Contextual Health Recommendations"
        description="Receive AI-driven recommendations based on your symptoms and medical history."
        icon={MessageSquareHeart}
      />
      <RecommendationsForm />
    </div>
  );
}
