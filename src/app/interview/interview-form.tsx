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
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="h-6 w-6 text-primary" />
          Start Your Interview
        </CardTitle>
        <CardDescription>
          Please provide your name and initial symptoms or concerns.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientName" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Your Name
            </Label>
            <Input
              id="patientName"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g., Jane Doe"
              required
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialComplaint" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Initial Complaint / Symptoms
            </Label>
            <Textarea
              id="initialComplaint"
              value={initialComplaint}
              onChange={(e) => setInitialComplaint(e.target.value)}
              placeholder="e.g., Persistent headache for 3 days, mild fever..."
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
                Processing...
              </>
            ) : (
              'Submit to AI'
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
          <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">Interview Summary & Next Steps</h3>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{result.interviewSummary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Suggested Specialty</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-lg px-3 py-1">{result.suggestedSpecialty}</Badge>
                 <p className="mt-2 text-sm text-muted-foreground">
                  Based on the interview, we suggest consulting a specialist in {result.suggestedSpecialty}.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
}
