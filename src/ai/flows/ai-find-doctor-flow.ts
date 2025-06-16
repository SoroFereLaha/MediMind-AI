// This is an auto-generated file from Firebase Studio.

'use server';
/**
 * @fileOverview Flow pour aider à trouver un médecin basé sur les symptômes, la localisation (code postal ou coordonnées géographiques) et une simulation d'appel API.
 *
 * - findDoctorBySymptoms - Fonction principale pour obtenir des suggestions de spécialités et des médecins.
 * - FindDoctorBySymptomsInput - Type d'entrée.
 * - FindDoctorBySymptomsOutput - Type de sortie.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindDoctorBySymptomsInputSchema = z.object({
  symptoms: z.string().describe('Les symptômes décrits par l"utilisateur.'),
  age: z.number().optional().describe('L"âge de l"utilisateur (optionnel).'),
  sex: z.string().optional().describe('Le sexe de l"utilisateur (optionnel, ex: "Masculin", "Féminin").'),
  postalCode: z.string().optional().describe('Le code postal de l"utilisateur pour affiner la recherche (optionnel).'),
  latitude: z.number().optional().describe('Latitude de l"utilisateur pour la recherche à proximité.'),
  longitude: z.number().optional().describe('Longitude de l"utilisateur pour la recherche à proximité.'),
});
export type FindDoctorBySymptomsInput = z.infer<
  typeof FindDoctorBySymptomsInputSchema
>;

const DoctorSchema = z.object({
  name: z.string().describe('Nom complet du médecin.'),
  specialty: z.string().describe('Spécialité du médecin.'),
  address: z.string().describe('Adresse du cabinet du médecin.'),
  phone: z.string().optional().describe('Numéro de téléphone du cabinet.'),
  distance: z.string().optional().describe('Distance approximative si les coordonnées sont utilisées.'),
  // Vous pourriez ajouter d'autres champs ici si votre API les fournit (ex: website, opening_hours)
});
export type Doctor = z.infer<typeof DoctorSchema>;

const FindDoctorBySymptomsOutputSchema = z.object({
  suggestedSpecialty: z
    .string()
    .describe('La spécialité médicale la plus pertinente suggérée par l"IA basée sur les symptômes.'),
  reasoning: z
    .string()
    .describe('Explication concise de la raison pour laquelle cette spécialité est suggérée.'),
  doctors: z
    .array(DoctorSchema)
    .describe(
      'Liste de médecins trouvés. Provient d\'une simulation tant que l\'appel API réel n\'est pas implémenté.'
    ),
  searchNote: z.string().describe('Note expliquant l"origine des données des médecins et les limites éventuelles de la recherche.')
});
export type FindDoctorBySymptomsOutput = z.infer<
  typeof FindDoctorBySymptomsOutputSchema
>;

export async function findDoctorBySymptoms(
  input: FindDoctorBySymptomsInput
): Promise<FindDoctorBySymptomsOutput> {
  return findDoctorFlow(input);
}

// Tool pour rechercher des médecins via une API externe
const findNearbyDoctorsAPITool = ai.defineTool(
  {
    name: 'findNearbyDoctorsAPI',
    description: 'Recherche des médecins à proximité via une API externe (actuellement simulé), basée sur la spécialité et la localisation.',
    inputSchema: z.object({
      specialty: z.string().describe('Spécialité médicale à rechercher.'),
      postalCode: z.string().optional().describe('Code postal pour affiner la recherche.'),
      latitude: z.number().optional().describe('Latitude pour la recherche à proximité.'),
      longitude: z.number().optional().describe('Longitude pour la recherche à proximité.'),
    }),
    outputSchema: z.array(DoctorSchema),
  },
  async ({ specialty, postalCode, latitude, longitude }) => {
    console.log(`findNearbyDoctorsAPITool: Recherche de médecins en ${specialty} près de:`, { postalCode, latitude, longitude });

    // =====================================================================================
    // IMPORTANT: SECTION À REMPLACER PAR UN APPEL API RÉEL
    // =====================================================================================
    // L'implémentation actuelle ci-dessous est une SIMULATION.
    // Pour des données réelles, vous devez :
    // 1. Choisir une API (ex: Google Places API, API d'un annuaire de santé, etc.).
    // 2. Obtenir une clé API pour ce service.
    // 3. Stocker cette clé API de manière sécurisée dans votre fichier .env (ex: GOOGLE_PLACES_API_KEY=VotreCle).
    // 4. Remplacer la logique de simulation par un appel `fetch` à l'API choisie.
    // 5. Parser la réponse de l'API pour la transformer en un tableau d'objets conformes à `DoctorSchema`.

    /*
    // EXEMPLE THÉORIQUE d'appel à Google Places API (Nearby Search) - À ADAPTER
    // NÉCESSITE une clé API dans process.env.GOOGLE_PLACES_API_KEY

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn("Clé API Google Places non configurée dans .env. Impossible de rechercher des médecins réels. Retour de données simulées.");
      // Retourner des données simulées ou un tableau vide si vous préférez ne rien afficher sans clé.
    } else {
      let locationQuery = '';
      if (latitude && longitude) {
        locationQuery = `location=${latitude}%2C${longitude}&radius=5000`; // Rayon de 5km
      } else if (postalCode) {
        // Google Places API préfère les coordonnées. Si vous avez un code postal,
        // vous pourriez d'abord utiliser la Geocoding API pour convertir le code postal en lat/lon.
        // Ou utiliser une recherche textuelle avec le code postal, mais les résultats peuvent varier.
        // Pour cet exemple, nous supposons que vous avez déjà des coordonnées ou que l'API le gère.
        // Une recherche textuelle pourrait être : `query=${specialty} in ${postalCode}`
        console.warn("La recherche par code postal direct avec Google Places API est moins précise que par coordonnées. Envisagez la géocodification.");
      }

      if (locationQuery) { // Ou une autre condition si vous utilisez query pour postalCode
        const searchType = specialty.toLowerCase().replace(/\s/g, '_'); // ex: "general_practice"
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${encodeURIComponent(specialty)}&type=doctor&${locationQuery}&key=${apiKey}`;
        // Alternative: Text Search: const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(specialty + ' doctor')}&${locationQuery}&key=${apiKey}`;


        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.error(`Erreur API Google Places: ${response.statusText}`);
            // Retourner des données simulées ou un tableau vide
          }
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const realDoctors = data.results.map((place: any) => {
              // Adaptation nécessaire ici pour mapper les champs de l'API Google Places
              // à votre DoctorSchema. Ceci est un exemple simplifié.
              let distStr;
              // Google Places ne renvoie pas directement la distance dans Nearby Search sans requête Distance Matrix.
              // Vous pourriez la calculer si vous avez les coordonnées de l'utilisateur et du lieu.
              // Ou l'afficher si l'API de recherche la fournit (parfois le cas pour les recherches textuelles avec 'rankby=distance')

              return {
                name: place.name || 'Nom Inconnu',
                specialty: place.types?.includes('doctor') ? specialty : (place.types?.[0] || 'Spécialité Inconnue').replace(/_/g, ' '),
                address: place.vicinity || place.formatted_address || 'Adresse Inconnue',
                phone: place.formatted_phone_number || undefined, // Nécessite une requête Place Details pour le téléphone souvent
                distance: distStr,
              };
            });
            console.log(`Trouvé ${realDoctors.length} médecins réels (exemple).`);
            return realDoctors.slice(0, 5); // Limiter pour la démo
          }
        } catch (error) {
          console.error("Erreur lors de l'appel à l'API Google Places:", error);
          // Retourner des données simulées ou un tableau vide
        }
      }
    }
    */

    // Logique de SIMULATION actuelle (à remplacer)
    console.log("Utilisation de la logique de SIMULATION pour findNearbyDoctorsAPITool.");
    const simulatedDoctors: Doctor[] = [
      {
        name: `Dr. Alice Expert (Simulé pour ${specialty})`,
        specialty: specialty,
        address: postalCode ? `1 Rue Principale, ${postalCode} Ville (Simulé)` : `123 Main St, Anytown (Simulé près de Lat: ${latitude?.toFixed(2)}, Lon: ${longitude?.toFixed(2)})`,
        phone: '01 22 33 44 55',
        distance: latitude && longitude ? `${Math.floor(Math.random() * 5) + 1} km (Simulé)` : undefined
      },
      {
        name: `Dr. Bob Clinicien (Simulé pour ${specialty})`,
        specialty: specialty,
        address: postalCode ? `10 Avenue Secondaire, ${postalCode} Ville (Simulé)` : `456 Oak Ave, Anytown (Simulé près de Lat: ${latitude?.toFixed(2)}, Lon: ${longitude?.toFixed(2)})`,
        phone: '01 66 77 88 99',
        distance: latitude && longitude ? `${Math.floor(Math.random() * 10) + 2} km (Simulé)` : undefined
      },
    ];
    await new Promise(resolve => setTimeout(resolve, 300)); // Simuler un délai d'API
    const filteredDoctors = simulatedDoctors.filter(
      doc => doc.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
    return filteredDoctors.slice(0, 5);
  }
);


