'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/app-context';
import { FileText as Document, Download, Copy as CopyIcon, Eye, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentRecommendationsProps {
  doctorId?: string;
  recommendations: {
    method: string;
    query: string;
    results: Array<{
      document_id: number;
      score: number;
      title: string;
      content?: string;
      url?: string;
    }>;
    total_results: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export function DocumentRecommendations({ doctorId, recommendations, loading, error }: DocumentRecommendationsProps) {
  const { documentVotes, toggleDocumentVote, hasVoted } = useAppContext();
  const [ratings, setRatings] = useState<Record<number, number>>({});

  // Charger les notes depuis backend au montage
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/ratings?doctorId=${doctorId}`);
        if (res.ok) {
          const data = await res.json();
          const map: Record<number, number> = {};
          data.ratings.forEach((r: { document_id: number; rating: number }) => {
            map[r.document_id] = r.rating;
          });
          setRatings(map);
        }
      } catch (e) {
        console.error('Erreur chargement notes', e);
      }
    };
    if (doctorId) load();
  }, [doctorId]);

  // Boîte de justification
  const [pending, setPending] = useState<{ id: number; rating: number } | null>(null);
  const [reason, setReason] = useState('');

  const saveRating = async (id: number, rating: number, reasonText: string = '') => {
    if (!doctorId) return; // Pas de médecin, pas d'enregistrement
    updateLocal(id, rating);
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, document_id: id, rating, reason: reasonText }),
      });
    } catch (e) {
      console.error('Erreur enregistrement note', e);
    }
  };

  const updateLocal = (id: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  const handleStarClick = (id: number, n: number) => {
    if (n <= 2) {
      setPending({ id, rating: n });
      setReason('');
    } else {
      saveRating(id, n);
    }
  };
  const [openDocId, setOpenDocId] = useState<number | null>(null);
  const [contentMap, setContentMap] = useState<Record<number, string>>({});

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2">
        <Loader2 className="animate-spin h-6 w-6 text-primary" />
        <span className="text-sm text-muted-foreground">Chargement des recommandations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="py-4">
        <AlertDescription>
          <p>Erreur lors de la récupération des recommandations: {error}</p>
        </AlertDescription>
      </Alert>
    );
  }

  const filteredResults = recommendations?.results.filter((d) => {
    const r = ratings[d.document_id];
    return r === undefined || r > 2; // on garde si pas noté ou note >2
  }) || [];

  if (!recommendations || filteredResults.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        <p>Aucune recommandation disponible (après filtrage).</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">Méthode: {recommendations.method}</p>
          <p className="text-sm text-muted-foreground">Requête: {recommendations.query}</p>
        </div>
        <p className="text-sm text-muted-foreground">Total: {filteredResults.length} résultats</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredResults.map((doc) => {
          const rating = ratings[doc.document_id] || 0;
          const badgeColor = doc.score >= 0.8 ? 'bg-green-600' : doc.score >= 0.5 ? 'bg-yellow-600' : 'bg-red-600';
          return (
            <div key={doc.document_id} className="p-4 rounded-lg bg-card shadow relative flex flex-col gap-3 transform transition-transform duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
              {/* Titre & score */}
              <div className="flex items-start justify-between">
                <h4 className="font-semibold pr-2 line-clamp-2" title={doc.title}>{doc.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${badgeColor}`}>{doc.score.toFixed(2)}</span>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-muted rounded">
                <div
                  className="h-full bg-primary rounded"
                  style={{ width: `${Math.min(doc.score * 100, 100)}%` }}
                />
              </div>

              {/* Extrait */}
              <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                {(doc.content || contentMap[doc.document_id] || '').slice(0, 200) || 'Aucun extrait disponible.'}
              </p>

              {/* Actions rapides */}
              <div className="flex items-center gap-2 mt-auto">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={async () => {
                    if (!contentMap[doc.document_id]) {
                      try {
                        const res = await fetch(`http://127.0.0.1:5000/document/${doc.document_id}/content`);
                        if (res.ok) {
                          const data = await res.json();
                          setContentMap((prev) => ({ ...prev, [doc.document_id]: data.content || '' }));
                        }
                      } catch (e) {
                        console.error('Erreur de chargement du contenu du document', e);
                      }
                    }
                    setOpenDocId(doc.document_id);
                  }}
                  title="Voir contenu"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {doc.url && (
                  <Button asChild size="icon" variant="ghost" title="Télécharger">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {doc.url && (
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Copier le lien"
                    onClick={() => navigator.clipboard.writeText(doc.url || '')}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Notation étoiles */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-4 w-4 cursor-pointer transition-colors ${n <= rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
                    onClick={() => handleStarClick(doc.document_id, n)}
                  />
                ))}
              </div>


            </div>
          );
        })}
      </div>

      {/* Modal de contenu complet */}
      <Dialog open={openDocId !== null} onOpenChange={(open) => !open && setOpenDocId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {recommendations.results.find((d) => d.document_id === openDocId)?.title || 'Document'}
            </DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {openDocId && (contentMap[openDocId] || 'Chargement...')}
          </div>
          <DialogFooter>
            {openDocId && recommendations.results.find((d)=>d.document_id===openDocId)?.url && (
              <Button asChild>
                <a
                  href={recommendations.results.find((d)=>d.document_id===openDocId)?.url}
                  target="_blank" rel="noopener noreferrer"
                >
                  Télécharger
                </a>
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="secondary">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog justification mauvaise note */}
      <Dialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pourquoi cette note&nbsp;?</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Expliquez brièvement pourquoi ce document est peu pertinent.</p>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Votre justification" />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (pending) {
                  saveRating(pending.id, pending.rating, reason);
                  setPending(null);
                }
              }}
            >
              Enregistrer
            </Button>
            <DialogClose asChild>
              <Button variant="secondary" onClick={() => setPending(null)}>Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}