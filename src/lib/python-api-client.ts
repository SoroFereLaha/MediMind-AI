
// ATTENTION : Ce fichier contient des placeholders pour l'URL de l'API et les identifiants.
// Veuillez les remplacer par vos propres valeurs.
// Pour la production, les identifiants ne doivent JAMAIS être codés en dur côté client.

const API_BASE_URL = 'http://localhost:8000/v1'; // REMPLACEZ localhost:8000 par le port correct de VOTRE API
const API_USER = 'testuser@example.com'; // REMPLACEZ par votre email de test
const API_PASS = 'testpassword'; // REMPLACEZ par votre mot de passe de test

const BASIC_AUTH_TOKEN = Buffer.from(`${API_USER}:${API_PASS}`).toString('base64');

export interface FoodRecommendationParams {
  location_lat?: string | number;
  location_lon?: string | number;
  date?: string; // ISO 8601 date string
}

export interface FoodRecommendationResponse {
  calories: {
    daily_target: number;
    consumed_today: number;
  };
  food_recommendations: string[]; // List of Food IDs
  message: string;
}

export interface ApiErrorResponse {
  error_message: string;
}

export async function getFoodRecommendationFromApi(
  params: FoodRecommendationParams
): Promise<FoodRecommendationResponse> {
  const queryParams = new URLSearchParams();
  if (params.location_lat !== undefined) queryParams.append('location_lat', String(params.location_lat));
  if (params.location_lon !== undefined) queryParams.append('location_lon', String(params.location_lon));
  if (params.date) queryParams.append('date', params.date);

  const url = `${API_BASE_URL}/getFoodRecommendation?${queryParams.toString()}`;

  console.log(`Calling API: ${url}`); // Pour le débogage

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${BASIC_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse = { error_message: `Erreur HTTP: ${response.status} ${response.statusText}` };
    try {
      errorData = await response.json();
    } catch (e) {
      // Si le corps de l'erreur n'est pas du JSON, utiliser le message HTTP standard
    }
    console.error('API Error:', errorData);
    throw new Error(errorData.error_message || `Erreur lors de la récupération des recommandations : ${response.status}`);
  }

  return response.json() as Promise<FoodRecommendationResponse>;
}

// Plus tard, nous pourrons ajouter ici d'autres fonctions pour appeler d'autres endpoints de votre API
// comme getSleepRecommendation, getActivityRecommendation, etc.