const prompt = ai.definePrompt({
  name: 'findDoctorPrompt',
  input: {schema: FindDoctorBySymptomsInputSchema},
  output: {schema: z.object({
    suggestedSpecialty: FindDoctorBySymptomsOutputSchema.shape.suggestedSpecialty,
    reasoning: FindDoctorBySymptomsOutputSchema.shape.reasoning,
  })},
  prompt: `
  Un utilisateur présente les informations suivantes :
  Symptômes : {{{symptoms}}}
  {{#if age}}Âge : {{{age}}} ans{{/if}}
  {{#if sex}}Sexe : {{{sex}}}{{/if}}
  {{#if postalCode}}Code Postal : {{{postalCode}}}{{/if}}
  {{#if latitude}}Localisation approximative fournie (lat: {{{latitude}}}, lon: {{{longitude}}}){{/if}}

  Votre rôle est d'agir comme un assistant d'orientation médicale.
  1. Basé sur les symptômes, l'âge (si fourni) et le sexe (si fourni), déterminez la spécialité médicale la plus pertinente à consulter.
     Si les symptômes sont vagues ou multiples, la médecine générale est souvent un bon point de départ.
  2. Fournissez une explication concise (1-2 phrases) de la raison pour laquelle cette spécialité est suggérée.
  3. Ne fournissez PAS de diagnostic, seulement une suggestion de spécialité.

  Assurez-vous que la sortie est structurée comme demandé.
  Par exemple, si les symptômes sont "mal de gorge et fièvre", une bonne suggestion serait "Médecine Générale" avec un raisonnement comme "Un médecin généraliste peut évaluer les symptômes courants comme le mal de gorge et la fièvre et orienter vers un spécialiste si nécessaire."
  Si les symptômes sont "douleur thoracique et essoufflement", suggérez "Cardiologie" ou "Pneumologie" si plus approprié, ou "Médecine Générale / Urgences" si cela semble critique, avec un raisonnement adapté.
  Soyez prudent si les symptômes semblent urgents, suggérez une consultation rapide.
  `,
});

