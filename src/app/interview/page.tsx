
import { PageHeader } from '@/components/page-header';
import { UserCheck } from 'lucide-react';
import { InterviewForm } from './interview-form';

export default function InterviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Entretien Patient IA"
        description="Parlez-nous de vous et de vos préoccupations de santé actuelles. Notre IA vous guidera."
        icon={UserCheck}
      />
      <InterviewForm />
    </div>
  );
}
