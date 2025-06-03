
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileHeart, Activity, ShieldAlert, User, Users, Moon } from 'lucide-react';
import { getContextualRecommendations, type ContextualRecommendationsOutput, type ContextualRecommendationsInput } from '@/ai/flows/ai-contextual-recommendation-notifications';
// To translate this form, import and use useTranslations from 'next-intl'
// Example:
// import { useTranslations } from 'next-intl';
// const t = useTranslations('RecommendationsForm');
// Then use t('someKey') for labels, placeholders, button text etc.

export function RecommendationsForm() {
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState('');
  const [currentActivityLevel, setCurrentActivityLevel] = useState('');
  const [recentSleepQuality, setRecentSleepQuality] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContextualRecommendationsOutput | null>(null);

  // Placeholder for translations - replace with actual useTranslations if i18n is re-enabled
  const t = (key: string, defaultText?: string) => {
    const translations: Record<string, string> = {
      formTitle: "Obtenir des Recommandations Personnalisées",
      formDescription: "Partagez vos symptômes actuels, vos antécédents médicaux et votre contexte pour des conseils sur mesure.",
      symptomsLabel: "Symptômes Actuels (Obligatoire)",
      symptomsPlaceholder: "Décrivez vos symptômes en détail...",
      historyLabel: "Antécédents Médicaux (Obligatoire)",
      historyPlaceholder: "Maladies passées pertinentes, conditions chroniques, allergies, médicaments...",
      ageLabel: "Âge (Optionnel)",
      agePlaceholder: "ex: 30",
      sexLabel: "Sexe (Optionnel)",
      sexPlaceholder: "Sélectionnez le sexe",
      male: "Masculin",
      female: "Féminin",
      // "Autre" retiré
      activityLabel: "Niveau d'Activité Actuel (Optionnel)",
      activityPlaceholder: "Sélectionnez le niveau d'activité",
      sedentary: "Sédentaire (ex: moins de 30 min/jour d'activité modérée)",
      light: "Léger (ex: 30-60 min/jour d'activité modérée)",
      moderate: "Modéré (ex: 60-90 min/jour d'activité modérée ou activité intense régulière)",
      active: "Actif (ex: >90 min/jour d'activité modérée ou entraînement intense quotidien)",
      sleepLabel: "Qualité du Sommeil Récent (Optionnel)",
      sleepDescription: "La qualité de votre sommeil influence votre énergie, votre humeur et votre récupération. Comment l'évaluez-vous ?",
      sleepPlaceholder: "Sélectionnez la qualité du sommeil",
      poor: "Mauvaise",
      average: "Moyenne",
      good: "Bonne",
      submitButton: "Obtenir des Recommandations",
      loadingButton: "Génération en cours...",
      errorTitle: "Erreur",
      resultsTitle: "Recommandations de l'IA",
      resultsCardTitle: "Conseils de Santé Proactifs",
      unknownError: "Une erreur inconnue est survenue."
    };
    return translations[key] || defaultText || key;
  };


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
      // Location and timeOfDay are no longer collected from this form
    };

    try {
      const output = await getContextualRecommendations(inputData);
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileHeart className="h-6 w-6 text-primary" />
          {t('formTitle')}
        </CardTitle>
        <CardDescription>
          {t('formDescription')}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="symptoms" className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> {t('symptomsLabel')}
            </Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t('symptomsPlaceholder')}
              required
              rows={3}
              className="text-base"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="medicalHistory" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> {t('historyLabel')}
            </Label>
            <Textarea
              id="medicalHistory"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder={t('historyPlaceholder')}
              required
              rows={3}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <User className="h-4 w-4" /> {t('ageLabel')}
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder={t('agePlaceholder')}
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {t('sexLabel')}
            </Label>
            <Select value={sex} onValueChange={setSex}>
              <SelectTrigger id="sex" className="text-base">
                <SelectValue placeholder={t('sexPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">{t('male')}</SelectItem>
                <SelectItem value="Female">{t('female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentActivityLevel" className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> {t('activityLabel')}
            </Label>
            <Select value={currentActivityLevel} onValueChange={setCurrentActivityLevel}>
              <SelectTrigger id="currentActivityLevel" className="text-base">
                <SelectValue placeholder={t('activityPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedentary">{t('sedentary')}</SelectItem>
                <SelectItem value="Light">{t('light')}</SelectItem>
                <SelectItem value="Moderate">{t('moderate')}</SelectItem>
                <SelectItem value="Active">{t('active')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recentSleepQuality" className="flex items-center gap-2">
              <Moon className="h-4 w-4" /> {t('sleepLabel')}
            </Label>
            <p className="text-xs text-muted-foreground">{t('sleepDescription')}</p>
            <Select value={recentSleepQuality} onValueChange={setRecentSleepQuality}>
              <SelectTrigger id="recentSleepQuality" className="text-base">
                <SelectValue placeholder={t('sleepPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Poor">{t('poor')}</SelectItem>
                <SelectItem value="Average">{t('average')}</SelectItem>
                <SelectItem value="Good">{t('good')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pt-6">
          <Button type="submit" disabled={isLoading} size="lg" className="shadow-md">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('loadingButton')}
              </>
            ) : (
              t('submitButton')
            )}
          </Button>
          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTitle>{t('errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>

      {result && (
        <div className="p-6 border-t">
          <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">{t('resultsTitle')}</h3>
          <Card>
            <CardHeader>
              <CardTitle>{t('resultsCardTitle')}</CardTitle>
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
