'use client';

import { getUnifiedHealthAnalysis } from './actions';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText, AlertTriangle, MapPin, Phone, Globe, Clock } from 'lucide-react';
import Link from 'next/link';
import type { RecommendationsOutput } from '@/ai/flows/ai-recommendations-flow';
import { searchHealthEstablishments } from '@/lib/services/locationService';

const formSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  symptoms: z.string().min(10, 'Veuillez décrire vos symptômes de manière plus détaillée.'),
  // Correction: l'input HTML retourne un string, on le transforme en nombre
  age: z.coerce.number().positive('L\'âge doit être un nombre positif.').optional(),
  sex: z.enum(['male', 'female', 'other']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type LocationState = { latitude: number; longitude: number } | null;

type HealthEstablishment = {
  specialite?: string;
  email?: string;
  id: string;
  name: string;
  type: 'medecin' | 'pharmacie' | 'hopital' | 'dentiste';
  address: string;
  distance: number;
  lat: number;
  lon: number;
  phone?: string;
  website?: string;
  opening_hours?: string;
};

export function HealthAssistantForm() {
  const [location, setLocation] = useState<LocationState>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'medecin' | 'pharmacie' | null>(null);
  const [establishments, setEstablishments] = useState<HealthEstablishment[]>([]);
  const [result, setResult] = useState<{
    analysis?: string;
    symptomAnalysis?: { summary: string; details: string };
    recommendedDoctors?: Array<{ name: string; specialty: string; address: string; reasoning: string }>;
    recommendedArticles?: { articles: Array<{ 
      document_id: number; 
      title: string; 
      score?: number; 
      view_url?: string 
    }> };
    error?: string;
  } | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Initialise le formulaire AVANT toute utilisation (évite TDZ)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
    },
  });

  const CONSENT_KEY = 'medimind_contextual_data_consent_v1';

  // Helper to (re)demander la géolocalisation
  const attemptGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        form.setValue('latitude', position.coords.latitude);
        form.setValue('longitude', position.coords.longitude);
        setLocationError(null);
      },
      (error) => {
        console.warn(`Geolocation error details: code=${error.code}, message='${error.message}'`);
        let userMessage = 'Impossible de récupérer votre position.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            userMessage = "Vous avez refusé la géolocalisation au niveau du navigateur. Veuillez l'autoriser dans les paramètres de votre navigateur.";
            break;
          case error.POSITION_UNAVAILABLE:
            userMessage = "Votre position n'est pas disponible actuellement.";
            break;
          case error.TIMEOUT:
            userMessage = "La demande de géolocalisation a expiré.";
            break;
          default:
            userMessage = 'Une erreur inconnue de géolocalisation est survenue.';
        }
        setLocationError(userMessage);
      }
    );
  }, [form]);

  // Effect for handling consent status changes
  useEffect(() => {
    const checkConsent = () => {
      const isAccepted = 
        localStorage.getItem(CONSENT_KEY) === 'accepted' || 
        localStorage.getItem('privacyAccepted') === 'true';
      setConsentAccepted(isAccepted);
      if (isAccepted && !location) {
        attemptGeolocation();
      }
    };

    checkConsent(); // Initial check

    const channel = new BroadcastChannel('consent_channel');
    const handleMessage = () => {
      checkConsent();
    };

    channel.addEventListener('message', handleMessage);
    window.addEventListener('focus', checkConsent); // Also check on focus as a fallback

    return () => {
      channel.close();
      window.removeEventListener('focus', checkConsent);
    };
  }, []);

  // Re-essayer la géolocalisation dès que le consentement est (re)validé
  useEffect(() => {
    if (!consentAccepted) {
      setLocationError("La géolocalisation est désactivée. Veuillez l'accepter dans la politique de confidentialité.");
      return;
    }

    // Si le consentement est accepté et qu'on n'a pas encore la localisation, on tente.
    if (consentAccepted && !location) {
      attemptGeolocation();
    }
  }, [consentAccepted, location, attemptGeolocation]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const data = await getUnifiedHealthAnalysis(values);
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ error: 'Une erreur inattendue est survenue.' });
    }
    setIsLoading(false);
  }

  const handleFindEstablishments = async (type: 'medecin' | 'pharmacie') => {
    try {
      setIsSearching(true);
      setSearchType(type);

      // Déterminer la position courante
      let currentLocation = location;
      if (!currentLocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 5000 });
          });
          currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(currentLocation);
          form.setValue('latitude', currentLocation.latitude);
          form.setValue('longitude', currentLocation.longitude);
        } catch (geoErr) {
          console.error('Geolocation error', geoErr);
          setLocationError("Veuillez autoriser la géolocalisation dans votre navigateur pour trouver un médecin à proximité.");
          setIsSearching(false);
          return;
        }
      }
      
      // Appeler l'API avec les coordonnées obtenues
      const results = await searchHealthEstablishments({
        type,
        lat: currentLocation?.latitude || 0,
        lon: currentLocation?.longitude || 0,
      });
      
      setEstablishments(results);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'établissements:', error);
      // Fallback: ouvrir Google Maps avec une recherche générique
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(type)}`, '_blank');
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenMap = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, "_blank");
  };

  return (
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {locationError && (
          <div className="mt-4 flex items-center rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
            <div className="flex-grow">
              {locationError}
            </div>
            <Button variant="ghost" size="sm" asChild className="ml-4 flex-shrink-0">
              <Link href="/privacy">Gérer</Link>
            </Button>
          </div>
        )}
        {location && !locationError && <p className="text-sm text-green-600 dark:text-green-400">Localisation activée pour trouver des médecins à proximité.</p>}
        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Décrivez vos symptômes</FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: J'ai une forte fièvre, des maux de tête et une toux sèche depuis 3 jours..." {...field} rows={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Âge (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 35"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexe (optionnel)</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={field.value ?? ''}
                    className="w-full p-2 border rounded-md bg-background text-foreground dark:bg-slate-800 dark:text-foreground"
                  >
                    <option value="">Non spécifié</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyse en cours...' : 'Lancer l\'analyse'}
        </Button>
        {(result?.analysis || result?.symptomAnalysis) && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">Rapport d'analyse</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Basé sur vos symptômes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-foreground whitespace-pre-wrap">
                    {result.analysis || result.symptomAnalysis?.details}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="default"
                    onClick={() => handleFindEstablishments('medecin')}
                    className="gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Trouver un médecin
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {isSearching && (
          <div className="text-center p-4">Recherche en cours, veuillez patienter...</div>
        )}
        {establishments.length > 0 && (
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">Résultats de la recherche</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {establishments.map((establishment) => (
        <div
           key={establishment.id}
           className="p-4 border rounded-lg bg-card/70 backdrop-blur-sm shadow-sm hover:border-primary/60 transition-colors flex flex-col gap-2"
         >
                <h3 className="font-medium text-base text-foreground">{establishment.name}</h3>
                <p className="text-sm text-muted-foreground">{establishment.address}</p>
                <p className="text-sm text-muted-foreground">{establishment.distance.toFixed(2)} km</p>
                {establishment.specialite && (
                  <p className="text-xs text-muted-foreground">Spécialité : {establishment.specialite}</p>
                )}
                {establishment.phone && (
                  <p className="text-xs text-muted-foreground">{establishment.phone}</p>
                )}
                {establishment.email && (
                  <p className="text-xs text-muted-foreground">{establishment.email}</p>
                )}
                {establishment.website && (
                  <a
                    href={establishment.website.startsWith('http') ? establishment.website : `http://${establishment.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary underline"
                  >
                    Site web
                  </a>
                )}
                {establishment.opening_hours && (
                  <p className="text-xs text-muted-foreground">Horaires : {establishment.opening_hours}</p>
                )}
                <Button
  variant="outline"
  size="sm"
  className="mt-2 w-full"
  onClick={() => handleOpenMap(establishment.lat, establishment.lon)}
>
  Ouvrir sur la carte
</Button>
                </div>
              ))}
            </div>
          </div>
        )}
        {result?.recommendedArticles && result.recommendedArticles.articles.length > 0 && (
  <Card className="mt-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">Articles Recommandés</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Basé sur vos symptômes, voici quelques articles qui pourraient vous intéresser.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.recommendedArticles.articles.map((article) => (
          <a
            key={article.document_id}
            href={article.view_url ? `http://localhost:5000${article.view_url}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-lg bg-card/70 backdrop-blur-sm shadow-sm hover:border-primary/60 transition-colors flex flex-col gap-2 p-4 group"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                  <path d="M4 22h16a2 2 0 0 0 2-2V7.5L17.5 2H6a2 2 0 0 0-2 2v4"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M10 18a1 1 0 0 0 1-1v-2h3a1 1 0 0 0 0-2h-3v-2a1 1 0 1 0-2 0v2H6a1 1 0 1 0 0 2h3v2a1 1 0 0 0 1 1z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-foreground group-hover:text-primary">
                  {article.title.replace(/_/g, ' ')}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cliquez pour lire l'article complet
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </CardContent>
  </Card>
)}
      </form>
    </Form>
  );
}