const findDoctorFlow = ai.defineFlow(
  {
    name: 'findDoctorFlow',
    inputSchema: FindDoctorBySymptomsInputSchema,
    outputSchema: FindDoctorBySymptomsOutputSchema,
    tools: [findNearbyDoctorsAPITool],
  },
  async (input) => {
    const {output: llmOutput} = await prompt(input);

    let suggestedSpecialty = 'Médecine Générale';
    let reasoning = 'Les informations fournies n"ont pas permis de déterminer une spécialité spécifique. Un médecin généraliste est un bon point de départ pour évaluer vos symptômes.';
    
    if (llmOutput?.suggestedSpecialty) {
      suggestedSpecialty = llmOutput.suggestedSpecialty;
      reasoning = llmOutput.reasoning;
    }
    
    const doctorsFromTool = await findNearbyDoctorsAPITool({
      specialty: suggestedSpecialty,
      postalCode: input.postalCode,
      latitude: input.latitude,
      longitude: input.longitude,
    });
    
    let searchNote = 'IMPORTANT : Les médecins listés ci-dessous proviennent actuellement d\'une **simulation**. Pour obtenir des résultats réels, vous devez intégrer un appel à une véritable API de recherche de professionnels de santé (ex: Google Places API) dans le code du `findNearbyDoctorsAPITool` (fichier `src/ai/flows/ai-find-doctor-flow.ts`). Consultez les commentaires dans ce fichier pour des instructions détaillées. Cela nécessitera une clé API que vous devrez configurer dans votre fichier `.env`.';

    if (doctorsFromTool.length === 0 && suggestedSpecialty !== 'Médecine Générale') {
        // Tentative de fallback vers des médecins généralistes si la spécialité ne donne rien
        const generalPractitioners = await findNearbyDoctorsAPITool({
            specialty: 'Médecine Générale',
            postalCode: input.postalCode,
            latitude: input.latitude,
            longitude: input.longitude,
        });
        if (generalPractitioners.length > 0) {
            searchNote += ` Aucun médecin (simulé) trouvé pour "${suggestedSpecialty}" avec les critères fournis. Affichage des médecins généralistes (simulés) disponibles.`;
            return {
                suggestedSpecialty: 'Médecine Générale (Fallback)',
                reasoning: `Aucun médecin (simulé) trouvé pour "${suggestedSpecialty}" avec les critères fournis. Voici des médecins généralistes (simulés) qui pourraient vous orienter. Raison initiale pour "${suggestedSpecialty}": ${reasoning}`,
                doctors: generalPractitioners,
                searchNote,
            };
        }
    }

    return {
      suggestedSpecialty,
      reasoning,
      doctors: doctorsFromTool,
      searchNote
    };
  }
);
    

