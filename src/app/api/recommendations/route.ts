import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { get as getFromCache, set as setInCache, cacheKeys } from '@/lib/cache';

interface RecommendationResponse {
  method: string;
  query: string;
  results: Array<{
    document_id: number;
    score: number;
    title: string;
  }>;
  total_results: number;
}

interface RecommendationResult {
  document_id: number;
  score: number;
  title: string;
}

export async function POST(request: Request) {
  try {
    const { patientId } = await request.json();
    const cacheKey = cacheKeys.recommendations(patientId);

    // 1. Vérifier le cache d'abord
    const cachedData = getFromCache<RecommendationResponse>(cacheKey);
    if (cachedData) {
      console.log(`[Cache] HIT for key: ${cacheKey}`);
      return NextResponse.json(cachedData);
    }

    console.log(`[Cache] MISS for key: ${cacheKey}`);

    // 2. Si pas dans le cache, continuer la logique existante
    const db = await getDb();
    const patientsCollection = db.collection('patientRecords');
    const patient = await patientsCollection.findOne({ _id: new ObjectId(patientId) });

    if (!patient) {
      return NextResponse.json({ error: "Patient non trouvé" }, { status: 404 });
    }

    const query = `Patient souffrant de ${patient.disease}. Notes: ${patient.notes}`;
    const ratingsCollection = db.collection('documentRatings');
    const badRatings = await ratingsCollection.find({ doctorId: patient.doctorId?.toString?.() || patient.doctorId, rating: { $lte: 2 } }).toArray();
    const excludedIds = new Set<number>(badRatings.map((r: any) => r.document_id));

    const response = await fetch('http://127.0.0.1:5000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche de documents');
    }

    const recommendations: RecommendationResponse = await response.json();
    const filteredResults = recommendations.results.filter((r) => !excludedIds.has(r.document_id));
    const finalResponse = { ...recommendations, results: filteredResults, total_results: filteredResults.length };

    // 3. Stocker le résultat dans le cache avant de le renvoyer
    setInCache(cacheKey, finalResponse);

    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error("Erreur lors de la récupération des recommandations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des recommandations" },
      { status: 500 }
    );
  }
}
