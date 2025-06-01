
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import { ArrowRight, Bot, Shield, BrainCircuit } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome to MediMind AI"
        description="Your intelligent health companion, providing AI-powered insights and guidance for your well-being."
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-xl bg-gradient-to-br from-primary/20 via-background to-background p-8 shadow-lg">
        <div>
          <h2 className="font-headline text-3xl font-semibold text-primary mb-4">
            Start Your Health Journey
          </h2>
          <p className="text-lg text-foreground mb-6">
            Begin with our AI Patient Interview to explore your symptoms and health concerns. MediMind AI will guide you through a series of questions to understand your situation better.
          </p>
          <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/interview">
              Start AI Patient Interview <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            alt="AI Doctor Illustration"
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover"
            data-ai-hint="medical AI"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-headline text-2xl font-semibold text-center text-foreground">
          How MediMind AI Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bot className="h-6 w-6" />
                AI-Powered Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Engage in a guided interview with our AI to discuss your symptoms and medical history.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BrainCircuit className="h-6 w-6" />
                Intelligent Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Receive insights based on specialist knowledge and contextual recommendations tailored to you.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Shield className="h-6 w-6" />
                Secure & Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your data is handled with the utmost care, ensuring privacy and security throughout the process.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center py-8">
        <p className="text-muted-foreground">
          MediMind AI is intended for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or treatment.
        </p>
      </section>
    </div>
  );
}
