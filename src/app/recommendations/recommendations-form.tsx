'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, FileHeart, Activity, ShieldAlert } from 'lucide-react';
import { getContextualRecommendations, type ContextualRecommendationsOutput } from '@/ai/flows/ai-contextual-recommendation-notifications';

export function RecommendationsForm() {
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContextualRecommendationsOutput | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await getContextualRecommendations({ symptoms, medicalHistory });
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileHeart className="h-6 w-6 text-primary" />
          Get Personalized Recommendations
        </CardTitle>
        <CardDescription>
          Share your current symptoms and relevant medical history for tailored advice.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> Current Symptoms
            </Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail..."
              required
              rows={5}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medicalHistory" className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Medical History
            </Label>
            <Textarea
              id="medicalHistory"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="Relevant past illnesses, chronic conditions, allergies, medications..."
              required
              rows={5}
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" disabled={isLoading} size="lg" className="shadow-md">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Get Recommendations'
            )}
          </Button>
          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>

      {result && (
        <div className="p-6 border-t">
          <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">AI Recommendations</h3>
          <Card>
            <CardHeader>
              <CardTitle>Proactive Health Advice</CardTitle>
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
