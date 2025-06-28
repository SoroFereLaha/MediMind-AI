'use client';

import { DocumentRecommendations } from './document-recommendations';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

interface PatientDocumentsProps {
  recommendations: {
    method: string;
    query: string;
    results: Array<{
      document_id: number;
      score: number;
      title: string;
    }>;
    total_results: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export function PatientDocuments({ recommendations, loading, error }: PatientDocumentsProps) {
  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Documents Recommandés</h3>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Documents Recommandés</h3>
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!recommendations || !recommendations.results || recommendations.results.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Documents Recommandés</h3>
        <p className="text-muted-foreground">Aucun document recommandé pour ce patient.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Documents Recommandés</h3>
      <DocumentRecommendations
        recommendations={recommendations}
        loading={loading}
        error={error}
      />
    </div>
  );
}
