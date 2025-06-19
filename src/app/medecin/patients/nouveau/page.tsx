
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FilePlus, User, CalendarDays, VenetianMask, Stethoscope, StickyNote } from 'lucide-react';
import { useAppContext, type PatientRecordInput } from '@/contexts/app-context';
import { useRouter } from 'next/navigation'; 

export default function NouvelleFichePage() {
  const { addPatientRecord } = useAppContext();
  const router = useRouter(); 
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState('');
  const [disease, setDisease] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!firstName || !lastName || !dob || !sex || !disease || !notes) {
      setError("Tous les champs sont obligatoires.");
      setIsLoading(false);
      return;
    }

    const recordInput: PatientRecordInput = {
      patientFirstName: firstName,
      patientLastName: lastName,
      patientDOB: dob, // Garder comme string, le backend/DB le convertira en Date
      patientSex: sex,
      disease,
      notes,
    };

    try {
      // TODO: Vérifier que l'utilisateur médecin est bien authentifié avant cet appel.
      // Le doctorId devrait être récupéré côté backend à partir de la session de l'utilisateur.
      const newRecord = await addPatientRecord(recordInput);
      if (newRecord) {
        setSuccessMessage(`Fiche de suivi pour ${newRecord.patientFirstName} ${newRecord.patientLastName} (ID: ${newRecord.id}) ajoutée (simulation API). Redirection...`);
        // Reset form
        setFirstName('');
        setLastName('');
        setDob('');
        setSex('');
        setDisease('');
        setNotes('');
        setTimeout(() => {
          router.push('/medecin/patients'); 
        }, 2500);
      } else {
        // Gérer le cas où newRecord est null si addPatientRecord peut retourner null en cas d'erreur API contrôlée
         setError('La création de la fiche a échoué (simulation API).');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur inconnue est survenue lors de l\'ajout de la fiche.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FilePlus className="h-7 w-7 text-primary" />
            Créer une Nouvelle Fiche de Suivi Patient
          </CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour ajouter une nouvelle fiche de suivi pour un patient. Ces données seront envoyées à votre backend.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-1"><User className="h-4 w-4" />Prénom</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Prénom du patient" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-1"><User className="h-4 w-4" />Nom</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Nom du patient" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dob" className="flex items-center gap-1"><CalendarDays className="h-4 w-4" />Date de Naissance</Label>
                <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex" className="flex items-center gap-1"><VenetianMask className="h-4 w-4" />Sexe</Label>
                <Select value={sex} onValueChange={setSex} required>
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Sélectionnez le sexe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculin">Masculin</SelectItem>
                    <SelectItem value="Féminin">Féminin</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disease" className="flex items-center gap-1"><Stethoscope className="h-4 w-4" />Maladie / Condition Principale</Label>
              <Input id="disease" value={disease} onChange={(e) => setDisease(e.target.value)} placeholder="ex: Diabète Type 2, Hypertension" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-1"><StickyNote className="h-4 w-4" />Notes de Suivi</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Entrez les détails du suivi, observations, plan de traitement..."
                required
                rows={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FilePlus className="mr-2 h-4 w-4" />}
              Enregistrer la Fiche (via API)
            </Button>
            {error && (
              <Alert variant="destructive" className="w-full">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert variant="default" className="w-full bg-green-100 border-green-300 text-green-700">
                <AlertTitle>Succès (Simulation)</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
