
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
          
          <h3 className="font-semibold text-lg text-primary">Data You Provide Directly</h3>
          <p>
            We collect information that you voluntarily enter into our forms, such as:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Primary health information:</strong> Current symptoms, personal and family medical history, allergies, current medications.</li>
            <li><strong>Personal profile:</strong> Age, sex, and potentially other information you choose to share to refine recommendations (e.g., activity level, sleep quality).</li>
            <li><strong>Specific health goals:</strong> If you communicate them to us.</li>
          </ul>
          <p>
            This information is used solely for the purpose of providing you with simulated interviews, AI-driven analysis, simulated specialist insights, and contextual recommendations, as described in our services.
          </p>

          <h3 className="font-semibold text-lg text-primary">Data Potentially Collected or Inferred to Enhance Context (With Transparency and Control)</h3>
          <p>
            To enrich your recommendations and make them more relevant, MediMind AI might use or infer certain contextual data. We distinguish several categories:
          </p>

          <h4 className="font-semibold text-md text-primary/90 pl-2">1. Basic Technical and Temporal Data</h4>
          <p className="pl-2">
            This data is generally necessary for the proper functioning of the service or is inferred during your interaction:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li><strong>Date and Time:</strong> The time you use the service, to adapt advice (e.g., morning routine, sleep preparation).</li>
            <li><strong>Day of the week:</strong> May influence the types of recommendations (e.g., weekend activities).</li>
            <li><strong>Approximate timezone:</strong> To adjust temporal information.</li>
            <li><strong>Device and browser information:</strong> Device type (mobile, desktop), operating system, browser type and version. This is used to optimize display, diagnose technical issues, and improve our services.</li>
          </ul>
          <p className="pl-2">
            The use of this data is inherent to the functioning of a web service and generally does not require consent separate from the acceptance of this policy.
          </p>

          <h4 className="font-semibold text-md text-primary/90 pl-2">2. Environmental Contextual Data (Requiring Active Consent for Automatic Collection)</h4>
          <p className="pl-2">
            This data, if collected automatically, would require your explicit permission:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li><strong>Precise geographic location:</strong> Could be used to provide advice tailored to local weather, health alerts in your area, air quality, or to suggest nearby activities.</li>
            <li><strong>Weather data, air quality, sunrise/sunset times:</strong> Would be obtained via third-party services based on your location (if shared).</li>
          </ul>
          <p className="pl-2">
            <strong>Important Clarification:</strong> Currently, the MediMind AI web application <strong>does not implement</strong> a consent-request mechanism for the automatic collection of your precise geographic location directly from the browser. If future features require this data, they will be introduced with clear permission requests, and you will have control to accept or refuse. Fields related to location in some of our current forms are for voluntary manual entry by you if you wish to provide this context.
          </p>
          
          <h4 className="font-semibold text-md text-primary/90 pl-2">3. Data from External Services (Requiring Active Consent for Connection)</h4>
          <p className="pl-2">
            In the future, we may offer the ability to connect MediMind AI to other services you use:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li><strong>Data from third-party health apps (e.g., Google Fit, Apple Health):</strong> Via a companion mobile app (not currently existing) and with your explicit authorization to synchronize data like step count, sleep, physical activity.</li>
            <li><strong>Calendar data (e.g., Google Calendar):</strong> To anticipate periods of stress or unavailability and adapt recommendations.</li>
          </ul>
          <p className="pl-2">
            Any such integration would be done with clear and specific authorization requests.
          </p>

          <h3 className="font-semibold text-lg text-primary">Data Security</h3> 
          <p>
            We employ industry-standard security safeguards to protect your data from unauthorized access, disclosure, alteration, or destruction. 
          </p>
          <h3 className="font-semibold text-lg text-primary">Data Sharing</h3> 
          <p>
            We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your explicit consent, except in the following cases: trusted service providers who assist us in operating our application (subject to confidentiality agreements), or if required by law. 
          </p>
           <h3 className="font-semibold text-lg text-primary">Your Control</h3> 
          <p>
            You have the right to request access to, correction of, or deletion of your personal data, subject to applicable legal requirements. 
          </p>
          <h3 className="font-semibold text-lg text-primary">Updates to This Policy</h3> 
          <p>
            We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page. 
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            If you have any questions about our privacy practices, please contact us.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
