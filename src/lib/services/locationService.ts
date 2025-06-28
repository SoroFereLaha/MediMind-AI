/**
 * Service pour interagir avec l'API de localisation des établissements de santé
 */

export interface HealthEstablishment {
  id: string;
  name: string;
  type: 'medecin' | 'pharmacie' | 'hopital' | 'dentiste';
  address: string;
  distance: number;
  lat: number;
  lon: number;
  phone?: string;
  email?: string;
  website?: string;
  opening_hours?: string;
  specialite?: string;
  note?: number;
}

interface SearchParams {
  lat: number;
  lon: number;
  type: 'medecin' | 'pharmacie' | 'hopital' | 'dentiste';
  rayon?: number;
}

const API_BASE_URL = 'http://localhost:5001';

/**
 * Recherche des établissements de santé à proximité
 */
export async function searchHealthEstablishments(
  params: SearchParams
): Promise<HealthEstablishment[]> {
  try {
    const { lat, lon, type, rayon = 5 } = params;
    const url = new URL(`${API_BASE_URL}/search`);
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lon.toString());
    url.searchParams.set('type', type);
    url.searchParams.set('rayon', rayon.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la recherche: ${response.statusText}`);
    }
    
    const data = await response.json();

    const list: any[] = data.etablissements || data.results || [];

    const mapped: HealthEstablishment[] = list.map((item, idx) => ({
      id: item.id?.toString() ?? `${idx}`,
      name: item.nom || item.name || 'Établissement',
      type: item.type_etablissement || item.type || 'medecin',
      address: item.adresse || item.address || 'Adresse non spécifiée',
      distance: item.distance_km ?? item.distance ?? 0,
      lat: item.latitude ?? item.lat ?? 0,
      lon: item.longitude ?? item.lon ?? 0,
      phone: item.telephone || item.phone || undefined,
      email: item.email && item.email !== 'N/A' ? item.email : undefined,
      website: item.site_web && item.site_web !== 'N/A' ? item.site_web : undefined,
      opening_hours: item.horaires && item.horaires !== 'N/A' ? item.horaires : undefined,
      specialite: item.specialite || undefined,
      note: typeof item.note === 'number' ? item.note : undefined,
    }));

    return mapped;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'établissements:', error);
    throw error;
  }
}

/**
 * Obtient la position actuelle de l'utilisateur
 */
export function getCurrentPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        // En cas d'erreur, on utilise une position par défaut (Casablanca)
        console.warn('Impossible d\'obtenir la position, utilisation de la position par défaut', error);
        resolve({
          lat: 33.5731,
          lon: -7.5898
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}
