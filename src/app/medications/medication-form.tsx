
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Pill, AlertTriangle, User, ShieldAlert, HeartCrack, ListPlus, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  getMedicationRecommendations, 
  type MedicationRecommendationOutput,
  type MedicationRecommendationInput
} from '@/ai/flows/ai-medication-recommendation';

export function MedicationForm() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState<string>('');
  const [knownAllergies, setKnownAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MedicationRecommendationOutput | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const inputData: MedicationRecommendationInput = {
      symptoms,
      age: age ? parseInt(age, 10) : undefined,
      knownAllergies: knownAllergies || undefined,
      currentMedications: currentMedications || undefined,
    };

    try {
      const output = await getMedicationRecommendations(inputData);
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur inconnue est survenue lors de la récupération des suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          Demander des Suggestions de Médicaments
        </CardTitle>
        <CardDescription className="text-destructive font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          IMPORTANT : Ces suggestions sont générées par une IA et ne remplacent JAMAIS un avis médical. Consultez toujours un professionnel de santé.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="flex items-center gap-2">
              <ListPlus className="h-4 w-4" /> Symptômes (Obligatoire)
            </Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Décrivez vos symptômes en détail..."
              required
              rows={4}
              className="text-base"
            />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="w-full sm:w-auto"
          >
            {showOptionalFields ? "Masquer les informations complémentaires" : "Afficher les informations complémentaires (recommandé)"}
            {showOptionalFields ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>

          {showOptionalFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t mt-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Âge (Optionnel)
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="ex: 30"
                  className="text-base"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="knownAllergies" className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" /> Allergies Connues (Optionnel)
                </Label>
                <Input
                  id="knownAllergies"
                  type="text"
                  value={knownAllergies}
                  onChange={(e) => setKnownAllergies(e.target.value)}
                  placeholder="ex: Pénicilline, Aspirine"
                  className="text-base"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="currentMedications" className="flex items-center gap-2">
                  <HeartCrack className="h-4 w-4" /> Médicaments Actuels (Optionnel)
                </Label>
                <Textarea
                  id="currentMedications"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="Listez les médicaments que vous prenez actuellement, y compris les dosages si connus..."
                  rows={2}
                  className="text-base"
                />
                 <p className="text-xs text-muted-foreground">Fournir cette information peut aider à identifier des interactions potentielles. Un professionnel de santé doit toujours valider.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" disabled={isLoading} size="lg" className="shadow-md">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recherche de suggestions...
              </>
            ) : (
              'Obtenir les Suggestions'
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
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>AVERTISSEMENT TRÈS IMPORTANT</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {result.importantWarning}
            </AlertDescription>
          </Alert>

          <h3 className="font-headline text-xl font-semibold mb-2">Suggestions pour : "{result.processedSymptoms}"</h3>
          
          {result.suggestedMedications.length > 0 ? (
            <ul className="space-y-4">
              {result.suggestedMedications.map((med, index) => (
                <li key={index} className="p-4 border rounded-md shadow-sm bg-card">
                  <p className="font-semibold text-lg text-primary">{med.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{med.reason}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune suggestion de médicament spécifique n'a été trouvée pour les symptômes fournis et les informations complémentaires. Cela ne signifie pas qu'il n'existe pas de traitement. Veuillez consulter un professionnel de santé.</p>
          )}
        </div>
      )}
    </Card>
  );
}
    