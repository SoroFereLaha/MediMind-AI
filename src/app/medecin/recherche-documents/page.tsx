'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, FileText, Download, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Oval } from 'react-loader-spinner';

// Based on the API documentation provided in memory
interface DocumentSearchResult {
  document_id: number;
  title: string;
  score?: number;
  download_url?: string;
  view_url?: string;
}

interface SearchApiResponse {
  query: string;
  method: string;
  total_results: number;
  results: DocumentSearchResult[];
}

export default function DocumentSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocumentSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // State for document content modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentSearchResult | null>(null);
  const [selectedDocContent, setSelectedDocContent] = useState<string | null>(null);
  const [isLoadingDocContent, setIsLoadingDocContent] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Veuillez entrer un terme de recherche.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          method: 'rank',
          limit: 15,
          include_download_info: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Erreur API: ${response.statusText}` }));
        throw new Error(errorData.error || `Erreur API: ${response.statusText}`);
      }

      const data: SearchApiResponse = await response.json();
      setResults(data.results);

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur inattendue est survenue.');
      setResults([]);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recherche de Documents Médicaux"
        description="Explorez la base de connaissances pour trouver des articles et des documents pertinents."
        icon={Search}
      />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="search"
              placeholder="Ex: traitement diabète type 2, nouvelles approches..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow"
              aria-label="Terme de recherche"
            />
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Oval
                  height={20}
                  width={20}
                  color="#ffffff"
                  secondaryColor="#f0f0f0"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              Rechercher
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-10">
           <Oval
              visible={true}
              height="80"
              width="80"
              color="#3b82f6"
              secondaryColor="#bfdbfe"
              ariaLabel='oval-loading'
              strokeWidth={3}
            />
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Aucun résultat</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Votre recherche pour "{query}" n'a retourné aucun document. Essayez avec d'autres termes.</p>
          </CardContent>
        </Card>
      )}

      {/* Modal for viewing document content */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.title.replace(/_/g, ' ')}</DialogTitle>
            <DialogDescription>Contenu du document</DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto p-4 border rounded-md bg-muted/20">
            {isLoadingDocContent ? (
              <div className="flex justify-center items-center h-full">
                <Oval
                  height={60}
                  width={60}
                  color="#3b82f6"
                  secondaryColor="#bfdbfe"
                  strokeWidth={3}
                />
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

      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((doc) => (
            <Card key={doc.document_id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-start gap-2 text-lg">
                  <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <span className="flex-grow">{doc.title.replace(/_/g, ' ')}</span>
                </CardTitle>
                {doc.score && (
                   <CardDescription>Pertinence : {(doc.score * 100).toFixed(2)}%</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button onClick={() => handleViewDocument(doc)} variant="secondary" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  {doc.download_url && (
                    <Button asChild variant="outline" className="w-full">
                      <a href={`http://localhost:5000${doc.download_url}`} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
