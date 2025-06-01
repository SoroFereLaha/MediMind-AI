
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { ArrowRight, Bot, Shield, BrainCircuit } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { getTranslations } from 'next-intl/server'; // Removed

export default async function HomePage({ params: routeParams }: { params: { locale: string } }) {
  // await Promise.resolve(); // Removed
  const locale = routeParams.locale;
  console.log(`[${locale}/page.tsx HomePage] Top of HomePage. Locale from routeParams: "${locale}" (type: ${typeof locale}) (i18n disabled)`);

  // Dummy t function as getTranslations is removed
  const t = (key: string) => {
    const translations: Record<string, string> = {
      welcomeTitle: "Welcome to MediMind AI",
      welcomeDescription: "Your intelligent health companion, providing AI-powered insights and guidance for your well-being.",
      startJourneyTitle: "Start Your Health Journey",
      startJourneyDescription: "Begin with our AI Patient Interview to explore your symptoms and health concerns. MediMind AI will guide you through a series of questions to understand your situation better.",
      startInterviewButton: "Start AI Patient Interview",
      howItWorksTitle: "How MediMind AI Works",
      aiConversationsTitle: "AI-Powered Conversations",
      aiConversationsDescription: "Engage in a guided interview with our AI to discuss your symptoms and medical history.",
      intelligentAnalysisTitle: "Intelligent Analysis",
      intelligentAnalysisDescription: "Receive insights based on specialist knowledge and contextual recommendations tailored to you.",
      securePrivateTitle: "Secure & Private",
      securePrivateDescription: "Your data is handled with the utmost care, ensuring privacy and security throughout the process.",
      disclaimer: "MediMind AI is intended for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or treatment."
    };
    return translations[key] || `[${key}]`; // Return translation or key as placeholder
  };
  
  // try {
  //   console.log(`[${locale}/page.tsx HomePage] Attempting to get translations with locale value: "${locale}" for 'HomePage'`);
  //   t = await getTranslations({locale, namespace: 'HomePage'});
  //   console.log(`[${locale}/page.tsx HomePage] Successfully got translations for 'HomePage'`);
  // } catch (error: any) {
  //   console.error(`[${locale}/page.tsx HomePage] CATCH_ERROR getTranslations for 'HomePage':`, error.message, error.digest ? error.digest : 'N/A', error.stack ? error.stack : 'N/A');
  //   // Fallback t function
  //   t = (key: string) => `FB ${key} (${locale})`;
  // }


  return (
    <div className="space-y-8">
      <PageHeader
        title={t('welcomeTitle')}
        description={t('welcomeDescription')}
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-xl bg-gradient-to-br from-primary/20 via-background to-background p-8 shadow-lg">
        <div>
          <h2 className="font-headline text-3xl font-semibold text-primary mb-4">
            {t('startJourneyTitle')}
          </h2>
          <p className="text-lg text-foreground mb-6">
            {t('startJourneyDescription')}
          </p>
          <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/interview"> {/* Link might need locale prefix if routing depends on it */}
              {t('startInterviewButton')} <ArrowRight className="ms-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            alt={t('welcomeTitle')}
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover"
            data-ai-hint="medical AI"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-headline text-2xl font-semibold text-center text-foreground">
          {t('howItWorksTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bot className="h-6 w-6" />
                {t('aiConversationsTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('aiConversationsDescription')}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BrainCircuit className="h-6 w-6" />
                {t('intelligentAnalysisTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('intelligentAnalysisDescription')}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-6 w-6" />
                {t('securePrivateTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('securePrivateDescription')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center py-8">
        <p className="text-muted-foreground">
          {t('disclaimer')}
        </p>
      </section>
    </div>
  );
}
