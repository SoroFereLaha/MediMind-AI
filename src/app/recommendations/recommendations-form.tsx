
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileHeart, Activity, ShieldAlert, User, Users, Moon, MapPin, Clock } from 'lucide-react';
import { getContextualRecommendations, type ContextualRecommendationsOutput, type ContextualRecommendationsInput } from '@/ai/flows/ai-contextual-recommendation-notifications';

export function RecommendationsForm() {
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState('');
  const [currentActivityLevel, setCurrentActivityLevel] = useState('');
  const [recentSleepQuality, setRecentSleepQuality] = useState('');
  const [location, setLocation] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContextualRecommendationsOutput | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const inputData: ContextualRecommendationsInput = {
      symptoms,
      medicalHistory,
      age: age ? parseInt(age, 10) : undefined,
      sex: sex || undefined,
      currentActivityLevel: currentActivityLevel || undefined,
      recentSleepQuality: recentSleepQuality || undefined,
      location: location || undefined,
      timeOfDay: timeOfDay || undefined,
    };

    try {
      const output = await getContextualRecommendations(inputData);
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
          <FileHeart className="h-6 w-6 text-primary" />
          Obtenir des Recommandations Personnalisées
        </CardTitle>
        <CardDescription>
          Partagez vos symptômes, antécédents et contexte pour des conseils sur mesure.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> Symptômes Actuels (Obligatoire)
            </Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Décrivez vos symptômes en détail..."
              required
              rows={3}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalHistory" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Antécédents Médicaux (Obligatoire)
            </Label>
            <Textarea
              id="medicalHistory"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="Maladies passées, conditions chroniques, allergies..."
              required
              rows={3}
              className="text-base"
            />
          </div>

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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Sexe (Optionnel)
            </Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger id="sex" className="text-base">
                <SelectValue placeholder="Sélectionnez le sexe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Masculin</SelectItem>
                <SelectItem value="Female">Féminin</SelectItem>
                <SelectItem value="Other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentActivityLevel" className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> Niveau d'Activité Actuel (Optionnel)
            </Label>
            <Select value={currentActivityLevel} onValueChange={setCurrentActivityLevel}>
              <SelectTrigger id="currentActivityLevel" className="text-base">
                <SelectValue placeholder="Niveau d'activité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedentary">Sédentaire</SelectItem>
                <SelectItem value="Light">Léger</SelectItem>
                <SelectItem value="Moderate">Modéré</SelectItem>
                <SelectItem value="Active">Actif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recentSleepQuality" className="flex items-center gap-2">
              <Moon className="h-4 w-4" /> Qualité du Sommeil Récent (Optionnel)
            </Label>
            <Select value={recentSleepQuality} onValueChange={setRecentSleepQuality}>
              <SelectTrigger id="recentSleepQuality" className="text-base">
                <SelectValue placeholder="Qualité du sommeil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Poor">Mauvaise</SelectItem>
                <SelectItem value="Average">Moyenne</SelectItem>
                <SelectItem value="Good">Bonne</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Localisation (Optionnel <span className="text-xs text-muted-foreground">peut être détectée avec permission</span>)
            </Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex: Paris, France"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeOfDay" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Moment de la journée (Optionnel <span className="text-xs text-muted-foreground">peut être détecté avec permission</span>)
            </Label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger id="timeOfDay" className="text-base">
                <SelectValue placeholder="Sélectionnez le moment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Matin</SelectItem>
                <SelectItem value="Afternoon">Après-midi</SelectItem>
                <SelectItem value="Evening">Soir</SelectItem>
                <SelectItem value="Night">Nuit</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pt-6">
          <Button type="submit" disabled={isLoading} size="lg" className="shadow-md">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              'Obtenir des Recommandations'
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
          <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">Recommandations de l'IA</h3>
          <Card>
            <CardHeader>
              <CardTitle>Conseils de Santé Proactifs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{result.recommendations}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}
