
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
          <h3 className="font-semibold text-lg text-primary">Collecte et Utilisation des Données</h3>
          <p>
            Nous collectons les informations que vous fournissez volontairement lors de vos interactions avec nos outils IA, telles que les symptômes, les antécédents médicaux et d'autres détails liés à la santé. Ces informations sont utilisées uniquement dans le but de vous fournir des informations, des résumés et des recommandations de santé basés sur l'IA, comme décrit dans nos services.
          </p>
          <h3 className="font-semibold text-lg text-primary">Sécurité des Données</h3>
          <p>
            Nous utilisons des mesures de sécurité conformes aux normes de l'industrie pour protéger vos données contre l'accès, la divulgation, l'altération ou la destruction non autorisés. Cela inclut le cryptage, les contrôles d'accès et les évaluations de sécurité régulières.
          </p>
          <h3 className="font-semibold text-lg text-primary">Partage des Données</h3>
          <p>
            Nous ne vendons, n'échangeons ni ne transférons d'aucune autre manière vos informations personnelles identifiables à des tiers, sauf si nous en informons préalablement les utilisateurs. Cela n'inclut pas les tiers de confiance qui nous aident à exploiter notre application, à mener nos activités ou à servir nos utilisateurs, tant que ces parties acceptent de garder ces informations confidentielles. Nous pouvons également divulguer des informations lorsque leur divulgation est appropriée pour se conformer à la loi, appliquer les politiques de notre site, ou protéger nos droits, notre propriété ou notre sécurité, ou ceux d'autrui.
          </p>
           <h3 className="font-semibold text-lg text-primary">Votre Contrôle</h3>
          <p>
            Nous croyons que vous devriez avoir le contrôle sur vos informations. Vous pouvez demander l'accès, la correction ou la suppression de vos données personnelles, sous réserve des exigences légales applicables.
          </p>

          <h3 className="font-semibold text-lg text-primary">Données Contextuelles Automatiques et Consentement</h3>
          <p>
            Pour enrichir davantage vos recommandations et les rendre plus pertinentes à votre situation actuelle, MediMind IA pourra, avec votre consentement explicite, accéder à certaines données contextuelles. Celles-ci peuvent inclure :
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Votre localisation approximative ou précise :</strong> Pour vous fournir des conseils adaptés à la météo locale, aux alertes sanitaires de votre région, ou pour suggérer des activités à proximité.</li>
            <li><strong>Le moment de la journée :</strong> Pour adapter les conseils à des routines (matin, soir) ou à des besoins spécifiques liés à l'heure.</li>
          </ul>
          <p>
            L'accès à ces données ne se fera jamais sans votre permission claire et préalable. Vous garderez le contrôle sur les informations que vous partagez. Ces données contextuelles sont utilisées uniquement dans le but d'améliorer la personnalisation des conseils de santé et de bien-être qui vous sont fournis.
          </p>

          <h3 className="font-semibold text-lg text-primary">Mises à Jour de cette Politique</h3>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement important en publiant la nouvelle politique sur cette page.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Ceci est un aperçu général de nos pratiques en matière de confidentialité des données. Pour des détails complets, veuillez consulter notre document complet de Politique de Confidentialité (lien à fournir si disponible). Si vous avez des questions sur nos pratiques de confidentialité, veuillez nous contacter.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
