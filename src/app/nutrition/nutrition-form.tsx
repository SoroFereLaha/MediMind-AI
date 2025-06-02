
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Salad, MapPin, CalendarDays, Lightbulb, Sparkles } from 'lucide-react';
import { getFoodRecommendationFromApi, type FoodRecommendationResponse } from '@/lib/python-api-client';

export function NutritionForm() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [date, setDate] = useState(''); // ISO 8601 format e.g., YYYY-MM-DD

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoodRecommendationResponse | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const params: { location_lat?: string; location_lon?: string; date?: string } = {};
      if (latitude) params.location_lat = latitude;
      if (longitude) params.location_lon = longitude;
      if (date) params.date = date;

      const output = await getFoodRecommendationFromApi(params);
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur inconnue est survenue lors de l\'appel à l\'API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Salad className="h-6 w-6 text-primary" />
          Vos Paramètres pour les Recommandations
        </CardTitle>
        <CardDescription>
          Fournissez votre localisation et la date (optionnel) pour obtenir des recommandations alimentaires.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Latitude (Optionnel)
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="ex: 48.8566"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Longitude (Optionnel)
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="ex: 2.3522"
                className="text-base"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> Date (Optionnel)
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">Format attendu : AAAA-MM-JJ (ISO 8601)</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" disabled={isLoading} size="lg" className="shadow-md">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recherche en cours...
              </>
            ) : (
              'Obtenir les Recommandations Nutritionnelles'
            )}
          </Button>
          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTitle>Erreur API</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>

      {result && (
        <div className="p-6 border-t">
          <h3 className="font-headline text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Vos Recommandations Nutritionnelles
          </h3>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-base">
                <p><strong>Objectif quotidien :</strong> {result.calories.daily_target.toLocaleString()} kcal</p>
                <p><strong>Consommées aujourd'hui :</strong> {result.calories.consumed_today.toLocaleString()} kcal</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Suggestions d'Aliments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.food_recommendations && result.food_recommendations.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-base">
                    {result.food_recommendations.map((foodId, index) => (
                      <li key={index}>ID Aliment : {foodId}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base text-muted-foreground">Aucune suggestion d'aliment spécifique pour le moment.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base whitespace-pre-wrap">{result.message}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
}
