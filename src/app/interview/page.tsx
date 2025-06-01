import { PageHeader } from '@/components/page-header';
import { UserCheck } from 'lucide-react';
import { InterviewForm } from './interview-form';

export default function InterviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Patient Interview"
        description="Tell us about yourself and your current health concerns. Our AI will guide you."
        icon={UserCheck}
      />
      <InterviewForm />
    </div>
  );
}
