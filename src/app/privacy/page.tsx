
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

  const getConsentMessage = () => {
    if (!isClient) return "Chargement de vos préférences de consentement...";
    switch (consentStatus) {
      case 'accepted':
        return {
          text: "Vous avez accepté la collecte automatisée de données contextuelles pour améliorer vos recommandations.",
          icon: <CheckCircle className="h-5 w-5 text-green-600 mr-2" />,
          color: "text-green-700",
        };
      case 'refused':
        return {
          text: "Vous avez refusé la collecte automatisée de données contextuelles. Seules les données que vous saisissez activement seront utilisées.",
          icon: <XCircle className="h-5 w-5 text-red-600 mr-2" />,
          color: "text-red-700",
        };
      default:
        return {
          text: "Votre choix concernant la collecte automatisée de données contextuelles est en attente.",
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />,
          color: "text-yellow-700",
        };
    }
  };
  
  const consentInfo = getConsentMessage();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Confidentialité des Données chez MediMind IA"
        description="Votre confiance et votre vie privée sont primordiales pour nous."
        icon={ShieldCheck}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Notre Engagement envers Votre Vie Privée</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <p>
            Chez MediMind IA, nous sommes profondément engagés à protéger vos informations personnelles et de santé. Nous comprenons la sensibilité de vos données et avons mis en place des mesures de sécurité robustes et des pratiques de confidentialité pour assurer leur confidentialité et leur intégrité.
          </p>
          
          <h3 className="font-semibold text-lg text-primary">Données que Vous Nous Fournissez Directement</h3>
          <p>
            Nous collectons les informations que vous saisissez volontairement dans nos formulaires. Ces données sont essentielles pour que nos IA puissent vous fournir des analyses et recommandations pertinentes. Elles incluent typiquement :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Informations de santé primaires :</strong> Symptômes actuels, antécédents médicaux personnels et familiaux, allergies, médicaments en cours.</li>
            <li><strong>Profil personnel :</strong> Âge, sexe (tels que vous les déclarez).</li>
            <li><strong>Données de style de vie (si fournies) :</strong> Niveau d'activité, qualité du sommeil.</li>
            <li><strong>Objectifs de santé spécifiques :</strong> Si vous nous les communiquez.</li>
          </ul>
          <p>
            Ces informations sont utilisées uniquement dans le but de vous fournir des entretiens simulés, des analyses par l'IA, des avis de spécialistes simulés, et des recommandations contextuelles, comme décrit dans nos services.
          </p>

          <h3 className="font-semibold text-lg text-primary">Données Contextuelles Potentielles</h3>
          <p>
            Pour enrichir vos recommandations et les rendre plus pertinentes, MediMind IA pourrait, avec votre consentement explicite lorsque nécessaire, utiliser ou déduire certaines données contextuelles. Nous distinguons plusieurs catégories :
          </p>

          <h4 className="font-semibold text-md text-primary/90 pl-2">1. Données Techniques et Temporelles de Base</h4>
          <p className="pl-2">
            Ces données sont généralement nécessaires au bon fonctionnement du service ou sont déduites lors de votre interaction pour fournir une expérience utilisateur standard :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li><strong>Date et Heure de la requête :</strong> Pour contextualiser temporellement les interactions.</li>
            <li><strong>Jour de la semaine :</strong> Déduit de la date.</li>
            <li><strong>Fuseau horaire approximatif :</strong> Pour ajuster les informations temporelles si pertinent.</li>
            <li><strong>Informations sur l'appareil et le navigateur (via User-Agent) :</strong> Type d'appareil (mobile, ordinateur), système d'exploitation, type et version du navigateur. Ceci est utilisé pour optimiser l'affichage, diagnostiquer des problèmes techniques et améliorer nos services.</li>
          </ul>
          <p className="pl-2">
            L'utilisation de ces données est inhérente au fonctionnement d'un service web et généralement couverte par l'acceptation de cette politique.
          </p>

          <h4 className="font-semibold text-md text-primary/90 pl-2">2. Données Contextuelles Automatisées (Soumises à Votre Consentement)</h4>
          <p className="pl-2">
            Pour aller plus loin dans la personnalisation, certaines données pourraient être collectées ou déduites automatiquement, mais <strong>uniquement si vous y consentez explicitement</strong> (voir la section "Gestion de Votre Consentement" ci-dessous) et si la fonctionnalité technique est implémentée dans l'application. Ces données incluent :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li><strong>Localisation géographique (approximative ou précise) :</strong>
              <ul className="list-circle list-inside pl-5">
                <li>Approximative (ex: ville, déduite de l'adresse IP) : Pourrait être utilisée pour adapter les conseils à des facteurs régionaux généraux.</li>
                <li>Précise (via API de géolocalisation du navigateur) : Nécessiterait une autorisation supplémentaire du navigateur. Pourrait être utilisée pour des conseils très localisés (météo spécifique, qualité de l'air, suggestions d'activités à proximité).</li>
              </ul>
            </li>
            <li><strong>(Fonctionnalité future) Données de services tiers connectés :</strong> Si vous choisissez de lier MediMind IA à d'autres services (ex: applications de santé, calendriers), nous ne collecterions des données de ces services qu'avec votre autorisation explicite pour chaque connexion.</li>
          </ul>
           <p className="pl-2">
            <strong>Précision importante :</strong> Actuellement, l'application web MediMind IA <strong>ne met pas en œuvre</strong> de mécanisme technique pour la collecte automatique de votre localisation géographique précise directement depuis le navigateur, ni de connexion à des services tiers. La section de consentement ci-dessous concerne votre accord de principe pour de futures fonctionnalités.
          </p>
          
          <h3 className="font-semibold text-lg text-primary mt-6">Gestion de Votre Consentement pour la Collecte de Données Contextuelles Automatisées</h3>
          <Card className="bg-card/50 p-4 mt-2">
            <CardContent className="space-y-3 pt-4">
              <p>
                Pour nous aider à vous fournir des recommandations encore plus personnalisées et proactives, vous pouvez consentir à ce que MediMind IA (dans ses futures versions améliorées) tente de collecter et d'utiliser automatiquement certaines données contextuelles mentionnées ci-dessus (principalement la localisation et les informations sur l'appareil).
              </p>
              <p>
                Si vous acceptez, ces données pourraient être utilisées pour enrichir les informations envoyées à nos IA, sans que vous ayez à les saisir manuellement.
                Si vous refusez, ou si vous ne faites pas de choix, seules les informations que vous saisissez explicitement dans les formulaires seront utilisées pour générer des recommandations.
              </p>
              <p>Vous pouvez modifier votre choix à tout moment.</p>
              
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
                  <CheckCircle className="mr-2 h-4 w-4" /> J'accepte la collecte automatisée
                </Button>
                <Button onClick={() => handleConsentChange('refused')} variant="outline" className="flex-1" disabled={!isClient || consentStatus === 'refused'}>
                  <XCircle className="mr-2 h-4 w-4" /> Je refuse la collecte automatisée
                </Button>
              </div>
               <p className="text-xs text-muted-foreground mt-2">
                Note : Ce choix est stocké localement dans votre navigateur. Il ne modifie pas les champs des formulaires actuels, mais influence la manière dont les données pourraient être collectées et utilisées par de futures versions de l'application.
              </p>
            </CardContent>
          </Card>

          <h3 className="font-semibold text-lg text-primary mt-6">Sécurité des Données</h3>
          <p>
            Nous employons des mesures de sécurité conformes aux normes de l'industrie pour protéger vos données contre l'accès, la divulgation, l'altération ou la destruction non autorisés.
          </p>
          <h3 className="font-semibold text-lg text-primary">Partage des Données</h3>
          <p>
            Nous ne vendons, n'échangeons ni ne transférons d'aucune autre manière vos informations personnelles identifiables à des tiers sans votre consentement explicite, sauf dans les cas suivants : fournisseurs de services de confiance qui nous aident à exploiter notre application (soumis à des accords de confidentialité), ou si la loi l'exige.
          </p>
           <h3 className="font-semibold text-lg text-primary">Votre Contrôle</h3>
          <p>
            Outre la gestion du consentement ci-dessus, vous avez le droit de demander l'accès, la correction ou la suppression de vos données personnelles saisies, sous réserve des exigences légales applicables.
          </p>
          <h3 className="font-semibold text-lg text-primary">Mises à Jour de cette Politique</h3>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la nouvelle politique sur cette page.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Si vous avez des questions sur nos pratiques de confidentialité, veuillez nous contacter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
