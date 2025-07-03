'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext, type PatientRecordServerResponse } from '@/contexts/app-context';
import { PageHeader } from '@/components/page-header';
import { Oval } from 'react-loader-spinner';
import { 
  User, 
  FileText, 
  CalendarDays, 
  VenetianMask, 
  Stethoscope, 
  StickyNote, 
  Lightbulb, 
  Link as LinkIcon, 
  ThumbsDown, 
  HelpCircle, 
  ArrowLeft, 
  Pencil, 
  Trash2 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { DislikeDocumentModal } from '@/components/modals/dislike-document-modal';

interface DocumentSearchResult {
  document_id: number;
  title: string;
  score: number;
  download_url?: string;
  view_url?: string;
  file_exists?: boolean;
  file_extension?: string;
}

interface SearchApiResponse {
  query: string;
  method: string;
  total_results: number;
  results: DocumentSearchResult[];
}

export default function FichePatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { getPatientRecordById } = useAppContext();
  
  const [patient, setPatient] = useState<PatientRecordServerResponse | null | undefined>(undefined);
  const [recommendedDocs, setRecommendedDocs] = useState<DocumentSearchResult[]>([]);

  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [patientError, setPatientError] = useState<string | null>(null);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState<string | null>(null);

  // State for document content modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentSearchResult | null>(null);
  const [selectedDocContent, setSelectedDocContent] = useState<string | null>(null);
  const [isLoadingDocContent, setIsLoadingDocContent] = useState(false);
  
  // State for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // State for dislike modal
  const [isDislikeModalOpen, setIsDislikeModalOpen] = useState(false);
  const [selectedDocForRating, setSelectedDocForRating] = useState<DocumentSearchResult | null>(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        setIsLoadingPatient(true);
        setPatientError(null);
        try {
          const record = await getPatientRecordById(patientId as string);
          setPatient(record);
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
    if (patient && patient !== null) {
      const fetchDocs = async () => {
        setIsLoadingDocs(true);
        setDocsError(null);
        try {
          const response = await fetch('/api/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `Erreur API: ${response.statusText}` }));
            throw new Error(errorData.error || `Erreur API: ${response.statusText}`);
          }

          const output: SearchApiResponse = await response.json();

          // Récupérer les notes pour filtrer les documents déjà dislikés (note ≤2)
          const doctorId = 'doc-001'; // TODO: récupérer l'ID médecin réel
          let disliked: Record<number, number> = {};
          try {
            const ratingsRes = await fetch(`/api/ratings?doctorId=${doctorId}`);
            if (ratingsRes.ok) {
              const data = await ratingsRes.json();
              data.ratings?.forEach((r: { document_id: number; rating: number }) => {
                disliked[r.document_id] = r.rating;
              });
            }
          } catch (e) {
            console.warn('Impossible de lire les notes, le filtrage sera ignoré');
          }

          const filtered = output.results.filter((d) => {
            const r = disliked[d.document_id];
            return r === undefined || r > 2; // garder si pas noté ou note >2
          });

          setRecommendedDocs(filtered);

        } catch (e) {
          setDocsError(e instanceof Error ? e.message : "Erreur lors de la récupération des documents pertinents.");
        } finally {
          setIsLoadingDocs(false);
        }
      };
      fetchDocs();
    }
  }, [patient, patientId]);

  const handleOpenDislikeModal = (doc: DocumentSearchResult) => {
    setSelectedDocForRating(doc);
    setIsDislikeModalOpen(true);
  };

  const handleCloseDislikeModal = () => {
    setIsDislikeModalOpen(false);
    setSelectedDocForRating(null);
  };

  const handleSubmitDislike = async (reason: string) => {
    if (!selectedDocForRating) return;

    setIsSubmittingRating(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientId,
          document_id: String(selectedDocForRating.document_id),
          rating: 2, // 2 for dislike
          reason: reason,
          doctorId: 'doc-001', // TODO: Replace with actual doctor ID from context/session
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      toast({
        title: 'Merci pour votre retour',
        description: 'Le document a été noté et ne sera plus recommandé.',
      });

      // Update UI immediately
      setRecommendedDocs(prevDocs => prevDocs.filter(doc => doc.document_id !== selectedDocForRating.document_id));
      handleCloseDislikeModal();

    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de soumettre la note. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!patientId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/patient-records/${patientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur lors de la suppression de la fiche patient.' }));
        throw new Error(errorData.message || 'Une erreur inconnue est survenue.');
      }
      
      router.push('/medecin/patients');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
      setDeleteError(errorMessage);
      console.error("Erreur lors de la tentative de suppression du patient", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDocument = async (doc: DocumentSearchResult) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
    setIsLoadingDocContent(true);
    setSelectedDocContent(null); // Reset previous content

    try {
      const response = await fetch(`http://localhost:5000/document/${doc.document_id}/content`);
      if (!response.ok) {
        throw new Error('Failed to fetch document content.');
      }
      const data = await response.json();
      setSelectedDocContent(data.content);
    } catch (error) {
      setSelectedDocContent('Erreur lors de la récupération du contenu du document.');
    } finally {
      setIsLoadingDocContent(false);
    }
  };

  if (isLoadingPatient) {
    return (
      <div className="flex justify-center items-center h-64">
        <Oval
          height={80}
          width={80}
          color="#bfdbfe"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#3b82f6"
          strokeWidth={3}
          strokeWidthSecondary={3}
        />
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
    <>
      <div className="space-y-8">
        <Button onClick={() => router.push('/medecin/patients')} variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste des patients
        </Button>
        <PageHeader
          title={`Fiche de Suivi: ${typedPatient.patientFirstName} ${typedPatient.patientLastName}`}
          description={`Détails et suivi pour ${typedPatient.patientFirstName} ${typedPatient.patientLastName}.`}
          icon={FileText}
        />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" /> Informations du Patient
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/medecin/patients/${patientId}/edit`)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </AlertDialogTrigger>
              </div>
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
              <div className="md:col-span-2 flex items-center gap-1">
                <Stethoscope className="h-5 w-5 text-muted-foreground" />
                <strong>Maladie:</strong> <Badge variant="secondary">{typedPatient.disease}</Badge>
              </div>
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

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette fiche ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible et supprimera définitivement la fiche de ce patient.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {deleteError && (
              <Alert variant="destructive">
                <AlertTitle>Erreur de suppression</AlertTitle>
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePatient} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                {isDeleting && <Oval
                  height={20}
                  width={20}
                  color="#ffffff"
                  wrapperStyle={{}}
                  wrapperClass="mr-2"
                  visible={true}
                  ariaLabel='oval-loading'
                  secondaryColor="#ffffff"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                />} 
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-primary" /> Documents Recommandés
              </h3>
            </CardTitle>
            <CardDescription>
              Documents recommandés par le système de recherche en fonction du contexte du patient.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingDocs && (
              <div className="flex items-center justify-center p-8">
                <Oval
                  height={60}
                  width={60}
                  color="#bfdbfe"
                  visible={true}
                  ariaLabel='oval-loading'
                  secondaryColor="#3b82f6"
                  strokeWidth={3}
                  strokeWidthSecondary={3}
                />
                <p className="ml-4">Recherche de documents pertinents...</p>
              </div>
            )}
            {docsError && (
              <Alert variant="destructive">
                <AlertTitle>Erreur de recherche</AlertTitle>
                <AlertDescription>{docsError}</AlertDescription>
              </Alert>
            )}
            {!isLoadingDocs && !docsError && (
              recommendedDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedDocs.map((doc) => (
                    <Card key={doc.document_id} className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>Score: {doc.score.toFixed(3)}</CardDescription>
                      </CardHeader>
                      <CardFooter className="mt-auto flex justify-between items-center pt-4 border-t">
                        <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc)}>
                          <LinkIcon className="h-4 w-4 mr-1" /> Lire
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleOpenDislikeModal(doc)}
                          title="Ce document n'est pas pertinent"
                          className="bg-red-500/15 text-red-500 hover:bg-red-500/25 hover:text-red-600"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Aucun document recommandé trouvé pour ce patient.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDoc && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedDoc.title}</DialogTitle>
              {selectedDoc.score && <DialogDescription>
                Score de pertinence: {selectedDoc.score.toFixed(3)}
              </DialogDescription>}
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
              {isLoadingDocContent ? (
                <div className="flex justify-center items-center h-full">
                  <Oval
                    height={80}
                    width={80}
                    color="#bfdbfe"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#3b82f6"
                    strokeWidth={3}
                    strokeWidthSecondary={3}
                  />
                  <p className="ml-4">Chargement du contenu...</p>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{selectedDocContent}</pre>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)}>Fermer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedDocForRating && (
        <DislikeDocumentModal
          isOpen={isDislikeModalOpen}
          onClose={handleCloseDislikeModal}
          onSubmit={handleSubmitDislike}
          documentTitle={selectedDocForRating.title}
          isSubmitting={isSubmittingRating}
        />
      )}
    </>
  );
}
