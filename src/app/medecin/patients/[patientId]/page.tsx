
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext, type PatientRecordServerResponse } from '@/contexts/app-context';
import { PageHeader } from '@/components/page-header';
import { User, FileText, CalendarDays, VenetianMask, Stethoscope, StickyNote, Loader2, Lightbulb, Link as LinkIcon, ThumbsUp, HelpCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { getRelevantDocuments, type RelevantDocumentInput, type RelevantDocumentOutput } from '@/ai/flows/ai-relevant-documents-flow';

export default function FichePatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const router = useRouter();
  const { getPatientRecordById, toggleDocumentVote, hasVoted } = useAppContext();
  
  const [patient, setPatient] = useState<PatientRecordServerResponse | null | undefined>(undefined); // undefined for loading, null if not found
  const [relevantDocs, setRelevantDocs] = useState<RelevantDocumentOutput | null>(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [patientError, setPatientError] = useState<string | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        setIsLoadingPatient(true);
        setPatientError(null);
        try {
          const record = await getPatientRecordById(patientId as string);
          setPatient(record); // Peut être null si non trouvé par l'API
        } catch (e) {
          setPatientError(e instanceof Error ? e.message : "Erreur lors de la récupération de la fiche patient.");
          setPatient(null);
        } finally {
          setIsLoadingPatient(false);
        }
      };
      fetchPatient();
    }
  }, [patientId, getPatientRecordById]);

  useEffect(() => {
    if (patient && patient !== null) { // Seulement si patient est trouvé et chargé
      const fetchDocs = async () => {
        setIsLoadingDocs(true);
        setDocsError(null);
        try {
          const birthDate = new Date(patient.patientDOB);
          const ageDiffMs = Date.now() - birthDate.getTime();
          const ageDate = new Date(ageDiffMs);
          const age = Math.abs(ageDate.getUTCFullYear() - 1970);

          const input: RelevantDocumentInput = {
            patientContext: {
              disease: patient.disease,
              sex: patient.patientSex, // Utiliser patientSex du record
              age: age,
              currentNotes: patient.notes,
            }
          };
          const output = await getRelevantDocuments(input);
          setRelevantDocs(output);
        } catch (e) {
          setDocsError(e instanceof Error ? e.message : "Erreur lors de la récupération des documents pertinents.");
        } finally {
          setIsLoadingDocs(false);
        }
      };
      fetchDocs();
    }
  }, [patient]); // Dépendance à 'patient' pour relancer si le patient change

  if (isLoadingPatient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Chargement de la fiche patient...</p>
      </div>
    );
  }

  if (patientError) {
     return (
      <div className="text-center py-10">
        <HelpCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Erreur de Chargement</h1>
        <p className="text-muted-foreground mt-2">{patientError}</p>
        <Button onClick={() => router.push('/medecin/patients')} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
        </Button>
      </div>
    );
  }

  if (patient === null) {
    return (
      <div className="text-center py-10">
        <HelpCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">Fiche Patient Introuvable</h1>
        <p className="text-muted-foreground mt-2">Impossible de trouver la fiche patient avec l'ID demandé via l'API.</p>
        <Button onClick={() => router.push('/medecin/patients')} className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
        </Button>
      </div>
    );
  }
  // Si patient est non null (donc PatientRecordServerResponse)
  const typedPatient = patient as PatientRecordServerResponse;

  return (
    <div className="space-y-8">
      <Button onClick={() => router.push('/medecin/patients')} variant="outline" size="sm" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des patients
      </Button>
      <PageHeader
        title={`Fiche de Suivi: ${typedPatient.patientFirstName} ${typedPatient.patientLastName}`}
        description={`Détails et suivi pour ${typedPatient.patientFirstName} ${typedPatient.patientLastName}.`}
        icon={FileText}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" /> Informations du Patient
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base">
          <p><strong>Prénom:</strong> {typedPatient.patientFirstName}</p>
          <p><strong>Nom:</strong> {typedPatient.patientLastName}</p>
          <p className="flex items-center gap-1">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <strong>Date de Naissance:</strong> {new Date(typedPatient.patientDOB).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="flex items-center gap-1">
            <VenetianMask className="h-5 w-5 text-muted-foreground" />
            <strong>Sexe:</strong> {typedPatient.patientSex}
          </p>
          <p className="md:col-span-2 flex items-center gap-1">
            <Stethoscope className="h-5 w-5 text-muted-foreground" />
            <strong>Maladie / Condition:</strong> <Badge variant="secondary">{typedPatient.disease}</Badge>
          </p>
          <div className="md:col-span-2 space-y-2 pt-2 border-t mt-2">
            <p className="flex items-start gap-1 font-semibold">
              <StickyNote className="h-5 w-5 text-muted-foreground mt-0.5" />
              Notes de Suivi:
            </p>
            <p className="whitespace-pre-wrap bg-muted/30 p-3 rounded-md border text-sm">{typedPatient.notes}</p>
            <p className="text-xs text-muted-foreground text-right">Fiche créée le: {new Date(typedPatient.createdAt).toLocaleString('fr-FR')} (M.A.J: {new Date(typedPatient.updatedAt).toLocaleString('fr-FR')})</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" /> Documents Pertinents Suggérés par l'IA
          </CardTitle>
          <CardDescription>
            Basé sur le contexte du patient, voici des documents qui pourraient être utiles pour approfondir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingDocs && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Recherche de documents...
            </div>
          )}
          {docsError && (
            <Alert variant="destructive">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{docsError}</AlertDescription>
            </Alert>
          )}
          {relevantDocs && relevantDocs.documents.length > 0 && (
            <ul className="space-y-4">
              {relevantDocs.documents.map((doc, index) => (
                <li key={index} className="p-4 border rounded-md shadow-sm bg-card hover:bg-muted/20 transition-colors">
                  <h4 className="font-semibold text-lg text-primary">{doc.title}</h4>
                  {doc.summary && <p className="text-sm text-muted-foreground mt-1 mb-2">{doc.summary}</p>}
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button asChild variant="outline" size="sm">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="mr-2 h-4 w-4" /> Lire le document (simulé)
                      </a>
                    </Button>
                    <Button 
                      variant={hasVoted(typedPatient.id, doc.url) ? "default" : "ghost"} 
                      size="sm" 
                      onClick={() => toggleDocumentVote(typedPatient.id, doc.url)}
                      className="transition-colors"
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" /> 
                      {hasVoted(typedPatient.id, doc.url) ? "Voté Utile" : "Marquer comme utile"}
                    </Button>
                  </div>
                  {doc.source && <p className="text-xs text-muted-foreground mt-2">Source: {doc.source}</p>}
                </li>
              ))}
            </ul>
          )}
           {relevantDocs && relevantDocs.documents.length === 0 && !isLoadingDocs && (
            <p className="text-muted-foreground text-center py-4">Aucun document pertinent spécifique n'a été suggéré par l'IA pour ce cas.</p>
           )}
           {relevantDocs?.reasoning && !isLoadingDocs && (
            <p className="text-xs text-muted-foreground mt-4 pt-2 border-t">Raisonnement de l'IA pour la recherche: {relevantDocs.reasoning}</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
