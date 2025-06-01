import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
// To translate this page, you'll need to use useTranslations or getTranslations
// For example:
// import { useTranslations } from 'next-intl';
// const t = useTranslations('PrivacyPage');
// Then use t('title'), t('description'), t('commitmentTitle'), t('p1'), etc.

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Data Privacy at MediMind AI" // Placeholder - needs translation
        description="Your trust and privacy are paramount to us." // Placeholder - needs translation
        icon={ShieldCheck}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Our Commitment to Your Privacy</CardTitle> 
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <p>
            At MediMind AI, we are deeply committed to protecting your personal and health information. We understand the sensitivity of your data and have implemented robust security measures and privacy practices to ensure its confidentiality and integrity. 
          </p>
          <h3 className="font-semibold text-lg text-primary">Data Collection and Use</h3> 
          <p>
            We collect information that you voluntarily provide during your interactions with our AI tools, such as symptoms, medical history, and other health-related details. This information is used solely for the purpose of providing you with AI-driven health insights, summaries, and recommendations as described in our services. 
          </p>
          <h3 className="font-semibold text-lg text-primary">Data Security</h3> 
          <p>
            We employ industry-standard security safeguards to protect your data from unauthorized access, disclosure, alteration, or destruction. This includes encryption, access controls, and regular security assessments. 
          </p>
          <h3 className="font-semibold text-lg text-primary">Data Sharing</h3> 
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties unless we provide users with advance notice. This does not include trusted third parties who assist us in operating our application, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it's release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property or safety. 
          </p>
           <h3 className="font-semibold text-lg text-primary">Your Control</h3> 
          <p>
            We believe you should have control over your information. You may request access to, correction of, or deletion of your personal data, subject to applicable legal requirements. 
          </p>
          <h3 className="font-semibold text-lg text-primary">Updates to This Policy</h3> 
          <p>
            We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page. 
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            This is a general overview of our data privacy practices. For complete details, please refer to our full Privacy Policy document (link to be provided if available). If you have any questions about our privacy practices, please contact us. 
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
