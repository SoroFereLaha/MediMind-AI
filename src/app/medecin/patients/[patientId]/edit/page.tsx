'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Pencil, ArrowLeft } from 'lucide-react';
import { useAppContext, type PatientRecordServerResponse } from '@/contexts/app-context';

const formSchema = z.object({
  patientFirstName: z.string().min(1, 'Le prénom est requis'),
  patientLastName: z.string().min(1, 'Le nom est requis'),
  patientDOB: z.string().min(1, 'La date de naissance est requise'),
  disease: z.string().min(1, 'La maladie est requise'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditPatientPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const router = useRouter();
  const { getPatientRecordById } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (patientId) {
      getPatientRecordById(patientId)
        .then(data => {
          if (data) {
            const dob = new Date(data.patientDOB).toISOString().split('T')[0];
            reset({ ...data, patientDOB: dob });
          } else {
            setError('Fiche patient non trouvée.');
          }
        })
        .catch(() => setError('Erreur lors de la récupération de la fiche patient.'))
        .finally(() => setIsLoading(false));
    }
  }, [patientId, getPatientRecordById, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/patient-records/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour.');
      }

      router.push(`/medecin/patients/${patientId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur inconnue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
        <Button onClick={() => router.back()} variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      <PageHeader
        title="Modifier la Fiche Patient"
        description="Mettez à jour les informations du patient."
        icon={Pencil}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du Patient</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <Alert variant="destructive"><AlertTitle>Erreur</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientFirstName">Prénom</Label>
                <Input id="patientFirstName" {...register('patientFirstName')} />
                {errors.patientFirstName && <p className="text-sm text-destructive mt-1">{errors.patientFirstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="patientLastName">Nom</Label>
                <Input id="patientLastName" {...register('patientLastName')} />
                {errors.patientLastName && <p className="text-sm text-destructive mt-1">{errors.patientLastName.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="patientDOB">Date de Naissance</Label>
              <Input id="patientDOB" type="date" {...register('patientDOB')} />
              {errors.patientDOB && <p className="text-sm text-destructive mt-1">{errors.patientDOB.message}</p>}
            </div>

            <div>
              <Label htmlFor="disease">Maladie / Contexte Principal</Label>
              <Input id="disease" {...register('disease')} />
              {errors.disease && <p className="text-sm text-destructive mt-1">{errors.disease.message}</p>}
            </div>

            <div>
              <Label htmlFor="notes">Notes Complémentaires</Label>
              <Textarea id="notes" {...register('notes')} />
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Annuler</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
