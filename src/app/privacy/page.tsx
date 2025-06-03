
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
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
            Nous collectons les informations que vous saisissez volontairement dans nos formulaires, telles que :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Informations de santé primaires :</strong> Symptômes actuels, antécédents médicaux personnels et familiaux, allergies, médicaments en cours.</li>
            <li><strong>Profil personnel :</strong> Âge, sexe, et potentiellement d'autres informations que vous choisissez de partager pour affiner les recommandations (ex: niveau d'activité, qualité du sommeil).</li>
            <li><strong>Objectifs de santé spécifiques :</strong> Si vous nous les communiquez.</li>
          </ul>
          <p>
            Ces informations sont utilisées uniquement dans le but de vous fournir des entretiens simulés, des analyses par l'IA, des avis de spécialistes simulés, et des recommandations contextuelles, comme décrit dans nos services.
          </p>

          <h3 className="font-semibold text-lg text-primary">Données Potentiellement Collectées ou Déduites pour Améliorer le Contexte (Avec Transparence et Contrôle)</h3>
          <p>
            Pour enrichir vos recommandations et les rendre plus pertinentes, MediMind IA pourrait utiliser ou déduire certaines données contextuelles. Nous distinguons plusieurs catégories :
          </p>

          <h4 className="font-semibold text-md text-primary/90 pl-2">1. Données Techniques et Temporelles de Base</h4>
          <p className="pl-2">
            Ces données sont généralement nécessaires au bon fonctionnement du service ou sont déduites lors de votre interaction :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li><strong>Date et Heure :</strong> L'heure à laquelle vous utilisez le service, pour adapter les conseils (ex: routine matinale, préparation au sommeil).</li>
            <li><strong>Jour de la semaine :</strong> Peut influencer les types de recommandations (ex: activités de week-end).</li>
            <li><strong>Fuseau horaire approximatif :</strong> Pour ajuster les informations temporelles.</li>
            <li><strong>Informations sur l'appareil et le navigateur :</strong> Type d'appareil (mobile, ordinateur), système d'exploitation, type et version du navigateur. Ceci est utilisé pour optimiser l'affichage, diagnostiquer des problèmes techniques et améliorer nos services.</li>
          </ul>
          <p className="pl-2">
            L'utilisation de ces données est inhérente au fonctionnement d'un service web et ne nécessite généralement pas un consentement distinct de l'acceptation de cette politique.
          </p>

          <h4 className="font-semibold text-md text-primary/90 pl-2">2. Données Contextuelles Environnementales (Nécessitant Consentement Actif pour Collecte Automatique)</h4>
          <p className="pl-2">
            Ces données, si collectées automatiquement, nécessiteraient votre permission explicite :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li><strong>Localisation géographique précise :</strong> Pourrait être utilisée pour fournir des conseils adaptés à la météo locale, aux alertes sanitaires de votre région, à la qualité de l'air, ou pour suggérer des activités à proximité.</li>
            <li><strong>Données météorologiques, qualité de l'air, lever/coucher du soleil :</strong> Seraient obtenues via des services tiers en se basant sur votre localisation (si partagée).</li>
          </ul>
          <p className="pl-2">
            <strong>Précision importante :</strong> Actuellement, l'application web MediMind IA <strong>ne met pas en œuvre</strong> de mécanisme de demande de consentement pour la collecte automatique de votre localisation géographique précise directement depuis le navigateur. Si des fonctionnalités futures nécessitent ces données, elles seront introduites avec des demandes de permission claires et vous aurez le contrôle pour accepter ou refuser. Les champs relatifs à la localisation dans certains de nos formulaires actuels sont pour une saisie manuelle volontaire de votre part si vous souhaitez fournir ce contexte.
          </p>
          
          <h4 className="font-semibold text-md text-primary/90 pl-2">3. Données Provenant de Services Externes (Nécessitant Consentement Actif pour Connexion)</h4>
          <p className="pl-2">
            À l'avenir, nous pourrions offrir la possibilité de connecter MediMind IA à d'autres services que vous utilisez :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-6">
            <li><strong>Données d'applications de santé tierces (ex: Google Fit, Apple Health) :</strong> Via une application mobile compagnon (non existante actuellement) et avec votre autorisation explicite pour synchroniser des données comme le nombre de pas, le sommeil, l'activité physique.</li>
            <li><strong>Données de calendrier (ex: Google Calendar) :</strong> Pour anticiper des périodes de stress ou d'indisponibilité et adapter les recommandations.</li>
          </ul>
          <p className="pl-2">
            Toute intégration de ce type se ferait avec des demandes d'autorisation claires et spécifiques.
          </p>

          <h3 className="font-semibold text-lg text-primary">Sécurité des Données</h3>
          <p>
            Nous employons des mesures de sécurité conformes aux normes de l'industrie pour protéger vos données contre l'accès, la divulgation, l'altération ou la destruction non autorisés.
          </p>
          <h3 className="font-semibold text-lg text-primary">Partage des Données</h3>
          <p>
            Nous ne vendons, n'échangeons ni ne transférons d'aucune autre manière vos informations personnelles identifiables à des tiers sans votre consentement explicite, sauf dans les cas suivants : fournisseurs de services de confiance qui nous aident à exploiter notre application (soumis à des accords de confidentialité), ou si la loi l'exige.
          </p>
           <h3 className="font-semibold text-lg text-primary">Votre Contrôle</h3>
          <p>
            Vous avez le droit de demander l'accès, la correction ou la suppression de vos données personnelles, sous réserve des exigences légales applicables.
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
