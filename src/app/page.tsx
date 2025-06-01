
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { ArrowRight, Bot, Shield, BrainCircuit } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const welcomeTitle = "Bienvenue chez MediMind IA";
  const welcomeDescription = "Votre compagnon de santé intelligent, fournissant des informations et des conseils basés sur l'IA pour votre bien-être.";
  const startJourneyTitle = "Commencez Votre Parcours de Santé";
  const startJourneyDescription = "Débutez avec notre Entretien Patient IA pour explorer vos symptômes et préoccupations de santé. MediMind IA vous guidera à travers une série de questions pour mieux comprendre votre situation.";
  const startInterviewButton = "Démarrer l'Entretien Patient IA";
  const howItWorksTitle = "Comment Fonctionne MediMind IA";
  const aiConversationsTitle = "Conversations Guidées par l'IA";
  const aiConversationsDescription = "Engagez une conversation guidée avec notre IA pour discuter de vos symptômes et de vos antécédents médicaux.";
  const intelligentAnalysisTitle = "Analyse Intelligente";
  const intelligentAnalysisDescription = "Recevez des informations basées sur les connaissances de spécialistes et des recommandations contextuelles adaptées à vous.";
  const securePrivateTitle = "Sécurisé et Confidentiel";
  const securePrivateDescription = "Vos données sont traitées avec le plus grand soin, garantissant confidentialité et sécurité tout au long du processus.";
  const disclaimer = "MediMind IA est destiné à des fins d'information uniquement et ne constitue pas un avis médical. Consultez toujours un professionnel de la santé qualifié pour toute préoccupation de santé ou avant de prendre toute décision relative à votre santé ou à votre traitement.";

  return (
    <div className="space-y-8">
      <PageHeader
        title={welcomeTitle}
        description={welcomeDescription}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-xl bg-gradient-to-br from-primary/20 via-background to-background p-8 shadow-lg">
        <div>
          <h2 className="font-headline text-3xl font-semibold text-primary mb-4">
            {startJourneyTitle}
          </h2>
          <p className="text-lg text-foreground mb-6">
            {startJourneyDescription}
          </p>
          <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/interview">
              {startInterviewButton} <ArrowRight className="ms-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            alt={welcomeTitle}
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover"
            data-ai-hint="medical AI"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-headline text-2xl font-semibold text-center text-foreground">
          {howItWorksTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bot className="h-6 w-6" />
                {aiConversationsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {aiConversationsDescription}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BrainCircuit className="h-6 w-6" />
                {intelligentAnalysisTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {intelligentAnalysisDescription}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-6 w-6" />
                {securePrivateTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {securePrivateDescription}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center py-8">
        <p className="text-muted-foreground">
          {disclaimer}
        </p>
      </section>
    </div>
  );
}
