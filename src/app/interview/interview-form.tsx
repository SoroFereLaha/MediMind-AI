
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MessageSquareText, User, Sparkles } from 'lucide-react';
import { aiPatientInterview, type AiPatientInterviewOutput } from '@/ai/flows/ai-patient-interview';
import { Badge } from '@/components/ui/badge';

export function InterviewForm() {
  const [patientName, setPatientName] = useState('');
  const [initialComplaint, setInitialComplaint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiPatientInterviewOutput | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await aiPatientInterview({ patientName, initialComplaint });
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="h-6 w-6 text-primary" />
          Commencer Votre Entretien
        </CardTitle>
        <CardDescription>
          Veuillez indiquer votre nom et vos symptômes initiaux ou préoccupations.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientName" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Votre Nom
            </Label>
            <Input
              id="patientName"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="ex: Jeanne Dupont"
              required
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialComplaint" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Plainte Initiale / Symptômes
            </Label>
            <Textarea
              id="initialComplaint"
              value={initialComplaint}
              onChange={(e) => setInitialComplaint(e.target.value)}
              placeholder="ex: Mal de tête persistant depuis 3 jours, fièvre légère..."
              required
              rows={4}
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" disabled={isLoading} size="lg" className="shadow-md">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              'Soumettre à l\'IA'
            )}
          </Button>
          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>

      {result && (
        <div className="p-6 border-t">
          <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">Résumé de l'Entretien et Prochaines Étapes</h3>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Résumé de l'Entretien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{result.interviewSummary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Spécialité Suggérée</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-lg px-3 py-1">{result.suggestedSpecialty}</Badge>
                 <p className="mt-2 text-sm text-muted-foreground">
                  D'après l'entretien, nous suggérons de consulter un spécialiste en {result.suggestedSpecialty}.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
}
