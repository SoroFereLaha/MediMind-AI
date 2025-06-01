
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Lightbulb, FileText, Users } from 'lucide-react';
import { getSpecialistInsights, type SpecialistInsightsOutput } from '@/ai/flows/ai-specialist-insights';

const specialties = [
  { value: 'Cardiology', label: 'Cardiologie', icon: HeartIcon },
  { value: 'Neurology', label: 'Neurologie', icon: BrainIcon },
  { value: 'Pulmonology', label: 'Pneumologie', icon: LungIcon },
  { value: 'Gastroenterology', label: 'Gastro-entérologie', icon: StomachIcon },
  { value: 'Dermatology', label: 'Dermatologie', icon: SkinIcon },
  { value: 'General Practice', label: 'Médecine Générale', icon: Users},
];

function HeartIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function BrainIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5V6H4.78A2.5 2.5 0 0 0 2.5 8.22v3.92A2.5 2.5 0 0 0 4 14.5V16a2.5 2.5 0 0 0 2.5 2.5h.5A2.5 2.5 0 0 0 9.5 21V6.5A2.5 2.5 0 0 0 7 4V2.5A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5V6h7.22A2.5 2.5 0 0 1 21.5 8.22v3.92A2.5 2.5 0 0 1 20 14.5V16a2.5 2.5 0 0 1-2.5 2.5h-.5A2.5 2.5 0 0 1 14.5 21V6.5A2.5 2.5 0 0 1 17 4V2.5A2.5 2.5 0 0 0 14.5 2Z"/></svg>; }
function LungIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14c-1.265-1.441-2-3.26-2-5a4 4 0 1 1 8 0c0 1.74-.735 3.559-2 5Z"/><path d="M18.84 11.42A6.14 6.14 0 0 0 18 10c0-3.771 3-5 3-5s-3 1.229-3 5c0 .552.082 1.085.232 1.585A10.02 10.02 0 0 1 12 18a10.02 10.02 0 0 1-6.232-4.415C5.918 13.085 6 12.552 6 12c0-3.771-3-5-3-5s3 1.229 3 5c0 .552-.082 1.085-.232 1.585A6.14 6.14 0 0 0 6 10a6 6 0 0 0 5 5.917V18"/><path d="M12 21v-3"/><path d="M6 10c0-1.03.243-2.011.691-2.886"/><path d="M18 10c0-1.03-.243-2.011-.691-2.886"/></svg>; }
function StomachIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/><path d="M12 10v4m-2-2h4"/></svg>;}
function SkinIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 0-7.07 17.07A10 10 0 1 0 12 2Z"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>;}


export function InsightsForm() {
  const [patientInfo, setPatientInfo] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SpecialistInsightsOutput | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!specialty) {
      setError('Veuillez sélectionner une spécialité.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await getSpecialistInsights({ patientInfo, specialty });
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
         <Lightbulb className="h-6 w-6 text-primary" />
          Demander un Avis Spécialisé
        </CardTitle>
        <CardDescription>
          Fournissez des informations patient complètes et sélectionnez une spécialité pour une analyse par l'IA.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientInfo" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Informations du Patient
            </Label>
            <Textarea
              id="patientInfo"
              value={patientInfo}
              onChange={(e) => setPatientInfo(e.target.value)}
              placeholder="Inclure symptômes, antécédents médicaux, résultats de tests, etc."
              required
              rows={8}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Spécialité Médicale
            </Label>
            <Select value={specialty} onValueChange={setSpecialty} required>
              <SelectTrigger id="specialty" className="text-base">
                <SelectValue placeholder="Sélectionnez une spécialité" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec) => (
                  <SelectItem key={spec.value} value={spec.value}>
                    <div className="flex items-center gap-2">
                      <spec.icon className="h-4 w-4 text-muted-foreground" />
                      {spec.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" disabled={isLoading} size="lg" className="shadow-md">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              "Obtenir l'Avis"
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
          <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">Avis de {specialty}</h3>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyse Détaillée</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{result.insights}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recommandations et Prochaines Étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{result.recommendations}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
}
