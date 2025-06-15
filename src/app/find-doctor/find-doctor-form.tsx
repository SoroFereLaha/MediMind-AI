
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, User, Users, Search, Activity, MapPin, BadgeInfo, Building } from 'lucide-react';
import { 
  findDoctorBySymptoms, 
  type FindDoctorBySymptomsOutput,
  type FindDoctorBySymptomsInput
} from '@/ai/flows/ai-find-doctor-flow';
import { Badge } from '@/components/ui/badge';

export function FindDoctorForm() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FindDoctorBySymptomsOutput | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const inputData: FindDoctorBySymptomsInput = {
      symptoms,
      age: age ? parseInt(age, 10) : undefined,
      sex: sex || undefined,
      postalCode: postalCode || undefined,
    };

    try {
      const output = await findDoctorBySymptoms(inputData);
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
          <Search className="h-6 w-6 text-primary" />
          Recherche de Médecin Assistée par IA
        </CardTitle>
        <CardDescription>
          Fournissez vos symptômes et quelques informations optionnelles pour obtenir une suggestion de spécialité et une liste de médecins (actuellement simulée).
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> Vos Symptômes (Obligatoire)
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Âge (Optionnel)
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="ex: 35"
                className="text-base"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Sexe (Optionnel)
              </Label>
              <Input // Ou un Select si vous préférez
                id="sex"
                type="text"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                placeholder="ex: Féminin, Masculin"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Code Postal (Optionnel)
              </Label>
              <Input
                id="postalCode"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="ex: 75001"
                className="text-base"
              />
            </div>
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
              'Obtenir Suggestions et Médecins'
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
          <h3 className="font-headline text-2xl font-semibold mb-2 text-primary">Résultats de votre recherche</h3>
          
          <Card className="mb-6 bg-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BadgeInfo className="h-5 w-5" />
                Spécialité Suggérée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-lg px-3 py-1 mb-2">{result.suggestedSpecialty}</Badge>
              <p className="text-sm text-foreground/80">{result.reasoning}</p>
            </CardContent>
          </Card>

          <h4 className="font-headline text-xl font-semibold mb-3">Médecins correspondants (Simulation)</h4>
          <Alert variant="default" className="mb-4">
            <BadgeInfo className="h-4 w-4" />
            <AlertDescription>{result.searchNote}</AlertDescription>
          </Alert>
          
          {result.doctors.length > 0 ? (
            <div className="space-y-4">
              {result.doctors.map((doctor, index) => (
                <Card key={index} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">{doctor.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{doctor.specialty}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Building className="h-4 w-4" /> {doctor.address}</p>
                    {doctor.phone && <p>Tél : {doctor.phone}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun médecin (simulé) n'a été trouvé pour la spécialité "{result.suggestedSpecialty}". Cela peut être dû à la nature des données de simulation.</p>
          )}
        </div>
      )}
    </Card>
  );
}

