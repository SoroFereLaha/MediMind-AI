
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { RecommendedMedicationSchema } from '@/ai/types/medication-recommendation-types';
import type { z } from 'zod';

// Type for medication recommendations
interface ProcessedDrugRecommendation extends z.infer<typeof RecommendedMedicationSchema> {
  // Champ supplémentaire spécifique au formulaire
  posologie_adulte?: string;
  // On conserve éventuellement "indication" si certaines API l'utilisent encore
  indication?: string;
}

interface MedicationRecommendationResponse {
  suggestedMedications: ProcessedDrugRecommendation[];
  processedSymptoms: string;
  importantWarning: string;
}
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Pill, AlertTriangle, User, ShieldAlert, HeartCrack, ListPlus, ShieldCheck, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { getCurrentPosition, searchHealthEstablishments, type HealthEstablishment } from '@/lib/services/locationService';
import { getMedicationRecommendations } from '@/ai/flows/ai-medication-recommendation';
import type { DrugSummary } from '@/lib/services/deepseekService';

export function MedicationForm() {
  async function handleFindPharmacies() {
    try {
      setIsSearching(true);
      const { lat, lon } = await getCurrentPosition();
      const results = await searchHealthEstablishments({ lat, lon, type: 'pharmacie', rayon: 5 });
      setPharmacies(results);
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la recherche de pharmacies.');
    } finally {
      setIsSearching(false);
    }
  }
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [knownAllergies, setKnownAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [medicationResults, setMedicationResults] = useState<ProcessedDrugRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ 
    processedSymptoms: string; 
    importantWarning: string; 
    suggestedMedications: ProcessedDrugRecommendation[] 
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pharmacies, setPharmacies] = useState<HealthEstablishment[]>([]);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showAllPharmacies, setShowAllPharmacies] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const inputData = {
      symptoms,
      age: age ? parseInt(age, 10) : undefined,
      sex: sex || undefined,
      knownAllergies: knownAllergies || undefined,
      currentMedications: currentMedications || undefined,
    };

    try {
      const output = await getMedicationRecommendations(inputData) as MedicationRecommendationResponse;
      // DEBUG: Log the raw backend output for medication recommendations
      console.log('[DEBUG][MedicationForm] Raw backend output:', output);
      const results: ProcessedDrugRecommendation[] = output.suggestedMedications.map((item) => ({
        ...item,
        nom: item.nom || 'Nom inconnu',
        indication: item.indication || 'Indication non précisée',
        posologie_adulte: item.posologie_adulte || '',
        effets_secondaires: item.effets_secondaires || '',
        contre_indications: item.contre_indications || '',
        avertissements: item.avertissements || ''
      }));
      setMedicationResults(results);
      setResult({
        processedSymptoms: output.processedSymptoms,
        importantWarning: output.importantWarning,
        suggestedMedications: results,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur inconnue est survenue lors de la récupération des suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" />
          Demander des Suggestions de Médicaments
        </CardTitle>
         <CardDescription className="text-muted-foreground">
           Suggestions de médicaments basées sur vos symptômes.
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
                <Label htmlFor="sex" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Sexe (Optionnel)
                </Label>
                <select
                  id="sex"
                  value={sex}
                  onChange={e => setSex(e.target.value)}
                  className="text-base border rounded px-3 py-2 w-full bg-background dark:bg-background"
                >
                  <option value="">Non spécifié</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
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
                  onChange={e => setCurrentMedications(e.target.value)}
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
      </Card>
      
      {result && (
        <Card className="shadow-lg">
          <div className="p-6">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>AVERTISSEMENT TRÈS IMPORTANT</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {result.importantWarning}
            </AlertDescription>
          </Alert>
          <h3 className="font-headline text-xl font-semibold mb-2">Suggestions pour : "{result.processedSymptoms}"</h3>
          
          {medicationResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {medicationResults.map((med, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col gap-2">
                  <h3 className="font-bold text-xl text-blue-900 dark:text-blue-200 mb-2">
                    {med.nom}
                  </h3>
                  {med.indication && (
                    <div className="mb-1">
                      <span className="font-semibold">Indication :</span>{' '}
                      <span className="font-normal">{med.indication}</span>
                    </div>
                  )}
                  {med.posologie_adulte && (
                    <div className="mb-1">
                      <span className="font-semibold">Posologie adulte :</span>{' '}
                      <span className="font-normal">{med.posologie_adulte}</span>
                    </div>
                  )}
                  {med.effets_secondaires && (
                    <div className="mb-1">
                      <span className="font-semibold">Effets secondaires :</span>{' '}
                      <span className="font-normal">{med.effets_secondaires}</span>
                    </div>
                  )}
                  {med.contre_indications && (
                    <div className="mb-1">
                      <span className="font-semibold">Contre-indications :</span>{' '}
                      <span className="font-normal">{med.contre_indications}</span>
                    </div>
                  )}
                  {med.avertissements && (
                    <div className="mb-1">
                      <span className="font-semibold">Avertissements :</span>{' '}
                      <span className="font-normal">{med.avertissements}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-8">
              <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
              <div className="text-destructive font-semibold text-center">
                Aucune suggestion n'a pu être générée. Vérifiez votre saisie ou réessayez plus tard.
              </div>
            </div>
          )}

          {/* Pharmacies à proximité : uniquement si suggestions */}
          {medicationResults.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleFindPharmacies}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Trouver une pharmacie à proximité
                    </>
                  )}
                </Button>
              </div>
              
              {pharmacies.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pharmacies.slice(0, showAllPharmacies ? pharmacies.length : 10).map((pharma, index) => (
                    <div key={pharma.id} className="p-4 border rounded-lg bg-card/70 backdrop-blur-sm shadow-sm hover:border-primary/60 transition-colors">
                      <h4 className="font-medium text-base text-foreground">{pharma.name}</h4>
                      <p className="text-sm text-muted-foreground">{pharma.address}</p>
                      <p className="text-sm text-muted-foreground">{pharma.distance.toFixed(2)} km</p>
                      {pharma.phone && (
                        <p className="text-xs text-muted-foreground">{pharma.phone}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${pharma.lat},${pharma.lon}`, '_blank')}
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Itinéraire
                        </Button>
                        {pharma.website && (
                          <a 
                            href={pharma.website.startsWith('http') ? pharma.website : `http://${pharma.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2 text-xs"
                          >
                            Site web
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                {pharmacies.length > 10 && !showAllPharmacies && (
                  <div className="col-span-full flex justify-center mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAllPharmacies(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-4 py-2 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Voir plus ({pharmacies.length - 10} autres)
                    </button>
                  </div>
                )}
                {showAllPharmacies && (
                  <div className="col-span-full flex justify-center mt-2">
                    <button
                      type="button"
                      onClick={() => setShowAllPharmacies(false)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Voir moins
                    </button>
                  </div>
                )}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Aucune pharmacie trouvée à proximité.
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    )}
  </div>
  );
}