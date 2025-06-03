
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, Lightbulb, FileText, Users, Heart, Brain, AirVent, Eye, Baby, Droplets, Bone, Ear, BrainCog, HeartHandshake, Ribbon, Droplet, ShieldBan 
} from 'lucide-react';
import { getSpecialistInsights, type SpecialistInsightsOutput } from '@/ai/flows/ai-specialist-insights';

function StomachIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/><path d="M12 10v4m-2-2h4"/></svg>;}
function SkinIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 0-7.07 17.07A10 10 0 1 0 12 2Z"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>;}

const specialties = [
  { value: 'General Practice', label: 'Médecine Générale', icon: Users},
  { value: 'Cardiology', label: 'Cardiologie', icon: Heart },
  { value: 'Neurology', label: 'Neurologie', icon: Brain },
  { value: 'Pulmonology', label: 'Pneumologie', icon: AirVent },
  { value: 'Gastroenterology', label: 'Gastro-entérologie', icon: StomachIcon },
  { value: 'Dermatology', label: 'Dermatologie', icon: SkinIcon },
  { value: 'Ophthalmology', label: 'Ophtalmologie', icon: Eye },
  { value: 'Pediatrics', label: 'Pédiatrie', icon: Baby },
  { value: 'Endocrinology', label: 'Endocrinologie', icon: Droplets },
  { value: 'Rheumatology', label: 'Rhumatologie', icon: Bone },
  { value: 'Otorhinolaryngology', label: 'ORL', icon: Ear },
  { value: 'Psychiatry', label: 'Psychiatrie', icon: BrainCog },
  { value: 'Gynecology', label: 'Gynécologie', icon: HeartHandshake },
  { value: 'Oncology', label: 'Oncologie', icon: Ribbon },
  { value: 'Urology', label: 'Urologie', icon: Droplet },
  { value: 'Allergology', label: 'Allergologie', icon: ShieldBan },
];


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
  
  const selectedSpecialtyLabel = specialties.find(s => s.value === specialty)?.label || specialty;

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
              'Obtenir l\'Avis'
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
           <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">Avis de {selectedSpecialtyLabel}</h3>
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
