
'use client';

import * as React from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const LOCAL_STORAGE_CONSENT_KEY = 'medimind_contextual_data_consent_v1';
type ConsentStatus = 'accepted' | 'refused' | 'pending';

export default function PrivacyPage() {
  const [consentStatus, setConsentStatus] = React.useState<ConsentStatus>('pending');
  const [isClient, setIsClient] = React.useState(false);

  const t = (key: string, defaultText?: string) => {
    const translations: Record<string, string> = {
      pageTitle: "Confidentialité des Données chez MediMind IA",
      pageDescription: "Votre confiance et votre vie privée sont primordiales pour nous.",
      commitmentTitle: "Notre Engagement envers Votre Vie Privée",
      commitmentP1: "Chez MediMind IA, nous sommes profondément engagés à protéger vos informations personnelles et de santé. Nous comprenons la sensibilité de vos données et avons mis en place des mesures de sécurité robustes et des pratiques de confidentialité pour assurer leur confidentialité et leur intégrité.",
      dataYouProvideTitle: "Données que Vous Nous Fournissez Directement",
      dataYouProvideP1: "Nous collectons les informations que vous saisissez volontairement dans nos formulaires. Ces données sont essentielles pour que nos IA puissent vous fournir des analyses et recommandations pertinentes. Elles incluent typiquement :",
      dataYouProvideL1: "<strong>Informations de santé primaires :</strong> Symptômes actuels, antécédents médicaux personnels et familiaux, allergies, médicaments en cours.",
      dataYouProvideL2: "<strong>Profil personnel :</strong> Âge, sexe (tels que vous les déclarez).",
      dataYouProvideL3: "<strong>Données de style de vie (si fournies) :</strong> Niveau d'activité, qualité du sommeil.",
      dataYouProvideL4: "<strong>Objectifs de santé spécifiques :</strong> Si vous nous les communiquez.",
      dataYouProvideP2: "Ces informations sont utilisées uniquement dans le but de vous fournir des entretiens simulés, des analyses par l'IA, des avis de spécialistes simulés, et des recommandations contextuelles, comme décrit dans nos services.",
      
      potentialContextualDataTitle: "Données Contextuelles Potentielles",
      potentialContextualDataP1: "Pour enrichir vos recommandations et les rendre plus pertinentes, MediMind IA pourrait, avec votre consentement explicite lorsque nécessaire, utiliser ou déduire certaines données contextuelles. Nous distinguons plusieurs catégories :",
      
      baseTechnicalDataTitle: "1. Données Techniques et Temporelles de Base",
      baseTechnicalDataP1: "Ces données sont généralement nécessaires au bon fonctionnement du service ou sont déduites lors de votre interaction pour fournir une expérience utilisateur standard :",
      baseTechnicalDataL1: "<strong>Date et Heure de la requête :</strong> Pour contextualiser temporellement les interactions.",
      baseTechnicalDataL2: "<strong>Jour de la semaine :</strong> Déduit de la date.",
      baseTechnicalDataL3: "<strong>Fuseau horaire approximatif :</strong> Pour ajuster les informations temporelles si pertinent.",
      baseTechnicalDataL4: "<strong>Informations sur l'appareil et le navigateur (via User-Agent) :</strong> Type d'appareil (mobile, ordinateur), système d'exploitation, type et version du navigateur. Ceci est utilisé pour optimiser l'affichage, diagnostiquer des problèmes techniques et améliorer nos services.",
      baseTechnicalDataP2: "L'utilisation de ces données est inhérente au fonctionnement d'un service web et généralement couverte par l'acceptation de cette politique.",

      automatedContextualDataTitle: "2. Données Contextuelles Automatisées (Soumises à Votre Consentement)",
      automatedContextualDataP1: "Pour aller plus loin dans la personnalisation, certaines données pourraient être collectées ou déduites automatiquement, mais <strong>uniquement si vous y consentez explicitement</strong> (voir la section \"Gestion de Votre Consentement\" ci-dessous) et si la fonctionnalité technique est implémentée dans l'application. Ces données incluent :",
      automatedContextualDataL1: "<strong>Localisation géographique (approximative ou précise) :</strong>",
      automatedContextualDataL1_1: "Approximative (ex: ville, déduite de l'adresse IP) : Pourrait être utilisée pour adapter les conseils à des facteurs régionaux généraux.",
      automatedContextualDataL1_2: "Précise (via API de géolocalisation du navigateur) : Nécessiterait une autorisation supplémentaire du navigateur. Pourrait être utilisée pour des conseils très localisés (météo spécifique, qualité de l'air, suggestions d'activités à proximité).",
      automatedContextualDataL2: "<strong>(Fonctionnalité future) Données de services tiers connectés :</strong> Si vous choisissez de lier MediMind IA à d'autres services (ex: applications de santé, calendriers), nous ne collecterions des données de ces services qu'avec votre autorisation explicite pour chaque connexion.",
      automatedContextualDataP2: "<strong>Précision importante :</strong> Actuellement, l'application web MediMind IA <strong>ne met pas en œuvre</strong> de mécanisme technique pour la collecte automatique de votre localisation géographique précise directement depuis le navigateur, ni de connexion à des services tiers. La section de consentement ci-dessous concerne votre accord de principe pour de futures fonctionnalités.",
      
      consentManagementTitle: "Gestion de Votre Consentement pour la Collecte de Données Contextuelles Automatisées",
      consentExplanation1: "Pour nous aider à vous fournir des recommandations encore plus personnalisées et proactives, vous pouvez consentir à ce que MediMind IA (dans ses futures versions améliorées) tente de collecter et d'utiliser automatiquement certaines données contextuelles mentionnées ci-dessus (principalement la localisation et les informations sur l'appareil).",
      consentExplanation2: "Si vous acceptez, ces données pourraient être utilisées pour enrichir les informations envoyées à nos IA, sans que vous ayez à les saisir manuellement. Si vous refusez, ou si vous ne faites pas de choix, seules les informations que vous saisissez explicitement dans les formulaires seront utilisées pour générer des recommandations.",
      consentExplanation3: "Vous pouvez modifier votre choix à tout moment.",
      consentStatusLoading: "Chargement de vos préférences de consentement...",
      consentStatusAccepted: "Vous avez accepté la collecte automatisée de données contextuelles pour améliorer vos recommandations.",
      consentStatusRefused: "Vous avez refusé la collecte automatisée de données contextuelles. Seules les données que vous saisissez activement seront utilisées.",
      consentStatusPending: "Votre choix concernant la collecte automatisée de données contextuelles est en attente.",
      acceptButton: "J'accepte la collecte automatisée",
      refuseButton: "Je refuse la collecte automatisée",
      consentNote: "Note : Ce choix est stocké localement dans votre navigateur. Il ne modifie pas les champs des formulaires actuels, mais influence la manière dont les données pourraient être collectées et utilisées par de futures versions de l'application.",

      dataSecurityTitle: "Sécurité des Données",
      dataSecurityP1: "Nous employons des mesures de sécurité conformes aux normes de l'industrie pour protéger vos données contre l'accès, la divulgation, l'altération ou la destruction non autorisés.",
      dataSharingTitle: "Partage des Données",
      dataSharingP1: "Nous ne vendons, n'échangeons ni ne transférons d'aucune autre manière vos informations personnelles identifiables à des tiers sans votre consentement explicite, sauf dans les cas suivants : fournisseurs de services de confiance qui nous aident à exploiter notre application (soumis à des accords de confidentialité), ou si la loi l'exige.",
      yourControlTitle: "Votre Contrôle",
      yourControlP1: "Outre la gestion du consentement ci-dessus, vous avez le droit de demander l'accès, la correction ou la suppression de vos données personnelles saisies, sous réserve des exigences légales applicables.",
      policyUpdatesTitle: "Mises à Jour de cette Politique",
      policyUpdatesP1: "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la nouvelle politique sur cette page.",
      contactP1: "Si vous avez des questions sur nos pratiques de confidentialité, veuillez nous contacter."
    };
    return translations[key] || defaultText || `[${key}]`;
  };


  React.useEffect(() => {
    setIsClient(true);
    const storedConsent = localStorage.getItem(LOCAL_STORAGE_CONSENT_KEY) as ConsentStatus | null;
    // If a choice is already stored, use it.
    if (storedConsent && ['accepted', 'refused'].includes(storedConsent)) {
      setConsentStatus(storedConsent);
    } else {
      // Otherwise, default to 'refused' and store this as the default choice.
      setConsentStatus('refused');
      localStorage.setItem(LOCAL_STORAGE_CONSENT_KEY, 'refused');
    }
  }, []);

  const handleConsentChange = (status: 'accepted' | 'refused') => {
    localStorage.setItem(LOCAL_STORAGE_CONSENT_KEY, status);
    setConsentStatus(status);
    // Broadcast the change to other tabs
    const channel = new BroadcastChannel('consent_channel');
    channel.postMessage({ consent: status });
    // The channel is intentionally not closed immediately to ensure message delivery.
    // It will be garbage-collected automatically.
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
        title={t('pageTitle')}
        description={t('pageDescription')}
        icon={ShieldCheck}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('commitmentTitle')}</CardTitle>
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
