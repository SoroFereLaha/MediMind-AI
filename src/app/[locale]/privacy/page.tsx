
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
// To translate this page, import and use useTranslations from 'next-intl'
// Example:
// import { useTranslations } from 'next-intl';
// const t = useTranslations('PrivacyPage');
// Then use t('title'), t('description'), t('commitmentTitle'), t('p1'), etc.
// And for the consent part: t('consentManagementTitle'), t('consentExplanation1'), etc.

const LOCAL_STORAGE_CONSENT_KEY = 'medimind_contextual_data_consent_v1'; // Should be same key as non-locale
type ConsentStatus = 'accepted' | 'refused' | 'pending';

export default function PrivacyPage() {
  const [consentStatus, setConsentStatus] = React.useState<ConsentStatus>('pending');
  const [isClient, setIsClient] = React.useState(false);

  // Placeholder for translations - replace with actual useTranslations if i18n is re-enabled
  const t = (key: string, defaultText?: string) => {
    const translations: Record<string, string> = {
      pageTitle: "Data Privacy at MediMind AI",
      pageDescription: "Your trust and privacy are paramount to us.",
      commitmentTitle: "Our Commitment to Your Privacy",
      commitmentP1: "At MediMind AI, we are deeply committed to protecting your personal and health information. We understand the sensitivity of your data and have implemented robust security measures and privacy practices to ensure its confidentiality and integrity.",
      dataYouProvideTitle: "Data You Provide Directly",
      dataYouProvideP1: "We collect information that you voluntarily enter into our forms. This data is essential for our AIs to provide you with relevant analyses and recommendations. It typically includes:",
      dataYouProvideL1: "<strong>Primary health information:</strong> Current symptoms, personal and family medical history, allergies, current medications.",
      dataYouProvideL2: "<strong>Personal profile:</strong> Age, sex (as you declare them).",
      dataYouProvideL3: "<strong>Lifestyle data (if provided):</strong> Activity level, sleep quality.",
      dataYouProvideL4: "<strong>Specific health goals:</strong> If you communicate them to us.",
      dataYouProvideP2: "This information is used solely for the purpose of providing you with simulated interviews, AI-driven analysis, simulated specialist insights, and contextual recommendations, as described in our services.",
      
      potentialContextualDataTitle: "Potential Contextual Data",
      potentialContextualDataP1: "To enrich your recommendations and make them more relevant, MediMind AI might, with your explicit consent where necessary, use or infer certain contextual data. We distinguish several categories:",
      
      baseTechnicalDataTitle: "1. Basic Technical and Temporal Data",
      baseTechnicalDataP1: "This data is generally necessary for the proper functioning of the service or is inferred during your interaction to provide a standard user experience:",
      baseTechnicalDataL1: "<strong>Date and Time of request:</strong> To temporally contextualize interactions.",
      baseTechnicalDataL2: "<strong>Day of the week:</strong> Deduced from the date.",
      baseTechnicalDataL3: "<strong>Approximate timezone:</strong> To adjust temporal information if relevant.",
      baseTechnicalDataL4: "<strong>Device and browser information (via User-Agent):</strong> Device type (mobile, desktop), operating system, browser type and version. This is used to optimize display, diagnose technical issues, and improve our services.",
      baseTechnicalDataP2: "The use of this data is inherent to the functioning of a web service and generally covered by the acceptance of this policy.",

      automatedContextualDataTitle: "2. Automated Contextual Data (Subject to Your Consent)",
      automatedContextualDataP1: "To go further in personalization, certain data could be collected or inferred automatically, but <strong>only if you explicitly consent</strong> (see the 'Manage Your Consent' section below) and if the technical functionality is implemented in the application. This data includes:",
      automatedContextualDataL1: "<strong>Geographic location (approximate or precise):</strong>",
      automatedContextualDataL1_1: "Approximate (e.g., city, deduced from IP address): Could be used to adapt advice to general regional factors.",
      automatedContextualDataL1_2: "Precise (via browser geolocation API): Would require additional browser permission. Could be used for highly localized advice (specific weather, air quality, nearby activity suggestions).",
      automatedContextualDataL2: "<strong>(Future functionality) Data from linked third-party services:</strong> If you choose to link MediMind AI to other services (e.g., health apps, calendars), we would only collect data from these services with your explicit authorization for each connection.",
      automatedContextualDataP2: "<strong>Important Clarification:</strong> Currently, the MediMind AI web application <strong>does not implement</strong> a technical mechanism for the automatic collection of your precise geographic location directly from the browser, nor connection to third-party services. The consent section below concerns your agreement in principle for future functionalities.",
      
      consentManagementTitle: "Manage Your Consent for Automated Contextual Data Collection",
      consentExplanation1: "To help us provide you with even more personalized and proactive recommendations, you can consent to MediMind AI (in its future improved versions) attempting to automatically collect and use certain contextual data mentioned above (primarily location and device information).",
      consentExplanation2: "If you accept, this data could be used to enrich the information sent to our AIs, without you needing to enter it manually. If you refuse, or if you do not make a choice, only the information you explicitly enter in the forms will be used to generate recommendations.",
      consentExplanation3: "You can change your choice at any time.",
      consentStatusLoading: "Loading your consent preferences...",
      consentStatusAccepted: "You have accepted automated contextual data collection to enhance your recommendations.",
      consentStatusRefused: "You have refused automated contextual data collection. Only data you actively enter will be used.",
      consentStatusPending: "Your choice regarding automated contextual data collection is pending.",
      acceptButton: "I Accept Automated Collection",
      refuseButton: "I Refuse Automated Collection",
      consentNote: "Note: This choice is stored locally in your browser. It does not change the fields in the current forms but influences how data might be collected and used by future versions of the application.",

      dataSecurityTitle: "Data Security",
      dataSecurityP1: "We employ industry-standard security safeguards to protect your data from unauthorized access, disclosure, alteration, or destruction.",
      dataSharingTitle: "Data Sharing",
      dataSharingP1: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your explicit consent, except in the following cases: trusted service providers who assist us in operating our application (subject to confidentiality agreements), or if required by law.",
      yourControlTitle: "Your Control",
      yourControlP1: "In addition to managing consent above, you have the right to request access to, correction of, or deletion of your entered personal data, subject to applicable legal requirements.",
      policyUpdatesTitle: "Updates to This Policy",
      policyUpdatesP1: "We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page.",
      contactP1: "If you have any questions about our privacy practices, please contact us."
    };
    return translations[key] || defaultText || `[${key}]`;
  };


  React.useEffect(() => {
    setIsClient(true);
    const storedConsent = localStorage.getItem(LOCAL_STORAGE_CONSENT_KEY) as ConsentStatus | null;
     if (storedConsent && ['accepted', 'refused'].includes(storedConsent)) {
      setConsentStatus(storedConsent);
    } else {
      setConsentStatus('pending');
    }
  }, []);

  const handleConsentChange = (status: 'accepted' | 'refused') => {
    localStorage.setItem(LOCAL_STORAGE_CONSENT_KEY, status);
    setConsentStatus(status);
  };
  
  const getConsentMessageInfo = () => {
    if (!isClient) return { text: t('consentStatusLoading'), icon: <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />, color: "text-yellow-700"};
    switch (consentStatus) {
      case 'accepted':
        return {
          text: t('consentStatusAccepted'),
          icon: <CheckCircle className="h-5 w-5 text-green-600 mr-2" />,
          color: "text-green-700",
        };
      case 'refused':
        return {
          text: t('consentStatusRefused'),
          icon: <XCircle className="h-5 w-5 text-red-600 mr-2" />,
          color: "text-red-700",
        };
      default:
        return {
          text: t('consentStatusPending'),
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />,
          color: "text-yellow-700",
        };
    }
  };

  const consentInfo = getConsentMessageInfo();

  return (
    <div className="space-y-8">
      <PageHeader
        title={t('pageTitle', "Data Privacy at MediMind AI")}
        description={t('pageDescription', "Your trust and privacy are paramount to us.")}
        icon={ShieldCheck}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('commitmentTitle', "Our Commitment to Your Privacy")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <p>
            {t('commitmentP1')}
          </p>
          
          <h3 className="font-semibold text-lg text-primary">{t('dataYouProvideTitle')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('dataYouProvideP1') }} />
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li dangerouslySetInnerHTML={{ __html: t('dataYouProvideL1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('dataYouProvideL2') }} />
            <li dangerouslySetInnerHTML={{ __html: t('dataYouProvideL3') }} />
            <li dangerouslySetInnerHTML={{ __html: t('dataYouProvideL4') }} />
          </ul>
          <p dangerouslySetInnerHTML={{ __html: t('dataYouProvideP2') }} />

          <h3 className="font-semibold text-lg text-primary">{t('potentialContextualDataTitle')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('potentialContextualDataP1') }} />

          <h4 className="font-semibold text-md text-primary/90 pl-2">{t('baseTechnicalDataTitle')}</h4>
          <p className="pl-2" dangerouslySetInnerHTML={{ __html: t('baseTechnicalDataP1') }} />
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li dangerouslySetInnerHTML={{ __html: t('baseTechnicalDataL1') }} />
            <li dangerouslySetInnerHTML={{ __html: t('baseTechnicalDataL2') }} />
            <li dangerouslySetInnerHTML={{ __html: t('baseTechnicalDataL3') }} />
            <li dangerouslySetInnerHTML={{ __html: t('baseTechnicalDataL4') }} />
          </ul>
          <p className="pl-2" dangerouslySetInnerHTML={{ __html: t('baseTechnicalDataP2') }} />

          <h4 className="font-semibold text-md text-primary/90 pl-2">{t('automatedContextualDataTitle')}</h4>
          <p className="pl-2" dangerouslySetInnerHTML={{ __html: t('automatedContextualDataP1') }} />
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li>{t('automatedContextualDataL1')}
              <ul className="list-circle list-inside pl-5">
                <li dangerouslySetInnerHTML={{ __html: t('automatedContextualDataL1_1')}} />
                <li dangerouslySetInnerHTML={{ __html: t('automatedContextualDataL1_2')}} />
              </ul>
            </li>
            <li dangerouslySetInnerHTML={{ __html: t('automatedContextualDataL2') }} />
          </ul>
          <p className="pl-2" dangerouslySetInnerHTML={{ __html: t('automatedContextualDataP2') }} />
          
          <h3 className="font-semibold text-lg text-primary mt-6">{t('consentManagementTitle')}</h3>
          <Card className="bg-card/50 p-4 mt-2">
            <CardContent className="space-y-3 pt-4">
              <p dangerouslySetInnerHTML={{ __html: t('consentExplanation1') }} />
              <p dangerouslySetInnerHTML={{ __html: t('consentExplanation2') }} />
              <p dangerouslySetInnerHTML={{ __html: t('consentExplanation3') }} />
              
              {isClient && (
                <div className="mt-4 p-3 border rounded-md">
                  <div className="flex items-center">
                    {consentInfo.icon}
                    <p className={`font-medium ${consentInfo.color}`}>{consentInfo.text}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button onClick={() => handleConsentChange('accepted')} className="flex-1" disabled={!isClient || consentStatus === 'accepted'}>
                  <CheckCircle className="mr-2 h-4 w-4" /> {t('acceptButton')}
                </Button>
                <Button onClick={() => handleConsentChange('refused')} variant="outline" className="flex-1" disabled={!isClient || consentStatus === 'refused'}>
                  <XCircle className="mr-2 h-4 w-4" /> {t('refuseButton')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: t('consentNote') }} />
            </CardContent>
          </Card>

          <h3 className="font-semibold text-lg text-primary mt-6">{t('dataSecurityTitle')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('dataSecurityP1')}} />
          <h3 className="font-semibold text-lg text-primary">{t('dataSharingTitle')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('dataSharingP1')}} />
           <h3 className="font-semibold text-lg text-primary">{t('yourControlTitle')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('yourControlP1')}} />
          <h3 className="font-semibold text-lg text-primary">{t('policyUpdatesTitle')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('policyUpdatesP1')}} />
          <p className="mt-6 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('contactP1')}} />
        </CardContent>
      </Card>
    </div>
  );
}
