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
      'Liste de médecins trouvés via une simulation d"appel API, correspondant à la spécialité suggérée et à la localisation.'
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

// Nouveau Tool pour simuler la recherche de médecins via une API externe
const findNearbyDoctorsAPITool = ai.defineTool(
  {
    name: 'findNearbyDoctorsAPI',
    description: 'Simule la recherche de médecins à proximité via une API externe, basée sur la spécialité et la localisation (coordonnées ou code postal).',
    inputSchema: z.object({
      specialty: z.string().describe('Spécialité médicale à rechercher.'),
      postalCode: z.string().optional().describe('Code postal pour affiner la recherche.'),
      latitude: z.number().optional().describe('Latitude pour la recherche à proximité.'),
      longitude: z.number().optional().describe('Longitude pour la recherche à proximité.'),
    }),
    outputSchema: z.array(DoctorSchema),
  },
  async ({ specialty, postalCode, latitude, longitude }) => {
    console.log(`Simulation d'appel API pour trouver des médecins en ${specialty} près de:`, { postalCode, latitude, longitude });
    
    // REMPLACEZ CETTE SECTION PAR UN APPEL `fetch` À UNE VRAIE API (ex: Google Places API)
    // Assurez-vous de gérer les clés API de manière sécurisée (variables d'environnement)
    // et de transformer la réponse de l'API au format DoctorSchema.
    
    // Exemple de données simulées
    const simulatedDoctors: Doctor[] = [
      { 
        name: `Dr. Alice Expert (Simulé pour ${specialty})`, 
        specialty: specialty, 
        address: postalCode ? `1 Rue Principale, ${postalCode} Ville` : '123 Main St, Anytown (près de vos coordonnées)', 
        phone: '01 22 33 44 55',
        distance: latitude ? `${Math.floor(Math.random() * 5) + 1} km` : undefined
      },
      { 
        name: `Dr. Bob Clinicien (Simulé pour ${specialty})`, 
        specialty: specialty, 
        address: postalCode ? `10 Avenue Secondaire, ${postalCode} Ville` : '456 Oak Ave, Anytown (près de vos coordonnées)', 
        phone: '01 66 77 88 99',
        distance: latitude ? `${Math.floor(Math.random() * 10) + 2} km` : undefined
      },
    ];

    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filtrer par spécialité pour la simulation (au cas où on voudrait des généralistes en fallback)
    const filteredDoctors = simulatedDoctors.filter(
      doc => doc.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
    
    return filteredDoctors.slice(0, 5); // Limiter à 5 résultats pour la démo
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
    tools: [findNearbyDoctorsAPITool], // Rendre le tool disponible
  },
  async (input) => {
    const {output: llmOutput} = await prompt(input);

    let suggestedSpecialty = 'Médecine Générale';
    let reasoning = 'Les informations fournies n"ont pas permis de déterminer une spécialité spécifique. Un médecin généraliste est un bon point de départ pour évaluer vos symptômes.';
    
    if (llmOutput?.suggestedSpecialty) {
      suggestedSpecialty = llmOutput.suggestedSpecialty;
      reasoning = llmOutput.reasoning;
    }
    
    const doctorsFromAPI = await findNearbyDoctorsAPITool({
      specialty: suggestedSpecialty,
      postalCode: input.postalCode,
      latitude: input.latitude,
      longitude: input.longitude,
    });
    
    let searchNote = 'Note : Les médecins listés ci-dessous proviennent d"une **simulation d\'appel à une API externe**. Pour des résultats réels, intégrez un appel à une véritable API de recherche de professionnels de santé (ex: Google Places API, nécessitant une clé API).';

    if (doctorsFromAPI.length === 0 && suggestedSpecialty !== 'Médecine Générale') {
        const generalPractitioners = await findNearbyDoctorsAPITool({
            specialty: 'Médecine Générale',
            postalCode: input.postalCode,
            latitude: input.latitude,
            longitude: input.longitude,
        });
        if (generalPractitioners.length > 0) {
            searchNote += ` Aucun médecin trouvé pour "${suggestedSpecialty}" avec les critères fournis. Affichage des médecins généralistes (simulés) disponibles.`;
            return {
                suggestedSpecialty: 'Médecine Générale (Fallback)',
                reasoning: `Aucun médecin trouvé pour "${suggestedSpecialty}" avec les critères fournis. Voici des médecins généralistes (simulés) qui pourraient vous orienter. Raison initiale pour "${suggestedSpecialty}": ${reasoning}`,
                doctors: generalPractitioners,
                searchNote,
            };
        }
    }

    return {
      suggestedSpecialty,
      reasoning,
      doctors: doctorsFromAPI,
      searchNote
    };
  }
);
    
