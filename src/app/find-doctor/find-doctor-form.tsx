
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, User, Users, Search, Activity, MapPin, BadgeInfo, Building, LocateFixed, Globe } from 'lucide-react';
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
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FindDoctorBySymptomsOutput | null>(null);

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setPostalCode(''); // Effacer le code postal si la géoloc est utilisée
        setIsLocating(false);
      },
      (geoError) => {
        setLocationError(`Erreur de géolocalisation: ${geoError.message}`);
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const inputData: FindDoctorBySymptomsInput = {
      symptoms,
      age: age ? parseInt(age, 10) : undefined,
      sex: sex || undefined,
    };

    if (latitude && longitude) {
      inputData.latitude = latitude;
      inputData.longitude = longitude;
    } else if (postalCode) {
      inputData.postalCode = postalCode;
    }


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
          Fournissez vos symptômes et des informations optionnelles pour obtenir une suggestion de spécialité. La recherche de médecins utilise votre localisation (si autorisée) ou un code postal, et simule un appel à une API externe.
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Input 
                id="sex"
                type="text"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                placeholder="ex: Féminin, Masculin"
                className="text-base"
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-6 mt-4">
             <h4 className="text-md font-medium text-foreground mb-2">Localisation pour la recherche</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="space-y-2 flex-1">
                <Label htmlFor="postalCode" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Code Postal (Optionnel)
                </Label>
                <Input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => {
                    setPostalCode(e.target.value);
                    if (e.target.value) { // Si un code postal est saisi, effacer lat/lon
                      setLatitude(null);
                      setLongitude(null);
                    }
                  }}
                  placeholder="ex: 75001 (si non géolocalisé)"
                  className="text-base"
                  disabled={!!(latitude && longitude)}
                />
              </div>
              <div className="sm:pt-7">
                 <span className="text-sm text-muted-foreground hidden sm:inline">OU</span>
              </div>
              <div className="space-y-2 flex-1">
                 <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Par Géolocalisation
                </Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGeoLocation} 
                  disabled={isLocating}
                  className="w-full"
                >
                  {isLocating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <LocateFixed className="mr-2 h-4 w-4" />
                  {latitude && longitude ? "Position actuelle utilisée" : "Utiliser ma position actuelle"}
                </Button>
              </div>
            </div>
            {locationError && <Alert variant="destructive"><AlertDescription>{locationError}</AlertDescription></Alert>}
             {latitude && longitude && <p className="text-xs text-muted-foreground">Position détectée : Lat {latitude.toFixed(4)}, Lon {longitude.toFixed(4)}. Le code postal sera ignoré.</p>}
          </div>

        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <Button type="submit" disabled={isLoading || isLocating} size="lg" className="shadow-md">
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

          <h4 className="font-headline text-xl font-semibold mb-3">Médecins correspondants (Simulation API)</h4>
          <Alert variant="default" className="mb-4">
            <BadgeInfo className="h-4 w-4" />
            <AlertDescription dangerouslySetInnerHTML={{ __html: result.searchNote }} />
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
                    {doctor.distance && <p>Distance approx. : {doctor.distance}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun médecin (simulé) n'a été trouvé pour la spécialité "{result.suggestedSpecialty}" avec la localisation fournie. Veuillez essayer d'élargir vos critères ou vérifier la logique de simulation d'API.</p>
          )}
        </div>
      )}
    </Card>
  );
}

