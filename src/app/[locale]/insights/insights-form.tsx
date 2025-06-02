
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
// To translate this form, import and use useTranslations from 'next-intl'
// Example:
// import { useTranslations } from 'next-intl';
// const t = useTranslations('InsightsForm');
// Then use t('someKey') for labels, placeholders, button text etc.

// Icônes SVG personnalisées conservées car pas d'équivalent direct simple dans Lucide
function StomachIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/><path d="M12 10v4m-2-2h4"/></svg>;}
function SkinIcon(props: React.SVGProps<SVGSVGElement>) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 0 0-7.07 17.07A10 10 0 1 0 12 2Z"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>;}

const specialties = [
  { value: 'General Practice', label: 'General Practice', icon: Users}, // Labels need translation for this file if i18n is re-enabled
  { value: 'Cardiology', label: 'Cardiology', icon: Heart },
  { value: 'Neurology', label: 'Neurology', icon: Brain },
  { value: 'Pulmonology', label: 'Pulmonology', icon: AirVent },
  { value: 'Gastroenterology', label: 'Gastroenterology', icon: StomachIcon },
  { value: 'Dermatology', label: 'Dermatology', icon: SkinIcon },
  { value: 'Ophthalmology', label: 'Ophthalmology', icon: Eye },
  { value: 'Pediatrics', label: 'Pediatrics', icon: Baby },
  { value: 'Endocrinology', label: 'Endocrinology', icon: Droplets },
  { value: 'Rheumatology', label: 'Rheumatology', icon: Bone },
  { value: 'Otorhinolaryngology', label: 'Otorhinolaryngology (ENT)', icon: Ear },
  { value: 'Psychiatry', label: 'Psychiatry', icon: BrainCog },
  { value: 'Gynecology', label: 'Gynecology', icon: HeartHandshake },
  { value: 'Oncology', label: 'Oncology', icon: Ribbon },
  { value: 'Urology', label: 'Urology', icon: Droplet },
  { value: 'Allergology', label: 'Allergology', icon: ShieldBan },
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
      setError('Please select a specialty.'); // Placeholder - needs translation
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const output = await getSpecialistInsights({ patientInfo, specialty });
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.'); // Placeholder - needs translation
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
          Request Specialist Insights 
        </CardTitle>
        <CardDescription>
          Provide comprehensive patient information and select a specialty for AI-driven analysis. 
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patientInfo" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Patient Information 
            </Label>
            <Textarea
              id="patientInfo"
              value={patientInfo}
              onChange={(e) => setPatientInfo(e.target.value)}
              placeholder="Include symptoms, medical history, test results, etc." 
              required
              rows={8}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Medical Specialty 
            </Label>
            <Select value={specialty} onValueChange={setSpecialty} required>
              <SelectTrigger id="specialty" className="text-base">
                <SelectValue placeholder="Select a specialty" /> 
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
                Analyzing... 
              </>
            ) : (
              'Get Insights' 
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
           <h3 className="font-headline text-2xl font-semibold mb-4 text-primary">{selectedSpecialtyLabel} Insights</h3>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle> 
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{result.insights}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recommendations & Next Steps</CardTitle> 
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
