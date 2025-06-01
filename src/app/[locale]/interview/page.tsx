import { PageHeader } from '@/components/page-header';
import { UserCheck } from 'lucide-react';
import { InterviewForm } from './interview-form';
// To translate this page, you'll need to use useTranslations or getTranslations
// For example:
// import { useTranslations } from 'next-intl';
// const t = useTranslations('InterviewPage');
// title={t('title')} description={t('description')}

export default function InterviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Patient Interview" // Placeholder - needs translation
        description="Tell us about yourself and your current health concerns. Our AI will guide you." // Placeholder - needs translation
        icon={UserCheck}
      />
      <InterviewForm />
    </div>
  );
}
